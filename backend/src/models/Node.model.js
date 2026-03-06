const mongoose = require("mongoose");


const nodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Node name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },
    tags: {
      type: [String],
      default: [],
    },
    // Reference to the user who created this node
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster lookup by owner
nodeSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Node", nodeSchema);
