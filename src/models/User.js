const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  language: {
    type: String,
    default: "en",
    enum: ["en", "es"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Password hashing middleware
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
UserSchema.methods.isValidPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to generate an auth token
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
