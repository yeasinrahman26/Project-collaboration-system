const Task = require("../models/Task");
const Project = require("../models/Project");
const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");

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

    // Get project to populate projectMembers
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = new Task({
      title,
      description,
      projectId,
      assignedTo,
      priority,
      dueDate,
      projectMembers: project.members || [], // Add project members
    });

    await task.save();
    await task.populate("assignedTo", "name email profilePicture");
    await task.populate("projectMembers", "name email profilePicture");

    // Create activity log
    await ActivityLog.create({
      action: "created",
      description: `Task "${title}" created`,
      userId: req.user.id,
      projectId,
      taskId: task._id,
    });

    // Create notification
    if (assignedTo) {
      await Notification.create({
        userId: assignedTo,
        type: "task_assigned",
        title: "Task Assigned",
        message: `You have been assigned to task "${title}"`,
        relatedTo: { type: "Task", id: task._id },
      });
    }

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const {
      projectId,
      status,
      priority,
      assignedTo,
      sort,
      page = 1,
      limit = 10,
      myTasks = false,
      search = "",
    } = req.query;

    let filter = {};
    let sortOption = { createdAt: -1 };

    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    // search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // If myTasks is true, show only tasks assigned to current user
    if (myTasks === "true") {
      filter.assignedTo = req.user.id;
    } else if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (sort === "deadline") sortOption = { dueDate: 1 };
    if (sort === "priority") sortOption = { priority: -1 };
    if (sort === "updated") sortOption = { updatedAt: -1 };

    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email profilePicture")
      .populate("projectMembers", "name email profilePicture")
      .populate("projectId", "name")
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortOption);

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
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

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate("assignedTo", "name email profilePicture")
      .populate("projectMembers", "name email profilePicture")
      .populate("projectId", "name");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, projectId } = req.body;

    const task = await Task.findById(id);

    // Prevent reassigning completed tasks
    if (
      task.status === "Completed" &&
      assignedTo &&
      assignedTo !== task.assignedTo.toString()
    ) {
      return res
        .status(400)
        .json({ message: "Completed tasks cannot be reassigned" });
    }

    // If projectId is being updated, refresh projectMembers
    let updateData = req.body;
    if (projectId && projectId !== task.projectId.toString()) {
      const project = await Project.findById(projectId);
      updateData.projectMembers = project.members || [];
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("assignedTo", "name email profilePicture")
      .populate("projectMembers", "name email profilePicture");

    // Create activity log
    await ActivityLog.create({
      action: "updated",
      description: `Task "${task.title}" ${status ? `status changed to ${status}` : "updated"}`,
      userId: req.user.id,
      projectId: task.projectId,
      taskId: id,
    });

    // Create notification if assigned to someone
    if (assignedTo && assignedTo !== task.assignedTo?.toString()) {
      await Notification.create({
        userId: assignedTo,
        type: "task_assigned",
        title: "Task Assigned",
        message: `You have been assigned to task "${task.title}"`,
        relatedTo: { type: "Task", id },
      });
    }

    // Create notification if completed
    if (status === "Completed" && task.assignedTo) {
      await Notification.create({
        userId: task.assignedTo,
        type: "task_completed",
        title: "Task Completed",
        message: `Task "${task.title}" has been marked as completed`,
        relatedTo: { type: "Task", id },
      });
    }

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

exports.getHighPriorityTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      priority: "High",
      status: { $ne: "Completed" },
    })
      .populate("assignedTo", "name email profilePicture")
      .populate("projectMembers", "name email profilePicture")
      .populate("projectId", "name")
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUpcomingDeadlines = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      dueDate: { $gte: today, $lte: futureDate },
      status: { $ne: "Completed" },
    })
      .populate("assignedTo", "name email profilePicture")
      .populate("projectMembers", "name email profilePicture")
      .populate("projectId", "name")
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOverdueTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      dueDate: { $lt: new Date() },
      status: { $ne: "Completed" },
    })
      .populate("assignedTo", "name email profilePicture")
      .populate("projectMembers", "name email profilePicture")
      .populate("projectId", "name")
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
