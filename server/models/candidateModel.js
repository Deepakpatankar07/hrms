import mongoose from 'mongoose'

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  resume: {
    type: String, // Store file path or URL (e.g., Cloudinary URL)
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'selected', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Candidate = mongoose.model('Candidate', candidateSchema);
export default Candidate;