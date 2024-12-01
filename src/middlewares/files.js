const File = require("../models/File.js");
const path = require("path");
const fs = require("fs").promises;

// Middleware to handle file uploads
exports.uploadFile = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: req.t("fileUploadError") });
    }

    const newFile = new File({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      user: req.user._id,
      path: file.path,
      language: req.user.language,
    });

    await newFile.save();

    // Add the file to the processing queue
    await req.fileQueue.add("process-file", { fileId: newFile._id });

    res.status(201).json(newFile);
  } catch (error) {
    res.status(500).json({ message: req.t("serverError") });
  }
};

// Middleware to handle file deletion
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: req.t("errors.fileNotFound") });
    }

    // Check if the user is authorized to delete the file
    if (file.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: req.t("errors.unauthorized") });
    }

    await file.deleteOne();
    res.json({ message: req.t("files.deleted") });
  } catch (error) {
    res.status(500).json({ message: req.t("serverError") });
  }
};

// Middleware to handle file download
exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: req.t("errors.fileNotFound") });
    }

    // Check if the user is authorized to download the file
    if (file.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: req.t("errors.unauthorized") });
    }

    res.download(
      path.join(__dirname, "..", "uploads", file.path),
      file.originalname
    );
  } catch (error) {
    res.status(500).json({ message: req.t("serverError") });
  }
};

// Middleware to list all files for the authenticated user
exports.listFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: req.t("serverError") });
  }
};
