
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguish from unexpected programmer errors
    Error.captureStackTrace(this, this.constructor);
  }
}

class ApiResponse {
  static success(res, statusCode = 200, message = "Success", data = {}) {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static paginated(res, message, data, pagination) {
    return res.status(200).json({ success: true, message, data, pagination });
  }
}

module.exports = { ApiError, ApiResponse };
