const Attendance = require('../models/AttendanceModel');
const Employee = require('../models/EmployeeModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// @desc    Get all attendance records
// @route   GET /api/v1/attendance
// @access  Private
exports.getAttendanceRecords = asyncHandler(async (req, res, next) => {
  const attendanceRecords = await Attendance.find().populate('employee', 'name email');
  
  res.status(200).json({
    success: true,
    count: attendanceRecords.length,
    data: attendanceRecords
  });
});


// @desc    update single attendance status
// @route   put /api/v1/attendance/:id
// @access  Private
exports.updateAttendanceRecord = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    
    if (!status || !['Present', 'Absent'].includes(status)) {
        return next(new ErrorResponse('Invalid status. Must be Present or Absent.', 400));
    }
    
    const attendanceRecord = await Attendance.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    );
    
    if (!attendanceRecord) {
        return next(new ErrorResponse(`Attendance record not found with id ${req.params.id}`, 404));
    }
    
    res.status(200).json({
        success: true,
        data: attendanceRecord
    });
    }
);