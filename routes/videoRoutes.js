const express = require("express");

const videoController = require("../controllers/videoController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { verifyVideoOwnership } = require("../middleware/ownership");
const { objectIdSchema } = require("../validators/commonValidators");
const {
  createVideoSchema,
  updateVideoSchema,
  createReviewSchema,
} = require("../validators/videoValidators");

const router = express.Router();

router.get("/", videoController.getPublicVideos);
router.post("/", protect, validate({ bodySchema: createVideoSchema }), videoController.createVideo);
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
router.post(
  "/:id/reviews",
  protect,
  validate({ paramsSchema: objectIdSchema, bodySchema: createReviewSchema }),
  videoController.createReview
);

module.exports = router;
