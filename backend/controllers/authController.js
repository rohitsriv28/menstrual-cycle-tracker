const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const generateAccessToken = (payload) => {
  return jwt.sign({ user: payload }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign({ user: payload }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, age } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({
      email,
      password,
      profile: { name, age },
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        message: "Invalid credentials",
        error: "Email or password mismatch",
      });

    let payload = {
      profile: user.profile,
      id: user._id,
      email: user.email,
    };
    // console.log(payload);

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ message: "Login successful", accessToken, refreshToken, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const user = await User.findOne({ refreshToken });
    if (!user)
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err)
          return res.status(403).json({ message: "Refresh token expired" });

        const accessToken = generateAccessToken(decoded.user);
        res.json({ accessToken });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      profile: user.profile,
      id: user._id,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
