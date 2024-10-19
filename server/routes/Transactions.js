const express = require("express");
const axios = require("axios"); // Axios to interact with Etherscan API
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth.js");
const router = express.Router();

router.use(requireAuth);

// Import your Transaction model
const Transaction = require("../models/transactionsModel");

// API to get last 5 transactions for an Ethereum address
router.post("/track", async (req, res) => {
  const { address } = req.body;

  console.log("Received address:", address);  // Log received address

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    // Fetch data from Etherscan API
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    console.log("Etherscan API Key:", etherscanApiKey);  // Log API Key for debugging

    const etherscanUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`;
    console.log("Etherscan URL:", etherscanUrl);  // Log the full Etherscan URL

    const response = await axios.get(etherscanUrl);
    console.log("Etherscan Response Data:", response.data);  // Log response from Etherscan

    if (response.data.status !== "1") {
      console.log("Failed to retrieve transactions:", response.data.message);
      return res.status(400).json({ error: `Failed to retrieve transactions: ${response.data.message}` });
    }

    // Get the last 5 transactions
    const lastFiveTransactions = response.data.result.slice(0, 5);
    console.log("Last 5 transactions:", lastFiveTransactions);  // Log last 5 transactions

    // Store transactions in MongoDB, ensuring the hash is unique to avoid duplicate entries
    for (let tx of lastFiveTransactions) {
      try {
        const newTransaction = new Transaction({
          address: tx.from,
          to: tx.to,
          value: tx.value,
          blockNumber: tx.blockNumber,
          hash: tx.hash,
          timeStamp: tx.timeStamp,
        });

        // Use upsert to avoid duplicate key error on unique 'hash'
        await Transaction.updateOne({ hash: tx.hash }, newTransaction, { upsert: true });
        console.log("Transaction upserted:", newTransaction);  // Log upserted transaction
      } catch (error) {
        console.error("Error saving transaction to MongoDB:", error.message);
        return res.status(500).json({ error: `Error saving transaction to MongoDB: ${error.message}` });
      }
    }

    // Return the transactions to the user
    res.json(lastFiveTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error.message || error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

// Fetch transactions from MongoDB
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ timeStamp: -1 });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions from MongoDB:", error.message);
    res.status(500).json({ error: `Failed to fetch transactions: ${error.message}` });
  }
});

module.exports = router;