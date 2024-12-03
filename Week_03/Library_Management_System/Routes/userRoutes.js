const express = require("express");
const router = express.Router();

const {
  registerUser,
  getAllUsers,
  loginUser,
  logoutUser,
} = require("../Controllers/userControllers");
const { protect, adminRoleAuth } = require("../Middlewares/authMiddleware");

router.post("/register", protect, adminRoleAuth, registerUser);
router.get("/users", protect, adminRoleAuth, getAllUsers);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
//borrow book
//view load history
//search book
//login book
module.exports = router;
