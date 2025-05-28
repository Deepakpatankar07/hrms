const express = require("express");
const {
  getAttendanceRecords,
  getAttendanceRecord,
  createAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  checkIn,
  checkOut,
} = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const Attendance = require("../models/AttendanceModel");

const router = express.Router();

router
  .route("/")
  .get(
    protect,
    getAttendanceRecords
  )

router.route("/:id").put(protect, updateAttendanceRecord)

module.exports = router;
