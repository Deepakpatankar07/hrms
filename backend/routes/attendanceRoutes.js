const express = require('express');
const {
  getAttendanceRecords,
  getAttendanceRecord,
  createAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  checkIn,
  checkOut
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Attendance = require('../models/AttendanceModel');

const router = express.Router();

router
  .route('/')
  .get(
    protect,
    authorize('hr', 'admin'),
    advancedResults(Attendance, 'employee'),
    getAttendanceRecords
  )
  .post(protect, createAttendanceRecord);

router
  .route('/:id')
  .get(protect, getAttendanceRecord)
  .put(protect, authorize('hr', 'admin'), updateAttendanceRecord)
  .delete(protect, authorize('admin'), deleteAttendanceRecord);

router
  .route('/checkin')
  .post(protect, checkIn);

router
  .route('/checkout')
  .put(protect, checkOut);

module.exports = router;