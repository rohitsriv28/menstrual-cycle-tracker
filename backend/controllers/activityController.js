const Activity = require("../models/Activity");

exports.logActivity = async (req, res) => {
  try {
    const { date, type, duration, details, protectionUsed } = req.body;
    const userId = req.user.id;

    let used = type === "sexual activity" && protectionUsed ? true : false;

    const activity = new Activity({
      user: userId,
      date,
      type,
      duration,
      details,
      protectionUsed: used,
    });

    await activity.save();
    res.status(201).json({ message: "Activity logged successfully", activity });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging activity", error: error.message });
  }
};

exports.getActivityHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const activities = await Activity.find({ user: userId }).sort({ date: -1 });

    res.status(200).json({ activities });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching activities", error: error.message });
  }
};

exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ activity });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching activity", error: error.message });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const { date, type, duration, details, protectionUsed } = req.body;
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (activity.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    activity.date = date || activity.date;
    activity.type = type || activity.type;
    activity.duration = duration || activity.duration;
    activity.details = details || activity.details;
    activity.protectionUsed = protectionUsed || activity.protectionUsed;

    await activity.save();
    res
      .status(200)
      .json({ message: "Activity updated successfully", activity });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating activity", error: error.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (activity.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await activity.deleteOne();
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting activity", error: error.message });
  }
};
