const express = require("express");

const userController = require("../controllers/userController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { objectIdSchema } = require("../validators/commonValidators");
const {
  updateMeSchema,
  updatePreferencesSchema,
} = require("../validators/userValidators");

const router = express.Router();

router.get("/me", protect, userController.getMe);
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
