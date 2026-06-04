const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getHighPriorityTasks,
  getUpcomingDeadlines,
  getOverdueTasks,
} = require("../controllers/taskController");

const router = express.Router();

// Create task
router.post("/", authMiddleware, createTask);

// Get all tasks (with filters & pagination)
router.get("/", authMiddleware, getTasks);

// Get task by ID
router.get("/:id", authMiddleware, getTaskById);

// Update task
router.put("/:id", authMiddleware, updateTask);

// Delete task
router.delete("/:id", authMiddleware, deleteTask);

// Get high priority tasks
router.get("/priority/high", authMiddleware, getHighPriorityTasks);

// Get upcoming deadline tasks
router.get("/deadline/upcoming", authMiddleware, getUpcomingDeadlines);

// Get overdue tasks
router.get("/deadline/overdue", authMiddleware, getOverdueTasks);

module.exports = router;
