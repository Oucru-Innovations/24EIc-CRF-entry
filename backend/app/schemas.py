from pydantic import BaseModel
from datetime import date, time
from typing import Optional
from backend.app.models import GenderEnum, PossibleReason, Event

# Patient Schema
class PatientBase(BaseModel):
    study_code: str
    abbreviation_name: str
    year_of_birth: int
    gender: GenderEnum  # Use GenderEnum for gender field

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int

    class Config:
        orm_mode = True

# PatientDayRecord Schema
class PatientDayRecordBase(BaseModel):
    study_code: str
    date_of_alert: date
    time_of_alert: time
    date_of_assessment: date
    time_of_assessment: time
    possible_reason_id: int  # Referring to the PossibleReason ID
    new_information: int  # Scale 0-7
    expected_alert: int  # Scale 0-7
    event_at_alert_id: int  # Referring to the Event ID
    event_during_24_hours: Optional[str]  # Comma-separated values for multiple events

class PatientDayRecordCreate(PatientDayRecordBase):
    pass

class PatientDayRecord(PatientDayRecordBase):
    id: int

    class Config:
        orm_mode = True

# PossibleReason Schema
class PossibleReasonBase(BaseModel):
    reason: str

class PossibleReasonCreate(PossibleReasonBase):
    pass

class PossibleReason(PossibleReasonBase):
    id: int

    class Config:
        orm_mode = True

# Event Schema
class EventBase(BaseModel):
    event: str

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int

    class Config:
        orm_mode = True
