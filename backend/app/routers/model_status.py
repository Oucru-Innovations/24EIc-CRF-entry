from fastapi import APIRouter, BackgroundTasks
from datetime import datetime, timedelta
import asyncio
from typing import Optional
from pydantic import BaseModel

router = APIRouter()

# Global variables to track status
last_heartbeat: Optional[datetime] = None
is_model_running: bool = False
TIMEOUT_SECONDS = 300  # Timeout threshold 5 minutes

class HeartbeatData(BaseModel):
    running: bool = True

@router.post("/heartbeat")
async def heartbeat(data: HeartbeatData):
    """Endpoint for model to send heartbeat with status"""
    global last_heartbeat, is_model_running
    last_heartbeat = datetime.now()
    is_model_running = data.running
    return {"status": "ok", "running": is_model_running}

@router.get("/status")
async def get_status():
    """Get current model status"""
    global is_model_running
    # Check for timeout
    if last_heartbeat and datetime.now() - last_heartbeat > timedelta(seconds=TIMEOUT_SECONDS):
        is_model_running = False
    return {"running": is_model_running}

