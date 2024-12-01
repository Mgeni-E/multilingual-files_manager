const File = require("../models/File.js");
const path = require("path");
const { fileQueue } = require("../services/fileQueue.js");

exports.upload = async (req, res) => {
  console.log(req.file);
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: req.t("fileUploadError") });
    }

    const { language } = req.user;

    // Create a new file record
    const newFile = new File({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      user: req.user._id,
      path: file.path,
      language,
    });

    await newFile.save();

    // Add the file to the queue for processing (e.g., conversion, thumbnail generation)
    await fileQueue.add("process-file", { fileId: newFile._id });

    res.status(201).json(newFile);
  } catch (error) {
    res.status(400).json({ message: req.t("fileUploadError") });
  }
};

exports.download = async (req, res) => {
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
    res.status(400).json({
      message: req.t("errors.fileDownload", { error: error.message }),
    });
  }
};

exports.delete = async (req, res) => {
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
    res
      .status(400)
      .json({ message: req.t("errors.fileDelete", { error: error.message }) });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: req.t("fileUploadError"),
      });
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, "..", "uploads", file.name);
    file.mv(uploadPath, async (err) => {
      if (err) {
        return res.status(500).json({
          message: req.t("errors.fileUpload", { error: err.message }),
        });
      }
      const newFile = new File({
        path: file.name,
        originalname: file.originalname,
        user: req.user._id,
      });
      await newFile.save();
      res.status(201).json({ _id: newFile._id, filename: file.originalname });
    });

    res.status(200).json({
      message: req.t("fileUploadSuccess"),
    });
  } catch (error) {
    res.status(400).json({
      message: req.t("fileUploadError"),
    });
  }
};
