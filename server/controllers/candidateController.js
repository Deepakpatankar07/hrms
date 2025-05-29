const Candidate = require("../models/CandidateModel");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const path = require("path");
const Employee = require("../models/EmployeeModel");
const Attendence = require("../models/AttendanceModel");
const { uploadFile, deleteFile } = require('../middleware/upload');

// @desc    Get all candidates
// @route   GET /api/v1/candidates
// @access  Private
exports.getCandidates = asyncHandler(async (req, res, next) => {
  const candidates = await Candidate.find();
  if (!candidates || candidates.length === 0) {
    return next(new ErrorResponse("No candidates found", 404));
  }
  console.log(candidates);
  res.status(200).json({
    candidates,
  });
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
    data: candidate,
  });
});

// @desc    Create new candidate
// @route   POST /api/v1/candidates
// @access  Private
exports.createCandidate = asyncHandler(async (req, res, next) => {
  let candidate = await Candidate.findOne({ email: req.body.email });
  if (candidate) {
    return next(new ErrorResponse('Candidate with this email already exists', 400));
  }
  const existingEmployee = await Employee.findOne({ email: req.body.email });
  if (existingEmployee) {
    return next(new ErrorResponse('Employee with this email already exists', 400));
  }

  if (!req.files || !req.files.resume) {
    return next(new ErrorResponse("Please upload a resume file", 400));
  }

  const file = req.files.resume;
  const uploadPath = process.env.FILE_UPLOAD_PATH || './public/uploads';
  const fileNamePrefix = `resume_${req.body.name.replace(/\s+/g, '_')}`;

  try {
    const { fileName } = await uploadFile(file, uploadPath, fileNamePrefix);

    console.log('File uploaded successfully:', fileName);
    const candidateData = {
      ...req.body,
      resume: fileName,
    };

    const candidate = await Candidate.create(candidateData);

    res.status(201).json({
      success: true,
      data: candidate,
    });
  } catch (err) {
    if (fileName) {
      try {
        await deleteFile(`${uploadPath}/${fileName}`);
      } catch (deleteErr) {
        console.error('Error cleaning up file after failed creation:', deleteErr);
      }
    }
    return next(err);
  }
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

  candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: candidate,
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



   await deleteFile(`./public/uploads/${candidate.resume}`)

 const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: deletedCandidate,
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
// @route   POST /api/v1/candidates/move-to-employee/:id
// @access  Private
exports.moveToEmployee = asyncHandler(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    return next(
      new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
    );
  }

  if (candidate.status !== "Selected") {
    return next(
      new ErrorResponse(
        `Candidate must be in Hired status to be moved to employees`,
        400
      )
    );
  }

  const employeeData = {
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    position: candidate.position,
    experience: candidate.experience,
    joinedAt: Date.now(),
    status: "Active",
  };

  const employee = await Employee.create(employeeData);
  await Attendence.create({
    employee: employee._id,
  });

  // Delete candidate
  await Candidate.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: employeeData,
  });
});
