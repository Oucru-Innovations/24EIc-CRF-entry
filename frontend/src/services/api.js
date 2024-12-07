import axios from 'axios';

// Set base URL for the API
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Adjust with your FastAPI URL
});

// Fetch all patients
export const getPatients = async () => {
  try {
    const response = await api.get('patients/');
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

// Fetch a specific patient by ID
export const getPatient = async (id) => {
  try {
    const response = await api.get(`patients/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching patient ${id}:`, error);
    throw error;
  }
};

// Fetch all day records for a specific patient
export const getDayRecords = async (patientId) => {
  try {
    const response = await api.get(`patient-day-records/?patient_id=${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching day records for patient ${patientId}:`, error);
    throw error;
  }
};

// Create a new patient
export const createPatient = async (patientData) => {
  try {
    const response = await api.post('patients/', patientData);
    return response.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

// Create a new day record
export const createDayRecord = async (dayRecordData) => {
  try {
    const response = await api.post('patient-day-records/', dayRecordData);
    return response.data;
  } catch (error) {
    console.error('Error creating day record:', error);
    throw error;
  }
};

// Trigger an event for a patient
export const triggerEvent = async (patientId, eventData) => {
  try {
    const response = await api.post(`patients/${patientId}/trigger-event`, eventData);
    return response.data;
  } catch (error) {
    console.error(`Error triggering event for patient ${patientId}:`, error);
    throw error;
  }
};

// Fetch possible reasons for alerts
export const getPossibleReasons = async () => {
    try {
      const response = await api.get('possible-reasons/');
      return response.data;
    } catch (error) {
      console.error('Error fetching possible reasons:', error);
      throw error;
    }
  };
  
  // Fetch events
  export const getEvents = async () => {
    try {
      const response = await api.get('events/');
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  };
  