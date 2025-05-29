const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date']
  },
  reason: {
    type: String,
    required: [true, 'Please provide reason for leave']
  },
  type: {
    type: String,
    enum: ['Sick', 'Vacation', 'Personal', 'Maternity', 'Paternity', 'Other'],
    required: [true, 'Please provide leave type']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  notes: {
    type: String
  },
  documents: [String],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Populate employee details when querying leaves
leaveSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'employee',
    select: 'name email position'
  });
  next();
});

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;