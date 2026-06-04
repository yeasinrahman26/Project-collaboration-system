const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  action: String,
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ActivityLog", activitySchema);
