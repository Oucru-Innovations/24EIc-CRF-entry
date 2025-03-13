import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, IconButton, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { Edit, Delete } from '@mui/icons-material';
import PatientForm from '../components/PatientForm';
import api from '../services/api';

function HomePage() {
  const [patients, setPatients] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [emailMode, setEmailMode] = useState(false);
  const [modelStatus, setModelStatus] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [targetStatus, setTargetStatus] = useState(null);

  useEffect(() => {
    fetchPatients();
    fetchEmailMode();
    checkModelStatus();

      // Set up polling interval for model status
    const statusInterval = setInterval(checkModelStatus, 10000); // Check every 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(statusInterval);
  }, []);

  const fetchPatients = () => {
    api.get('patients/')
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
      });
  };

  // Check model status from backend
  const checkModelStatus = async () => {
    try {
      const response = await api.get('model/status');
      if (response.data) {
        const currentStatus = response.data.running;
        setModelStatus(currentStatus);

        // Clear loading state if target status is reached or cleared
        if (targetStatus === null || currentStatus === targetStatus) {
          setTargetStatus(null);
          setIsModelLoading(false);
        }
      }
    } catch (error) {
      console.error('Error checking model status:', error);
      setModelStatus(false);
      setTargetStatus(null);
      setIsModelLoading(false);
    }
    // try {
    //   const response = await fetch('http://localhost:5000/status');
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
      
    //   const data = await response.json();
    //   setModelStatus(data.running);
    // } catch (error) {
    //   console.error('Error checking model status:', error);
    //   setModelStatus(false); // Default to false if there's an error
    // }
  };

  // Fetch the current email mode from SystemLog API
  const fetchEmailMode = () => {
    api.get('logs/system_log/latest') // Adjust endpoint if needed
      .then((response) => {
        if (response.data) {
          setEmailMode(response.data.email_mode);
        }
      })
      .catch((error) => {
        console.error('Error fetching email mode:', error);
      });
  };

  // Toggle model status
  const handleToggleModel = async () => {
    // const newStatus = !modelStatus;
    // setModelStatus(newStatus); // Optimistic UI update
    const target = !modelStatus;
    setTargetStatus(target);
    setIsModelLoading(true);

    try {
      // const endpoint = newStatus ? '/start' : '/stop';
      const endpoint = target ? '/start' : '/stop';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // console.log(`Model ${newStatus ? 'started' : 'stopped'} successfully`);
      console.log(`Model ${target ? 'start' : 'stop'} command sent successfully`);
    } catch (error) {
      console.error('Error toggling model:', error);
      setTargetStatus(null);
      setIsModelLoading(false);
      // setModelStatus(!newStatus); // Revert UI on failure
    }
  };

  // Toggle email mode
  const handleToggleEmailMode = () => {
    const newMode = !emailMode;
    setEmailMode(newMode); // Optimistic UI update

    api.post('/logs/system_log/', {
      email_mode: newMode,
      change_email_mode_timestamp: new Date().toISOString(),
    })
      .then(() => {
        console.log('Email mode updated successfully');
      })
      .catch((error) => {
        console.error('Error updating email mode:', error);
        setEmailMode(!newMode); // Revert UI on failure
      });
  };

  // Toggle patient status (Active/Inactive)
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

    // Find the current patient to get all their data
    const currentPatient = patients.find(patient => patient.id === id);
    // Optimistically update the UI
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === id ? { ...patient, status: newStatus } : patient
      )
    );

    // Send API request to update status
    api.put(`patients/${id}`, { ...currentPatient, status: newStatus })
      .then(() => {
        console.log(`Patient ${id} status updated to ${newStatus}`);
      })
      .catch((error) => {
        console.error(`Error updating patient ${id} status:`, error);
        // Revert UI update if API fails
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === id ? { ...patient, status: currentStatus } : patient
          )
        );
      });
  };


  const handleSavePatient = (savedPatient) => {
    // Update the list if editing or add the new patient
    setPatients((prevPatients) => {
      const existingIndex = prevPatients.findIndex((p) => p.id === savedPatient.id);
      if (existingIndex !== -1) {
        const updatedPatients = [...prevPatients];
        updatedPatients[existingIndex] = savedPatient;
        return updatedPatients;
      }
      return [...prevPatients, savedPatient];
    });
    fetchPatients(); // Refresh the table
  };

  const handleOpenDialog = (patient = null) => {
    setEditingPatient(patient);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingPatient(null);
    setDialogOpen(false);
  };

  const handleDeletePatient = (id) => {
    if (window.confirm('Are you sure you want to delete this patient? This action is irreversible.')) {
      api.delete(`patients/${id}`)
        .then(() => {
          setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== id));
          console.log('Patient deleted successfully');
        })
        .catch((error) => {
          console.error('Error deleting patient:', error);
        });
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'study_code', headerName: 'Study Code', width: 150 },
    { field: 'abbreviation_name', headerName: 'Initials', width: 150 },
    { field: 'year_of_birth', headerName: 'Year of Birth', width: 130 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Switch
          checked={params.row.status === 'Active'}
          onChange={() => handleToggleStatus(params.row.id, params.row.status)}
          color="primary"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleOpenDialog(params.row)}
            title="Edit Patient"
          >
            <Edit />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDeletePatient(params.row.id)}
            title="Delete Patient"
          >
            <Delete />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/patients/${params.row.id}`}
          >
            View
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <div>
      <h1>Patient</h1>

      {/* Email Mode Toggle */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <FormControlLabel
          control={
            <Switch
              checked={emailMode}
              onChange={handleToggleEmailMode}
              color="primary"
            />
          }
          label={`Alert Mode: ${emailMode ? 'ON' : 'OFF'}`}
        />
        {/* <FormControlLabel
          control={
            <Switch
              checked={modelStatus}
              onChange={handleToggleModel}
              color="secondary"
            />
          }
          label={`Model Status: ${modelStatus ? 'ON' : 'OFF'}`}
        /> */}
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="contained"
            onClick={handleToggleModel}
            disabled={isModelLoading}
            color={modelStatus ? "error" : "primary"}
          >
            {isModelLoading ? (
              <>
                <CircularProgress size={24} color="inherit" />
                <Box component="span" ml={1}>
                  {targetStatus ? "Starting..." : "Stopping..."}
                </Box>
              </>           
            ) : (
              modelStatus ? "Stop Model" : "Start Model"
            )}
          </Button>
          <Box
            width={24}
            height={24}
            borderRadius="50%"
            bgcolor={modelStatus ? "#4caf50" : "#f44336"}
            border={1}
            borderColor="grey.300"
            display="flex"
            alignItems="center"
            justifyContent="center"
          />
          <Box component="span" color={modelStatus ? "success.main" : "error.main"}>
            {modelStatus ? "Running" : "Stopped"}
          </Box>
        </Box>
      </Box>
      
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={patients}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleOpenDialog()}
        style={{ marginTop: '20px' }}
      >
        Add New Patient
      </Button>
      <PatientForm
        open={isDialogOpen}
        onClose={handleCloseDialog}
        patientData={editingPatient}
        onSave={handleSavePatient}
      />
    </div>
  );
}

export default HomePage;
