const Symptom = require("../models/Symptom");

const logSymptom = async (req, res) => {
  try {
    const { symptomType, severity, mood, notes } = req.body;
    const userId = req.user.id;

    const newSymptom = new Symptom({
      user: userId,
      symptomType,
      severity,
      mood,
      notes,
    });

    await newSymptom.save();
    res.status(201).json(newSymptom);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging symptom", error: error.message });
  }
};

const getSymptomHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const symptoms = await Symptom.find({ user: userId }).sort({ date: -1 });

    res.status(200).json({symptoms});
  } catch (error) {
    res.status(500).json({
      message: "Error fetching symptom history",
      error: error.message,
    });
  }
};

const updateSymptom = async (req, res) => {
  try {
    const { symptomType, severity, mood, notes } = req.body;
    const userId = req.user.id;

    const symptom = await Symptom.findOne({ _id: req.params.id, user: userId });
    if (!symptom) {
      return res.status(404).json({ message: "Symptom not found" });
    }

    symptom.symptomType = symptomType || symptom.symptomType;
    symptom.severity = severity || symptom.severity;
    symptom.mood = mood || symptom.mood;
    symptom.notes = notes || symptom.notes;

    await symptom.save();
    res.status(200).json({ message: "Symptom updated successfully", symptom });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating symptom", error: error.message });
  }
};

const deleteSymptom = async (req, res) => {
  try {
    const userId = req.user.id;

    const symptom = await Symptom.findOne({ _id: req.params.id, user: userId });
    if (!symptom) {
      return res.status(404).json({ message: "Symptom not found" });
    }

    await symptom.deleteOne();
    res.status(200).json({ message: "Symptom deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting symptom", error: error.message });
  }
};

const getSymptomInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const symptoms = await Symptom.find({ user: userId });

    const symptomCounts = {};
    symptoms.forEach((s) => {
      symptomCounts[s.symptomType] = (symptomCounts[s.symptomType] || 0) + 1;
    });

    let insights = [];
    for (let symptom in symptomCounts) {
      insights.push(`${symptom} occurred ${symptomCounts[symptom]} times.`);
    }

    res.status(200).json({ insights });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating insights", error: error.message });
  }
};

const getSymptomById = async (req, res) => {
  try {
    const userId = req.user.id;
    const symptom = await Symptom.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!symptom) {
      return res.status(404).json({ message: "Symptom not found" });
    }

    res.status(200).json(symptom);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching symptom",
      error: error.message,
    });
  }
};

module.exports = {
  logSymptom,
  getSymptomHistory,
  updateSymptom,
  deleteSymptom,
  getSymptomInsights,
  getSymptomById,
};
