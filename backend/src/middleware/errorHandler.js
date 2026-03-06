const { ApiError } = require("../utils/apiResponse.utils");

const errorHandler = (err, _req, res, _next) => {
  let error = err;

  // ── Mongoose: invalid ObjectId ─────────────────────────────────────────────
  if (err.name === "CastError") {
    error = new ApiError(400, `Invalid value for field: ${err.path}`);
  }

  // ── Mongoose: duplicate key violation ─────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(409, `${field} already exists.`);
  }

  // ── Mongoose: schema validation errors ────────────────────────────────────
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(400, messages.join(". "));
  }

  // ── JWT errors ─────────────────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token.");
  }
  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token has expired. Please log in again.");
  }

  const statusCode = error.statusCode || 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error."
      : error.message;

  // Log unexpected errors in development for easier debugging
  if (statusCode === 500 && process.env.NODE_ENV !== "production") {
    console.error("[Error]", err);
  }

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
