const mongoose = require("mongoose");

const HealthMetricSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    metricType: {
      type: String,
      enum: ["water_intake", "sleep_hours", "weight", "blood_pressure"],
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

HealthMetricSchema.pre("save", function (next) {
  const metric = this;

  switch (metric.metricType) {
    case "water_intake":
      if (typeof metric.value !== "number" || metric.value < 0) {
        return next(new Error("Water intake must be a positive number (ml)."));
      }
      break;

    case "sleep_hours":
      if (
        typeof metric.value !== "number" ||
        metric.value < 0 ||
        metric.value > 24
      ) {
        return next(new Error("Sleep hours must be between 0 and 24."));
      }
      break;

    case "weight":
      if (typeof metric.value !== "number" || metric.value <= 0) {
        return next(new Error("Weight must be a positive number."));
      }
      break;

    case "blood_pressure":
      if (
        typeof metric.value !== "object" ||
        !metric.value.systolic ||
        !metric.value.diastolic ||
        metric.value.systolic <= metric.value.diastolic
      ) {
        return next(
          new Error(
            "Blood pressure must have valid systolic and diastolic values."
          )
        );
      }
      break;

    default:
      return next(new Error("Invalid metric type."));
  }

  next();
});

module.exports = mongoose.model("HealthMetric", HealthMetricSchema);
