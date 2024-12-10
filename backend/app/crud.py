from sqlmodel import Session, select
from backend.app.models import Patient, PatientDayRecord, PossibleReason, Event

# --- Patient CRUD Operations ---

def create_patient(db: Session, patient: Patient):
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

def get_patients(db: Session, skip: int = 0, limit: int = 100):
    statement = select(Patient).offset(skip).limit(limit)
    return db.exec(statement).all()

def get_patient_by_id(db: Session, patient_id: int):
    return db.get(Patient, patient_id)

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
def get_patient_day_records(db: Session, patient_id: int, skip: int = 0, limit: int = 100):
    statement = select(PatientDayRecord).where(PatientDayRecord.patient_id == patient_id).offset(skip).limit(limit)
    return db.exec(statement).all()

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
def get_possible_reasons(db: Session, skip: int = 0, limit: int = 100):
    statement = select(PossibleReason).offset(skip).limit(limit)
    return db.exec(statement).all()

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
def get_events(db: Session, skip: int = 0, limit: int = 100):
    statement = select(Event).offset(skip).limit(limit)
    return db.exec(statement).all()

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
