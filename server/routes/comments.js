const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

// Add comment to task
router.post("/:taskId/comments", authMiddleware, addComment);

// Get comments for task
router.get("/:taskId/comments", authMiddleware, getComments);

// Delete comment
router.delete("/:commentId", authMiddleware, deleteComment);

module.exports = router;
