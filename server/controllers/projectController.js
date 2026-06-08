const Project = require("../models/Project");
const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");

exports.createProject = async (req, res) => {
  try {
    const { name, description, deadline, status } = req.body;

    const project = new Project({
      name,
      description,
      deadline,
      status, 
      createdBy: req.user.id,
      members: [req.user.id],
    });

    await project.save();

    // Log activity
    await ActivityLog.create({
      action: "created",
      description: `Project "${name}" created`,
      userId: req.user.id,
      projectId: project._id,
    });

    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { status, sort, page = 1, limit = 9 } = req.query;
    let filter = { members: req.user.id };
    let sortOption = { createdAt: -1 };

    if (status) filter.status = status;

    if (sort === "deadline") sortOption = { deadline: 1 };
    if (sort === "name") sortOption = { name: 1 };

    const skip = (page - 1) * limit;

    const projects = await Project.find(filter)
      .populate("createdBy", "name email")
      .populate("members", "name email profilePicture")
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortOption);

    const total = await Project.countDocuments(filter);

    res.json({
      projects,
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

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate("createdBy", "name email")
      .populate("members", "name email profilePicture");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, req.body, { new: true })
      .populate("createdBy", "name email")
      .populate("members", "name email profilePicture");

    await ActivityLog.create({
      action: "updated",
      description: `Project "${project.name}" updated`,
      userId: req.user.id,
      projectId: id,
    });

    res.json({ message: "Project updated", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    // Delete all tasks in this project
    await Task.deleteMany({ projectId: id });

    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.body;
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: memberId } },
      { new: true },
    ).populate("members", "name email profilePicture");

    // Notify member
    await Notification.create({
      userId: memberId,
      type: "member_added",
      title: "Added to Project",
      message: `You have been added to project "${project.name}"`,
      relatedTo: { type: "Project", id: projectId },
    });

    // Log activity
    await ActivityLog.create({
      action: "member_added",
      description: `Member added to "${project.name}"`,
      userId: req.user.id,
      projectId,
    });

    res.json({ message: "Member added", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.body;
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { members: memberId } },
      { new: true },
    ).populate("members", "name email profilePicture");

    res.json({ message: "Member removed", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    const totalTasks = await Task.countDocuments({ projectId });
    const completedTasks = await Task.countDocuments({
      projectId,
      status: "Completed",
    });
    const pendingTasks = await Task.countDocuments({
      projectId,
      status: { $ne: "Completed" },
    });

    const percentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    res.json({
      projectId,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionPercentage: percentage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
