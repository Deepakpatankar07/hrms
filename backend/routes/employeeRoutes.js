const express = require('express');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  uploadPhoto
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const advancedResults = require('../middleware/advancedResults');
const Employee = require('../models/EmployeeModel');

const router = express.Router();

router
  .route('/')
  .get(
    protect,
    authorize('hr', 'admin'),
    advancedResults(Employee),
    getEmployees
  )
  .post(protect, authorize('admin'), createEmployee);

router
  .route('/:id')
  .get(protect, authorize('hr', 'admin'), getEmployee)
  .put(protect, authorize('hr', 'admin'), updateEmployee)
  .delete(protect, authorize('admin'), deleteEmployee);

router
  .route('/:id/photo')
  .put(protect, authorize('hr', 'admin'), upload, uploadPhoto);

module.exports = router;