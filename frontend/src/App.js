import React from 'react';
import './App.css'; // Custom styles
import { Route, Routes } from 'react-router-dom'; // Import routes for navigation
import HomePage from './pages/HomePage'; // Import HomePage component
import PatientPage from './pages/PatientPage'; // Import PatientPage component
import PatientForm from './components/PatientForm'; // Import PatientForm component
import DayRecordForm from './components/DayRecordForm'; // Import DayRecordForm component

function App() {
  return (
    <div className="App">
      <h1>Patient Management System</h1>
      <Routes>
        {/* Define route for home page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Define route for individual patient page */}
        <Route path="/patients/:patientId" element={<PatientPage />} />
        
        {/* Define route for adding a new patient */}
        <Route path="/add-patient" element={<PatientForm />} />
        
        {/* Define route for editing a patient */}
        <Route path="/edit-patient/:patientId" element={<PatientForm />} />
        
        {/* Define route for adding a new day record */}
        <Route path="/add-record/:patientId" element={<DayRecordForm />} />
        
        {/* Define route for editing an existing day record */}
        <Route path="/edit-record/:patientId/:recordId" element={<DayRecordForm />} />
      </Routes>
    </div>
  );
}

export default App;
