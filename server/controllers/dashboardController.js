const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // User's projects
    const totalProjects = await Project.countDocuments({ members: userId });
    const activeProjects = await Project.countDocuments({
      members: userId,
      status: "Active",
    });
    const completedProjects = await Project.countDocuments({
      members: userId,
      status: "Completed",
    });

    // User's tasks
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Completed",
    });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
    });
    const inProgressTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "InProgress",
    });

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // Tasks by priority
    const highPriority = await Task.countDocuments({
      assignedTo: userId,
      priority: "High",
    });
    const mediumPriority = await Task.countDocuments({
      assignedTo: userId,
      priority: "Medium",
    });
    const lowPriority = await Task.countDocuments({
      assignedTo: userId,
      priority: "Low",
    });

    res.json({
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        overdue: overdueTasks,
      },
      priorityBreakdown: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({ members: userId })
      .select("name status deadline")
      .sort({ deadline: 1 });

    const projectSummary = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({
          projectId: project._id,
        });
        const completedTasks = await Task.countDocuments({
          projectId: project._id,
          status: "Completed",
        });
        const pendingTasks = totalTasks - completedTasks;
        const percentage =
          totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

        return {
          id: project._id,
          name: project.name,
          status: project.status,
          deadline: project.deadline,
          totalTasks,
          completedTasks,
          pendingTasks,
          completionPercentage: percentage,
        };
      }),
    );

    res.json(projectSummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMemberWorkload = async (req, res) => {
  try {
    const { memberId } = req.params;

    const totalTasks = await Task.countDocuments({ assignedTo: memberId });
    const completedTasks = await Task.countDocuments({
      assignedTo: memberId,
      status: "Completed",
    });
    const pendingTasks = totalTasks - completedTasks;

    res.json({
      memberId,
      totalTasks,
      completedTasks,
      pendingTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTaskStatusDistribution = async (req, res) => {
  try {
    const userId = req.user.id;

    const todo = await Task.countDocuments({
      assignedTo: userId,
      status: "Todo",
    });
    const inProgress = await Task.countDocuments({
      assignedTo: userId,
      status: "InProgress",
    });
    const completed = await Task.countDocuments({
      assignedTo: userId,
      status: "Completed",
    });

    res.json({
      Todo: todo,
      "In Progress": inProgress,
      Completed: completed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
