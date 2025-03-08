const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded.user.id)
    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
