const express = require("express");

const videoController = require("../controllers/videoController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { verifyVideoOwnership } = require("../middleware/ownership");
const { objectIdSchema } = require("../validators/commonValidators");
const { upload } = require("../middleware/upload");
const {
  createVideoSchema,
  updateVideoSchema,
  createReviewSchema,
} = require("../validators/videoValidators");

const router = express.Router();

router.get("/", videoController.getPublicVideos);
router.get("/:id", validate({ paramsSchema: objectIdSchema }), videoController.getVideoById);

// Feed endpoints
router.get("/feed/following", protect, videoController.getFollowingFeed);
router.get("/feed/trending", videoController.getTrendingFeed);
router.get("/user", protect, videoController.getUserVideos);
router.post("/", protect, upload.single("file"), videoController.createVideo);
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
