const Task = require("../models/Task");
const Project = require("../models/Project");
const ActivityLog = require("../models/ActivityLog");

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } =
      req.body;

    // Validate deadline
    if (new Date(dueDate) < new Date()) {
      return res
        .status(400)
        .json({ message: "Please select a valid deadline" });
    }

    // Check duplicate
    const existingTask = await Task.findOne({ projectId, title });
    if (existingTask) {
      return res
        .status(400)
        .json({ message: "This task already exists in the project" });
    }

    const task = new Task({
      title,
      description,
      projectId,
      assignedTo,
      priority,
      dueDate,
    });

    await task.save();

    await ActivityLog.create({
      action: "created",
      description: `Task "${title}" created`,
      userId: req.user.id,
      projectId,
      taskId: task._id,
    });

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;
    let filter = {};

    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).populate("assignedTo");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    const task = await Task.findById(id);

    // Prevent reassigning completed tasks
    if (task.status === "Completed" && assignedTo !== task.assignedTo) {
      return res
        .status(400)
        .json({ message: "Completed tasks cannot be reassigned" });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    await ActivityLog.create({
      action: "updated",
      description: `Task "${task.title}" updated to ${status}`,
      userId: req.user.id,
      projectId: task.projectId,
      taskId: id,
    });

    res.json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
