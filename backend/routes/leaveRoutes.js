const express = require('express');
const {
  getLeaves,
  getLeave,
  createLeave,
  updateLeave,
  deleteLeave,
  uploadDocument,
  downloadDocument,
  getCalendarLeaves
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const advancedResults = require('../middleware/advancedResults');
const Leave = require('../models/LeaveModel');

const router = express.Router();

router
  .route('/')
  .get(
    protect,
    advancedResults(Leave, 'employee'),
    getLeaves
  )
  .post(protect, createLeave);

router
  .route('/calendar')
  .get(protect, getCalendarLeaves);

router
  .route('/:id')
  .get(protect, getLeave)
  .put(protect, updateLeave)
  .delete(protect, deleteLeave);

router
  .route('/:id/documents')
  .put(protect, upload, uploadDocument);

router
  .route('/:id/documents/:docId')
  .get(protect, downloadDocument);

module.exports = router;