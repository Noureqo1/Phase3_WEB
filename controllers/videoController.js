const videoService = require("../services/videoService");
const asyncHandler = require("../middleware/asyncHandler");

const createVideo = asyncHandler(async (req, res) => {
  const video = await videoService.createVideo(req.user._id, req.body);
  res.status(201).json({ success: true, data: video });
});

const getPublicVideos = asyncHandler(async (_req, res) => {
  const videos = await videoService.getPublicFeed();
  res.status(200).json({ success: true, data: videos });
});

const updateVideo = asyncHandler(async (req, res) => {
  const updated = await videoService.updateVideo(req.video, req.body);
  res.status(200).json({ success: true, data: updated });
});

const deleteVideo = asyncHandler(async (req, res) => {
  await videoService.deleteVideo(req.video);
  res.status(200).json({ success: true, message: "Video deleted successfully" });
});

const createReview = asyncHandler(async (req, res) => {
  const review = await videoService.createReview({
    userId: req.user._id,
    videoId: req.params.id,
    payload: req.body,
  });
  res.status(201).json({ success: true, data: review });
});

module.exports = {
  createVideo,
  getPublicVideos,
  updateVideo,
  deleteVideo,
  createReview,
};
