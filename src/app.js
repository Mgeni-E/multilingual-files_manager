const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const redis = require("redis");
const cors = require("cors");
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB"),
      console.log("Database Name:", mongoose.connection.db.databaseName);
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Redis connection
const redisClient = redis.createClient({
  password: process.env.REDIS_PSWD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
redisClient.connect(console.log("Connected to Redis")).catch(console.error);

// i18n setup
i18next.use(i18nextMiddleware.LanguageDetector).init({
  fallbackLng: "en",
  preload: ["en", "es"],
  resources: {
    en: require("./i18n/en"),
    es: require("./i18n/es"),
  },
});

app.use(i18nextMiddleware.handle(i18next));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: req.t("welcome") });
});

// Import the file routes
const fileRoutes = require("./routes/files");
const authRoutes = require("./routes/auth");

// Add routes
app.use("/", authRoutes);
app.use("/upload", fileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: req.t("serverError"),
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

// Move server start logic to only run if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
