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
    // status: 'Inactive',
  });

  
  const [errors, setErrors] = useState({

    study_code: '',

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
        // status: 'Inactive',
      });
    }

    
    // Reset errors when form is opened/closed

    setErrors({ study_code: '' });

  }, [patientData]);

  
  const validateStudyCode = (code) => {
    // Add your validation rules here

    // For example:

    if (!code) {
      return "Study Code is required";
    }
    // Split the code by hyphens
    const parts = code.split('-');
    
    if (parts.length !== 3) {
      return 'Study Code must have exactly 3 parts separated by hyphens (e.g., 24EIc-003-001)';
    }

    // Validate part 1: 2 numbers + 2 uppercase letters + 1 lowercase letter
    const part1Regex = /^[0-9]{2}[A-Z]{2}[a-z]{1}$/;
    if (!part1Regex.test(parts[0])) {
      return 'First part must be 2 numbers followed by 2 uppercase letters and 1 lowercase letter (e.g., 24EIc)';
    }

    // Validate part 2: exactly 3 digits
    const part2Regex = /^[0-9]{3}$/;
    if (!part2Regex.test(parts[1])) {
      return 'Second part must be exactly 3 digits (e.g., 003)';
    }

    // Validate part 3: up to 4 digits
    const part3Regex = /^[0-9]{1,4}$/;
    if (!part3Regex.test(parts[2])) {
      return 'Third part must be between 1 and 4 digits (e.g., 001)';
    }

    return ""; // Return empty string if validation passes
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "study_code") {
      // Validate study code
      // Convert input to uppercase for first part convenience
      const formattedValue = value.replace(/\s+/g, ''); // Remove any spaces
      const error = validateStudyCode(formattedValue);
      setErrors((prev) => ({
        ...prev,  
        study_code: error,
      }));
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate all fields before submission
    const studyCodeError = validateStudyCode(formData.study_code);
    if (studyCodeError) {
      setErrors((prev) => ({
        ...prev,
        study_code: studyCodeError,
      }));
      return; // Prevent submission if there are errors
    }
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
      <DialogTitle>
        {patientData ? "Edit Patient" : "Add New Patient"}
      </DialogTitle>
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
            error={!!errors.study_code}
            helperText={errors.study_code || 'Format: 24EIc-003-001'}
            placeholder="24EIc-003-001"
            inputProps={{ maxLength: 15 }}
            // You can add additional props for immediate validation
            onBlur={(e) => {
              const error = validateStudyCode(e.target.value);
              setErrors((prev) => ({
                ...prev,
                study_code: error,
              }));
            }}
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
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!!errors.study_code}>
          {patientData ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PatientForm;
