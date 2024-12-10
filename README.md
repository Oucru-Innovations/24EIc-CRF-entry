
# Patient Management System

A full-stack application for managing patients, their records, and administrative data. The system includes functionality for adding, editing, and deleting patients and their day records, as well as managing possible reasons and events.

## Features

- Manage patients and their day records.
- Admin page to manage possible reasons and events.
- Sidebar navigation with responsive design.
- Integrated backend with FastAPI and frontend with React.

---

## Requirements

- Python (>=3.8)
- Node.js (>=16)
- npm (or yarn)
- SQLite (pre-configured)

---

## Backend Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Oucru-Innovations/24EIc-CRF-entry
```

### 2. Set Up the Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Initialize the Database
```bash
python backend/app/create_db.py
```

This will create the database and add the initial records for "Possible Reasons" and "Events."

### 5. Run the Backend Server
```bash
uvicorn backend.app.main:app --reload
```

The backend server will be available at `http://localhost:8000`.

### 6. Access API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation and the full list of available APIs.

---

## Frontend Setup

### 1. Navigate to the Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Frontend Development Server
```bash
npm start
```

The frontend will be available at `http://localhost:3000`.

---

## Running the Project

1. **Start the Backend Server**:
   ```bash
   uvicorn backend.app.main:app --reload
   ```
2. **Start the Frontend Development Server**:
   ```bash
   npm start
   ```

3. Open browser and navigate to `http://localhost:3000`.

---

## Project Structure

### Backend (`backend/`)
- **`app/`**: Contains backend application code.
  - **`models.py`**: SQLModel models for database tables.
  - **`crud.py`**: CRUD operations for the application.
  - **`main.py`**: Main application entry point.
  - **`create_db.py`**: Script to initialize the database.

### Frontend (`frontend/`)
- **`src/`**: Contains React application code.
  - **`components/`**: Reusable UI components like `Header`, `Sidebar`, etc.
  - **`pages/`**: Pages for different routes like `HomePage`, `PatientPage`, and `AdminPage`.
  - **`services/`**: API service module for backend communication.

---

## Notes

- Make sure the backend is running before starting the frontend.
- Use `npm run build` to create a production build of the frontend.
- Refer to `http://localhost:8000/docs` for the complete list of APIs provided by the backend.

---

