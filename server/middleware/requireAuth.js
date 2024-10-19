const jwt = require("jsonwebtoken");
const process = require("process");
const userModel = require("../models/userModel.js");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  // Check if the authorization header exists
  if (!authorization) {
    console.log("Authorization header missing");
    return res.status(401).json({ error: "Authorization token required" });
  }

  // Extract the token from the header
  const token = authorization.split(" ")[1];
  console.log("Received token:", token);

  try {
    // Verify the token using the SECRET key
    const { _id } = jwt.verify(token, process.env.SECRET);
    console.log("Verified user ID:", _id);

    // Find the user in the database by their _id
    req.user = await userModel.findOne({ _id }).select("_id");
    if (!req.user) {
      console.log("User not found");
      return res.status(401).json({ error: "User not found" });
    }

    // Proceed to the next middleware if everything is correct
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;