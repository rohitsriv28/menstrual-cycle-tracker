const express = require("express");
const router = express.Router();
const {
  logSymptom,
  getSymptomHistory,
  getSymptomById,
  updateSymptom,
  deleteSymptom,
  getSymptomInsights,
} = require("../controllers/symptomController");
const authenticate = require("../middleware/authMiddleware");

router.post("/log", authenticate, logSymptom);
router.get("/insights/", authenticate, getSymptomInsights);
router.get("/history", authenticate, getSymptomHistory);
router.get("/:id", authenticate, getSymptomById);
router.put("/:id", authenticate, updateSymptom);
router.delete("/:id", authenticate, deleteSymptom);

module.exports = router;
