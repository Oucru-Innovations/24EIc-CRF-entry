from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- PossibleReason CRUD Endpoints ---

# Create a new PossibleReason
@router.post("/possible-reasons/", response_model=schemas.PossibleReason)
def create_possible_reason(reason: schemas.PossibleReasonCreate, db: Session = Depends(get_db)):
    return crud.create_possible_reason(db=db, reason=reason)

# Get all possible reasons
@router.get("/possible-reasons/", response_model=list[schemas.PossibleReason])
def get_possible_reasons(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_possible_reasons(db=db, skip=skip, limit=limit)

# --- Event CRUD Endpoints ---

# Create a new Event
@router.post("/events/", response_model=schemas.Event)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    return crud.create_event(db=db, event=event)

# Get all events
@router.get("/events/", response_model=list[schemas.Event])
def get_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_events(db=db, skip=skip, limit=limit)