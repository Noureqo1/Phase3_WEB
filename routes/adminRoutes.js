const express = require("express");

const adminController = require("../controllers/adminController");
const validate = require("../middleware/validate");
const { protect, restrictTo } = require("../middleware/auth");
const { objectIdSchema } = require("../validators/commonValidators");
const { updateUserStatusSchema } = require("../validators/userValidators");

const router = express.Router();

router.use(protect, restrictTo("admin"));

router.get("/health", adminController.adminHealth);
router.get("/stats", adminController.getStats);
router.patch(
  "/users/:id/status",
  validate({ paramsSchema: objectIdSchema, bodySchema: updateUserStatusSchema }),
  adminController.updateUserStatus
);
router.get("/moderation", adminController.getModeration);

module.exports = router;
