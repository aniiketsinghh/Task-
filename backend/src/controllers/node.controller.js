const Node = require("../models/Node.model");
const { ApiError, ApiResponse } = require("../utils/apiResponse.utils");


const createNode = async (req, res, next) => {
  try {
    const { name, description, status, tags } = req.body;

    const node = await Node.create({
      name,
      description,
      status,
      tags,
      createdBy: req.user._id,
    });

    ApiResponse.success(res, 201, "Node created successfully.", { node });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/nodes
 * Returns a paginated list of nodes.
 * Both admin and regular users can see ALL nodes.
 * Supports: ?page=1&limit=10&status=active&search=keyword
 */
const getNodes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [nodes, total] = await Promise.all([
      Node.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Node.countDocuments(filter),
    ]);

    ApiResponse.paginated(res, "Nodes fetched successfully.", nodes, {
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
 * GET /api/v1/nodes/:id
 * Returns a single node by ID.
 * Any authenticated user can view any node.
 */
const getNode = async (req, res, next) => {
  try {
    const node = await Node.findById(req.params.id).populate("createdBy", "name email");
    if (!node) return next(new ApiError(404, "Node not found."));
    ApiResponse.success(res, 200, "Node fetched successfully.", { node });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/nodes/:id
 * ADMIN ONLY — update any node.
 */
const updateNode = async (req, res, next) => {
  try {
    const node = await Node.findById(req.params.id);
    if (!node) return next(new ApiError(404, "Node not found."));

    if (req.user.role !== "admin") {
      return next(new ApiError(403, "Only admins can update nodes."));
    }

    const allowedUpdates = ["name", "description", "status", "tags"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) node[field] = req.body[field];
    });

    await node.save();

    ApiResponse.success(res, 200, "Node updated successfully.", { node });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/nodes/:id
 * ADMIN ONLY — delete any node.
 */
const deleteNode = async (req, res, next) => {
  try {
    const node = await Node.findById(req.params.id);
    if (!node) return next(new ApiError(404, "Node not found."));

    if (req.user.role !== "admin") {
      return next(new ApiError(403, "Only admins can delete nodes."));
    }

    await node.deleteOne();

    ApiResponse.success(res, 200, "Node deleted successfully.", {});
  } catch (err) {
    next(err);
  }
};

module.exports = { createNode, getNodes, getNode, updateNode, deleteNode };
