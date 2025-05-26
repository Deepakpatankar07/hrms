import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Leave from '../models/leaveModel.js';
import Attendance from '../models/attendanceModel.js';

const router = express.Router();

// Create a new leave request (protected route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { employeeId, startDate, endDate, reason, document } = req.body;

    if (!employeeId || !startDate || !endDate || !reason || !document) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if employee was present on the start date
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startDate);
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'present',
    });

    if (!attendance) {
      return res.status(400).json({ error: 'Employee must be present to apply for leave' });
    }

    const leave = new Leave({
      employeeId,
      startDate,
      endDate,
      reason,
      document,
    });
    await leave.save();

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leave requests with filters and search (protected route)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, date, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.startDate = { $lte: endOfDay };
      query.endDate = { $gte: startOfDay };
    }

    const leaves = await Leave.find(query).populate('employeeId');

    // Filter by employee name if search query exists
    let filteredLeaves = leaves;
    if (search) {
      filteredLeaves = leaves.filter(leave =>
        leave.employeeId.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json(filteredLeaves);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update leave status (protected route)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    leave.status = status;
    await leave.save();

    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;