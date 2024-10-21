const userModel = require("../models/userModel.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Create JWT token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Create a new user
const createUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate fields
  if (!email || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const user = new userModel({ email, password });
    user.password = await user.createHash(password); // Hash password
    await user.save();

    // Generate token
    const token = createToken(user._id);
    res.status(201).json({ email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate fields
  if (!email || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const passwordIsValid = await user.verifyPassword(password);
    if (!passwordIsValid) return res.status(401).json({ error: "Invalid password" });

    // Generate token
    const token = createToken(user._id);
    res.status(200).json({
      message: "Logged in successfully",
      id: user._id,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single user
const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  try {
    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ error: "No such user" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  try {
    const user = await userModel.findOneAndDelete({ _id: id });
    if (!user) return res.status(404).json({ error: "No such user" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  try {
    const user = await userModel.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true } // Return the updated document
    );
    if (!user) return res.status(404).json({ error: "No such user" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
};