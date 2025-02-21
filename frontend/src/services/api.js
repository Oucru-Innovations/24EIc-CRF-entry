import axios from 'axios';

// Set base URL for the API
const API_BASE_URL = 'http://localhost:8080/api'; // Backend base URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;

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
    // Add unique `id` property to each record if not present
    return response.data.map((record) => ({
      id: record.id || `${record.patient_id}-${record.date_of_alert}-${record.time_of_alert}`, // Fallback if no id
      ...record,
    }));
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
    const response = await api.get('options/possible-reasons/'); // Corrected endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching possible reasons:', error);
    throw error;
  }
};

// Fetch events
export const getEvents = async () => {
  try {
    const response = await api.get('options/events/'); // Corrected endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Create a possible reason
export const createPossibleReason = async (reasonData) => {
  try {
    const response = await api.post('options/possible-reasons/', reasonData);
    return response.data;
  } catch (error) {
    console.error('Error creating possible reason:', error);
    throw error;
  }
};

// Create an event
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('options/events/', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update a possible reason
export const updatePossibleReason = async (id, reasonData) => {
  try {
    const response = await api.put(`options/possible-reasons/${id}`, reasonData);
    return response.data;
  } catch (error) {
    console.error('Error updating possible reason:', error);
    throw error;
  }
};

// Update an event
export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`options/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete a possible reason
export const deletePossibleReason = async (id) => {
  try {
    const response = await api.delete(`options/possible-reasons/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting possible reason:', error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`options/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Fetch the latest system log entry (email mode status)
export const getLatestSystemLog = async () => {
  try {
    const response = await api.get('logs/system_log/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest system log:', error);
    throw error;
  }
};
