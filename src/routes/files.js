const express = require("express");
const fileController = require("../controllers/fileController.js");
const authMiddleware = require("../middlewares/auth.js");

const router = express.Router();

// Upload a file
router.post("/upload", authMiddleware, fileController.upload);

// Download a file
router.get("/download/:id", authMiddleware, fileController.download);

// Delete a file
router.delete("/delete/:id", authMiddleware, fileController.delete);

module.exports = router;
