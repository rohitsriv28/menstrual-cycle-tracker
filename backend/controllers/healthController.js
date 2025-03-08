const HealthMetric = require("../models/HealthMetric");

const logHealthMetric = async (req, res) => {
  try {
    const { metricType, value, notes } = req.body;
    const userId = req.user.id;

    if (!metricType || !value) {
      return res
        .status(400)
        .json({ message: "Metric type and value are required" });
    }

    const healthMetric = new HealthMetric({
      user: userId,
      metricType,
      value,
      notes,
    });

    await healthMetric.save();
    res.status(201).json(healthMetric);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging health metric", error: error.message });
  }
};

const getHealthMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const metrics = await HealthMetric.find({ user: userId }).sort({
      date: -1,
    });

    res.status(200).json({ metrics });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching health metrics", error: error.message });
  }
};

const updateHealthMetric = async (req, res) => {
  try {
    const { metricType, value, notes } = req.body;
    const userId = req.user.id;

    let metric = await HealthMetric.findById(req.params.id);
    if (!metric) {
      return res.status(404).json({ message: "Health metric not found" });
    }

    if (metric.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this metric" });
    }

    metric.metricType = metricType || metric.metricType;
    metric.value = value || metric.value;
    metric.notes = notes || metric.notes;

    await metric.save();
    res.status(200).json(metric);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating health metric", error: error.message });
  }
};

const deleteHealthMetric = async (req, res) => {
  try {
    const userId = req.user.id;

    const metric = await HealthMetric.findById(req.params.id);
    if (!metric) {
      return res.status(404).json({ message: "Health metric not found" });
    }

    if (metric.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this metric" });
    }

    await metric.deleteOne();
    res.status(200).json({ message: "Health metric deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting health metric", error: error.message });
  }
};

module.exports = {
  logHealthMetric,
  getHealthMetrics,
  updateHealthMetric,
  deleteHealthMetric,
};
