import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Appointment.css";

const Appointment = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    notes: "",
  });
  const [bookingSuccess, setBookingSuccess] = useState(false); // State for success message

  // Load available slots (mocked or from API)
  useEffect(() => {
    const fetchSlots = async () => {
      const mockSlots = ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"];
      setSlots(mockSlots);
    };
    fetchSlots();

    // Check if the appointment was booked successfully after reload
    const previousBookingSuccess = localStorage.getItem("bookingSuccess");
    if (previousBookingSuccess) {
      setBookingSuccess(true); // Set success to true if found in localStorage
    }
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/appointment", {
        token,
        doctor: formData.doctor,
        date: formData.date,
        time: selectedSlot,
        notes: formData.notes,
      });
      setBookingSuccess(true); // Set success state to true
      localStorage.setItem("bookingSuccess", "true"); // Store success flag in localStorage
      setFormData({ doctor: "", date: "", notes: "" }); // Reset form
      setSelectedSlot(""); // Reset slot selection
      alert(response.data.message);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Appointment booking failed");
    }
  };

  // const handleReset = () => {
  //   // Reset booking success and remove success flag from localStorage
  //   setBookingSuccess(false);
  //   localStorage.removeItem("bookingSuccess");
  // };

  if (bookingSuccess) {
    return (
      <div className="appointment-container">
        <div className="success-message">
          Appointment booked successfully!
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-container">
      <h2>Book an Appointment</h2>
      <form className="appointment-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="doctor">Doctor:</label>
        <input
          type="text"
          id="doctor"
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
          placeholder="Enter doctor's name"
          required
        />

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any notes for the doctor"
        ></textarea>

        <label htmlFor="slot">Select a Slot:</label>
        <select
          id="slot"
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          required
        >
          <option value="">--Select a slot--</option>
          {slots.map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleBooking}>
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default Appointment;
