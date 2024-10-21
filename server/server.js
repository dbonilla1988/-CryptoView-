const express = require("express");
const dotenv = require("dotenv");
const workoutRoutes = require("./routes/workouts.js");
const usersRoutes = require("./routes/users.js");
const transactionsRoutes = require("./routes/Transactions.js");
const userPortfolio = require("./routes/userPortfolio.js");
const nftRoutes = require("./routes/nft.js");  
const tokenRoutes = require("./routes/tokenRoutes.js");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

// Check for missing essential environment variables
if (!process.env.INFURA_PROJECT_ID || !process.env.MONG_URI || !process.env.SECRET) {
  console.error("Missing environment variables.");
  process.exit(1);
}

// Initialize express app
const app = express();

// CORS configuration
app.use(cors({ origin: ["http://localhost:5173", "https://api.coingecko.com/"] }));

// Middleware to parse JSON
app.use(express.json());

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.path}`);
  next();
});

// Register routes
app.use("/api/workouts/", workoutRoutes);
app.use("/api/portfolio/", userPortfolio);
app.use("/api/transactions/", transactionsRoutes);
app.use("/api/users/", usersRoutes);
app.use("/api/nft/", nftRoutes); 
app.use("/api", tokenRoutes);

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONG_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const port = process.env.PORT || 5001;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });