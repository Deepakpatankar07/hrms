const { check, validationResult } = require('express-validator');

// Common validation rules
exports.validate = (method) => {
  switch (method) {
    case 'createCandidate': {
      return [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('position', 'Position is required').not().isEmpty(),
        check('experience', 'Experience is required').isNumeric(),
        check('resume', 'Resume is required').not().isEmpty()
      ];
    }
    case 'createEmployee': {
      return [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('position', 'Position is required').not().isEmpty(),
        check('department', 'Department is required').not().isEmpty(),
        check('experience', 'Experience is required').isNumeric(),
        check('salary', 'Salary is required').isNumeric()
      ];
    }
    case 'createAttendance': {
      return [
        check('employee', 'Employee ID is required').not().isEmpty(),
        check('status', 'Status is required').not().isEmpty()
      ];
    }
    case 'createLeave': {
      return [
        check('employee', 'Employee ID is required').not().isEmpty(),
        check('startDate', 'Start date is required').not().isEmpty(),
        check('endDate', 'End date is required').not().isEmpty(),
        check('reason', 'Reason is required').not().isEmpty(),
        check('type', 'Type is required').not().isEmpty()
      ];
    }
  }
};

// Middleware to check validation results
exports.validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};