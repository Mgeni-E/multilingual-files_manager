const express = require("express");
const authMiddleware = require("../middlewares/auth.js");
const fileOperations = require("../middlewares/files.js");
const multer = require("multer");
const path = require("path");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads")); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage }); // Create the upload middleware

// Create the router
const router = express.Router();

// Upload a file
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  fileOperations.uploadFile
);

// Download a file
router.get("/download/:id", authMiddleware, fileOperations.downloadFile);

// Delete a file
router.delete("/delete/:id", authMiddleware, fileOperations.deleteFile);

// List all files for the authenticated user
router.get("/files", authMiddleware, fileOperations.listFiles);

module.exports = router;
