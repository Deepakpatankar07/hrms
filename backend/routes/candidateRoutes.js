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
const { protect } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const Candidate = require("../models/CandidateModel");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(Candidate), getCandidates)
  .post(protect,  createCandidate);

router
  .route("/:id")
  .get(protect, getCandidate)
  .put(protect, updateCandidate)
  .delete(protect, deleteCandidate);

router
  .route("/:id/resume")
  // .put(protect, upload, uploadResume)
  .get(protect, downloadResume);

router.route("/move-to-employee/:id").post(moveToEmployee);

module.exports = router;
