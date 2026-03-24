const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema(
  {
    followerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    followingid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

followerSchema.index({ followerid: 1, followingid: 1 }, { unique: true });

followerSchema.pre("save", function preventSelfFollow() {
  if (this.followerid.equals(this.followingid)) {
    const error = new Error("Users cannot follow themselves");
    error.statusCode = 400;
    throw error;
  }
});

module.exports = mongoose.model("Follower", followerSchema);
