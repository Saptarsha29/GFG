from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime, timezone
import uuid

from models import QueryRequest, QueryResponse, ChartData, QueryHistory
from data_loader import DataLoader
from llm_agent import LLMAgent
from query_parser import QueryParser
from chart_generator import ChartGenerator
from insights_engine import InsightsEngine

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# MongoDB connection with safe fallback
mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=1000)
db = client[os.environ.get("DB_NAME", "test_database")]

# Persistent file storage fallback for history
HISTORY_FILE = ROOT_DIR / "history_store.json"
IN_MEMORY_HISTORY = []

def load_persistent_history():
    global IN_MEMORY_HISTORY
    try:
        if HISTORY_FILE.exists():
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                import json
                IN_MEMORY_HISTORY = json.load(f)
                logger.info(f"Loaded {len(IN_MEMORY_HISTORY)} history items from {HISTORY_FILE.name}")
    except Exception as e:
        logger.error(f"Error loading persistent history file: {e}")

def save_persistent_history():
    try:
        import json
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(IN_MEMORY_HISTORY, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving persistent history file: {e}")

load_persistent_history()

# Initialize data loader
data_loader = DataLoader()
df = data_loader.get_dataframe()

# Initialize components
llm_agent = LLMAgent()
chart_generator = ChartGenerator()

# Create the main app
app = FastAPI(title="Amazon AI BI Copilot API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")



@api_router.get("/")
async def root():
    return {"message": "Amazon AI BI Dashboard API is running"}


from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File

@api_router.get("/dataset/stats")
async def get_dataset_stats():
    """Get summary statistics of the dataset"""
    try:
        stats = data_loader.get_summary_stats()
        return stats
    except Exception as e:
        logger.error(f"Error getting dataset stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/dataset/sample")
async def get_dataset_sample(limit: int = 25):
    """Get sample rows from the active dataset for live data inspection"""
    try:
        current_df = data_loader.get_dataframe()
        if current_df is None or len(current_df) == 0:
            return {"rows": [], "total": 0}
        
        sample_df = current_df.head(limit).fillna("")
        rows = sample_df.to_dict(orient="records")
        return {"rows": rows, "total": len(current_df)}
    except Exception as e:
        logger.error(f"Error getting dataset sample: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload custom CSV dataset"""
    try:
        logger.info(f"Receiving custom dataset upload: {file.filename}")
        if not file.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail="Only .csv files are supported.")

        content = await file.read()
        stats = data_loader.load_from_bytes(content, file.filename)
        logger.info(f"Custom dataset '{file.filename}' loaded successfully with {stats['total_rows']} rows.")
        return {
            "message": f"Successfully loaded dataset '{file.filename}'",
            "stats": stats
        }
    except Exception as e:
        logger.error(f"Error uploading dataset: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@api_router.post("/dataset/reset")
async def reset_dataset():
    """Reset active dataset back to original default Amazon Sales dataset"""
    try:
        stats = data_loader.reset_to_default()
        logger.info("Dataset reset to default Amazon Sales dataset.")
        return {
            "message": "Reset dataset to default Amazon Sales dataset",
            "stats": stats
        }
    except Exception as e:
        logger.error(f"Error resetting dataset: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@api_router.post("/ask")
async def ask_question(request: QueryRequest):
    """Process natural language query and return chart data with insights"""
    try:
        logger.info(f"Received query: {request.query}")
        current_df = data_loader.get_dataframe()
        stats = data_loader.get_summary_stats()

        # Parse query using LLM with active dataset column schema
        session_id = request.session_id or str(uuid.uuid4())
        instructions = await llm_agent.parse_query(
            user_query=request.query,
            session_id=session_id,
            columns_meta=stats.get("columns_meta", []),
            dataset_name=stats.get("dataset_name", "Dataset")
        )

        # Check domain validity
        if instructions.get("is_valid") is False or "error" in instructions:
            err_msg = instructions.get(
                "error", 
                f"Invalid Question: This question cannot be answered using the active dataset '{stats.get('dataset_name', 'Dataset')}'."
            )
            logger.warning(f"Invalid / out-of-domain query: {request.query} -> {err_msg}")
            
            error_response = QueryResponse(
                charts=[],
                insights="",
                query=request.query,
                timestamp=datetime.now(timezone.utc).isoformat(),
                error=err_msg
            )
            return error_response

        # Execute query on dataset
        query_parser = QueryParser(current_df)
        result = query_parser.execute_query(instructions)

        # Generate chart data
        chart = chart_generator.generate_chart_data(result, instructions)

        # Generate insights
        insights_engine = InsightsEngine(current_df)
        insights = insights_engine.generate_insights(
            request.query, result, instructions
        )

        # Create response
        response = QueryResponse(
            charts=[chart],
            insights=insights,
            query=request.query,
            timestamp=datetime.now(timezone.utc).isoformat()
        )

        # Save to history: ALWAYS save instantly in memory first (0ms latency)
        history_doc = {
            "id": str(uuid.uuid4()),
            "query": request.query,
            "response": response.model_dump(),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "session_id": session_id
        }

        # Instant in-memory push & persistent disk file save
        IN_MEMORY_HISTORY.insert(0, history_doc)
        save_persistent_history()

        # Non-blocking async insert to MongoDB if available (pass copy so _id mutation does not contaminate in-memory doc)
        async def _async_db_save(doc_to_save):
            try:
                await db.query_history.insert_one(doc_to_save.copy())
            except Exception:
                pass

        import asyncio
        asyncio.create_task(_async_db_save(history_doc))

        logger.info(f"Query processed successfully: {request.query}")
        return response

    except Exception as e:
        logger.error(f"Error processing query: {e}", exc_info=True)
        return QueryResponse(
            charts=[],
            insights="",
            query=request.query,
            timestamp=datetime.now(timezone.utc).isoformat(),
            error=f"Invalid Question / Execution Error: {str(e)}"
        )


@api_router.get("/history")
async def get_query_history(limit: int = 50):
    """Get query history instantly from persistent cache"""
    cleaned_history = []
    for item in IN_MEMORY_HISTORY[:limit]:
        if isinstance(item, dict):
            clean_item = {k: v for k, v in item.items() if k != "_id"}
            cleaned_history.append(clean_item)
    return {"history": cleaned_history}



@api_router.delete("/history/{query_id}")
async def delete_query_history(query_id: str):
    """Delete a specific query from history"""
    global IN_MEMORY_HISTORY
    try:
        IN_MEMORY_HISTORY = [h for h in IN_MEMORY_HISTORY if h.get("id") != query_id]
        save_persistent_history()

        async def _async_db_delete():
            try:
                await db.query_history.delete_one({"id": query_id})
            except Exception:
                pass
        import asyncio
        asyncio.create_task(_async_db_delete())

        return {"message": "Query deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.delete("/history")
async def clear_query_history():
    """Clear all query history"""
    global IN_MEMORY_HISTORY
    try:
        IN_MEMORY_HISTORY = []
        save_persistent_history()

        async def _async_db_clear():
            try:
                await db.query_history.delete_many({})
            except Exception:
                pass
        import asyncio
        asyncio.create_task(_async_db_clear())
        return {"message": "Deleted all query history"}
    except Exception as e:
        logger.error(f"Error clearing history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    try:
        client.close()
    except Exception:
        pass