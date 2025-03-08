const Period = require("../models/Period");
const User = require("../models/User");

exports.logPeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date" });
    }

    const overlappingPeriod = await Period.findOne({
      user: userId,
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
    });

    if (overlappingPeriod) {
      return res
        .status(400)
        .json({ message: "This period overlaps with an existing entry." });
    }

    const period = new Period({
      user: userId,
      startDate,
      endDate,
    });

    await period.save();
    res.status(201).json({ message: "Period logged successfully", period });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCycleHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const periods = await Period.find({ user: userId }).sort({ startDate: -1 });

    res.status(200).json({ message: "Cycle history retrieved", periods });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.predictNextPeriod = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get periods sorted from newest to oldest
    const periods = await Period.find({ user: userId })
      .sort({ startDate: -1 })
      .limit(6);

    if (periods.length < 2) {
      return res
        .status(400)
        .json({ message: "Not enough data to predict cycle length" });
    }

    // Calculate average cycle length
    let totalDays = 0;
    for (let i = 0; i < periods.length - 1; i++) {
      // Calculate days between current period and next older period
      // Note the order of subtraction is important since we're working with
      // periods sorted newest to oldest
      const daysBetween =
        (new Date(periods[i].startDate) - new Date(periods[i + 1].startDate)) /
        (1000 * 60 * 60 * 24);

      totalDays += daysBetween;
    }

    const avgCycleLength = Math.round(totalDays / (periods.length - 1));
    await User.findByIdAndUpdate(userId, { cycleLength: avgCycleLength });

    // Calculate next period date by adding avgCycleLength days to the most recent period
    const lastPeriod = periods[0];
    const nextPeriodStartDate = new Date(lastPeriod.startDate);
    nextPeriodStartDate.setDate(nextPeriodStartDate.getDate() + avgCycleLength);

    res.status(200).json({
      message: "Next period prediction",
      nextPeriodStartDate,
      avgCycleLength,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getFertileWindow = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const avgCycleLength = user.cycleLength || 28;
    const ovulationDay = avgCycleLength - 14;

    const lastPeriod = await Period.findOne({ user: userId }).sort({
      startDate: -1,
    });
    if (!lastPeriod) {
      return res.status(400).json({ message: "No period data available" });
    }

    const nextPeriodStartDate = new Date(lastPeriod.startDate);
    nextPeriodStartDate.setDate(nextPeriodStartDate.getDate() + avgCycleLength);

    const ovulationDate = new Date(nextPeriodStartDate);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    res.status(200).json({
      message: "Fertile window calculated",
      fertileStart,
      fertileEnd,
      ovulationDate,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updatePeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const periodId = req.params.id;

    const period = await Period.findById(periodId);
    if (!period) {
      return res.status(404).json({ message: "Period log not found" });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date" });
    }

    if (String(period.user) !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this log" });
    }

    const overlappingPeriod = await Period.findOne({
      user: userId,
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
    });

    if (overlappingPeriod) {
      return res
        .status(400)
        .json({ message: "This period overlaps with an existing entry." });
    }

    period.startDate = startDate || period.startDate;
    period.endDate = endDate || period.endDate;

    await period.save();
    res.status(200).json({ message: "Period updated successfully", period });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deletePeriod = async (req, res) => {
  try {
    const periodId = req.params.id;

    const period = await Period.findById(periodId);
    if (!period) {
      return res.status(404).json({ message: "Period log not found" });
    }

    if (String(period.user) !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this log" });
    }

    await period.deleteOne();
    res.status(200).json({ message: "Period log deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
