import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,

  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ListItemText,
  Typography,
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

  const [modelLogs, setModelLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState('');
  const [possibleReasons, setPossibleReasons] = useState({});


  useEffect(() => {
    // Fetch patient details
    api.get(`patients/${patientId}`)
      .then((response) => setPatient(response.data))
      .catch((error) => console.error('Error fetching patient details:', error));

    fetchPossibleReasons(); // Fetch possible reasons once
    // // Fetch patient's day records
    // fetchDayRecords();
    // Fetch model logs
    fetchModelLogs();
  }, [patientId]);

  useEffect(() => {
    if (Object.keys(possibleReasons).length > 0) {
      fetchDayRecords(); // Fetch day records only after possibleReasons is set
    }
  }, [possibleReasons]); // Runs when possibleReasons updates

  const fetchPossibleReasons = () => {
    api.get(`options/possible-reasons/`) // Adjust the endpoint if needed
      .then((response) => {
        const reasonMap = response.data.reduce((acc, reason) => {
          acc[reason.id] = reason.reason; // Store { id: reasonText }
          return acc;
        }, {});
        setPossibleReasons(reasonMap);
      })
      .catch((error) => console.error('Error fetching possible reasons:', error));
  };

  const fetchDayRecords = () => {
    api.get(`patient-day-records/?patient_id=${patientId}`)
      .then((response) => {
        // Transform the response data to combine date & time fields
        const transformedData = response.data.map((record) => ({
          ...record,
          alert_datetime: `${record.date_of_alert} ${record.time_of_alert}`,
          assessment_datetime: `${record.date_of_assessment} ${record.time_of_assessment}`,
          reason: possibleReasons[record.possible_reason_id] || "Unknown",
        }));
        setDayRecords(transformedData);
      })
      .catch((error) => {
        console.error('Error fetching day records:', error);
        if (error.response?.status === 404) {
          console.error('No records found for this patient');
        }
      });
  };

  const fetchModelLogs = () => {
    api.get(`logs/model_log/${patientId}`)
      .then((response) => setModelLogs([...response.data])) // Update to force new reference
      .catch((error) => console.error('Error fetching model logs:', error));
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
      
      // If this was created from a log, update the log's ack status
      if (selectedLog) {
        api.put(`logs/model_log/${selectedLog}`, { ack: true })
          .then(() => {
            fetchModelLogs(); // Refetch logs to update the dropdown
            setSelectedLog(''); // Reset the selected log
          })
          .catch((error) => console.error('Error updating log status:', error));
      }
      
      handleDialogClose();
    })
    .catch((error) => console.error('Error saving day record:', error));
    // method(url, payload)
    //   .then((response) => {
    //     fetchDayRecords(); // Refetch the records after saving
    //     handleDialogClose();
    //   })
    //   .catch((error) => console.error('Error saving day record:', error));
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

  const handleLogChange = (event) => {
    const selectedLogId = event.target.value;
    setSelectedLog(selectedLogId);
    const selectedLogDetail = modelLogs.find(log => log.id === selectedLogId);
    
    // Create initial form data with the log date and time
    const initialFormData = {
      isNewRecord: true, 
      date_of_alert: selectedLogDetail.date,
      time_of_alert: selectedLogDetail.time,
    };
    
    // Pass the initial form data when opening the dialog
    handleDialogOpen(initialFormData);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50, headerClassName: 'data-grid-header' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
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
    // { field: 'date_of_alert', headerName: 'Date of Alert', width: 100, headerClassName: styles.dataGridHeader },
    // { field: 'time_of_alert', headerName: 'Time of Alert', width: 100, headerClassName: styles.dataGridHeader },
    // { field: 'date_of_assessment', headerName: 'Date of Assessment', width: 100, headerClassName: styles.dataGridHeader },
    // { field: 'time_of_assessment', headerName: 'Time of Assessment', width: 100, headerClassName: styles.dataGridHeader },
    { field: 'alert_datetime', headerName: 'Alert Time', width: 200, headerClassName: styles.dataGridHeader },
    { field: 'assessment_datetime', headerName: 'Assessment Time', width: 200, headerClassName: styles.dataGridHeader },
    // { field: 'new_information', headerName: 'New Information', width: 350, headerClassName: styles.dataGridHeader },
    { field: 'reason', headerName: 'Reason of Alert', width: 350, headerClassName: styles.dataGridHeader },
    { field: 'expected_alert', headerName: 'Expected Alert', width: 350, headerClassName: styles.dataGridHeader },
    // { field: 'event_during_24_hours', headerName: 'Alert content', width: 300, headerClassName: styles.dataGridHeader },
    { field: 'notes', headerName: 'Notes', width: 300, headerClassName: styles.dataGridHeader },
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

          <FormControl fullWidth variant="outlined" sx={{ mb: 2 , width: '300px'}}>
            <InputLabel id="ignored-alert-list-label">Ignored Alert List</InputLabel>
            <Select
              labelId="ignored-alert-list-label"
              id="ignored-alert-list"
              value={selectedLog}
              onChange={handleLogChange}
              label="Ignored Alert List"
              MenuProps={{ PaperProps: { style: { maxHeight: 300, width: 300 } } }}
            >
              {modelLogs.filter(log => !log.ack).map((log) => ( 
                <MenuItem key={log.id} value={log.id}>
                  {log.date} {log.time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={4} sx={{ height: 'auto', width: '100%', position: 'relative' }}>
            <Box sx={{ flexGrow: 1, overflow: 'auto', pb: 8 }}>
              <DataGrid
                rows={dayRecords}
                columns={columns}
                getRowId={(row) => row.id}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
                disableSelectionOnClick
                slots={{ toolbar: GridToolbar }}
              />
            </Box>

            {/* Sticky Button */}
            <Box sx={{ position: 'sticky', bottom: 20, background: 'white', p: 2, textAlign: 'center' }}>
              <Button
                id="add-record-button"
                variant="contained"
                color="secondary"
                onClick={() => handleDialogOpen()}
              >
                Add Observation
              </Button>
            </Box>
          </Box>
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
