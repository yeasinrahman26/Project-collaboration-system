const express = require("express");
const {
  signup,
  login,
  updateProfilePicture,
  getProfile,
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/authController");
const { authMiddleware, roleCheck } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/profile-picture", authMiddleware, updateProfilePicture);
router.get("/profile", authMiddleware, getProfile);
router.get("/users", authMiddleware, roleCheck(["Admin"]), getAllUsers);

router.put("/users/:userId", authMiddleware, updateUser);
router.delete(
  "/users/:userId",
  authMiddleware,
  roleCheck(["Admin"]),
  deleteUser,
);

module.exports = router;
