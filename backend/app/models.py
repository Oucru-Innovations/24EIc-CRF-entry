from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from enum import Enum
from datetime import date, time, datetime

# Gender Enum (Only Male and Female)
class GenderEnum(str, Enum):
    male = "Male"
    female = "Female"

# Patient model
class Patient(SQLModel, table=True):
    __tablename__ = "patients"  # Explicitly set table name

    id: Optional[int] = Field(default=None, primary_key=True)
    study_code: str = Field(index=True, unique=True)
    abbreviation_name: str
    year_of_birth: int
    gender: GenderEnum

    # Relationship to PatientDayRecord
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
    date_of_alert: str
    time_of_alert: str
    date_of_assessment: str
    time_of_assessment: str
    possible_reason_id: int = Field(foreign_key="possible_reasons.id")  # Reference to possible_reasons table
    new_information: int  # Scale 0-7
    expected_alert: int  # Scale 0-7
    event_at_alert_id: int = Field(foreign_key="events.id")  # Reference to events table
    event_during_24_hours: Optional[str]  # Comma-separated values

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
    
    patient: Patient = Relationship(back_populates="model_log")
    

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

class SystemLog(SQLModel, table=True):
    __tablename__ = "system_log"
    id: Optional[int] = Field(default=None, primary_key=True)
    # Email mode: 0 off while 1 on
    email_mode: bool
    change_email_mode_timestamp: datetime
    
