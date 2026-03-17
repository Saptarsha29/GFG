from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime

class QueryRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

class ChartData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    chart_type: str
    title: str
    x_axis: str
    y_axis: str
    data: List[Dict[str, Any]]
    description: Optional[str] = None

class QueryResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    charts: List[ChartData]
    insights: str
    query: str
    timestamp: str
    error: Optional[str] = None

class QueryHistory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    query: str
    response: QueryResponse
    timestamp: str
    session_id: Optional[str] = None

class ExportRequest(BaseModel):
    query_id: str
    format: str = "json"
