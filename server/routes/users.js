const express = require("express");
const {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  loginUser,
} = require("../controllers/userController.js"); // Check this path

const router = express.Router();

// Login a user
router.post("/signin", loginUser); // Ensure loginUser is defined

// GET all users
router.get("/", getUsers); // Ensure getUsers is defined

// GET a single user
router.get("/:id", getUser); // Ensure getUser is defined

// POST a new user
router.post("/signup", createUser); // Ensure createUser is defined

// DELETE a user
router.delete("/:id", deleteUser); // Ensure deleteUser is defined

// UPDATE a user
router.patch("/:id", updateUser); // Ensure updateUser is defined

module.exports = router;