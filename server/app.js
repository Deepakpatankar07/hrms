const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const errorHandler = require('./utils/errorHandler');

// Route files

const candidateRoutes = require('./routes/candidateRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Body parser
app.use(express.json({ limit: '10kb' }));


// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true 
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
// app.use(limiter);
const fileupload = require('express-fileupload');


// File uploading
app.use(fileupload());

// Make sure this comes before your routes
app.use(express.static('public')); 


// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/candidates', candidateRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/leaves', leaveRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;