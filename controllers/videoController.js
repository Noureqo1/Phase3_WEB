const videoService = require("../services/videoService");
const { validateVideoDuration, cleanupFile, generateThumbnail } = require("../middleware/upload");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");



const createVideo = asyncHandler(async (req, res) => {

  if (!req.file) {

    throw new AppError("No video file uploaded", 400);

  }



  try {

    // Try to validate video duration, but handle FFmpeg not being available

    let duration = 60; // Default 1 minute

    let thumbnail = null;

    

    try {

      const durationResult = await validateVideoDuration(req.file.path);

      duration = durationResult.duration;

      

      // Generate thumbnail

      thumbnail = await generateThumbnail(req.file.path);

    } catch (ffmpegError) {

      console.warn("FFmpeg not available, using default duration and no thumbnail:", ffmpegError.message);

      // Continue with default duration if FFmpeg is not available

    }

    

    // Prepare video data

    const videoData = {

      title: req.body.title,

      description: req.body.description || "",

      videoURL: `/uploads/${req.file.filename}`, // Store relative path

      thumbnail: thumbnail, // Save thumbnail path

      duration: duration,

      timestamps: [],

      status: "public"

    };



    const video = await videoService.createVideo(req.user._id, videoData);

    

    res.status(201).json({ success: true, data: video });

  } catch (error) {

    // Clean up file on error only

    await cleanupFile(req.file.path);

    throw error;

  }

});



const getPublicVideos = asyncHandler(async (_req, res) => {

  const videos = await videoService.getPublicFeed();

  res.status(200).json({ success: true, data: videos });

});



const getVideoById = asyncHandler(async (req, res) => {

  const video = await videoService.getVideoById(req.params.id);

  if (!video) {

    return res.status(404).json({ success: false, error: { message: "Video not found" } });

  }

  res.status(200).json({ success: true, data: video });

});



const updateVideo = asyncHandler(async (req, res) => {

  const updated = await videoService.updateVideo(req.video, req.body);

  res.status(200).json({ success: true, data: updated });

});



const deleteVideo = asyncHandler(async (req, res) => {

  await videoService.deleteVideo(req.video);

  res.status(200).json({ success: true, message: "Video deleted successfully" });

});



const getUserReview = asyncHandler(async (req, res) => {

  const review = await videoService.getUserReview(req.params.id, req.user._id);

  res.status(200).json({ success: true, data: review });

});



const getVideoReviews = asyncHandler(async (req, res) => {

  const reviews = await videoService.getVideoReviews(req.params.id);

  res.status(200).json({ success: true, data: reviews });

});



const createReview = asyncHandler(async (req, res) => {

  const review = await videoService.createReview({

    userId: req.user._id,

    videoId: req.params.id,

    payload: req.body,

  });

  res.status(201).json({ success: true, data: review });

});



const updateReview = asyncHandler(async (req, res) => {

  const review = await videoService.updateReview(req.params.id, req.user._id, req.body);

  res.status(200).json({ success: true, data: review });

});



const deleteReview = asyncHandler(async (req, res) => {

  await videoService.deleteReview(req.params.id, req.user._id);

  res.status(200).json({ success: true, message: "Review deleted successfully" });

});



const likeVideo = asyncHandler(async (req, res) => {

  const video = await videoService.likeVideo(req.params.id, req.user._id);

  res.status(200).json({ success: true, data: video });

});



const unlikeVideo = asyncHandler(async (req, res) => {

  const video = await videoService.unlikeVideo(req.params.id, req.user._id);

  res.status(200).json({ success: true, data: video });

});



const getFollowingFeed = asyncHandler(async (req, res) => {

  const { skip = 0, limit = 12, search, sortBy } = req.query;

  const videos = await videoService.getFollowingFeed(req.user._id, {

    skip: parseInt(skip),

    limit: parseInt(limit),

    search,

    sortBy

  });

  res.status(200).json({ success: true, data: videos });

});



const getTrendingFeed = asyncHandler(async (req, res) => {

  const { skip = 0, limit = 12, search, sortBy } = req.query;

  const videos = await videoService.getTrendingFeed({

    skip: parseInt(skip),

    limit: parseInt(limit),

    search,

    sortBy

  });

  res.status(200).json({ success: true, data: videos });

});



const getUserVideos = asyncHandler(async (req, res) => {

  const videos = await videoService.getUserVideos(req.user._id);

  res.status(200).json({ success: true, data: videos });

});



module.exports = {

  createVideo,

  getPublicVideos,

  getVideoById,

  updateVideo,

  deleteVideo,

  getUserReview,

  getVideoReviews,

  createReview,

  updateReview,

  deleteReview,

  likeVideo,

  unlikeVideo,

  getFollowingFeed,

  getTrendingFeed,

  getUserVideos,

};

