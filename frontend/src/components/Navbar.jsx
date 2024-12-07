import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const checkLoginState = () => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('name');
    const storedUserRole = localStorage.getItem('role'); // Assuming 'role' stores admin status

    setLoggedIn(!!token);
    setIsAdmin(storedUserRole === 'true'); // Check if the user is an admin
    setUserName(storedUserName || '');
  };

  useEffect(() => {
    checkLoginState();

    const handleStorageChange = () => {
      checkLoginState();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('storage')); // Notify navbar of changes
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Appointment System</h1>
        <div className="navbar-toggle" onClick={toggleMenu}>
          ☰
        </div>
      </div>
      <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
        {!loggedIn ? (
          <>
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/register" onClick={toggleMenu}>Register</Link></li>
            <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
            <li><Link to='/admin-login' onClick={toggleMenu}>Admin</Link></li>
          </>
        ) : isAdmin ? (
          // If the user is an admin, show the appointments page link
          <>
            <li><Link to="/appointments" onClick={toggleMenu}>Appointments</Link></li>
            <li><span className="navbar-user">Hello, Admin {userName}!</span></li>
            <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          // If the user is not an admin, show regular links
          <>
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><span className="navbar-user">Hello, {userName}!</span></li>
            <li><Link to="/myappointment" onClick={toggleMenu}>My Appointments</Link></li>
            <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
