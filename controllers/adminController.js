const adminService = require("../services/adminService");
const asyncHandler = require("../middleware/asyncHandler");

const adminHealth = asyncHandler(async (_req, res) => {
  const health = await adminService.getAdminHealth();
  res.status(200).json({ success: true, data: health });
});

const getStats = asyncHandler(async (_req, res) => {
  const stats = await adminService.getAdminStats();
  res.status(200).json({ success: true, data: stats });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await adminService.softDeleteUser({
    userId: req.params.id,
    payload: req.body,
  });
  res.status(200).json({ success: true, data: user });
});

const getModeration = asyncHandler(async (_req, res) => {
  const moderation = await adminService.getModerationQueue();
  res.status(200).json({ success: true, data: moderation });
});

module.exports = { adminHealth, getStats, updateUserStatus, getModeration };
