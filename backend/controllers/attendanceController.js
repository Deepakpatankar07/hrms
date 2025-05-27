const Attendance = require('../models/AttendanceModel');
const Employee = require('../models/EmployeeModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all attendance records
// @route   GET /api/v1/attendance
// @route   GET /api/v1/employees/:employeeId/attendance
// @access  Private
exports.getAttendanceRecords = asyncHandler(async (req, res, next) => {
  if (req.params.employeeId) {
    const attendance = await Attendance.find({ employee: req.params.employeeId });

    return res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single attendance record
// @route   GET /api/v1/attendance/:id
// @access  Private
exports.getAttendanceRecord = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(
      new ErrorResponse(`Attendance record not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: attendance
  });
});

// @desc    Create attendance record
// @route   POST /api/v1/attendance
// @access  Private
exports.createAttendanceRecord = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check if employee exists and is active
  const employee = await Employee.findById(req.body.employee);
  if (!employee || employee.status !== 'Active') {
    return next(
      new ErrorResponse(
        `Employee not found or not active with id of ${req.body.employee}`,
        404
      )
    );
  }

  const attendance = await Attendance.create(req.body);

  res.status(201).json({
    success: true,
    data: attendance
  });
});

// @desc    Update attendance record
// @route   PUT /api/v1/attendance/:id
// @access  Private
exports.updateAttendanceRecord = asyncHandler(async (req, res, next) => {
  let attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(
      new ErrorResponse(`Attendance record not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is HR or admin
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this attendance record`,
        401
      )
    );
  }

  attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: attendance
  });
});

// @desc    Delete attendance record
// @route   DELETE /api/v1/attendance/:id
// @access  Private/Admin
exports.deleteAttendanceRecord = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(
      new ErrorResponse(`Attendance record not found with id of ${req.params.id}`, 404)
    );
  }

  await attendance.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Check in employee
// @route   POST /api/v1/attendance/checkin
// @access  Private
exports.checkIn = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if already checked in today
  const existingAttendance = await Attendance.findOne({
    employee: req.user.id,
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  });

  if (existingAttendance) {
    return next(
      new ErrorResponse(`Already checked in for today`, 400)
    );
  }

  // Create new attendance record
  const attendance = await Attendance.create({
    employee: req.user.id,
    date: Date.now(),
    status: 'Present',
    checkIn: Date.now(),
    user: req.user.id
  });

  res.status(201).json({
    success: true,
    data: attendance
  });
});

// @desc    Check out employee
// @route   PUT /api/v1/attendance/checkout
// @access  Private
exports.checkOut = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find today's attendance record
  const attendance = await Attendance.findOne({
    employee: req.user.id,
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  });

  if (!attendance) {
    return next(
      new ErrorResponse(`No check-in record found for today`, 404)
    );
  }

  if (attendance.checkOut) {
    return next(
      new ErrorResponse(`Already checked out for today`, 400)
    );
  }

  attendance.checkOut = Date.now();
  await attendance.save();

  res.status(200).json({
    success: true,
    data: attendance
  });
});