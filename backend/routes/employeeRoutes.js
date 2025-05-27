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
    advancedResults(Employee),
    getEmployees
  )
  .post(protect, createEmployee);

router
  .route('/:id')
  .get(protect, getEmployee)
  .put(protect, updateEmployee)
  .delete(protect, deleteEmployee);

router
  .route('/:id/photo')
  .put(protect, upload, uploadPhoto);

module.exports = router;