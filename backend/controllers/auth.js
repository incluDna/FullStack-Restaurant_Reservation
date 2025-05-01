const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const APIError = require("../utils/APIError");

/**
 * @description Register user into the database
 * @route GET /api/auth/register
 * @access Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, tel, email, role, password, employedAt } = req.body;

  const user = await User.create({
    name,
    tel,
    email,
    role,
    password,
    employedAt,
  });

  sendTokenResponse(user, 200, res);
});

/**
 * @description Login user into the system
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    throw new APIError("Please provide an email and password", 400);
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new APIError("Invalid credentials", 401);
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new APIError("Invalid credentials", 401);
  }

  // Create token
  // const token = user.getSignedJwtToken();
  // res.status(200).json({ success: true, token });
  sendTokenResponse(user, 200, res);
});

/**
 * @description Get logged in user information
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

/**
 * @description Log user out / clear cookie
 * @route GET /api/auth/logout
 * @access Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(204).json({
    success: true,
    data: {},
  });
});

// Get token from model, create cookie, and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

/**
 * @description Update logged in user data
 * @route PUT /api/auth/update
 * @access Private
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, tel } = req.body;

  const fieldsToUpdate = { name, email, tel };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new APIError(`User not found`, 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});
