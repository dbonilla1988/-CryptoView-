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
    console.log("User ID from token:", _id); // Log the user ID

    // Find the user in the database by their _id
    const user = await userModel.findById(_id); // Lookup user by ID
    console.log("User found in database:", user); // Log the user found

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "User not found" });
    }

    // Attach user to request object
    req.user = user;

    // Proceed to the next middleware if everything is correct
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;