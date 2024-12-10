import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from '@mui/material';

function PatientForm({ open, onClose, patientData, onSave }) {
  const [formData, setFormData] = useState({
    study_code: '',
    abbreviation_name: '',
    year_of_birth: '',
    gender: '',
  });

  useEffect(() => {
    if (patientData) {
      setFormData(patientData); // Pre-fill form if editing an existing patient
    } else {
      setFormData({
        study_code: '',
        abbreviation_name: '',
        year_of_birth: '',
        gender: '',
      });
    }
  }, [patientData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const method = patientData ? 'put' : 'post';
      const url = patientData ? `patients/${patientData.id}` : 'patients/';
      const response = await api[method](url, formData);
      onSave(response.data);
      onClose(); // Close the dialog after saving
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{patientData ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Study Code"
            name="study_code"
            value={formData.study_code}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Abbreviation Name"
            name="abbreviation_name"
            value={formData.abbreviation_name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Year of Birth"
            name="year_of_birth"
            type="number"
            value={formData.year_of_birth}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            select
            fullWidth
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {patientData ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PatientForm;
