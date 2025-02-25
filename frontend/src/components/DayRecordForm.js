import React, { useState, useEffect } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import api from '../services/api';

function DayRecordForm({ patientId, recordData, onSave }) {
  const [possibleReasons, setPossibleReasons] = useState([]);
  const [events, setEvents] = useState([]);
  const [patientStudyCode, setPatientStudyCode] = useState('');
  const [formData, setFormData] = useState({
    date_of_alert: '',
    time_of_alert: '',
    date_of_assessment: '',
    time_of_assessment: '',
    possible_reason_id: '',
    new_information: 0,
    expected_alert: 0,
    event_at_alert_id: '',
    event_during_24_hours: '',
  });

  useEffect(() => {
    // Fetch patient details to get the study code
    api.get(`patients/${patientId}`)
      .then((response) => setPatientStudyCode(response.data.study_code))
      .catch((error) => console.error('Error fetching patient details:', error));

    // Fetch possible reasons and events
    api.get('options/possible-reasons/')
      .then((response) => setPossibleReasons(response.data))
      .catch((error) => console.error('Error fetching possible reasons:', error));

    api.get('options/events/')
      .then((response) => setEvents(response.data))
      .catch((error) => console.error('Error fetching events:', error));

    // if (recordData) {
    //   setFormData(recordData); // Pre-fill the form if editing a day record
    // }
    if (recordData) {
      if (recordData.isNewRecord) {
        // This is a new record with pre-filled data
        setFormData(prevState => ({
          ...prevState,
          date_of_alert: recordData.date_of_alert,
          time_of_alert: recordData.time_of_alert,
        }));
      } else {
        // This is an existing record being edited
        setFormData(recordData);
      }
    }
  }, [patientId, recordData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const method = recordData ? api.put : api.post;
      // const url = recordData ? `patient-day-records/${recordData.id}` : 'patient-day-records/';
          // Check if this is an existing record (not from log selection)
    const isExistingRecord = recordData && !recordData.isNewRecord;
    const method = isExistingRecord ? api.put : api.post;
    const url = isExistingRecord ? `patient-day-records/${recordData.id}` : 'patient-day-records/';

      const response = await method(url, { ...formData, patient_id: patientId });
      // Call onSave with the updated/new record
      onSave(response.data);
  
      // Reset the form after saving
      setFormData({
        date_of_alert: '',
        time_of_alert: '',
        date_of_assessment: '',
        time_of_assessment: '',
        possible_reason_id: '',
        new_information: 0,
        expected_alert: 0,
        event_at_alert_id: '',
        event_during_24_hours: '',
      });
    } catch (error) {
      console.error('Error saving day record:', error);
    }
  };
  

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, p: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      {/* <Typography variant="h6" gutterBottom>
        {recordData ? 'Edit Day Record' : 'Add New Day Record'}
      </Typography> */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Study Code"
            value={patientStudyCode}
            InputProps={{ readOnly: true }}
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date of Alert"
            type="date"
            name="date_of_alert"
            value={formData.date_of_alert}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            // required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Time of Alert"
            type="time"
            name="time_of_alert"
            value={formData.time_of_alert}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            // required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date of Assessment"
            type="date"
            name="date_of_assessment"
            value={formData.date_of_assessment}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Time of Assessment"
            type="time"
            name="time_of_assessment"
            value={formData.time_of_assessment}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Possible Reason of Alert"
            name="possible_reason_id"
            value={formData.possible_reason_id}
            onChange={handleChange}
            // required
          >
            {possibleReasons.map((reason) => (
              <MenuItem key={reason.id} value={reason.id}>
                {reason.reason}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="New Information (0-7)"
            type="number"
            name="new_information"
            value={formData.new_information}
            onChange={handleChange}
            inputProps={{ min: 0, max: 7 }}
            // required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Expected Alert (0-7)"
            type="number"
            name="expected_alert"
            value={formData.expected_alert}
            onChange={handleChange}
            inputProps={{ min: 0, max: 7 }}
            // required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Event at Alert"
            name="event_at_alert_id"
            value={formData.event_at_alert_id}
            onChange={handleChange}
            // required
          >
            {events.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.event}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Event During 24 Hours"
            name="event_during_24_hours"
            value={formData.event_during_24_hours}
            onChange={handleChange}
            placeholder="Comma-separated values"
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          {recordData ? 'Update' : 'Save'} Record
        </Button>
      </Box>
    </Box>
  );
}

export default DayRecordForm;
