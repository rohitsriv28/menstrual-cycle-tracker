const express = require("express");
const router = express.Router();
const {
  shareCycleData,
  getSharedData,
  getSharedDataByToken,
  updateSharedData,
  revokePartnerAccess,
  getMySharedPartners,
} = require("../controllers/partnerController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/share", authMiddleware, shareCycleData);
router.get("/mypartner", authMiddleware, getMySharedPartners);
router.get("/data", authMiddleware, getSharedData);
router.get("/data/:token", getSharedDataByToken);
router.put("/update/:id", authMiddleware, updateSharedData);
router.delete("/revoke/:id", authMiddleware, revokePartnerAccess);

module.exports = router;
