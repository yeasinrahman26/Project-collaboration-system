const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  getDashboardStats,
  getProjectSummary,
  getMemberWorkload,
  getTaskStatusDistribution,
} = require("../controllers/dashboardController");

const router = express.Router();

// Get dashboard stats
router.get("/stats", authMiddleware, getDashboardStats);

// Get project summary
router.get("/projects-summary", authMiddleware, getProjectSummary);

// Get member workload
router.get("/member/:memberId/workload", authMiddleware, getMemberWorkload);

// Get task status distribution
router.get("/task-distribution", authMiddleware, getTaskStatusDistribution);

module.exports = router;
