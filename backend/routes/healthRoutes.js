const express = require("express");
const router = express.Router();
const {
  logHealthMetric,
  getHealthMetrics,
  updateHealthMetric,
  deleteHealthMetric,
} = require("../controllers/healthController");
const authenticate = require("../middleware/authMiddleware");

router.post("/log", authenticate, logHealthMetric);
router.get("/history", authenticate, getHealthMetrics);
router.put("/:id", authenticate, updateHealthMetric);
router.delete("/:id", authenticate, deleteHealthMetric);

module.exports = router;
