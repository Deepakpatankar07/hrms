const Candidate = require('../models/CandidateModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');
const fs = require('fs');

// @desc    Get all candidates
// @route   GET /api/v1/candidates
// @access  Private
exports.getCandidates = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single candidate
// @route   GET /api/v1/candidates/:id
// @access  Private
exports.getCandidate = asyncHandler(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    return next(
      new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: candidate
  });
});

// @desc    Create new candidate
// @route   POST /api/v1/candidates
// @access  Private
exports.createCandidate = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const candidate = await Candidate.create(req.body);

  res.status(201).json({
    success: true,
    data: candidate
  });
});

// @desc    Update candidate
// @route   PUT /api/v1/candidates/:id
// @access  Private
exports.updateCandidate = asyncHandler(async (req, res, next) => {
  let candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    return next(
      new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is HR or admin
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this candidate`,
        401
      )
    );
  }

  candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: candidate
  });
});

// @desc    Delete candidate
// @route   DELETE /api/v1/candidates/:id
// @access  Private
exports.deleteCandidate = asyncHandler(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    return next(
      new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is HR or admin
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this candidate`,
        401
      )
    );
  }

  // Delete resume file
  const filePath = path.join(__dirname, `../uploads/${candidate.resume}`);
  fs.unlink(filePath, err => {
    if (err) console.error(err);
  });

  await candidate.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload resume for candidate
// @route   PUT /api/v1/candidates/:id/resume
// @access  Private
exports.uploadResume = asyncHandler(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    return next(
      new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  // Check if file is PDF
  if (!req.file.mimetype.startsWith('application/pdf')) {
    return next(new ErrorResponse(`Please upload a PDF file`, 400));
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

  // Delete old resume if exists
  if (candidate.resume) {
    const oldFilePath = path.join(__dirname, `../uploads/${candidate.resume}`);
    fs.unlink(oldFilePath, err => {
      if (err) console.error(err);
    });
  }

  // Update candidate with new resume
  await Candidate.findByIdAndUpdate(req.params.id, { resume: req.file.filename });

  res.status(200).json({
    success: true,
    data: req.file.filename
  });
});

// @desc    Download candidate resume
// @route   GET /api/v1/candidates/:id/resume
// @access  Private
exports.downloadResume = asyncHandler(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate || !candidate.resume) {
    return next(
      new ErrorResponse(`Resume not found for candidate ${req.params.id}`, 404)
    );
  }

  const filePath = path.join(__dirname, `../uploads/${candidate.resume}`);

  res.download(filePath);
});

// @desc    Move candidate to employee
// @route   POST /api/v1/candidates/:id/move-to-employee
// @access  Private/Admin
exports.moveToEmployee = asyncHandler(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    return next(
      new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if candidate is hired
  if (candidate.status !== 'Hired') {
    return next(
      new ErrorResponse(
        `Candidate must be in Hired status to be moved to employees`,
        400
      )
    );
  }

  // Create employee from candidate data
  const employeeData = {
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    position: candidate.position,
    experience: candidate.experience,
    joinedAt: Date.now(),
    status: 'Active'
  };

  // In a real app, you would create an Employee here
  // const employee = await Employee.create(employeeData);

  // Delete candidate
  await candidate.remove();

  res.status(200).json({
    success: true,
    data: employeeData // In real app, return the created employee
  });
});