const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
      enum: ["exercise", "sexual activity", "self-pleasuring"],
    },
    duration: {
      type: Number,
      required: function () {
        return this.type === "exercise";
      },
    },
    protectionUsed: {
      type: Boolean,
      required: function () {
        return this.type === "sexual activity";
      },
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
