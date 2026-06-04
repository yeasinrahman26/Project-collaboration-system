const express = require("express");
const { authMiddleware, roleCheck } = require("../middleware/auth");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addMember,
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);
router.post("/add-member", authMiddleware, addMember);

module.exports = router;
