const express = require("express");
const { authMiddleware, roleCheck } = require("../middleware/auth");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectStats,
} = require("../controllers/projectController");

const router = express.Router();

// Create project (Admin & ProjectManager only)
router.post(
  "/",
  authMiddleware,
  roleCheck(["Admin", "ProjectManager"]),
  createProject,
);

// Get all projects
router.get("/", authMiddleware, getProjects);

// Get project by ID
router.get("/:id", authMiddleware, getProjectById);

// Update project
router.put(
  "/:id",
  authMiddleware,
  roleCheck(["Admin", "ProjectManager"]),
  updateProject,
);

// Delete project
router.delete(
  "/:id",
  authMiddleware,
  roleCheck(["Admin", "ProjectManager"]),
  deleteProject,
);

// Add member to project
router.post(
  "/add-member",
  authMiddleware,
  roleCheck(["Admin", "ProjectManager"]),
  addMember,
);

// Remove member from project
router.post(
  "/remove-member",
  authMiddleware,
  roleCheck(["Admin", "ProjectManager"]),
  removeMember,
);

// Get project stats
router.get("/:projectId/stats", authMiddleware, getProjectStats);

module.exports = router;
