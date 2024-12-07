from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ENUM
from backend.app.database import Base
import enum

# Gender Enum (Only Male and Female)
class GenderEnum(str, enum.Enum):
    male = "Male"
    female = "Female"

# Patient model
class Patient(Base):
    __tablename__ = 'patients'

    id = Column(Integer, primary_key=True, index=True)
    study_code = Column(String, unique=True, index=True, nullable=False)
    abbreviation_name = Column(String, nullable=False)
    year_of_birth = Column(Integer, nullable=False)
    gender = Column(Enum(GenderEnum), nullable=False)  # Use Enum here for gender

    day_records = relationship("PatientDayRecord", back_populates="patient")

# PossibleReason model
class PossibleReason(Base):
    __tablename__ = 'possible_reasons'

    id = Column(Integer, primary_key=True, index=True)
    reason = Column(String, unique=True, nullable=False)

# Event model
class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True, index=True)
    event = Column(String, unique=True, nullable=False)

# PatientDayRecord model
class PatientDayRecord(Base):
    __tablename__ = 'patient_day_records'

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=False)
    date_of_alert = Column(Date, nullable=False)
    time_of_alert = Column(Time, nullable=False)
    date_of_assessment = Column(Date, nullable=False)
    time_of_assessment = Column(Time, nullable=False)
    possible_reason_id = Column(Integer, ForeignKey('possible_reasons.id'), nullable=False)
    new_information = Column(Integer, nullable=False)  # Scale 0-7
    expected_alert = Column(Integer, nullable=False)   # Scale 0-7
    event_at_alert_id = Column(Integer, ForeignKey('events.id'), nullable=False)
    event_during_24_hours = Column(String, nullable=True)  # Store multiple choices as comma-separated values

    patient = relationship("Patient", back_populates="day_records")
    possible_reason = relationship("PossibleReason")
    event_at_alert = relationship("Event")
