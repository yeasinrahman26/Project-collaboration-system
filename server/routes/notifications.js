const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// Get notifications
router.get("/", authMiddleware, getNotifications);

// Mark notification as read
router.put("/:id/read", authMiddleware, markAsRead);

// Mark all as read
router.put("/mark-all-read", authMiddleware, markAllAsRead);

// Delete notification
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
