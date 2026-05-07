const z = require('zod');

// User validation schemas
const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address'),
  password: z.string()
    .min(1, 'Password is required')
});

// Video validation schemas
const uploadVideoSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  status: z.enum(['public', 'private', 'unlisted'])
    .default('public')
});

// Comment validation schemas
const createCommentSchema = z.object({
  text: z.string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment must be less than 500 characters'),
  videoId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid video ID')
});

// Like validation schemas
const likeVideoSchema = z.object({
  videoId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid video ID')
});

// Payment validation schemas
const createTipSchema = z.object({
  creatorId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid creator ID'),
  amount: z.number()
    .min(1, 'Minimum tip amount is $1')
    .max(10000, 'Maximum tip amount is $10,000'),
  videoId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid video ID')
    .optional(),
  message: z.string()
    .max(200, 'Message must be less than 200 characters')
    .optional()
});

// User profile update schemas
const updateProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  notificationPreferences: z.object({
    email: z.object({
      followers: z.boolean().default(true),
      comments: z.boolean().default(true),
      likes: z.boolean().default(true),
      tips: z.boolean().default(true)
    }).optional(),
    inApp: z.object({
      followers: z.boolean().default(true),
      comments: z.boolean().default(true),
      likes: z.boolean().default(true),
      tips: z.boolean().default(true)
    }).optional()
  }).optional()
});

// Admin validation schemas
const adminActionSchema = z.object({
  userId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  action: z.enum(['activate', 'deactivate', 'suspend', 'delete']),
  reason: z.string()
    .max(500, 'Reason must be less than 500 characters')
    .optional()
});

// Pagination schemas
const paginationSchema = z.object({
  page: z.number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot be more than 100')
    .default(20)
});

// Search schemas
const searchSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters'),
  type: z.enum(['video', 'user', 'all'])
    .default('all'),
  page: z.number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(50, 'Limit cannot be more than 50')
    .default(20)
});

// Validation middleware factory
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      let data;
      
      switch (source) {
        case 'body':
          data = req.body;
          break;
        case 'query':
          data = req.query;
          break;
        case 'params':
          data = req.params;
          break;
        default:
          data = req.body;
      }

      const result = schema.parse(data);
      
      // Replace the request data with validated data
      switch (source) {
        case 'body':
          req.body = result;
          break;
        case 'query':
          req.query = result;
          break;
        case 'params':
          req.params = result;
          break;
      }
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

module.exports = {
  // Schemas
  registerSchema,
  loginSchema,
  uploadVideoSchema,
  createCommentSchema,
  likeVideoSchema,
  createTipSchema,
  updateProfileSchema,
  adminActionSchema,
  paginationSchema,
  searchSchema,
  
  // Middleware
  validate
};
