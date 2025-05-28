const Candidate = require("../models/CandidateModel");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const path = require("path");
const fs = require("fs");
const Employee = require("../models/EmployeeModel");
const Attendence = require("../models/AttendanceModel");

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
  // First ensure you have the file upload middleware configured
  if (!req.files || !req.files.resume) {
    return next(new ErrorResponse("Please upload a resume file", 400));
  }

  const file = req.files.resume;

  // Validate file type
  const fileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!fileTypes.includes(file.mimetype)) {
    return next(new ErrorResponse("Please upload a PDF or Word document", 400));
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return next(
      new ErrorResponse(
        `File size should be less than ${maxSize / 1024 / 1024}MB`,
        400
      )
    );
  }

  // Create custom filename
  const ext = path.extname(file.name);
  file.name = `resume_${req.body.name.replace(
    /\s+/g,
    "_"
  )}_${Date.now()}${ext}`;

  // Upload file
  file.mv(
    `${process.env.FILE_UPLOAD_PATH || "./public/uploads"}/${file.name}`,
    async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse("Problem with file upload", 500));
      }

      try {
        const candidateData = {
          ...req.body,
          resume: file.name,
          user: req.user.id, // Add the user who created the candidate
        };

        const candidate = await Candidate.create(candidateData);

        res.status(201).json({
          success: true,
          data: candidate,
        });
      } catch (err) {
        // Clean up the uploaded file if creation fails
        fs.unlink(
          `${process.env.FILE_UPLOAD_PATH || "./public/uploads"}/${file.name}`,
          () => {}
        );
        return next(new ErrorResponse(err.message, 400));
      }
    }
  );
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

  // Make sure user is HR or admin
  if (req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this candidate`,
        401
      )
    );
  }

  // Delete resume file
  const filePath = path.join(__dirname, `../uploads/${candidate.resume}`);
  fs.unlink(filePath, (err) => {
    if (err) console.error(err);
  });

  await candidate.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Upload resume for candidate
// @route   PUT /api/v1/candidates/:id/resume
// @access  Private
// exports.uploadResume = asyncHandler(async (req, res, next) => {
//   const candidate = await Candidate.findById(req.params.id);

//   if (!candidate) {
//     return next(
//       new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
//     );
//   }

//   if (!req.file) {
//     return next(new ErrorResponse(`Please upload a file`, 400));
//   }

//   // Check if file is PDF
//   if (!req.file.mimetype.startsWith('application/pdf')) {
//     return next(new ErrorResponse(`Please upload a PDF file`, 400));
//   }

//   // Check file size
//   if (req.file.size > process.env.MAX_FILE_UPLOAD) {
//     return next(
//       new ErrorResponse(
//         `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
//         400
//       )
//     );
//   }

//   // Delete old resume if exists
//   if (candidate.resume) {
//     const oldFilePath = path.join(__dirname, `../uploads/${candidate.resume}`);
//     fs.unlink(oldFilePath, err => {
//       if (err) console.error(err);
//     });
//   }

//   // Update candidate with new resume
//   await Candidate.findByIdAndUpdate(req.params.id, { resume: req.file.filename });

//   res.status(200).json({
//     success: true,
//     data: req.file.filename
//   });
// });

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
// @access  Private/Admin
exports.moveToEmployee = asyncHandler(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    return next(
      new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if candidate is hired
  if (candidate.status !== "Selected") {
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
    status: "Active",
  };

  // In a real app, you would create an Employee here
  const employee = await Employee.create(employeeData);
  await Attendence.create({
    employee: employee._id,
  });

  // Delete candidate
  await Candidate.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: employeeData, // In real app, return the created employee
  });
});
