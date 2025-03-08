const Partner = require("../models/Partner");
const User = require("../models/User");
const Period = require("../models/Period");
const Symptom = require("../models/Symptom");
const Activity = require("../models/Activity");
const HealthMetric = require("../models/HealthMetric");
const crypto = require("crypto");

const shareCycleData = async (req, res) => {
  try {
    const { partnerEmail, sharedOptions } = req.body;
    const userId = req.user.id;

    if (req.user.email === partnerEmail) {
      return res
        .status(400)
        .json({ message: "You cannot share data with yourself" });
    }

    const partner = await User.findOne({ email: partnerEmail });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const existingShare = await Partner.findOne({
      user: userId,
    });
    if (existingShare) {
      return res
        .status(400)
        .json({ message: "You have already shared data with a partner" });
    }

    const accessToken = crypto.randomBytes(32).toString("hex");

    const newShare = new Partner({
      user: userId,
      partner: partner._id,
      partnerEmail,
      sharedOptions,
      accessGranted: true,
      accessToken,
    });

    await newShare.save();
    res.status(201).json({ message: "Data shared successfully", accessToken });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sharing cycle data", error: error.message });
  }
};

const getSharedData = async (req, res) => {
  try {
    const userId = req.user.id;
    const sharedRecords = await Partner.find({
      partner: userId,
      accessGranted: true,
    }).populate("user", "email profile");

    if (!sharedRecords.length) {
      return res.status(404).json({ message: "No shared data found" });
    }

    const sharedData = sharedRecords.map(({ sharedOptions, user }) => ({
      sharedOptions,
      user,
    }));
    res.status(200).json(sharedData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching shared data", error: error.message });
  }
};

const getSharedDataByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const sharedRecord = await Partner.findOne({
      accessToken: token,
      accessGranted: true,
    }).populate("user", "email profile");

    if (!sharedRecord) {
      return res
        .status(404)
        .json({ message: "Invalid or expired access token" });
    }

    const { sharedOptions, user } = sharedRecord;
    let sharedData = {};

    if (sharedOptions.periodDates) {
      sharedData.periods = await Period.find({ user: user._id });
    }
    if (sharedOptions.symptoms) {
      sharedData.symptoms = await Symptom.find({ user: user._id });
    }
    if (sharedOptions.activities) {
      sharedData.activities = await Activity.find({ user: user._id });
    }
    if (sharedOptions.healthMetrics) {
      sharedData.healthMetrics = await HealthMetric.find({ user: user._id });
    }

    res.status(200).json({ user, sharedData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching shared data", error: error.message });
  }
};

const updateSharedData = async (req, res) => {
  try {
    const { sharedOptions } = req.body;
    const userId = req.user.id;

    const sharedRecord = await Partner.findOne({
      _id: req.params.id,
      user: userId,
    });
    if (!sharedRecord) {
      return res.status(404).json({ message: "Shared data not found" });
    }

    sharedRecord.sharedOptions = sharedOptions;
    await sharedRecord.save();

    res
      .status(200)
      .json({ message: "Shared data updated successfully", sharedRecord });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating shared data", error: error.message });
  }
};

const revokePartnerAccess = async (req, res) => {
  try {
    const userId = req.user.id;
    const sharedRecord = await Partner.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!sharedRecord) {
      return res.status(404).json({ message: "Shared data not found" });
    }

    await Partner.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Partner access revoked successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error revoking access", error: error.message });
  }
};

const getMySharedPartners = async (req, res) => {
  try {
    const userId = req.user.id;
    const partners = await Partner.find({ user: userId }).select(
      "-__v -createdAt -updatedAt"
    );
    res.status(200).json(partners);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching partners", error: error.message });
  }
};

module.exports = {
  shareCycleData,
  getSharedData,
  getSharedDataByToken,
  updateSharedData,
  revokePartnerAccess,
  getMySharedPartners,
};
