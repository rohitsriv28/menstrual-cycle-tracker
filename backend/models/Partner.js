const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    partnerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    accessGranted: {
      type: Boolean,
      default: false,
    },
    accessToken: {
      type: String,
      unique: true,
    },
    sharedOptions: {
      periodDates: { type: Boolean, default: false },
      symptoms: { type: Boolean, default: false },
      activities: { type: Boolean, default: false },
      healthMetrics: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", PartnerSchema);
