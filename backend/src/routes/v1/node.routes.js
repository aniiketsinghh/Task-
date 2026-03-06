const express = require("express");
const {
  createNode,
  getNodes,
  getNode,
  updateNode,
  deleteNode,
} = require("../../controllers/node.controller");
const { protect, restrictTo} = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validate.middleware");
const { createNodeValidation, updateNodeValidation } = require("../../validators/node.validators");

const router = express.Router();

// All node routes require authentication
router.use(protect);

router
  .route("/")
  .get(getNodes)
  .post(createNodeValidation, validate, createNode); // Any logged-in user can create

router
  .route("/:id")
  .get(getNode)                                                           // Anyone can view
  .patch(restrictTo("admin"), updateNodeValidation, validate, updateNode) // Admin only
  .delete(restrictTo("admin"), deleteNode);                               // Admin only

module.exports = router;
