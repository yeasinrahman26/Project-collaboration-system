const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const Task = require("../models/Task");

exports.addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comment = new Comment({
      taskId,
      userId: req.user.id,
      text,
    });

    await comment.save();
    await comment.populate("userId", "name email profilePicture");

    // Notify task assignee
    if (task.assignedTo && task.assignedTo.toString() !== req.user.id) {
      await Notification.create({
        userId: task.assignedTo,
        type: "comment_added",
        title: "New Comment",
        message: `Someone commented on task "${task.title}"`,
        relatedTo: { type: "Task", id: taskId },
      });
    }

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const comments = await Comment.find({ taskId })
      .populate("userId", "name email profilePicture")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments({ taskId });

    res.json({
      comments,
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
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (comment.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
