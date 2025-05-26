import express from "express";
import authMiddleware from "../middleware/auth.js";
import Attendance from "../models/attendanceModel.js";
import Employee from "../models/employeeModel.js";

const router = express.Router();

// Record attendance for an employee (protected route)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const attendance = new Attendance({ employeeId, date, status });
    await attendance.save();

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get attendance records with filters and search (protected route)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { date, search } = req.query;
    let query = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const attendanceRecords = await Attendance.find(query).populate(
      "employeeId"
    );

    // Filter by employee name if search query exists
    let filteredRecords = attendanceRecords;
    if (search) {
      filteredRecords = attendanceRecords.filter((record) =>
        record.employeeId.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json(filteredRecords);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
