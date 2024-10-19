const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const generateToken = (userId) => {
    const SECRET = process.env.SECRET; // Load secret from environment variables
    const token = jwt.sign({ _id: userId }, SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
    return token;
};

// Example usage with the user ID from MongoDB
const userId = "671405a050813e3372d8975c"; // Update this with your actual user ID
const token = generateToken(userId);
console.log("Generated JWT:", token);