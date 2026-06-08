const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  projectMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },

  status: {
    type: String,
    enum: ["Todo", "InProgress", "Completed"],
    default: "Todo",
  },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index for duplicate check
taskSchema.index({ projectId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model("Task", taskSchema);
