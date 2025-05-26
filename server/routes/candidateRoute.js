import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Candidate from '../models/candidateModel.js';
import Employee from '../models/employeeModel.js';

const router = express.Router();

// Create a new candidate (protected route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, resume } = req.body;

    // Basic validation (you can extend with Zod if needed)
    if (!name || !email || !resume) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const candidate = new Candidate({ name, email, resume });
    await candidate.save();

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all candidates with filters and search (protected route)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }
    if (status) {
      query.status = status;
    }

    const candidates = await Candidate.find(query);
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Convert candidate to employee (protected route)
router.post('/:id/convert', authMiddleware, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Create new employee from candidate details
    const employee = new Employee({
      name: candidate.name,
      email: candidate.email,
      role: req.body.role || 'Employee', // Default role if not provided
    });
    await employee.save();

    // Update candidate status
    candidate.status = 'selected';
    await candidate.save();

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router