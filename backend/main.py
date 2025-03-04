import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.app.database import engine
from backend.app.models import SQLModel
from backend.app.routers import patients, options, patient_day_records, logs, model_status

# Initialize FastAPI app
app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all tables in the database
@app.on_event("startup")
async def on_startup():
    SQLModel.metadata.create_all(engine)

# Custom ValidationError handler
@app.exception_handler(HTTPException)
async def validation_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# Include the routers
app.include_router(patients.router, prefix="/api/patients", tags=["patients"])
app.include_router(logs.router, prefix="/api/logs", tags=["logs"])
app.include_router(patient_day_records.router, prefix="/api/patient-day-records", tags=["patient-day-records"])
app.include_router(options.router, prefix="/api/options", tags=["options"])

app.include_router(model_status.router, prefix="/api/model", tags=["model"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the SQLModel-based Patient Management API!"}

# Entry point for development server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
