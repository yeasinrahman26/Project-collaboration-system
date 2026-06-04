const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  searchProjects,
  searchTasks,
  searchMembers,
} = require("../controllers/searchController");

const router = express.Router();

// Search projects
router.get("/projects", authMiddleware, searchProjects);

// Search tasks
router.get("/tasks", authMiddleware, searchTasks);

// Search members
router.get("/members", authMiddleware, searchMembers);

module.exports = router;
