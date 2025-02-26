from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from backend.app.database import get_session
from backend.app.models import Patient
import backend.app.crud as crud
from fastapi.responses import JSONResponse

router = APIRouter()

# Create a Patient
@router.post("/", response_model=Patient)
def create_patient(patient: Patient, db: Session = Depends(get_session)):
    existing_patient = crud.get_patient_by_id(db=db, patient_id=patient.id)
    if existing_patient:
        raise HTTPException(status_code=400, detail="Patient with this ID already exists")
    return crud.create_patient(db=db, patient=patient)

# Get All Patients
@router.get("/", response_model=list[Patient])
def get_patients(skip: int = 0, limit: int = None, db: Session = Depends(get_session)):
    return crud.get_patients(db=db, skip=skip, limit=limit)

# Get a Single Patient by ID
@router.get("/{patient_id}", response_model=Patient)
def get_patient(patient_id: int, db: Session = Depends(get_session)):
    patient = crud.get_patient_by_id(db=db, patient_id=patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

# Get a Single Patient by Study Code
@router.get("/get_patient_by_study_code/{study_code}", response_model=Patient)
def get_patient(study_code: str, db: Session = Depends(get_session)):
    # patient = crud.get_patient_by_id(db=db, patient_id=patient_id)
    patient = crud.get_patient_by_study_code(db=db, patient_code=study_code)
    if not patient:
        return JSONResponse(
            status_code=404,
            content={"message": "Patient not found", "study_code": study_code, "exists": False},
        )
    return patient

# Update a Patient
@router.put("/{patient_id}", response_model=Patient)
def update_patient(patient_id: int, patient: Patient, db: Session = Depends(get_session)):
    updated_patient = crud.update_patient(db=db, patient_id=patient_id, patient=patient)
    if not updated_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return updated_patient

# Delete a Patient
@router.delete("/{patient_id}", response_model=dict)
def delete_patient(patient_id: int, db: Session = Depends(get_session)):
    deleted_patient = crud.delete_patient(db=db, patient_id=patient_id)
    if not deleted_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"message": "Patient and associated records deleted successfully"}

