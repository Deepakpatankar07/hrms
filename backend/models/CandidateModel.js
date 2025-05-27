const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please provide candidate name']
  },
  email: {
    type: String,
    required: [true, 'Please provide candidate email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please provide a valid email'
    }
  },
  phone: {
    type: String,
    required: [true, 'Please provide candidate phone number']
  },
  position: {
    type: String,
    required: [true, 'Please provide candidate position']
  },
  status: {
    type: String,
    enum: ['New', 'Interviewed', 'Offered', 'Hired', 'Rejected'],
    default: 'New'
  },
  experience: {
    type: Number,
    required: [true, 'Please provide candidate experience']
  },
  resume: {
    type: String,
    required: [true, 'Please upload candidate resume']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index for search
candidateSchema.index({ name: 'text', email: 'text', position: 'text' });

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;