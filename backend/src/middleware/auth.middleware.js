const { verifyToken } = require("../utils/jwt.utils");
const { ApiError } = require("../utils/apiResponse.utils");
const User = require("../models/User.model");


const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(401, "Access denied. No token provided."));
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token); // throws if invalid or expired

    // Re-fetch user to catch cases where the account was deleted post-issue
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new ApiError(401, "User belonging to this token no longer exists."));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token has expired. Please log in again."));
    }
    return next(new ApiError(401, "Invalid token."));
  }
};

/**
 * restrictTo — factory that returns middleware allowing only specific roles.
 * Usage: router.delete("/:id", protect, restrictTo("admin"), controller)
 */
const restrictTo = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have permission to perform this action."));
  }
  next();
};

module.exports = { protect, restrictTo };
