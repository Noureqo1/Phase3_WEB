const { z } = require("zod");

const toggleSchema = z.object({
  followers: z.boolean().optional(),
  comments: z.boolean().optional(),
  likes: z.boolean().optional(),
  tips: z.boolean().optional(),
});

const updateMeSchema = z
  .object({
    username: z.string().trim().min(3).max(30).optional(),
    bio: z.string().trim().max(500).optional(),
    avatarKey: z.string().trim().max(500).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

const updatePreferencesSchema = z
  .object({
    inApp: toggleSchema.optional(),
    email: toggleSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one preference group is required",
  });

const updateUserStatusSchema = z.object({
  active: z.boolean().optional(),
  accountstatus: z.string().trim().min(1).max(50).optional(),
});

module.exports = {
  updateMeSchema,
  updatePreferencesSchema,
  updateUserStatusSchema,
};
