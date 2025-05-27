const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half Day', 'On Leave'],
    default: 'Present'
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  notes: {
    type: String
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

// Prevent duplicate attendance for same employee on same date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// Populate employee details when querying attendance
attendanceSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'employee',
    select: 'name email position'
  });
  next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;