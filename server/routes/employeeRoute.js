import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Employee from '../models/employeeModel.js';

const router = express.Router();

// Get all employees with filters and search (protected route)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, role } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (role) {
      query.role = role;
    }

    const employees = await Employee.find(query);
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update an employee (protected route)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.role = role || employee.role;
    await employee.save();

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an employee (protected route)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;