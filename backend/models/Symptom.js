const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    symptomType: {
      type: String,
      required: true,
      enum: [
        "cramps",
        "bloating",
        "headache",
        "fatigue",
        "nausea",
        "mood_swings",
        "other",
      ],
    },
    severity: {
      type: String,
      enum: ["mild", "moderate", "severe"],
      required: true,
    },
    mood: {
      type: String,
      enum: ["happy", "irritable", "anxious", "sad", "neutral"],
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Symptom", symptomSchema);
