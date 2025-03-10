from sqlmodel import Session, select
from backend.app.models import (
    Patient, PatientDayRecord, PossibleReason, 
    Event, ModelLog, PipelineLog, SystemLog
)
from datetime import datetime,date,time
from sqlalchemy import desc, asc

# --- Patient CRUD Operations ---

def create_patient(db: Session, patient: Patient):
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

def get_patients(db: Session, skip: int = 0, limit: int | None = None):
    query = db.query(Patient)
    # Apply offset
    query = query.offset(skip)
    # Apply limit only if provided
    if limit is not None:
        query = query.limit(limit)
    return query.all()


def get_patient_by_id(db: Session, patient_id: int):
    return db.get(Patient, patient_id)

def get_patient_by_study_code(db: Session, patient_code: str):
    statement = select(Patient).where(Patient.study_code == patient_code)
    return db.exec(statement).first()

def update_patient(db: Session, patient_id: int, patient: Patient):
    # Fetch the existing patient
    existing_patient = db.get(Patient, patient_id)
    if not existing_patient:
        return None

    # Update fields
    existing_patient.study_code = patient.study_code
    existing_patient.abbreviation_name = patient.abbreviation_name
    existing_patient.year_of_birth = patient.year_of_birth
    existing_patient.gender = patient.gender
    existing_patient.status = patient.status
    existing_patient.notes = patient.notes
    # existing_patient.status_date = patient.status_date

    # Commit changes to the database
    db.add(existing_patient)
    db.commit()
    db.refresh(existing_patient)

    return existing_patient

def delete_patient(db: Session, patient_id: int):
    # Fetch the patient
    patient = db.get(Patient, patient_id)
    if not patient:
        return None

    # Delete all associated day records
    statement = select(PatientDayRecord).where(PatientDayRecord.patient_id == patient_id)
    day_records = db.exec(statement).all()
    for record in day_records:
        db.delete(record)

    # Delete the patient
    db.delete(patient)
    db.commit()
    return patient

# --- PatientDayRecord CRUD Operations ---

# Create a new PatientDayRecord
def create_patient_day_record(db: Session, record: PatientDayRecord):
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

# Get all PatientDayRecords for a specific patient
def get_patient_day_records(db: Session, patient_id: int, skip: int = 0, limit: int | None = None):
    query = db.query(PatientDayRecord).filter(PatientDayRecord.patient_id == patient_id)
    # Apply offset
    query = query.offset(skip)
    # Apply limit only if provided
    if limit is not None:
        query = query.limit(limit)
    return query.all()

# Get a single PatientDayRecord by ID
def get_patient_day_record_by_id(db: Session, record_id: int):
    return db.get(PatientDayRecord, record_id)

# Update an existing PatientDayRecord
def update_patient_day_record(db: Session, record_id: int, updated_record: PatientDayRecord):
    # Fetch the existing record
    record = db.get(PatientDayRecord, record_id)
    if not record:
        return None

    # Update fields
    for field, value in updated_record.dict(exclude_unset=True).items():
        setattr(record, field, value)

    db.add(record)
    db.commit()
    db.refresh(record)
    return record

# Delete a PatientDayRecord
def delete_patient_day_record(db: Session, record_id: int):
    # Fetch the record
    record = db.get(PatientDayRecord, record_id)
    if not record:
        return None

    db.delete(record)
    db.commit()
    return record


# --- PossibleReason CRUD Operations ---

# Create a PossibleReason
def create_possible_reason(db: Session, reason: PossibleReason):
    db.add(reason)
    db.commit()
    db.refresh(reason)
    return reason

# Get all PossibleReasons
def get_possible_reasons(db: Session, skip: int = 0, limit: int = None):
    query = db.query(PossibleReason)
    # Apply offset
    query = query.offset(skip)
    # Apply limit only if provided
    if limit is not None:
        query = query.limit(limit)
    return query.all()

# Get a single PossibleReason by ID
def get_possible_reason_by_id(db: Session, reason_id: int):
    return db.get(PossibleReason, reason_id)

# Update a PossibleReason
def update_possible_reason(db: Session, reason_id: int, updated_reason: PossibleReason):
    reason = db.get(PossibleReason, reason_id)
    if not reason:
        return None
    for field, value in updated_reason.dict(exclude_unset=True).items():
        setattr(reason, field, value)
    db.add(reason)
    db.commit()
    db.refresh(reason)
    return reason

# Delete a PossibleReason
def delete_possible_reason(db: Session, reason_id: int):
    reason = db.get(PossibleReason, reason_id)
    if not reason:
        return None
    db.delete(reason)
    db.commit()
    return reason

# --- Event CRUD Operations ---

# Create an Event
def create_event(db: Session, event: Event):
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

# Get all Events
def get_events(db: Session, skip: int = 0, limit: int = None):
    query = db.query(Event)
    # Apply offset
    query = query.offset(skip)
    # Apply limit only if provided
    if limit is not None:
        query = query.limit(limit)
    return query.all()


# Get a single Event by ID
def get_event_by_id(db: Session, event_id: int):
    return db.get(Event, event_id)

# Update an Event
def update_event(db: Session, event_id: int, updated_event: Event):
    event = db.get(Event, event_id)
    if not event:
        return None
    for field, value in updated_event.dict(exclude_unset=True).items():
        setattr(event, field, value)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

# Delete an Event
def delete_event(db: Session, event_id: int):
    event = db.get(Event, event_id)
    if not event:
        return None
    db.delete(event)
    db.commit()
    return event


# --- ModelLog CRUD Operations ---

def create_model_log(db: Session, log: ModelLog):
    # Ensure date and time are proper Python objects
    if isinstance(log.date, str):
        log.date = date.fromisoformat(log.date)
    if isinstance(log.time, str):
        log.time = time.fromisoformat(log.time)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log



def get_model_logs(db: Session, patient_id: int, skip: int = 0, limit: int = None):
    query = db.query(ModelLog).filter(ModelLog.patient_id == patient_id).order_by(desc(ModelLog.date), desc(ModelLog.time))

    if limit:  # Apply limit only if it's provided
        query = query.limit(limit)

    return query.offset(skip).all()


def get_model_log_by_id(db: Session, log_id: int):
    return db.get(ModelLog, log_id)


def update_model_log(db: Session, log_id: int, updated_log: ModelLog):
    log = db.get(ModelLog, log_id)
    if not log:
        return None
    for field, value in updated_log.dict(exclude_unset=True).items():
        setattr(log, field, value)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def delete_model_log(db: Session, log_id: int):
    log = db.get(ModelLog, log_id)
    if not log:
        return None
    db.delete(log)
    db.commit()
    return log

# --- PipelineLog CRUD Operations ---

def create_pipeline_log(db: Session, log: PipelineLog):
    if isinstance(log.date, str):
        log.date = date.fromisoformat(log.date)
    if isinstance(log.time, str):
        log.time = time.fromisoformat(log.time)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def get_pipeline_logs(db: Session, patient_id: int, skip: int = 0, limit: int = None):
    query = db.query(PipelineLog).filter(PipelineLog.patient_id == patient_id)
    # Apply offset
    query = query.offset(skip)
    # Apply limit only if provided
    if limit is not None:
        query = query.limit(limit)
    return query.all()


def get_pipeline_log_by_id(db: Session, log_id: int):
    return db.get(PipelineLog, log_id)


def update_pipeline_log(db: Session, log_id: int, updated_log: PipelineLog):
    log = db.get(PipelineLog, log_id)
    if not log:
        return None
    for field, value in updated_log.dict(exclude_unset=True).items():
        setattr(log, field, value)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def delete_pipeline_log(db: Session, log_id: int):
    log = db.get(PipelineLog, log_id)
    if not log:
        return None
    db.delete(log)
    db.commit()
    return log

# --- SystemLog CRUD Operations ---

def create_system_log(log: SystemLog, db: Session):
    # Ensure timestamp is converted to datetime
    if isinstance(log.change_email_mode_timestamp, str):
        log.change_email_mode_timestamp = datetime.fromisoformat(log.change_email_mode_timestamp.rstrip("Z"))

    # Create a new log entry
    new_log = SystemLog(
        email_mode=log.email_mode,
        change_email_mode_timestamp=log.change_email_mode_timestamp
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    # **Convert to a dictionary for serialization**
    return new_log.dict()


def get_system_logs(db: Session, skip: int = 0, limit: int = None, order_by: str = "asc"):
    query = db.query(SystemLog)

    # Apply ordering
    if order_by == "desc":
        query = query.order_by(desc(SystemLog.change_email_mode_timestamp))
    else:
        query = query.order_by(asc(SystemLog.change_email_mode_timestamp))

    # Apply offset
    query = query.offset(skip)

    # Apply limit only if provided
    if limit is not None:
        query = query.limit(limit)

    return query.all()



def get_system_log_by_id(db: Session, log_id: int):
    return db.get(SystemLog, log_id)


def update_system_log(db: Session, log_id: int, updated_log: SystemLog):
    log = db.get(SystemLog, log_id)
    if not log:
        return None
    for field, value in updated_log.dict(exclude_unset=True).items():
        setattr(log, field, value)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def delete_system_log(db: Session, log_id: int):
    log = db.get(SystemLog, log_id)
    if not log:
        return None
    db.delete(log)
    db.commit()
    return log
