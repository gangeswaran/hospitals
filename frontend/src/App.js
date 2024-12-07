import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Appointment from './components/Appointment';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MyAppointments from './components/MyAppointments';
import Home from './components/Home';
import AdminLoginRegister from './components/Admin/AdminLogin';
import AppointmentsBook from './components/Admin/AppointmentsBook';

const App = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('token'); // Clear token on logout
  };

  return (
    <Router>
      <Navbar isAdminLoggedIn={isAdminLoggedIn} handleAdminLogout={handleAdminLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        {!isAdminLoggedIn && <Route path="/register" element={<Register />} />}
        {!isAdminLoggedIn && <Route path="/login" element={<Login />} />}
        {!isAdminLoggedIn && <Route path="/appointment" element={<Appointment />} />}
        {!isAdminLoggedIn && <Route path="/myappointment" element={<MyAppointments />} />}
        <Route
          path="/admin-login"
          element={<AdminLoginRegister onLoginSuccess={handleAdminLogin} />}
        />
        <Route path='/appointments' element={<AppointmentsBook />} />
       
      </Routes>
    </Router>
  );
};

export default App;
