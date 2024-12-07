import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import DayRecordForm from '../components/DayRecordForm';

function PatientPage() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [dayRecords, setDayRecords] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch patient details
    axios.get(`/api/patients/${patientId}`)
      .then(response => {
        setPatient(response.data);
      })
      .catch(error => {
        console.error('Error fetching patient details:', error);
      });

    // Fetch patient's day records
    axios.get(`/api/patient-day-records/?patient_id=${patientId}`)
      .then(response => {
        setDayRecords(response.data);
      })
      .catch(error => {
        console.error('Error fetching day records:', error);
      });
  }, [patientId]);

  const handleSaveDayRecord = (newRecord) => {
    setDayRecords(prevRecords => [...prevRecords, newRecord]);
    setIsEditing(false);
  };

  return (
    <div>
      {patient ? (
        <>
          <h1>Patient Details: {patient.study_code} - {patient.abbreviation_name}</h1>
          <p><strong>Year of Birth:</strong> {patient.year_of_birth}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>

          <h2>Day Records</h2>
          <ul>
            {dayRecords.map((record) => (
              <li key={record.id}>
                <p>{record.date_of_alert} {record.time_of_alert} - {record.new_information}</p>
              </li>
            ))}
          </ul>
          <button onClick={() => setIsEditing(true)}>Add New Record</button>

          {isEditing && (
            <DayRecordForm
              patientId={patientId}
              onSave={handleSaveDayRecord}
            />
          )}
        </>
      ) : (
        <p>Loading patient details...</p>
      )}

      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default PatientPage;
