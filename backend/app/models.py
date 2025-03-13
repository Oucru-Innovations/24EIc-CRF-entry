from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from enum import Enum
from datetime import date, time, datetime
from pydantic import validator

# Gender Enum (Only Male and Female)
class GenderEnum(str, Enum):
    male = "Male"
    female = "Female"

# Status Enum (Active or Inactive)
class StatusEnum(str, Enum):
    active = "Active"
    inactive = "Inactive"

# Patient model
class Patient(SQLModel, table=True):
    __tablename__ = "patients"  # Explicitly set table name

    id: Optional[int] = Field(default=None, primary_key=True)
    study_code: str = Field(index=True, unique=True)
    abbreviation_name: str
    year_of_birth: int
    gender: GenderEnum
    status: StatusEnum = Field(default=StatusEnum.active)
    # status: Enum = Enum("Active", "Inactive")
    # status_date: Optional[date] = Field(default=None)
    # Relationship to PatientDayRecord
    summary: str = Field(default="")
    day_records: list["PatientDayRecord"] = Relationship(back_populates="patient")
    model_log: list["ModelLog"] = Relationship(back_populates="patient",sa_relationship_kwargs={"cascade": "all, delete"})
    pipeline_log: list["PipelineLog"] = Relationship(back_populates="patient",sa_relationship_kwargs={"cascade": "all, delete"})

# PossibleReason model
class PossibleReason(SQLModel, table=True):
    __tablename__ = "possible_reasons"  # Explicitly set table name

    id: Optional[int] = Field(default=None, primary_key=True)
    reason: str = Field(unique=True)

# Event model
class Event(SQLModel, table=True):
    __tablename__ = "events"  # Explicitly set table name

    id: Optional[int] = Field(default=None, primary_key=True)
    event: str = Field(unique=True)

# PatientDayRecord model
class PatientDayRecord(SQLModel, table=True):
    __tablename__ = "patient_day_records"  # Explicitly set table name

    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patients.id")  # Reference to patients table
    date_of_alert: Optional[str] = None
    time_of_alert: Optional[str] = None
    date_of_assessment: Optional[str] = Field(default=None)
    time_of_assessment: Optional[str] = Field(default=None)
    possible_reason_id: Optional[int] = Field(default=None, foreign_key="possible_reasons.id")  # Reference to possible_reasons table
    new_information: Optional[int] = None  # Scale 0-7
    expected_alert: Optional[int] = None  # Scale 0-7
    event_at_alert_id: Optional[int] = Field(default=None, foreign_key="events.id")  # Reference to events table
    event_during_24_hours: Optional[str]  # Comma-separated values
    notes: Optional[str] = None
    
    patient: Patient = Relationship(back_populates="day_records")
    possible_reason: PossibleReason = Relationship()
    event_at_alert: Event = Relationship()

class ModelLog(SQLModel, table=True):
    __tablename__ = "model_log"
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patients.id")  # Reference to patients table
    content: str
    raw_content: str
    date: date
    time: time
    ack: bool = Field(default=False)
    
    patient: Patient = Relationship(back_populates="model_log")
    
    @validator('date', pre=True)
    def validate_date(cls, v):
        if isinstance(v, str):
            return date.fromisoformat(v)
        return v
        
    @validator('time', pre=True)
    def validate_time(cls, v):
        if isinstance(v, str):
            return time.fromisoformat(v)
        return v

class PipelineLog(SQLModel, table=True):
    __tablename__ = "pipeline_log"
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patients.id")  # Reference to patients table
    date: date
    time: time
    content: str
    raw_content: str
    # Email mode: 0 off while 1 on
    # email_mode: bool
    # change_email_mode_timestamp: datetime
    patient: Patient = Relationship(back_populates="pipeline_log")

    @validator('date', pre=True)
    def validate_date(cls, v):
        if isinstance(v, str):
            return date.fromisoformat(v)
        return v
        
    @validator('time', pre=True)
    def validate_time(cls, v):
        if isinstance(v, str):
            return time.fromisoformat(v)
        return v

class SystemLog(SQLModel, table=True):
    __tablename__ = "system_log"
    id: Optional[int] = Field(default=None, primary_key=True)
    # Email mode: 0 off while 1 on
    email_mode: bool
    change_email_mode_timestamp: datetime
    
