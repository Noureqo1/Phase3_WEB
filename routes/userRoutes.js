const express = require("express");
const multer = require("multer");

const userController = require("../controllers/userController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { objectIdSchema } = require("../validators/commonValidators");
const {
  updateMeSchema,
  updatePreferencesSchema,
} = require("../validators/userValidators");

const router = express.Router();

// Configure multer for avatar uploads
const upload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

router.get("/me", protect, userController.getMe);
router.post("/upload-avatar", protect, upload.single("avatar"), userController.uploadAvatar);
router.patch(
  "/updateMe",
  protect,
  validate({ bodySchema: updateMeSchema }),
  userController.updateMe
);
router.patch(
  "/preferences",
  protect,
  validate({ bodySchema: updatePreferencesSchema }),
  userController.updatePreferences
);

router.post(
  "/:id/follow",
  protect,
  validate({ paramsSchema: objectIdSchema }),
  userController.followUser
);
router.delete(
  "/:id/unfollow",
  protect,
  validate({ paramsSchema: objectIdSchema }),
  userController.unfollowUser
);
router.get(
  "/:id/followers",
  validate({ paramsSchema: objectIdSchema }),
  userController.getFollowers
);
router.get(
  "/:id/following",
  validate({ paramsSchema: objectIdSchema }),
  userController.getFollowing
);
router.get("/:id", validate({ paramsSchema: objectIdSchema }), userController.getPublicProfile);

module.exports = router;
