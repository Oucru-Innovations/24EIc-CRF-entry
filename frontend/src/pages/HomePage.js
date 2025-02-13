import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, IconButton, Switch, FormControlLabel } from '@mui/material';
import { Link } from 'react-router-dom';
import { Edit, Delete } from '@mui/icons-material';
import PatientForm from '../components/PatientForm';
import api from '../services/api';

function HomePage() {
  const [patients, setPatients] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [emailMode, setEmailMode] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchEmailMode();
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
          label={`Email Mode: ${emailMode ? 'ON' : 'OFF'}`}
        />
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
