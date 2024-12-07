from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas
from ..database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create a new patient
@router.post("/", response_model=schemas.Patient)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    return crud.create_patient(db=db, patient=patient)

# Get all patients
@router.get("/", response_model=list[schemas.Patient])
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_patients(db=db, skip=skip, limit=limit)

# Get patient by ID
@router.get("/{patient_id}", response_model=schemas.Patient)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    return crud.get_patient_by_id(db=db, patient_id=patient_id)

# Update patient
@router.put("/{patient_id}", response_model=schemas.Patient)
def update_patient(patient_id: int, patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    return crud.update_patient(db=db, patient_id=patient_id, patient=patient)

# Delete patient
@router.delete("/{patient_id}", response_model=schemas.Patient)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    return crud.delete_patient(db=db, patient_id=patient_id)