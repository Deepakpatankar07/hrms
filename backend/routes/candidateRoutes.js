const express = require("express");
const {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  uploadResume,
  downloadResume,
  moveToEmployee,
} = require("../controllers/candidateController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
const advancedResults = require("../middleware/advancedResults");
const Candidate = require("../models/CandidateModel");

const router = express.Router();

router
  .route("/")
  .get(
    // protect,
    // authorize('hr', 'admin'),
    advancedResults(Candidate),
    getCandidates
  )
  .post(protect, 
    // authorize("hr", "admin"), 
    createCandidate);

router
  .route("/:id")
  .get(protect, getCandidate)
  .put(protect, updateCandidate)
  .delete(protect, deleteCandidate);

router
  .route("/:id/resume")
  // .put(protect, authorize("hr", "admin"), upload, uploadResume)
  .get(protect, downloadResume);

router
  .route("/move-to-employee/:id")
  .post(moveToEmployee);

module.exports = router;
