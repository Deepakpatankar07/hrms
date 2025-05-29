const express = require("express");
const {
  getAttendanceRecords,
  updateAttendanceRecord,
} = require("../controllers/attendanceController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(protect, getAttendanceRecords);

router.route("/:id").put(protect, updateAttendanceRecord);

module.exports = router;
