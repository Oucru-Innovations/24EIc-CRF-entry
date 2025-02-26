from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from backend.app.database import get_session
from backend.app.models import ModelLog, PipelineLog, SystemLog
import backend.app.crud as crud
from datetime import datetime
# from typing import Optional

router = APIRouter()

# --- ModelLog Endpoints ---

@router.post("/model_log/", response_model=ModelLog)
def create_model_log(log: ModelLog, db: Session = Depends(get_session)):
    return crud.create_model_log(db=db, log=log)

@router.get("/model_log/{patient_id}", response_model=list[ModelLog])
def get_model_logs(patient_id: int, skip: int = 0, limit: int = None, db: Session = Depends(get_session)):
    return crud.get_model_logs(db=db, patient_id=patient_id, skip=skip, limit=limit)

@router.get("/model_log/by_id/{log_id}", response_model=ModelLog)
def get_model_log_by_id(log_id: int, db: Session = Depends(get_session)):
    log = crud.get_model_log_by_id(db=db, log_id=log_id)
    if not log:
        raise HTTPException(status_code=404, detail="ModelLog not found")
    return log

@router.put("/model_log/{log_id}", response_model=ModelLog)
def update_model_log(log_id: int, log: ModelLog, db: Session = Depends(get_session)):
    updated_log = crud.update_model_log(db=db, log_id=log_id, updated_log=log)
    if not updated_log:
        raise HTTPException(status_code=404, detail="ModelLog not found")
    return updated_log

@router.delete("/model_log/{log_id}", response_model=dict)
def delete_model_log(log_id: int, db: Session = Depends(get_session)):
    deleted_log = crud.delete_model_log(db=db, log_id=log_id)
    if not deleted_log:
        raise HTTPException(status_code=404, detail="ModelLog not found")
    return {"message": "ModelLog deleted successfully"}

# --- PipelineLog Endpoints ---

@router.post("/pipeline_log/", response_model=PipelineLog)
def create_pipeline_log(log: PipelineLog, db: Session = Depends(get_session)):
    return crud.create_pipeline_log(db=db, log=log)

@router.get("/pipeline_log/{patient_id}", response_model=list[PipelineLog])
def get_pipeline_logs(patient_id: int, skip: int = 0, limit: Optional[int] = None, db: Session = Depends(get_session)):
    return crud.get_pipeline_logs(db=db, patient_id=patient_id, skip=skip, limit=limit)

@router.get("/pipeline_log/by_id/{log_id}", response_model=PipelineLog)
def get_pipeline_log_by_id(log_id: int, db: Session = Depends(get_session)):
    log = crud.get_pipeline_log_by_id(db=db, log_id=log_id)
    if not log:
        raise HTTPException(status_code=404, detail="PipelineLog not found")
    return log

@router.put("/pipeline_log/{log_id}", response_model=PipelineLog)
def update_pipeline_log(log_id: int, log: PipelineLog, db: Session = Depends(get_session)):
    updated_log = crud.update_pipeline_log(db=db, log_id=log_id, updated_log=log)
    if not updated_log:
        raise HTTPException(status_code=404, detail="PipelineLog not found")
    return updated_log

@router.delete("/pipeline_log/{log_id}", response_model=dict)
def delete_pipeline_log(log_id: int, db: Session = Depends(get_session)):
    deleted_log = crud.delete_pipeline_log(db=db, log_id=log_id)
    if not deleted_log:
        raise HTTPException(status_code=404, detail="PipelineLog not found")
    return {"message": "PipelineLog deleted successfully"}

# --- SystemLog Endpoints ---

# @router.post("/system_log/", response_model=SystemLog)
# def create_system_log(log: SystemLog, db: Session = Depends(get_session)):
#     return crud.create_system_log(db=db, log=log)

# @router.get("/system_log/{patient_id}", response_model=list[SystemLog])
# def get_system_logs(patient_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_session)):
#     return crud.get_system_logs(db=db, patient_id=patient_id, skip=skip, limit=limit)

# @router.get("/system_log/by_id/{log_id}", response_model=SystemLog)
# def get_system_log_by_id(log_id: int, db: Session = Depends(get_session)):
#     log = crud.get_system_log_by_id(db=db, log_id=log_id)
#     if not log:
#         raise HTTPException(status_code=404, detail="SystemLog not found")
#     return log

# @router.put("/system_log/{log_id}", response_model=SystemLog)
# def update_system_log(log_id: int, log: SystemLog, db: Session = Depends(get_session)):
#     updated_log = crud.update_system_log(db=db, log_id=log_id, updated_log=log)
#     if not updated_log:
#         raise HTTPException(status_code=404, detail="SystemLog not found")
#     return updated_log

# @router.delete("/system_log/{log_id}", response_model=dict)
# def delete_system_log(log_id: int, db: Session = Depends(get_session)):
#     deleted_log = crud.delete_system_log(db=db, log_id=log_id)
#     if not deleted_log:
#         raise HTTPException(status_code=404, detail="SystemLog not found")
#     return {"message": "SystemLog deleted successfully"}

@router.post("/system_log", response_model=SystemLog)
def create_system_log(log: SystemLog, db: Session = Depends(get_session)):
    # Ensure timestamp is converted to datetime
    if isinstance(log.change_email_mode_timestamp, str):
        log.change_email_mode_timestamp = datetime.fromisoformat(log.change_email_mode_timestamp.rstrip("Z"))
    return crud.create_system_log(db=db, log=log)

#get status send email
@router.get("/system_log/latest", response_model=SystemLog)
def get_latest_system_log(db: Session = Depends(get_session)):
    logs = crud.get_system_logs(db=db, skip=0, limit=1, order_by="desc")  # Fetch latest log
    if not logs:
        raise HTTPException(status_code=404, detail="No SystemLog found")
    return logs[0]

@router.get("/system_log", response_model=SystemLog)
def get_latest_system_log(db: Session = Depends(get_session)):
    logs = crud.get_system_logs(db=db, skip=0, limit=1, order_by="desc")  # Fetch latest log
    if not logs:
        raise HTTPException(status_code=404, detail="No SystemLog found")
    return logs

@router.put("/system_log", response_model=SystemLog)
def update_system_log(log: SystemLog, db: Session = Depends(get_session)):
    # Ensure timestamp is converted to datetime
    if isinstance(log.change_email_mode_timestamp, str):
        log.change_email_mode_timestamp = datetime.fromisoformat(log.change_email_mode_timestamp.rstrip("Z"))

    updated_log = crud.update_system_log(db=db, updated_log=log)
    if not updated_log:
        raise HTTPException(status_code=404, detail="SystemLog not found")
    return updated_log
