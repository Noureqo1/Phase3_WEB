const authService = require("../services/authService");
const asyncHandler = require("../middleware/asyncHandler");

/** @description Cookie options for JWT token */
const COOKIE_OPTIONS = {
  httpOnly: false,       // Frontend reads via js-cookie, keep accessible
  secure: false,         // Set to true in production (HTTPS)
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

/**
 * @description Register a new user and set JWT cookie
 * @route POST /api/v1/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  // Set the JWT cookie so the frontend session is established immediately
  res.cookie("token", result.token, COOKIE_OPTIONS);

  res.status(201).json({
    success: true,
    data: result,
  });
});

/**
 * @description Login a user and always set/overwrite the JWT cookie
 * @route POST /api/v1/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  // Always overwrite the JWT cookie — this is the key fix for account-switching
  res.cookie("token", result.token, COOKIE_OPTIONS);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @description Logout the current user by clearing the JWT cookie
 * @route POST /api/v1/auth/logout
 */
const logout = asyncHandler(async (_req, res) => {
  // Clear the JWT cookie by setting it to empty with maxAge: 0
  res.cookie("token", "", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = { register, login, logout };
