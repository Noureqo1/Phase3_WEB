const { z } = require("zod");

const objectIdSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid id format"),
});

module.exports = { objectIdSchema };
