const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: [
      "task_assigned",
      "task_completed",
      "project_created",
      "comment_added",
      "member_added",
    ],
    required: true,
  },
  title: String,
  message: String,
  relatedTo: {
    type: { type: String, enum: ["Task", "Project", "User"] },
    id: mongoose.Schema.Types.ObjectId,
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
