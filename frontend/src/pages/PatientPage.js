import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import back icon
import DayRecordForm from '../components/DayRecordForm'; // Import the DayRecordForm component
import styles from '../styles/styles.PatientPage.css';
function PatientPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [dayRecords, setDayRecords] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    // Fetch patient details
    api.get(`patients/${patientId}`)
      .then((response) => setPatient(response.data))
      .catch((error) => console.error('Error fetching patient details:', error));

    // Fetch patient's day records
    fetchDayRecords();
  }, [patientId]);

  const fetchDayRecords = () => {
    api.get(`patient-day-records/?patient_id=${patientId}`)
      .then((response) => setDayRecords(response.data))
      .catch((error) => {
        console.error('Error fetching day records:', error);
        if (error.response?.status === 404) {
          console.error('No records found for this patient');
        }
      });
  };

  const handleDialogOpen = (record = null) => {
    setCurrentRecord(record);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setCurrentRecord(null);
    setIsDialogOpen(false);

    // Reset focus to the "Add New Record" button
    const addButton = document.getElementById('add-record-button');
    if (addButton) {
      addButton.focus();
    }
  };

  const handleSaveRecord = (record) => {
    const isNew = !record.id; // Check if the record is new
    const method = isNew ? api.post : api.put;
    const url = isNew
      ? `patient-day-records/`
      : `patient-day-records/${record.id}`;

    // Add patient_id for new records explicitly
    const payload = isNew ? { ...record, patient_id: patientId } : record;

    method(url, payload)
      .then((response) => {
        fetchDayRecords(); // Refetch the records after saving
        handleDialogClose();
      })
      .catch((error) => console.error('Error saving day record:', error));
  };

  const handleDeleteRecord = (recordId) => {
    api.delete(`patient-day-records/${recordId}`)
      .then(() => {
        setDayRecords((prevRecords) =>
          prevRecords.filter((record) => record.id !== recordId)
        );
      })
      .catch((error) => console.error('Error deleting day record:', error));
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50, headerClassName: 'data-grid-header' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      headerClassName: 'data-grid-header',
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDialogOpen(params.row)}
            style={{ marginRight: 10 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteRecord(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
    { field: 'date_of_alert', headerName: 'Date of Alert', width: 100, headerClassName: styles.dataGridHeader },
    { field: 'time_of_alert', headerName: 'Time of Alert', width: 100, headerClassName: styles.dataGridHeader },
    { field: 'date_of_assessment', headerName: 'Date of Assessment', width: 100, headerClassName: styles.dataGridHeader },
    { field: 'time_of_assessment', headerName: 'Time of Assessment', width: 100, headerClassName: styles.dataGridHeader },
    { field: 'new_information', headerName: 'New Information', width: 100, headerClassName: styles.dataGridHeader },
    { field: 'expected_alert', headerName: 'Expected Alert', width: 100, headerClassName: styles.dataGridHeader },
    { field: 'event_during_24_hours', headerName: 'Event During 24 Hours', width: 180, headerClassName: styles.dataGridHeader },
  ];
  
  // const columns = [
  //   { field: 'id', headerName: 'ID', width: 50 },
  //   {
  //     field: 'actions',
  //     headerName: 'Actions',
  //     width: 200,
  //     renderCell: (params) => (
  //       <>
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           onClick={() => handleDialogOpen(params.row)}
  //           style={{ marginRight: 10 }}
  //         >
  //           Edit
  //         </Button>
  //         <Button
  //           variant="contained"
  //           color="error"
  //           onClick={() => handleDeleteRecord(params.row.id)}
  //         >
  //           Delete
  //         </Button>
  //       </>
  //     ),
  //   },
  //   { field: 'date_of_alert', headerName: 'Date of Alert', width: 100 },
  //   { field: 'time_of_alert', headerName: 'Time of Alert', width: 100 },
  //   { field: 'date_of_assessment', headerName: 'D.O.A', width: 100 },
  //   { field: 'time_of_assessment', headerName: 'T.O.A', width: 50 },
  //   { field: 'new_information', headerName: 'New Info', width: 50 },
  //   { field: 'expected_alert', headerName: 'Expected Alert', width: 50 },
  //   { field: 'event_during_24_hours', headerName: 'Event During 24 Hours', width: 180 },
    
  // ];

  return (
    <div>
      {patient ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
              <ArrowBackIcon fontSize="large" />
            </IconButton>
            <h1>
              Observation 
            </h1>
          </Box>
          <p>
            <strong>Study code:</strong> {patient?.study_code} - {patient?.abbreviation_name}
          </p>
          <p>
            <strong>Year of Birth:</strong> {patient.year_of_birth}
          </p>
          <p>
            <strong>Gender:</strong> {patient.gender}
          </p>

          <Box mt={4} style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={dayRecords}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={5}
              rowsPerPageOptions={[5]}
              autoHeight
              disableSelectionOnClick
            />
          </Box>
          <Button
            id="add-record-button"
            variant="contained"
            color="secondary"
            onClick={() => handleDialogOpen()}
            style={{ marginTop: '20px' }}
          >
            Add Observation
          </Button>

          <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <DialogTitle>{currentRecord ? 'Edit Record' : 'Add New Record'}</DialogTitle>
            <DialogContent>
              <DayRecordForm
                patientId={patientId}
                recordData={currentRecord}
                onSave={handleSaveRecord}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <p>Loading patient details...</p>
      )}
    </div>
  );
}

export default PatientPage;
