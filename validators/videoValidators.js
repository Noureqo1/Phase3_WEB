const { z } = require("zod");

const createVideoSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().max(2000).optional().default(""),
  videoURL: z.string().trim().url(),
  duration: z.number().int().min(1).max(300),
  timestamps: z.array(z.number().nonnegative()).optional().default([]),
  status: z.enum(["public", "private", "flagged"]).optional(),
});

const updateVideoSchema = z
  .object({
    title: z.string().trim().min(1).max(150).optional(),
    description: z.string().trim().max(2000).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional().default(""),
});

module.exports = { createVideoSchema, updateVideoSchema, createReviewSchema };
