from fastapi import FastAPI
from backend.app.routers import patients, options
from backend.app.database import engine
from backend.app import models

# Create all tables in the database
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# Include the routers for patients and options
app.include_router(patients.router, prefix="/patients", tags=["patients"])
app.include_router(options.router, prefix="/options", tags=["options"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Patient Management API!"}
