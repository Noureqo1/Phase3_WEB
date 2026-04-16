const mongoose = require("mongoose");



const videoSchema = new mongoose.Schema(

  {

    title: {

      type: String,

      required: true,

      trim: true,

      maxlength: 150,

    },

    description: {

      type: String,

      default: "",

      trim: true,

      maxlength: 2000,

    },

    owner: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,

    },

    videoURL: {

      type: String,

      required: true,

      trim: true,

    },

    duration: {

      type: Number,

      required: true,

      min: 1,

      max: 300,

    },

    timestamps: {

      type: [Number],

      default: [],

    },

    viewscount: {

      type: Number,

      default: 0,

      min: 0,

    },

    reviewCount: {

      type: Number,

      default: 0,

      min: 0,

    },

    avgRating: {

      type: Number,

      default: 0,

      min: 0,

      max: 5,

    },

    status: {

      type: String,

      enum: ["public", "private", "flagged"],

      default: "public",

    },

    likedBy: {

      type: [mongoose.Schema.Types.ObjectId],

      ref: "User",

      default: [],

    },

    likes: {

      type: Number,

      default: 0,

      min: 0,

    },

  },

  { timestamps: true }

);



module.exports = mongoose.model("Video", videoSchema);

