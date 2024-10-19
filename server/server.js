const express = require("express");
const dotenv = require("dotenv");
const workoutRoutes = require("./routes/workouts.js");
const usersRoutes = require("./routes/users.js");
const transactionsRoutes = require("./routes/Transactions.js");
const userPortfolio = require("./routes/userPortfolio.js");
const nftRoutes = require("./routes/nft.js");  // Register NFT routes
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();  // Load environment variables

// Check for missing essential environment variables
if (!process.env.INFURA_PROJECT_ID) {
  console.error("Missing INFURA_PROJECT_ID in environment variables.");
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment variables.");
  process.exit(1);
}

if (!process.env.SECRET) {
  console.error("Missing SECRET in environment variables.");
  process.exit(1);
}

// Initialize express
const app = express();

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173", "https://api.coingecko.com/"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

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
app.use("/api/nft/", nftRoutes); // Register the NFT route

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message || error);
  });