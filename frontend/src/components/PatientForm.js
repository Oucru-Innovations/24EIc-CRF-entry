import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PatientForm({ patientData, onSave }) {
  const [formData, setFormData] = useState({
    study_code: '',
    abbreviation_name: '',
    year_of_birth: '',
    gender: '',
  });

  useEffect(() => {
    if (patientData) {
      setFormData(patientData); // Pre-fill form if editing an existing patient
    }
  }, [patientData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = patientData ? 'put' : 'post';
    const url = patientData ? `/api/patients/${patientData.id}` : '/api/patients/';

    axios[method](url, formData)
      .then((response) => {
        onSave(response.data);
        setFormData({
          study_code: '',
          abbreviation_name: '',
          year_of_birth: '',
          gender: '',
        });
      })
      .catch((error) => {
        console.error('Error saving patient:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Study Code:</label>
        <input
          type="text"
          name="study_code"
          value={formData.study_code}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Abbreviation Name:</label>
        <input
          type="text"
          name="abbreviation_name"
          value={formData.abbreviation_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Year of Birth:</label>
        <input
          type="number"
          name="year_of_birth"
          value={formData.year_of_birth}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <button type="submit">{patientData ? 'Update' : 'Save'} Patient</button>
    </form>
  );
}

export default PatientForm;
