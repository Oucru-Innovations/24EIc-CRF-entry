from sqlmodel import create_engine, Session

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# Dependency for database session
def get_session():
    with Session(engine) as session:
        yield session
