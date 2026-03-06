const { validationResult } = require("express-validator");
const { ApiError } = require("../utils/apiResponse.utils");


const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(". ");
    return next(new ApiError(422, message));
  }
  next();
};

module.exports = { validate };
