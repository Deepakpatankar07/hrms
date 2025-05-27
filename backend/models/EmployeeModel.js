const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide employee name']
  },
  email: {
    type: String,
    required: [true, 'Please provide employee email'],
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
    required: [true, 'Please provide employee phone number']
  },
  position: {
    type: String,
    required: [true, 'Please provide employee position']
  },
  department: {
    type: String,
    required: [true, 'Please provide employee department']
  },
  experience: {
    type: Number,
    required: [true, 'Please provide employee experience']
  },
  salary: {
    type: Number,
    required: [true, 'Please provide employee salary']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended', 'Terminated'],
    default: 'Active'
  },
  role: {
    type: String,
    enum: ['employee', 'manager', 'admin'],
    default: 'employee'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

// Create text index for search
employeeSchema.index({ name: 'text', email: 'text', position: 'text' });

// Cascade delete attendance when an employee is deleted
employeeSchema.pre('remove', async function(next) {
  await this.model('Attendance').deleteMany({ employee: this._id });
  await this.model('Leave').deleteMany({ employee: this._id });
  next();
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;