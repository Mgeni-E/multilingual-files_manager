const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  path: {
    type: String,
    required: true,
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

const File = mongoose.model("File", FileSchema);
module.exports = File;
