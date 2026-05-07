const express = require("express");

const videoController = require("../controllers/videoController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { verifyVideoOwnership } = require("../middleware/ownership");
const { objectIdSchema } = require("../validators/commonValidators");
const { upload } = require("../middleware/upload");
const videoService = require("../services/videoService");
const {
  createVideoSchema,
  updateVideoSchema,
  createReviewSchema,
} = require("../validators/videoValidators");

const router = express.Router();

// Log all video upload requests
router.post("/upload-debug", (req, res) => {
  console.log("Upload request received");
  console.log("Headers:", req.headers);
  console.log("Content-Type:", req.get('Content-Type'));
  res.json({ message: "Debug endpoint" });
});

router.get("/", videoController.getPublicVideos);

// Feed endpoints and user routes must come before /:id
router.get("/feed/following", protect, videoController.getFollowingFeed);
router.get("/feed/trending", videoController.getTrendingFeed);
router.get("/user", protect, videoController.getUserVideos);
router.get("/liked", protect, videoController.getLikedVideos);

// Dynamic routes must come last
router.get("/:id", validate({ paramsSchema: objectIdSchema }), videoController.getVideoById);
// Simplified upload route for debugging
router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("=== UPLOAD DEBUG ===");
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    console.log("req.headers.authorization:", req.headers.authorization);
    
    // Check if user is authenticated
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid auth header found");
      return res.status(401).json({ success: false, error: { message: "Authentication required" } });
    }
    
    const token = authHeader.split(" ")[1];
    const jwt = require("jsonwebtoken");
    const User = require("../models/User");
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("Invalid token:", err.message);
      return res.status(401).json({ success: false, error: { message: "Invalid token" } });
    }
    
    const user = await User.findById(decoded.id).select("-hashedPassword");
    if (!user || !user.active) {
      console.log("User not found or inactive");
      return res.status(401).json({ success: false, error: { message: "User not found" } });
    }
    
    console.log("User authenticated:", user.username);
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: { message: "No file uploaded" } });
    }
    
    // Validate video file size - must be at least 1MB for a real video
    if (req.file.size < 1024 * 1024) {
      // Delete the invalid file
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        error: { message: `File too small to be a valid video. Minimum size is 1MB. Got: ${(req.file.size / 1024).toFixed(2)}KB` } 
      });
    }
    
    // Create video in database
    const videoData = {
      title: req.body.title || "Untitled",
      description: req.body.description || "",
      videoURL: `/uploads/${req.file.filename}`,
      duration: 60,
      timestamps: [],
      status: "public"
    };
    
    console.log("Creating video with data:", videoData);
    const video = await videoService.createVideo(user._id, videoData);
    console.log("Video created:", video._id);
    
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    console.error("Upload error:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});
router.patch(
  "/:id",
  protect,
  validate({ paramsSchema: objectIdSchema, bodySchema: updateVideoSchema }),
  verifyVideoOwnership,
  videoController.updateVideo
);
router.delete(
  "/:id",
  protect,
  validate({ paramsSchema: objectIdSchema }),
  verifyVideoOwnership,
  videoController.deleteVideo
);
router.get(
  "/:id/reviews/user",
  protect,
  validate({ paramsSchema: objectIdSchema }),
  videoController.getUserReview
);
router.get(
  "/:id/reviews",
  validate({ paramsSchema: objectIdSchema }),
  videoController.getVideoReviews
);
router.post(
  "/:id/reviews",
  protect,
  validate({ paramsSchema: objectIdSchema, bodySchema: createReviewSchema }),
  videoController.createReview
);
router.patch(
  "/:id/reviews",
  protect,
  validate({ paramsSchema: objectIdSchema, bodySchema: createReviewSchema }),
  videoController.updateReview
);
router.delete(
  "/:id/reviews",
  protect,
  validate({ paramsSchema: objectIdSchema }),
  videoController.deleteReview
);
router.post(
  "/:id/like",
  protect,
  validate({ paramsSchema: objectIdSchema }),
  videoController.likeVideo
);
router.delete(
  "/:id/like",
  protect,
  validate({ paramsSchema: objectIdSchema }),
  videoController.unlikeVideo
);

module.exports = router;
