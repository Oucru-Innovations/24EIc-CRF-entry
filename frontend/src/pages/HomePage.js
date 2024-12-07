import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get('/api/patients/')
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
      });
  }, []);

  return (
    <div>
      <h1>Patients Overview</h1>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            <Link to={`/patients/${patient.id}`}>
              {patient.study_code} - {patient.abbreviation_name}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/add-patient">Add New Patient</Link>
    </div>
  );
}

export default HomePage;
