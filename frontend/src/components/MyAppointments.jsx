import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MyAppointments.css'; // Ensure to style appropriately

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/appointments', {
          headers: { token },
        });
        console.log(response.data);
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch appointments.');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="appointments-container">
      <h2>Your Appointments</h2>
      {appointments.length === 0 ? (
        <p>You have no appointments booked.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id} className="appointment-item">
              <h3>Appointment with Dr. {appointment.doctor}</h3>
              <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
              <p>Time: {appointment.time}</p>
              <p>Sickness: {appointment.notes}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAppointments;
