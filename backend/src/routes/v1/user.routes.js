const express = require("express");
const { getAllUsers, updateUserRole, deleteUser } = require("../../controllers/user.controller");
const { protect, restrictTo } = require("../../middleware/auth.middleware");

const router = express.Router();

// All routes here require authentication AND the admin role
router.use(protect, restrictTo("admin"));

router.get("/",                getAllUsers);
router.patch("/:id/role",      updateUserRole);
router.delete("/:id",          deleteUser);

module.exports = router;
