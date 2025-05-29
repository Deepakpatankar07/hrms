const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  name: {
    type: String,
    required: [true, 'Please provide candidate name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide candidate email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please provide a valid email'
    }
  },
  phone: {
    type: String,
    required: [true, 'Please provide candidate phone number'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Please provide candidate position'],
    trim: true
  },
  status: {
    type: String,
    enum: ['New', 'Selected', 'Rejected'],
    default: 'New'
  },
  experience: {
    type: Number,
    required: [true, 'Please provide candidate experience in years']
  },
  resume: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index for search
candidateSchema.index({ name: 'text', email: 'text', position: 'text' });

// Update the updatedAt field before saving
candidateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Candidate', candidateSchema);