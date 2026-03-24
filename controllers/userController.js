const userService = require("../services/userService");
const socialService = require("../services/socialService");
const asyncHandler = require("../middleware/asyncHandler");

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user._id);
  res.status(200).json({ success: true, data: user });
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMe(req.user._id, req.body);
  res.status(200).json({ success: true, data: user });
});

const getPublicProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getPublicProfileById(req.params.id);
  res.status(200).json({ success: true, data: profile });
});

const updatePreferences = asyncHandler(async (req, res) => {
  const user = await userService.updatePreferences(req.user._id, req.body);
  res.status(200).json({ success: true, data: user });
});

const followUser = asyncHandler(async (req, res) => {
  const relation = await socialService.followUser({
    currentUserId: req.user._id,
    targetUserId: req.params.id,
  });
  res.status(201).json({ success: true, data: relation });
});

const unfollowUser = asyncHandler(async (req, res) => {
  await socialService.unfollowUser({
    currentUserId: req.user._id,
    targetUserId: req.params.id,
  });
  res.status(200).json({ success: true, message: "Unfollowed successfully" });
});

const getFollowers = asyncHandler(async (req, res) => {
  const followers = await socialService.listFollowers(req.params.id);
  res.status(200).json({ success: true, data: followers });
});

const getFollowing = asyncHandler(async (req, res) => {
  const following = await socialService.listFollowing(req.params.id);
  res.status(200).json({ success: true, data: following });
});

module.exports = {
  getMe,
  updateMe,
  getPublicProfile,
  updatePreferences,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
