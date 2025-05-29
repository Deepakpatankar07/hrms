const multer = require('multer');
const path = require('path');


const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('resume');

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: PDF files only!');
  }
}

module.exports = upload;


















const uploadFile = async (file, uploadPath, fileNamePrefix = '') => {
  // Validate file type
  const fileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  
  if (!fileTypes.includes(file.mimetype)) {
    throw new ErrorResponse("Please upload a PDF or Word document", 400);
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new ErrorResponse(
      `File size should be less than ${maxSize / 1024 / 1024}MB`,
      400
    );
  }

  // Create custom filename
  const ext = path.extname(file.name);
  const customFileName = `${fileNamePrefix}_${Date.now()}${ext}`;

  // Upload file
  const fullPath = `${uploadPath}/${customFileName}`;
  
  return new Promise((resolve, reject) => {
    file.mv(fullPath, (err) => {
      if (err) {
        console.error(err);
        reject(new ErrorResponse("Problem with file upload", 500));
      }
      resolve({
        fileName: customFileName,
        filePath: fullPath
      });
    });
  });
};

const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  uploadFile,
  deleteFile
};