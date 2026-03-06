const { body } = require("express-validator");

const createNodeValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Node name is required")
    .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "pending"])
    .withMessage("Status must be active, inactive, or pending"),

  body("tags")
    .optional()
    .isArray().withMessage("Tags must be an array"),
];

const updateNodeValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty().withMessage("Name cannot be empty")
    .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "pending"])
    .withMessage("Status must be active, inactive, or pending"),

  body("tags")
    .optional()
    .isArray().withMessage("Tags must be an array"),
];

module.exports = { createNodeValidation, updateNodeValidation };
