from sqlmodel import SQLModel, Session
from backend.app.database import engine
from backend.app.models import PossibleReason, Event

def init_db():
    # Create tables if they do not exist
    SQLModel.metadata.create_all(engine)

    # Add default records for PossibleReason and Event
    with Session(engine) as session:
        # Check if the default records already exist
        default_reason = session.query(PossibleReason).filter_by(reason="reasons").first()
        default_event = session.query(Event).filter_by(event="events").first()

        # Add the default "reasons" record if not present
        if not default_reason:
            session.add(PossibleReason(reason="reasons"))
        
        # Add the default "events" record if not present
        if not default_event:
            session.add(Event(event="events"))

        # Commit changes
        session.commit()

if __name__ == "__main__":
    init_db()
