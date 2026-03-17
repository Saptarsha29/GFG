# from fastapi import FastAPI, APIRouter, HTTPException
# from dotenv import load_dotenv
# from starlette.middleware.cors import CORSMiddleware
# from motor.motor_asyncio import AsyncIOMotorClient
# import os
# import logging
# from pathlib import Path
# from datetime import datetime, timezone
# import uuid

# from models import QueryRequest, QueryResponse, ChartData, QueryHistory
# from data_loader import DataLoader
# from llm_agent import LLMAgent
# from query_parser import QueryParser
# from chart_generator import ChartGenerator
# from insights_engine import InsightsEngine

# ROOT_DIR = Path(__file__).parent
# load_dotenv(ROOT_DIR / ".env")

# # MongoDB connection
# mongo_url = os.environ["MONGO_URL"]
# client = AsyncIOMotorClient(mongo_url)
# db = client[os.environ["DB_NAME"]]

# # Initialize data loader
# data_loader = DataLoader()
# df = data_loader.get_dataframe()

# # Initialize components
# llm_agent = LLMAgent()
# chart_generator = ChartGenerator()

# # Create the main app
# app = FastAPI(title="AI Business Intelligence Dashboard API")

# # Create a router with the /api prefix
# api_router = APIRouter(prefix="/api")

# # Configure logging
# logging.basicConfig(
#     level=logging.INFO,
#     format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
# )
# logger = logging.getLogger(__name__)


# @api_router.get("/")
# async def root():
#     return {"message": "AI BI Dashboard API is running"}


# @api_router.get("/dataset/stats")
# async def get_dataset_stats():
#     """Get summary statistics of the dataset"""
#     try:
#         stats = data_loader.get_summary_stats()
#         return stats
#     except Exception as e:
#         logger.error(f"Error getting dataset stats: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# @api_router.post("/ask")
# async def ask_question(request: QueryRequest):
#     """Process natural language query and return chart data with insights"""
#     try:
#         logger.info(f"Received query: {request.query}")

#         # Parse query using LLM
#         session_id = request.session_id or str(uuid.uuid4())
#         instructions = await llm_agent.parse_query(request.query, session_id)

#         if "error" in instructions and instructions.get("error"):
#             logger.warning(f"LLM parsing had issues: {instructions['error']}")

#         # Execute query on dataset
#         query_parser = QueryParser(df)
#         result = query_parser.execute_query(instructions)

#         # Generate chart data
#         chart = chart_generator.generate_chart_data(result, instructions)

#         # Generate insights
#         insights_engine = InsightsEngine(df)
#         insights = insights_engine.generate_insights(
#             request.query, result, instructions
#         )

#         # Create response
#         response = QueryResponse(
#             charts=[chart],
#             insights=insights,
#             query=request.query,
#             timestamp=datetime.now(timezone.utc).isoformat()
#         )

#         # Save to history
#         history_doc = {
#             "id": str(uuid.uuid4()),
#             "query": request.query,
#             "response": response.model_dump(),
#             "timestamp": datetime.now(timezone.utc).isoformat(),
#             "session_id": session_id
#         }

#         await db.query_history.insert_one(history_doc)

#         logger.info(f"Query processed successfully: {request.query}")
#         return response

#     except Exception as e:
#         logger.error(f"Error processing query: {e}", exc_info=True)
#         return QueryResponse(
#             charts=[],
#             insights="",
#             query=request.query,
#             timestamp=datetime.now(timezone.utc).isoformat(),
#             error=f"Unable to process query: {str(e)}"
#         )


# @api_router.get("/history")
# async def get_query_history(limit: int = 20):
#     """Get query history"""
#     try:
#         history = await db.query_history.find(
#             {}, {"_id": 0}
#         ).sort("timestamp", -1).limit(limit).to_list(limit)

#         return {"history": history}

#     except Exception as e:
#         logger.error(f"Error fetching history: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# @api_router.delete("/history/{query_id}")
# async def delete_query_history(query_id: str):
#     """Delete a specific query from history"""
#     try:
#         result = await db.query_history.delete_one({"id": query_id})

#         if result.deleted_count == 0:
#             raise HTTPException(status_code=404, detail="Query not found")

#         return {"message": "Query deleted successfully"}

#     except HTTPException:
#         raise

#     except Exception as e:
#         logger.error(f"Error deleting history: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# @api_router.delete("/history")
# async def clear_query_history():
#     """Clear all query history"""
#     try:
#         result = await db.query_history.delete_many({})
#         return {"message": f"Deleted {result.deleted_count} queries"}

#     except Exception as e:
#         logger.error(f"Error clearing history: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# # Include router
# app.include_router(api_router)

# # CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_credentials=True,
#     allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.on_event("shutdown")
# async def shutdown_db_client():
#     client.close()

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware # Updated import
from dotenv import load_dotenv
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

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# Initialize data loader
data_loader = DataLoader()
df = data_loader.get_dataframe()

# Initialize components
llm_agent = LLMAgent()
chart_generator = ChartGenerator()

# Create the main app
app = FastAPI(title="AI Business Intelligence Dashboard API")

# ==========================================
# CORS SETUP (Updated for Vercel & Local)
# ==========================================
origins = [
    "http://localhost:3000",      # React local server
    "http://localhost:5173",      # Vite local server
    "https://tumhara-app.vercel.app" # ⚠️ IMPORTANT: Yahan apna Vercel URL daalna!
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ==========================================

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@api_router.get("/")
async def root():
    return {"message": "AI BI Dashboard API is running"}


@api_router.get("/dataset/stats")
async def get_dataset_stats():
    """Get summary statistics of the dataset"""
    try:
        stats = data_loader.get_summary_stats()
        return stats
    except Exception as e:
        logger.error(f"Error getting dataset stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/ask")
async def ask_question(request: QueryRequest):
    """Process natural language query and return chart data with insights"""
    try:
        logger.info(f"Received query: {request.query}")

        # Parse query using LLM
        session_id = request.session_id or str(uuid.uuid4())
        instructions = await llm_agent.parse_query(request.query, session_id)

        if "error" in instructions and instructions.get("error"):
            logger.warning(f"LLM parsing had issues: {instructions['error']}")

        # Execute query on dataset
        query_parser = QueryParser(df)
        result = query_parser.execute_query(instructions)

        # Generate chart data
        chart = chart_generator.generate_chart_data(result, instructions)

        # Generate insights
        insights_engine = InsightsEngine(df)
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

        # Save to history
        history_doc = {
            "id": str(uuid.uuid4()),
            "query": request.query,
            "response": response.model_dump(),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "session_id": session_id
        }

        await db.query_history.insert_one(history_doc)

        logger.info(f"Query processed successfully: {request.query}")
        return response

    except Exception as e:
        logger.error(f"Error processing query: {e}", exc_info=True)
        return QueryResponse(
            charts=[],
            insights="",
            query=request.query,
            timestamp=datetime.now(timezone.utc).isoformat(),
            error=f"Unable to process query: {str(e)}"
        )


@api_router.get("/history")
async def get_query_history(limit: int = 20):
    """Get query history"""
    try:
        history = await db.query_history.find(
            {}, {"_id": 0}
        ).sort("timestamp", -1).limit(limit).to_list(limit)

        return {"history": history}

    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.delete("/history/{query_id}")
async def delete_query_history(query_id: str):
    """Delete a specific query from history"""
    try:
        result = await db.query_history.delete_one({"id": query_id})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Query not found")

        return {"message": "Query deleted successfully"}

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Error deleting history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.delete("/history")
async def clear_query_history():
    """Clear all query history"""
    try:
        result = await db.query_history.delete_many({})
        return {"message": f"Deleted {result.deleted_count} queries"}

    except Exception as e:
        logger.error(f"Error clearing history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Include router
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()