const User = require("../models/User.model");
const { ApiError, ApiResponse } = require("../utils/apiResponse.utils");
const { buildUserResponse } = require("../utils/jwt.utils");


const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find().select("-password").sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(),
    ]);

    ApiResponse.paginated(res, "Users fetched.", users, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/users/:id/role
 * Admin only — updates a user's role.
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return next(new ApiError(400, 'Role must be "user" or "admin".'));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return next(new ApiError(404, "User not found."));

    ApiResponse.success(res, 200, "User role updated.", { user: buildUserResponse(user) });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/users/:id
 * Admin only — deletes a user account.
 */
const deleteUser = async (req, res, next) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return next(new ApiError(400, "You cannot delete your own account."));
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new ApiError(404, "User not found."));

    ApiResponse.success(res, 200, "User deleted.", {});
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
