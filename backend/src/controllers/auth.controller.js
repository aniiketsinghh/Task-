const User = require("../models/User.model");
const { signToken, buildUserResponse } = require("../utils/jwt.utils");
const { ApiError, ApiResponse } = require("../utils/apiResponse.utils");


const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Accept "admin" or "user" — default to "user" for anything else
    const safeRole = ["admin", "user"].includes(role) ? role : "user";

    const user = await User.create({ name, email, password, role: safeRole });
    const token = signToken({ id: user._id, role: user.role });

    ApiResponse.success(res, 201, "Registration successful.", {
      token,
      user: buildUserResponse(user),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/login
 * Authenticates a user and returns a signed JWT on success.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password since the schema omits it by default
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new ApiError(401, "Invalid email or password."));
    }

    const token = signToken({ id: user._id, role: user.role });

    ApiResponse.success(res, 200, "Login successful.", {
      token,
      user: buildUserResponse(user),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/auth/me
 * Returns the profile of the currently authenticated user.
 */
const getMe = async (req, res, next) => {
  try {
    ApiResponse.success(res, 200, "Profile fetched.", {
      user: buildUserResponse(req.user),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
