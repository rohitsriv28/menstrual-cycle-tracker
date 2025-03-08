const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: (date) => date <= new Date(),
      message: "Start date cannot be in the future",
    },
  },
  endDate: {
    type: Date,
    required: true,
    validate: [
      {
        validator: function (date) {
          return date > this.startDate;
        },
        message: "End date must be after start date",
      },
      {
        validator: (date) => date <= new Date(),
        message: "End date cannot be in the future",
      },
    ],
  },
  cycleLength: Number,
  notes: String,
});

periodSchema.pre("save", function (next) {
  const diffTime = Math.abs(this.endDate - this.startDate);
  this.cycleLength = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  next();
});

module.exports = mongoose.model("Period", periodSchema);
