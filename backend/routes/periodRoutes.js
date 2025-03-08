const express = require("express");
const router = express.Router();
const {
  logPeriod,
  getCycleHistory,
  predictNextPeriod,
  getFertileWindow,
  updatePeriod,
  deletePeriod,
} = require("../controllers/periodController");
const authenticate = require("../middleware/authMiddleware");

router.post("/log", authenticate, logPeriod);
router.get("/history", authenticate, getCycleHistory);
router.get("/predict", authenticate, predictNextPeriod);
router.get("/fertile-window", authenticate, getFertileWindow);
router.put("/:id", authenticate, updatePeriod);
router.delete("/:id", authenticate, deletePeriod);

module.exports = router;
