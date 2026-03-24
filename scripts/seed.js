const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const fs = require("fs/promises");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("../config/db");
const User = require("../models/User");
const Video = require("../models/Video");
const Review = require("../models/Review");
const Follower = require("../models/Follower");

const SALT_ROUNDS = 10;

const userSeeds = [
  {
    username: "clipsphere_admin",
    email: "admin@clipsphere.local",
    password: "AdminPass123!",
    role: "admin",
    bio: "Platform superuser",
    avatarKey: "avatars/admin.png",
  },
  {
    username: "alice_creator",
    email: "alice@clipsphere.local",
    password: "UserPass123!",
    role: "user",
    bio: "Travel micro-vlogger",
    avatarKey: "avatars/alice.png",
  },
  {
    username: "bob_coder",
    email: "bob@clipsphere.local",
    password: "UserPass123!",
    role: "user",
    bio: "Code and coffee shorts",
    avatarKey: "avatars/bob.png",
  },
  {
    username: "chloe_foodie",
    email: "chloe@clipsphere.local",
    password: "UserPass123!",
    role: "user",
    bio: "Street food reviews",
    avatarKey: "avatars/chloe.png",
  },
];

const createUsers = async () => {
  const users = [];

  for (const seed of userSeeds) {
    const hashedPassword = await bcrypt.hash(seed.password, SALT_ROUNDS);
    const user = await User.create({
      username: seed.username,
      email: seed.email,
      hashedPassword,
      role: seed.role,
      bio: seed.bio,
      avatarKey: seed.avatarKey,
      active: true,
      accountstatus: "active",
    });

    users.push(user);
  }

  return users;
};

const createVideos = async (users) => {
  const [admin, alice, bob, chloe] = users;

  const videoSeeds = [
    {
      title: "Sunrise in Bali",
      description: "30-second sunrise timelapse.",
      owner: alice._id,
      videoURL: "https://cdn.clipsphere.local/videos/bali-sunrise.mp4",
      duration: 30,
      timestamps: [5, 12, 24],
      status: "public",
    },
    {
      title: "React Hook in 60s",
      description: "useMemo explained quickly.",
      owner: bob._id,
      videoURL: "https://cdn.clipsphere.local/videos/react-hook.mp4",
      duration: 60,
      timestamps: [10, 25, 48],
      status: "public",
    },
    {
      title: "Night Market Bites",
      description: "Top 3 snacks under $5.",
      owner: chloe._id,
      videoURL: "https://cdn.clipsphere.local/videos/night-market.mp4",
      duration: 95,
      timestamps: [20, 49, 77],
      status: "public",
    },
    {
      title: "Admin Moderation Demo",
      description: "Internal moderation sample clip.",
      owner: admin._id,
      videoURL: "https://cdn.clipsphere.local/videos/mod-demo.mp4",
      duration: 45,
      timestamps: [8, 19, 31],
      status: "private",
    },
    {
      title: "Extreme Food Challenge",
      description: "Potentially risky challenge video.",
      owner: chloe._id,
      videoURL: "https://cdn.clipsphere.local/videos/food-challenge.mp4",
      duration: 120,
      timestamps: [14, 40, 92],
      status: "flagged",
    },
    {
      title: "Full Stack Setup",
      description: "From clone to running app in 4 minutes.",
      owner: bob._id,
      videoURL: "https://cdn.clipsphere.local/videos/full-stack-setup.mp4",
      duration: 240,
      timestamps: [30, 90, 180],
      status: "public",
    },
  ];

  return Video.insertMany(videoSeeds);
};

const createReviews = async (users, videos) => {
  const [, alice, bob, chloe] = users;
  const [bali, reactHook, nightMarket, , flagged, fullStack] = videos;

  const reviewSeeds = [
    {
      user: bob._id,
      video: bali._id,
      rating: 5,
      comment: "Super clean shots, loved this!",
    },
    {
      user: chloe._id,
      video: bali._id,
      rating: 4,
      comment: "Great vibe and editing.",
    },
    {
      user: alice._id,
      video: reactHook._id,
      rating: 5,
      comment: "Explained clearly in one minute.",
    },
    {
      user: chloe._id,
      video: reactHook._id,
      rating: 3,
      comment: "Good, but a bit fast.",
    },
    {
      user: alice._id,
      video: flagged._id,
      rating: 1,
      comment: "Unsafe content, should be reviewed.",
    },
    {
      user: bob._id,
      video: flagged._id,
      rating: 2,
      comment: "Not a fan of this challenge.",
    },
    {
      user: alice._id,
      video: fullStack._id,
      rating: 4,
      comment: "Useful checklist format.",
    },
    {
      user: bob._id,
      video: nightMarket._id,
      rating: 5,
      comment: "Now I want to visit this place.",
    },
  ];

  return Review.insertMany(reviewSeeds);
};

const createFollowers = async (users) => {
  const [admin, alice, bob, chloe] = users;

  const followerSeeds = [
    { followerid: alice._id, followingid: bob._id },
    { followerid: alice._id, followingid: chloe._id },
    { followerid: bob._id, followingid: alice._id },
    { followerid: chloe._id, followingid: alice._id },
    { followerid: chloe._id, followingid: bob._id },
    { followerid: admin._id, followingid: alice._id },
  ];

  return Follower.insertMany(followerSeeds);
};

const seed = async () => {
  try {
    await connectDB();
    // eslint-disable-next-line no-console
    console.log("Connected to MongoDB");

    await Promise.all([
      Follower.deleteMany({}),
      Review.deleteMany({}),
      Video.deleteMany({}),
      User.deleteMany({}),
    ]);
    // eslint-disable-next-line no-console
    console.log("Cleared existing data");

    const users = await createUsers();
    const videos = await createVideos(users);
    const reviews = await createReviews(users, videos);
    const followers = await createFollowers(users);

    // eslint-disable-next-line no-console
    console.log(
      `Seed complete: users=${users.length}, videos=${videos.length}, reviews=${reviews.length}, follows=${followers.length}`
    );
    // eslint-disable-next-line no-console
    console.log("Seeded user ids:");
    users.forEach((user) => {
      // eslint-disable-next-line no-console
      console.log(`- ${user.username}: ${user._id}`);
    });
    // eslint-disable-next-line no-console
    console.log("Seeded video ids:");
    videos.forEach((video) => {
      // eslint-disable-next-line no-console
      console.log(`- ${video.title}: ${video._id}`);
    });

    const seedIds = {
      users: Object.fromEntries(users.map((user) => [user.username, user._id.toString()])),
      videos: Object.fromEntries(videos.map((video) => [video.title, video._id.toString()])),
    };
    const outputPath = path.resolve(__dirname, "../postman/seed-ids.json");
    await fs.writeFile(outputPath, JSON.stringify(seedIds, null, 2), "utf8");
    // eslint-disable-next-line no-console
    console.log(`Saved ids for Postman: ${outputPath}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    // eslint-disable-next-line no-console
    console.log("Database connection closed");
  }
};

seed();
