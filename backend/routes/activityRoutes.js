const express = require("express");
const router = express.Router();
const {
  logActivity,
  getActivityHistory,
  updateActivity,
  deleteActivity,
} = require("../controllers/activityController");
const authenticate = require("../middleware/authMiddleware");

router.post("/log", authenticate, logActivity);
router.get("/history", authenticate, getActivityHistory);
router.patch("/:id", authenticate, updateActivity);
router.delete("/:id", authenticate, deleteActivity);

module.exports = router;
