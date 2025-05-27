const Leave = require('../models/LeaveModel');
const Employee = require('../models/EmployeeModel');
const Attendance = require('../models/AttendanceModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');
const fs = require('fs');

// @desc    Get all leaves
// @route   GET /api/v1/leaves
// @route   GET /api/v1/employees/:employeeId/leaves
// @access  Private
exports.getLeaves = asyncHandler(async (req, res, next) => {
  if (req.params.employeeId) {
    const leaves = await Leave.find({ employee: req.params.employeeId });

    return res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single leave
// @route   GET /api/v1/leaves/:id
// @access  Private
exports.getLeave = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    return next(
      new ErrorResponse(`Leave not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: leave
  });
});

// @desc    Create leave
// @route   POST /api/v1/leaves
// @access  Private
exports.createLeave = asyncHandler(async (req, res, next) => {
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

  // Check if employee has attendance record as present
  const attendance = await Attendance.findOne({
    employee: req.body.employee,
    status: 'Present'
  });

  if (!attendance) {
    return next(
      new ErrorResponse(
        `Employee must be present to apply for leave`,
        400
      )
    );
  }

  const leave = await Leave.create(req.body);

  res.status(201).json({
    success: true,
    data: leave
  });
});

// @desc    Update leave
// @route   PUT /api/v1/leaves/:id
// @access  Private
exports.updateLeave = asyncHandler(async (req, res, next) => {
  let leave = await Leave.findById(req.params.id);

  if (!leave) {
    return next(
      new ErrorResponse(`Leave not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is HR or admin
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this leave`,
        401
      )
    );
  }

  leave = await Leave.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: leave
  });
});

// @desc    Delete leave
// @route   DELETE /api/v1/leaves/:id
// @access  Private/Admin
exports.deleteLeave = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    return next(
      new ErrorResponse(`Leave not found with id of ${req.params.id}`, 404)
    );
  }

  // Delete documents if any
  if (leave.documents && leave.documents.length > 0) {
    leave.documents.forEach(doc => {
      const filePath = path.join(__dirname, `../uploads/${doc}`);
      fs.unlink(filePath, err => {
        if (err) console.error(err);
      });
    });
  }

  await leave.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload document for leave
// @route   PUT /api/v1/leaves/:id/documents
// @access  Private
exports.uploadDocument = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    return next(
      new ErrorResponse(`Leave not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  // Check file size
  if (req.file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a file less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Add document to leave
  leave.documents.push(req.file.filename);
  await leave.save();

  res.status(200).json({
    success: true,
    data: req.file.filename
  });
});

// @desc    Download leave document
// @route   GET /api/v1/leaves/:id/documents/:docId
// @access  Private
exports.downloadDocument = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id);

  if (!leave || !leave.documents || leave.documents.length === 0) {
    return next(
      new ErrorResponse(`Document not found for leave ${req.params.id}`, 404)
    );
  }

  const document = leave.documents.find(doc => doc === req.params.docId);

  if (!document) {
    return next(
      new ErrorResponse(`Document not found with id of ${req.params.docId}`, 404)
    );
  }

  const filePath = path.join(__dirname, `../uploads/${document}`);

  res.download(filePath);
});

// @desc    Get approved leaves for calendar
// @route   GET /api/v1/leaves/calendar
// @access  Private
exports.getCalendarLeaves = asyncHandler(async (req, res, next) => {
  const leaves = await Leave.find({ status: 'Approved' }).select(
    'startDate endDate employee'
  ).populate({
    path: 'employee',
    select: 'name'
  });

  res.status(200).json({
    success: true,
    data: leaves
  });
});