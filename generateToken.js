const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const generateToken = (userId) => {
    const SECRET = process.env.SECRET; // Load secret from environment variables
    const token = jwt.sign({ _id: userId }, SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
    return token;
};

// Example usage with the new user ID from MongoDB
const userId = "67168877567182a108dbf967"; // Replace with the actual ID of the new user
const token = generateToken(userId);
console.log("Generated JWT:", token);