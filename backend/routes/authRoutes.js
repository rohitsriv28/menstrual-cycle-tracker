const express = require("express");
const {
  register,
  login,
  logout,
  getProfile,
  refreshToken,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
