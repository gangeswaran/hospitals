import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppointmentsBook = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await axios.get('http://localhost:5000/admin/appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { appointments, users } = response.data;

      console.log('Appointments:', appointments); // Log appointments
      console.log('Users:', users); // Log users

      // Map users to the patientId in appointments
      const updatedAppointments = appointments.map((appointment) => {
        const user = users.find(
          (user) => user._id.toString() === appointment.patientId.toString()
        );
        return {
          ...appointment,
          patientName: user ? user.name : 'Unknown', // Add the patient's name to each appointment
        };
      });

      setAppointments(updatedAppointments); // Set the appointments with patient names
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointments. Please try again.');
      if (err.response?.status === 401) {
        handleLogout(); // Auto logout on unauthorized access
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAppointments([]);
  };

  return (
    <div style={styles.container}>
      <h2>Appointments</h2>
      {error && <p style={styles.error}>{error}</p>}
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul style={styles.list}>
          {appointments.map((appointment) => (
            <li key={appointment._id} style={styles.listItem}>
              <p>
                <strong>Patient Name:</strong> {appointment.patientName}
              </p>
              <p>
                <strong>Date:</strong> {appointment.date}
              </p>
              <p>
                <strong>Time:</strong> {appointment.time}
              </p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>
    </div>
  );
};

// Inline styles (can be replaced with a CSS file)
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
};

export default AppointmentsBook;
