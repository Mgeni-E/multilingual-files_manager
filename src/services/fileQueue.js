const Bull = require("bull"),
  File = require("../models/File.js"),
  path = require("path"),
  fs = require("fs").promises;

// Create a new Bull queue
const fileQueue = new Bull("file-processing", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PSWD,
  },
});

// Define a job processor for the 'process-file' queue
fileQueue.process("process-file", async (job) => {
  const { fileId } = job.data;
  const file = await File.findById(fileId);

  if (!file) {
    throw new Error("File not found");
  }

  // Perform any necessary file processing tasks (e.g., conversion, thumbnail generation)
  // Example: Convert the file to PDF
  const pdfPath = path.join(__dirname, "..", "uploads", `${file.filename}.pdf`);
  await convertToPdf(file.path, pdfPath);

  // Update the file record with the new path
  file.path = `${file.filename}.pdf`;
  await file.save();
});

async function convertToPdf(inputPath, outputPath) {
  // Implement the file conversion logic here
  // (e.g., using a PDF conversion library)
  console.log(`Converting file at ${inputPath} to ${outputPath}`);
  await fs.copyFile(inputPath, outputPath);
}

module.exports = { fileQueue };
