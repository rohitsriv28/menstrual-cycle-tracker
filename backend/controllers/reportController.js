const Period = require("../models/Period");
const Symptom = require("../models/Symptom");
const Activity = require("../models/Activity");
const HealthMetric = require("../models/HealthMetric");

exports.getReportSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const periods = await Period.find({ user: userId }).sort({ startDate: -1 });

    const symptoms = await Symptom.find({ user: userId }).sort({ date: -1 });

    if (periods.length === 0) {
      return res
        .status(400)
        .json({ message: "No period data available for report." });
    }

    let totalDays = 0;
    for (let i = 0; i < periods.length - 1; i++) {
      totalDays +=
        (new Date(periods[i].startDate) - new Date(periods[i + 1].startDate)) /
        (1000 * 60 * 60 * 24);
    }
    const avgCycleLength =
      periods.length > 1
        ? Math.round(totalDays / (periods.length - 1))
        : "Not enough data";

    const lastPeriod = periods[0];
    const nextPeriodStartDate = new Date(lastPeriod.startDate);
    nextPeriodStartDate.setDate(
      nextPeriodStartDate.getDate() +
        (avgCycleLength !== "Not enough data" ? avgCycleLength : 28)
    );

    const symptomCounts = {};
    symptoms.forEach((s) => {
      symptomCounts[s.symptomType] = (symptomCounts[s.symptomType] || 0) + 1;
    });
    const commonSymptoms = Object.entries(symptomCounts).sort(
      (a, b) => b[1] - a[1]
    );

    const report = {
      message: "User Health Report",
      cycleSummary: {
        lastPeriodStart: lastPeriod.startDate,
        avgCycleLength,
        nextPredictedPeriod: nextPeriodStartDate,
      },
      symptomTrends: commonSymptoms.map(
        ([symptom, count]) => `${symptom}: ${count} times`
      ),
      healthInsights:
        avgCycleLength < 21 || avgCycleLength > 35
          ? "Possible irregular cycles detected."
          : "Cycle length is normal.",
    };

    res.status(200).json(report);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating report", error: error.message });
  }
};

exports.getActivityReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year, type } = req.query;

    let filter = { user: userId };

    if (year) {
      filter.date = {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lt: new Date(`${year}-12-31T23:59:59.999Z`),
      };
    }
    if (month) {
      filter.date = {
        $gte: new Date(
          `${year || new Date().getFullYear()}-${month}-01T00:00:00.000Z`
        ),
        $lt: new Date(
          `${year || new Date().getFullYear()}-${month}-31T23:59:59.999Z`
        ),
      };
    }

    if (type) {
      filter.type = type;
    }

    const activities = await Activity.find(filter).sort({ date: -1 });

    if (!activities.length) {
      return res.status(400).json({ message: "No activity data found." });
    }

    res.status(200).json({ activities });
  } catch (error) {
    res.status(500).json({
      message: "Error generating activity report",
      error: error.message,
    });
  }
};

exports.getSymptomReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year, type, mood, severity } = req.query;

    let filter = { user: userId };

    if (year) {
      filter.date = {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lt: new Date(`${year}-12-31T23:59:59.999Z`),
      };
    }
    if (month) {
      const targetYear = year || new Date().getFullYear();
      filter.date = {
        $gte: new Date(`${targetYear}-${month}-01T00:00:00.000Z`),
        $lt: new Date(`${targetYear}-${month}-31T23:59:59.999Z`),
      };
    }

    if (type) filter.symptomType = type;
    if (mood) filter.mood = mood;
    if (severity) filter.severity = severity;

    const symptoms = await Symptom.find(filter).sort({ date: -1 });

    if (!symptoms.length) {
      return res.status(400).json({ message: "No symptom data found." });
    }

    res.status(200).json({ symptoms });
  } catch (error) {
    res.status(500).json({
      message: "Error generating symptom report",
      error: error.message,
    });
  }
};

exports.getPeriodReport = async (req, res) => {
  try {
    const userId = req.user.id;

    const periods = await Period.find({ user: userId }).sort({ startDate: -1 });

    if (!periods.length) {
      return res.status(400).json({ message: "No period data found." });
    }

    res.status(200).json({ periods });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching period report",
      error: error.message,
    });
  }
};

exports.getHealthMetricsReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { metricType, month, year } = req.query;

    let query = { user: userId };

    if (metricType) query.metricType = metricType;
    if (month && year) {
      query.date = {
        $gte: new Date(`${year}-${month}-01`),
        $lt: new Date(`${year}-${parseInt(month) + 1}-01`),
      };
    } else if (year) {
      query.date = {
        $gte: new Date(`${year}-01-01`),
        $lt: new Date(`${parseInt(year) + 1}-01-01`),
      };
    }

    const healthMetrics = await HealthMetric.find(query).sort({ date: -1 });

    if (!healthMetrics.length) {
      return res.status(400).json({ message: "No health metric data found." });
    }

    res.status(200).json({ healthMetrics });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching health metrics report",
      error: error.message,
    });
  }
};
