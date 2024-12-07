const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Import Nodemailer
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;

// App initialization
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// MongoDB Schemas and Models
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false }, // New field to differentiate admin users
});

const AppointmentSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  name: String,
  doctor: String,
  doctorEmail: String, // Store doctor's email
  date: String,
  time: String,
  notes: String,
});

const User = mongoose.model('User', UserSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your email service provider
  auth: {
    user: 'gangeswaran375@gmail.com',
    pass: 'hakz iovi zzhj ezyh',
  },
});

// Helper function to send email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: EMAIL_SERVICE,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Routes

// 1. User Registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Registration failed' });
  }
});

// 2. User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// 3. Create Appointment
app.post('/appointment', async (req, res) => {
  const { token, patientName,doctor, date, time, notes } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const appointment = new Appointment({
      patientId: decoded.userId,
      name: patientName,
      doctor,
      date,
      time,
      notes,
    });
    await appointment.save();
    console.log(appointment.patientName)

    // Send email to the doctor
    sendEmail( `mahalakshmisrinamagiri02@gmail.com`,
      'New Appointment Scheduled',
      `You have a new appointment scheduled:\n\n
      Patient ID: ${decoded.userId}\n
      Patient Name: ${patientName}\n
      Doctor: ${doctor}\n
      Date: ${date}\n
      Time: ${time}\n
      Notes: ${notes}`
    );

    res.status(201).json({ message: 'Appointment booked successfully, email sent to the doctor' });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token or appointment creation failed' });
  }
});

// 4. Get Appointments for a User
app.get('/appointments', async (req, res) => {
  const { token } = req.headers;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const appointments = await Appointment.find({ patientId: decoded.userId });
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token or failed to fetch appointments' });
  }
});




// Create Doctor Schema
const DoctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String},
  isAdmin: { type: Boolean, default: true },
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

//admin registration
app.post('/admin/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = new Doctor({ name, email, password: hashedPassword });
    await doctor.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Registration failed' });
  }
});

//admin login

app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: doctor._id }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, name: doctor.name ,role: doctor.isAdmin});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

//admin get appointments

app.get('/admin/appointments', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, 'your_secret_key', async (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });

      const appointments = await Appointment.find();
      const users = await  User.find();
      res.status(200).json({ appointments, users });    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});












// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
