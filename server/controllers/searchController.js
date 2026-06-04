const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

exports.searchProjects = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter required" });
    }

    const projects = await Project.find({
      members: req.user.id,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    })
      .populate("createdBy", "name email")
      .populate("members", "name email profilePicture");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchTasks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter required" });
    }

    const tasks = await Task.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    })
      .populate("assignedTo", "name email profilePicture")
      .populate("projectId", "name");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchMembers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter required" });
    }

    const members = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
