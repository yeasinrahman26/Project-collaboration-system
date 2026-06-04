const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const ActivityLog = require("../models/ActivityLog");

const router = express.Router();

// Get recent activities
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const activities = await ActivityLog.find()
      .populate("userId", "name email profilePicture")
      .populate("projectId", "name")
      .populate("taskId", "title")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ timestamp: -1 });

    const total = await ActivityLog.countDocuments();

    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
