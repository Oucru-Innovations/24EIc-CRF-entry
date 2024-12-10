from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from backend.app.database import get_session
from backend.app.models import PatientDayRecord
import backend.app.crud as crud

router = APIRouter()

# Get all PatientDayRecords for a specific patient
@router.get("/", response_model=list[PatientDayRecord])
def get_patient_day_records(patient_id: int, db: Session = Depends(get_session)):
    records = crud.get_patient_day_records(db=db, patient_id=patient_id)
    if not records:
        raise HTTPException(status_code=404, detail="Day records not found")
    return records

# Get a single PatientDayRecord by ID
@router.get("/{record_id}", response_model=PatientDayRecord)
def get_patient_day_record(record_id: int, db: Session = Depends(get_session)):
    record = crud.get_patient_day_record_by_id(db=db, record_id=record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Day record not found")
    return record

# Create a new PatientDayRecord
@router.post("/", response_model=PatientDayRecord)
def create_patient_day_record(record: PatientDayRecord, db: Session = Depends(get_session)):
    return crud.create_patient_day_record(db=db, record=record)

# Update an existing PatientDayRecord
@router.put("/{record_id}", response_model=PatientDayRecord)
def update_patient_day_record(record_id: int, updated_record: PatientDayRecord, db: Session = Depends(get_session)):
    record = crud.update_patient_day_record(db=db, record_id=record_id, updated_record=updated_record)
    if not record:
        raise HTTPException(status_code=404, detail="Day record not found")
    return record

# Delete a PatientDayRecord
@router.delete("/{record_id}", response_model=dict)
def delete_patient_day_record(record_id: int, db: Session = Depends(get_session)):
    record = crud.delete_patient_day_record(db=db, record_id=record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Day record not found")
    return {"message": "Day record deleted successfully"}
