const express = require("express");
const {
  getReportSummary,
  getActivityReport,
  getSymptomReport,
  getPeriodReport,
  getHealthMetricsReport,
} = require("../controllers/reportController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", authenticate, getReportSummary);
router.get("/activity", authenticate, getActivityReport);
router.get("/symptoms", authenticate, getSymptomReport);
router.get("/periods", authenticate, getPeriodReport);
router.get("/health-metrics", authenticate, getHealthMetricsReport);

module.exports = router;
