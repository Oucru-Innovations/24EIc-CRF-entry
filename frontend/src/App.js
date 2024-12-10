import React, { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PatientPage from './pages/PatientPage';
import PatientForm from './components/PatientForm';
import DayRecordForm from './components/DayRecordForm';
import AdminPage from './pages/AdminPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
  const [patients, setPatients] = useState([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleSavePatient = (newPatient) => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
    console.log('Patient saved successfully:', newPatient);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />

      {/* Main Content */}
      <div style={{ flexGrow: 1 }}>
        {/* Header */}
        <Header
          sidebarExpanded={sidebarExpanded}
          onSidebarToggle={() => setSidebarExpanded(!sidebarExpanded)}
        />

        {/* Main Page Content */}
        <div
          style={{
            padding: '20px',
            marginTop: 64, // Add margin to account for the height of the header (64px is default AppBar height)
            marginLeft: sidebarExpanded ? 240 : 80,
            transition: 'margin-left 0.3s ease',
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/patients/:patientId" element={<PatientPage />} />
            <Route
              path="/patient/:patientId?"
              element={<PatientForm onSave={handleSavePatient} />}
            />
            <Route
              path="/day-record/:patientId/:recordId?"
              element={
                <DayRecordForm
                  onSave={(data) => console.log('Day record saved/updated:', data)}
                />
              }
            />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
