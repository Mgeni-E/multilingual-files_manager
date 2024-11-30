const express = require("express");
const authController = require("../controllers/authController.js");
const authMiddleware = require("../middlewares/auth.js");

const router = express.Router();

// User registration
router.post("/register", authController.register);

// User login
router.post("/login", authController.login);

// User logout
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
