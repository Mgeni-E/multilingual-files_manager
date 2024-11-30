const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const authMiddleware = async function (req, res, next) {
  // Skip authentication in test environment
  if (process.env.NODE_ENV === "test") {
    req.user = {
      _id: "test-user-id",
      language: "en",
    };
    return next();
  }

  // Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
