const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password, language } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: req.t("userExists") });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      language,
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: req.t("serverError") });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: req.t("invalidCredentials") });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: req.t("invalidCredentials") });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: req.t("serverError") });
  }
};

exports.logout = async (req, res) => {
  try {
    // TODO: Implement logout functionality (e.g., blacklist the token)
    res.json({ message: req.t("logout.success") });
  } catch (error) {
    res
      .status(400)
      .json({ message: req.t("errors.logout", { error: error.message }) });
  }
};
