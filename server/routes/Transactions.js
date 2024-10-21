const express = require("express");
const axios = require("axios");
const Transaction = require("../models/transactionsModel.js");
const requireAuth = require("../middleware/requireAuth.js");
const { MongoClient } = require("mongodb");
const Web3 = require("web3"); // Import Web3

const uri = "mongodb+srv://dbonilla1988:dcBAP52L2py9yOiO@cluster0.i6pld.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

const router = express.Router();
router.use(requireAuth); // Ensure user is authenticated

// Function to validate Ethereum address
const isValidEthereumAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

// API endpoint to track transactions
router.post("/track", async (req, res) => {
  const { address } = req.body;

  // Validate request body
  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  // Check if the address is valid
  if (!isValidEthereumAddress(address)) {
    return res.status(400).json({ error: "Invalid Ethereum address format" });
  }

  try {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    const etherscanUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`;

    // Fetch transaction data from Etherscan API
    const response = await axios.get(etherscanUrl);

    // Check for successful response
    if (response.data.status !== "1") {
      return res.status(400).json({ error: response.data.message });
    }

    // Get the last 5 transactions
    const lastFiveTransactions = response.data.result.slice(0, 5);

    // Store transactions in MongoDB
    const transactionPromises = lastFiveTransactions.map(async (tx) => {
      const newTransaction = {
        address: tx.from,
        to: tx.to,
        value: tx.value,
        blockNumber: tx.blockNumber,
        hash: tx.hash,
        timeStamp: tx.timeStamp,
      };

      // Upsert to avoid duplicate transactions
      await Transaction.updateOne(
        { hash: tx.hash }, // condition to find the document
        { $set: newTransaction }, // use $set to update fields without _id
        { upsert: true }
      );
    });

    await Promise.all(transactionPromises); // Wait for all upsert operations to complete

    // Respond with the last 5 transactions
    res.json(lastFiveTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    console.error("Full error:", error); // Log full error for more insight
    res.status(500).json({ error: "Internal server error" });
  }
});

// New endpoint to query transactions by address and date range
router.get("/query", async (req, res) => {
  const { address, startDate, endDate } = req.query;

  if (!address || !startDate || !endDate) {
    return res.status(400).json({ error: "Address and date range are required" });
  }

  try {
    const transactions = await Transaction.find({
      address: address,
      timeStamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New API endpoint to check token balance
router.get("/token-balance", async (req, res) => {
  const { contractAddress, walletAddress } = req.query;

  // Validate input
  if (!contractAddress || !walletAddress) {
    return res.status(400).json({ error: "Contract address and wallet address are required" });
  }

  if (!isValidEthereumAddress(contractAddress) || !isValidEthereumAddress(walletAddress)) {
    return res.status(400).json({ error: "Invalid address format" });
  }

  try {
    // Initialize Web3
    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_NETWORK));

    // ERC20 ABI
    const abi = [
      {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const tokenContract = new web3.eth.Contract(abi, contractAddress);
    const balance = await tokenContract.methods.balanceOf(walletAddress).call();
    
    // Convert the balance from Wei to the token's decimal representation
    const decimals = await tokenContract.methods.decimals().call();
    const formattedBalance = balance / (10 ** decimals); // Adjust for token decimals

    res.json({ balance: formattedBalance });
  } catch (error) {
    console.error("Error fetching token balance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Call the connectDB function when the module is loaded
connectDB();

module.exports = router;