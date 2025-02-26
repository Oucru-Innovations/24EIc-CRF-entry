from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from backend.app.database import get_session
from backend.app.models import PossibleReason, Event
import backend.app.crud as crud

router = APIRouter()

# --- PossibleReasons Routes ---

# Create a PossibleReason
@router.post("/possible-reasons/", response_model=PossibleReason)
def create_possible_reason(reason: PossibleReason, db: Session = Depends(get_session)):
    return crud.create_possible_reason(db=db, reason=reason)

# Get All PossibleReasons
@router.get("/possible-reasons/", response_model=list[PossibleReason])
def get_possible_reasons(skip: int = 0, limit: int = None, db: Session = Depends(get_session)):
    return crud.get_possible_reasons(db=db, skip=skip, limit=limit)

# Get a Single PossibleReason by ID
@router.get("/possible-reasons/{reason_id}", response_model=PossibleReason)
def get_possible_reason(reason_id: int, db: Session = Depends(get_session)):
    reason = crud.get_possible_reason_by_id(db=db, reason_id=reason_id)
    if not reason:
        raise HTTPException(status_code=404, detail="PossibleReason not found")
    return reason

# Update a PossibleReason
@router.put("/possible-reasons/{reason_id}", response_model=PossibleReason)
def update_possible_reason(reason_id: int, reason: PossibleReason, db: Session = Depends(get_session)):
    updated_reason = crud.update_possible_reason(db=db, reason_id=reason_id, updated_reason=reason)
    if not updated_reason:
        raise HTTPException(status_code=404, detail="PossibleReason not found")
    return updated_reason

# Delete a PossibleReason
@router.delete("/possible-reasons/{reason_id}", response_model=dict)
def delete_possible_reason(reason_id: int, db: Session = Depends(get_session)):
    reason = db.get(PossibleReason, reason_id)
    if reason and reason.reason == "reasons":
        raise HTTPException(status_code=403, detail="Cannot delete the default 'reasons' record")
    deleted_reason = crud.delete_possible_reason(db=db, reason_id=reason_id)
    if not deleted_reason:
        raise HTTPException(status_code=404, detail="PossibleReason not found")
    return {"message": "PossibleReason deleted successfully"}

# --- Events Routes ---

# Create an Event
@router.post("/events/", response_model=Event)
def create_event(event: Event, db: Session = Depends(get_session)):
    return crud.create_event(db=db, event=event)

# Get All Events
@router.get("/events/", response_model=list[Event])
def get_events(skip: int = 0, limit: int = None, db: Session = Depends(get_session)):
    return crud.get_events(db=db, skip=skip, limit=limit)

# Get a Single Event by ID
@router.get("/events/{event_id}", response_model=Event)
def get_event(event_id: int, db: Session = Depends(get_session)):
    event = crud.get_event_by_id(db=db, event_id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

# Update an Event
@router.put("/events/{event_id}", response_model=Event)
def update_event(event_id: int, event: Event, db: Session = Depends(get_session)):
    updated_event = crud.update_event(db=db, event_id=event_id, updated_event=event)
    if not updated_event:
        raise HTTPException(status_code=404, detail="Event not found")
    return updated_event

# Delete an Event
@router.delete("/events/{event_id}", response_model=dict)
def delete_event(event_id: int, db: Session = Depends(get_session)):
    event = db.get(Event, event_id)
    if event and event.event == "events":
        raise HTTPException(status_code=403, detail="Cannot delete the default 'events' record")
    deleted_event = crud.delete_event(db=db, event_id=event_id)
    if not deleted_event:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}
