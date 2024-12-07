import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DayRecordForm({ patientId, recordData, onSave }) {
  const [possibleReasons, setPossibleReasons] = useState([]);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    study_code: '',
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
    // Fetch possible reasons and events
    axios.get('/api/possible-reasons/').then((response) => setPossibleReasons(response.data));
    axios.get('/api/events/').then((response) => setEvents(response.data));

    if (recordData) {
      setFormData(recordData); // Pre-fill the form if editing a day record
    }
  }, [recordData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = recordData ? 'put' : 'post';
    const url = recordData ? `/api/patient-day-records/${recordData.id}` : '/api/patient-day-records/';

    axios[method](url, formData)
      .then((response) => {
        onSave(response.data);
        setFormData({
          study_code: '',
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
      })
      .catch((error) => {
        console.error('Error saving day record:', error);
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
        <label>Date of Alert:</label>
        <input
          type="date"
          name="date_of_alert"
          value={formData.date_of_alert}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Time of Alert:</label>
        <input
          type="time"
          name="time_of_alert"
          value={formData.time_of_alert}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Date of Assessment:</label>
        <input
          type="date"
          name="date_of_assessment"
          value={formData.date_of_assessment}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Time of Assessment:</label>
        <input
          type="time"
          name="time_of_assessment"
          value={formData.time_of_assessment}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Possible Reason of Alert:</label>
        <select
          name="possible_reason_id"
          value={formData.possible_reason_id}
          onChange={handleChange}
          required
        >
          <option value="">Select a reason</option>
          {possibleReasons.map((reason) => (
            <option key={reason.id} value={reason.id}>{reason.reason}</option>
          ))}
        </select>
      </div>
      <div>
        <label>New Information (0-7):</label>
        <input
          type="number"
          name="new_information"
          value={formData.new_information}
          onChange={handleChange}
          min="0"
          max="7"
          required
        />
      </div>
      <div>
        <label>Expected Alert (0-7):</label>
        <input
          type="number"
          name="expected_alert"
          value={formData.expected_alert}
          onChange={handleChange}
          min="0"
          max="7"
          required
        />
      </div>
      <div>
        <label>Event at Alert:</label>
        <select
          name="event_at_alert_id"
          value={formData.event_at_alert_id}
          onChange={handleChange}
          required
        >
          <option value="">Select an event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>{event.event}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Event During 24 Hours:</label>
        <input
          type="text"
          name="event_during_24_hours"
          value={formData.event_during_24_hours}
          onChange={handleChange}
          placeholder="Comma-separated values"
        />
      </div>
      <button type="submit">{recordData ? 'Update' : 'Save'} Record</button>
    </form>
  );
}

export default DayRecordForm;
