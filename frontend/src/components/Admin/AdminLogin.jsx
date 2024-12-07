import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminLoginRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Switch between login and register
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
  
    try {
      const response = await axios.post('http://localhost:5000/admin/login', {
        name,
        email,
        password,
      });
  
      // Save the JWT token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'true'); // Set role to 'true' for admin
      localStorage.setItem('name', response.data.name); // Store the admin's name
      alert(response.data.token, "success");
  
      // Dispatch a storage event to notify Navbar to re-render
      window.dispatchEvent(new Event('storage'));
  
      setIsLoggedIn(true);
      fetchAppointments();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    }
  };
  

  // Handle Admin Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await axios.post('http://localhost:5000/admin/register', {
        name,
        email,
        password,
      });

      // On successful registration, automatically log in
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      fetchAppointments();
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Error registering. Please try again.');
    }
  };

  // Fetch Appointments
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
  
      const { appointments, users } = response.data;  // Destructure both appointments and users
  
      console.log('Appointments:', appointments);  // Log appointments
      console.log('Users:', users);  // Log users
  
      // Assuming you want to map the users to the patientId in appointments
      const updatedAppointments = appointments.map((appointment) => {
        // Find the user based on the patientId
        const user = users.find((user) => user._id.toString() === appointment.patientId.toString());
        return {
          ...appointment,
          patientName: user ? user.name : 'Unknown',  // Add the patient's name to each appointment
        };
      });
  
      setAppointments(updatedAppointments);  // Set the appointments with patient names
  
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointments. Please try again.');
      if (err.response?.status === 401) {
        handleLogout();  // Auto logout on unauthorized access
      }
    }
  };
  

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setAppointments([]);
  };

  // Check token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchAppointments();
    }
  }, []);

  // Render Login Form
  const renderLoginForm = () => (
    <div style={styles.container}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
      <div style={styles.inputGroup}>
          <label>Name</label>
          <input
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      <p>
        Don't have an account?{' '}
        <button onClick={() => setIsLogin(false)} style={styles.link}>
          Register here
        </button>
      </p>
    </div>
  );

  // Render Register Form
  const renderRegisterForm = () => (
    <div style={styles.container}>
      <h2>Admin Register</h2>
      <form onSubmit={handleRegister} style={styles.form}>
      <div style={styles.inputGroup}>
          <label>Name</label>
          <input
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
      <p>
        Already have an account?{' '}
        <button onClick={() => setIsLogin(true)} style={styles.link}>
          Login here
        </button>
      </p>
    </div>
  );

  // Render Appointments List
  const renderAppointments = () => (
    <div style={styles.container}>
      <h2>Appointments</h2>
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

  return isLoggedIn ? renderAppointments() : isLogin ? renderLoginForm() : renderRegisterForm();
};

// Inline styles (can be replaced with a CSS file)
const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    boxSizing: 'border-box',
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
  link: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default AdminLoginRegister;
