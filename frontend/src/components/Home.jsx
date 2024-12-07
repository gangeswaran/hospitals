import React from "react";
import "../styles/Home.css";
import hospitalImage from "../../src/home.jpg";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to HealthCare Hub</h1>
          <p>Providing top-notch healthcare solutions for patients and providers alike.</p>
          <button className="cta-button"><Link to='/appointment'>Book an Appointment</Link></button>
        </div>
        <div className="hero-image">
          <img src={hospitalImage} alt="Hospital" width={800} />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Our Hospital?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="feature-icon fas fa-stethoscope"></i>
            <h3>Comprehensive Care</h3>
            <p>From primary care to specialized treatments, we ensure the best for our patients.</p>
          </div>
          <div className="feature-card">
            <i className="feature-icon fas fa-user-md"></i>
            <h3>Expert Doctors</h3>
            <p>Our team of highly qualified professionals is dedicated to your well-being.</p>
          </div>
          <div className="feature-card">
            <i className="feature-icon fas fa-heartbeat"></i>
            <h3>Advanced Facilities</h3>
            <p>State-of-the-art technology and modern infrastructure for superior healthcare.</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <h2>Need Immediate Assistance?</h2>
        <p>Contact us for emergency care or to book an appointment.</p>
        <button className="cta-button cta-secondary">Contact Us</button>
      </section>
    </div>
  );
};

export default Home;
