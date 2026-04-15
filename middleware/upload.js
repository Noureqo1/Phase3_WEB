const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

// Configure multer for file upload
const uploadDir = path.join(__dirname, "../uploads");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "video-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Only allow video files
  const allowedMimes = ["video/mp4", "video/x-msvideo", "video/quicktime"];
  const maxSize = 500 * 1024 * 1024; // 500 MB

  if (!allowedMimes.includes(file.mimetype)) {
    return cb(
      new Error(`Invalid file type. Only video files are allowed. Got: ${file.mimetype}`)
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB
  },
});

/**
 * Get video duration using FFmpeg
 */
const getVideoDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(new Error(`Failed to probe video: ${err.message}`));
      }

      const duration = metadata.format.duration;
      resolve(Math.ceil(duration)); // Return duration in seconds, rounded up
    });
  });
};

/**
 * Validate video duration (max 300 seconds / 5 minutes)
 */
const validateVideoDuration = async (filePath, maxDuration = 300) => {
  try {
    const duration = await getVideoDuration(filePath);

    if (duration > maxDuration) {
      throw new Error(
        `Video duration ${duration}s exceeds maximum allowed duration of ${maxDuration}s (5 minutes)`
      );
    }

    return { valid: true, duration };
  } catch (error) {
    throw error;
  }
};

/**
 * Clean up uploaded file
 */
const cleanupFile = (filePath) => {
  return new Promise((resolve) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}:`, err.message);
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  upload,
  getVideoDuration,
  validateVideoDuration,
  cleanupFile,
};
