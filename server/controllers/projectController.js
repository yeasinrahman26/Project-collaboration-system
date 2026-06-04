const Project = require("../models/Project");
const ActivityLog = require("../models/ActivityLog");

exports.createProject = async (req, res) => {
  try {
    const { name, description, deadline } = req.body;

    const project = new Project({
      name,
      description,
      deadline,
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
    const projects = await Project.find({ members: req.user.id }).populate(
      "members",
    );
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
    });

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
    await Project.findByIdAndDelete(id);
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
    ).populate("members");

    res.json({ message: "Member added", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
