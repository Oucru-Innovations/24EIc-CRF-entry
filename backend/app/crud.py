from sqlalchemy.orm import Session
from backend.app.models import Patient, PatientDayRecord, PossibleReason, Event
from backend.app.schemas import PatientCreate, Patient, PatientDayRecordCreate, PatientDayRecord, PossibleReasonCreate, EventCreate
from backend.app.models import GenderEnum

# --- Patient CRUD Operations ---

# Create a new Patient
def create_patient(db: Session, patient: PatientCreate):
    db_patient = Patient(
        study_code=patient.study_code,
        abbreviation_name=patient.abbreviation_name,
        year_of_birth=patient.year_of_birth,
        gender=patient.gender
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

# Get all Patients
def get_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Patient).offset(skip).limit(limit).all()

# Get a single Patient by ID
def get_patient_by_id(db: Session, patient_id: int):
    return db.query(Patient).filter(Patient.id == patient_id).first()

# --- PatientDayRecord CRUD Operations ---

# Create a new PatientDayRecord
def create_patient_day_record(db: Session, patient_day_record: PatientDayRecordCreate):
    db_patient_day_record = PatientDayRecord(
        patient_id=patient_day_record.patient_id,
        date_of_alert=patient_day_record.date_of_alert,
        time_of_alert=patient_day_record.time_of_alert,
        date_of_assessment=patient_day_record.date_of_assessment,
        time_of_assessment=patient_day_record.time_of_assessment,
        possible_reason_id=patient_day_record.possible_reason_of_alert,
        new_information=patient_day_record.new_information,
        expected_alert=patient_day_record.expected_alert,
        event_at_alert_id=patient_day_record.event_at_alert,
        event_during_24_hours=patient_day_record.event_during_24_hours
    )
    db.add(db_patient_day_record)
    db.commit()
    db.refresh(db_patient_day_record)
    return db_patient_day_record

# Get all PatientDayRecords for a specific patient
def get_patient_day_records(db: Session, patient_id: int, skip: int = 0, limit: int = 100):
    return db.query(PatientDayRecord).filter(PatientDayRecord.patient_id == patient_id).offset(skip).limit(limit).all()

# Get a single PatientDayRecord by ID
def get_patient_day_record_by_id(db: Session, patient_day_record_id: int):
    return db.query(PatientDayRecord).filter(PatientDayRecord.id == patient_day_record_id).first()

# --- PossibleReason CRUD Operations ---

# Create a new PossibleReason
def create_possible_reason(db: Session, reason: PossibleReasonCreate):
    db_reason = PossibleReason(reason=reason.reason)
    db.add(db_reason)
    db.commit()
    db.refresh(db_reason)
    return db_reason

# Get all PossibleReasons
def get_possible_reasons(db: Session, skip: int = 0, limit: int = 100):
    return db.query(PossibleReason).offset(skip).limit(limit).all()

# Get a single PossibleReason by ID
def get_possible_reason_by_id(db: Session, reason_id: int):
    return db.query(PossibleReason).filter(PossibleReason.id == reason_id).first()

# --- Event CRUD Operations ---

# Create a new Event
def create_event(db: Session, event: EventCreate):
    db_event = Event(event=event.event)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

# Get all Events
def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Event).offset(skip).limit(limit).all()

# Get a single Event by ID
def get_event_by_id(db: Session, event_id: int):
    return db.query(Event).filter(Event.id == event_id).first()

# --- Update CRUD Operations ---

# Update a Patient
def update_patient(db: Session, patient_id: int, patient: PatientCreate):
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if db_patient:
        db_patient.study_code = patient.study_code
        db_patient.abbreviation_name = patient.abbreviation_name
        db_patient.year_of_birth = patient.year_of_birth
        db_patient.gender = patient.gender
        db.commit()
        db.refresh(db_patient)
    return db_patient

# Update a PatientDayRecord
def update_patient_day_record(db: Session, record_id: int, patient_day_record: PatientDayRecordCreate):
    db_patient_day_record = db.query(PatientDayRecord).filter(PatientDayRecord.id == record_id).first()
    if db_patient_day_record:
        db_patient_day_record.date_of_alert = patient_day_record.date_of_alert
        db_patient_day_record.time_of_alert = patient_day_record.time_of_alert
        db_patient_day_record.date_of_assessment = patient_day_record.date_of_assessment
        db_patient_day_record.time_of_assessment = patient_day_record.time_of_assessment
        db_patient_day_record.possible_reason_id = patient_day_record.possible_reason_of_alert
        db_patient_day_record.new_information = patient_day_record.new_information
        db_patient_day_record.expected_alert = patient_day_record.expected_alert
        db_patient_day_record.event_at_alert_id = patient_day_record.event_at_alert
        db_patient_day_record.event_during_24_hours = patient_day_record.event_during_24_hours
        db.commit()
        db.refresh(db_patient_day_record)
    return db_patient_day_record

# Update a PossibleReason
def update_possible_reason(db: Session, reason_id: int, reason: PossibleReasonCreate):
    db_reason = db.query(PossibleReason).filter(PossibleReason.id == reason_id).first()
    if db_reason:
        db_reason.reason = reason.reason
        db.commit()
        db.refresh(db_reason)
    return db_reason

# Update an Event
def update_event(db: Session, event_id: int, event: EventCreate):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event:
        db_event.event = event.event
        db.commit()
        db.refresh(db_event)
    return db_event

# --- Delete CRUD Operations ---

# Delete a Patient
def delete_patient(db: Session, patient_id: int):
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if db_patient:
        db.delete(db_patient)
        db.commit()
    return db_patient

# Delete a PatientDayRecord
def delete_patient_day_record(db: Session, record_id: int):
    db_patient_day_record = db.query(PatientDayRecord).filter(PatientDayRecord.id == record_id).first()
    if db_patient_day_record:
        db.delete(db_patient_day_record)
        db.commit()
    return db_patient_day_record

# Delete a PossibleReason
def delete_possible_reason(db: Session, reason_id: int):
    db_reason = db.query(PossibleReason).filter(PossibleReason.id == reason_id).first()
    if db_reason:
        db.delete(db_reason)
        db.commit()
    return db_reason

# Delete an Event
def delete_event(db: Session, event_id: int):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event:
        db.delete(db_event)
        db.commit()
    return db_event
