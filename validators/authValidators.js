const { z } = require("zod");

const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(30).optional(),
  lastName: z.string().trim().min(1).max(30).optional(),
  username: z.string().trim().min(3).max(30).optional(),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
}).refine((data) => {
  // Either username should be provided, or both firstName and lastName
  return data.username || (data.firstName && data.lastName);
}, {
  message: "Either username or both firstName and lastName must be provided",
  path: ["username"],
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
});

module.exports = { registerSchema, loginSchema };
