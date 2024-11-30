// src/scripts/seedDatabase.js
const mongoose = require("mongoose");
const User = require("../models/User");
const File = require("../models/File");

// Load environment variables
require("dotenv").config();

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB for seeding");

    // Clear existing data (optional, use carefully)
    await User.deleteMany({});
    await File.deleteMany({});

    // Create a test user
    const newUser = new User({
      username: "testUser",
      email: "testuser@example.com",
      password: "securepassword",
    });
    await newUser.save();
    console.log("Test user created:", newUser._id);

    // Create a test file associated with the user
    const newFile = new File({
      filename: "example.txt",
      originalname: "original-example.txt",
      mimetype: "text/plain",
      size: 1024,
      user: newUser._id,
      path: "/path/to/file",
    });
    await newFile.save();
    console.log("Test file created:", newFile._id);

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
  }
}

// Run the seeding function
seedDatabase().catch(console.error);
