const Employee = require('../models/EmployeeModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');
const fs = require('fs');

// @desc    Get all employees
// @route   GET /api/v1/employees
// @access  Private
exports.getEmployees = asyncHandler(async (req, res, next) => {

  const employees = await Employee.find();
  

  res.status(200).json({
    success: true,
    data: employees
  });
});

// @desc    Get single employee
// @route   GET /api/v1/employees/:id
// @access  Private
exports.getEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(
      new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: employee
  });
});

// @desc    Create new employee
// @route   POST /api/v1/employees
// @access  Private/Admin
exports.createEmployee = asyncHandler(async (req, res, next) => {
   const existingEmployee = await Employee.findOne({ email: req.body.email });
  if (existingEmployee) {
    return next(new ErrorResponse('Email already exists', 400));
  }


  const employee = await Employee.create(req.body);

  res.status(201).json({
    success: true,
    data: employee
  });
});

// @desc    Update employee
// @route   PUT /api/v1/employees/:id
// @access  Private
exports.updateEmployee = asyncHandler(async (req, res, next) => {
  let employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(
      new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404)
    );
  }

  employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,

  });

  res.status(200).json({
    success: true,
    data: employee
  });
});

// @desc    Delete employee
// @route   DELETE /api/v1/employees/:id
// @access  Private/Admin
exports.deleteEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(
      new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404)
    );
  }

  // Delete photo if exists
  // if (employee.photo !== 'default.jpg') {
  //   const filePath = path.join(__dirname, `../uploads/${employee.photo}`);
  //   fs.unlink(filePath, err => {
  //     if (err) console.error(err);
  //   });
  // }

  await  Employee.findByIdAndDelete(req.params.id ,{ new: true});

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload photo for employee
// @route   PUT /api/v1/employees/:id/photo
// @access  Private
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(
      new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  // Check if file is image
  if (!req.file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (req.file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Delete old photo if exists
  if (employee.photo !== 'default.jpg') {
    const oldFilePath = path.join(__dirname, `../uploads/${employee.photo}`);
    fs.unlink(oldFilePath, err => {
      if (err) console.error(err);
    });
  }

  // Update employee with new photo
  await Employee.findByIdAndUpdate(req.params.id, { photo: req.file.filename });

  res.status(200).json({
    success: true,
    data: req.file.filename
  });
});