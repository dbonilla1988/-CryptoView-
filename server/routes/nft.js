const express = require("express");
const { HttpProvider } = require('web3-providers-http');
const { Web3 } = require('web3');
const NFT = require("../models/NFT");
const fetch = require("node-fetch");
const router = express.Router();
require('dotenv').config();

// Initialize Web3 with Sepolia network via Infura
let web3;

try {
  const infuraProjectId = process.env.INFURA_PROJECT_ID;

  if (!infuraProjectId) {
    throw new Error("Missing INFURA_PROJECT_ID in environment variables");
  }

  const infuraNetwork = `https://sepolia.infura.io/v3/${infuraProjectId}`;
  const provider = new HttpProvider(infuraNetwork);
  web3 = new Web3(provider);

  console.log("Web3 initialized with Sepolia network in nft.js");

  // Test connection by retrieving the current block number
  web3.eth.getBlockNumber()
    .then(blockNumber => console.log(`Current block number: ${blockNumber}`))
    .catch(error => {
      console.error(`Error retrieving block number: ${error.message || error}`);
    });
} catch (error) {
  console.error("Failed to initialize Web3:", error.message || error);
}

// Endpoint for NFT Metadata Retrieval and Storage
router.post('/metadata', async (req, res) => {
  const { contractAddress, tokenId } = req.body;

  if (!contractAddress || !tokenId) {
    console.log("Contract address or token ID missing in request.");
    return res.status(400).send('Contract address and token ID are required.');
  }

  console.log(`Fetching metadata for contract: ${contractAddress}, token ID: ${tokenId}`);

  try {
    const ABI = [
      {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "tokenURI",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const contract = new web3.eth.Contract(ABI, contractAddress);
    const tokenURI = await contract.methods.tokenURI(tokenId).call();

    if (!tokenURI || typeof tokenURI !== "string") {
      console.log("Invalid or missing token URI.");
      return res.status(404).send('Token URI not found or invalid.');
    }

    console.log(`Token URI: ${tokenURI}`);
    
    const metadataResponse = await fetch(tokenURI);

    if (!metadataResponse.ok) {
      console.log(`Fetch Error: ${metadataResponse.status} - ${metadataResponse.statusText}`);
      throw new Error(`Failed to fetch metadata from token URI: ${metadataResponse.statusText}`);
    }

    const metadata = await metadataResponse.json();
    const { name, description, image } = metadata;

    if (!name || !description || !image) {
      console.log("Incomplete metadata retrieved from the token URI.");
      return res.status(400).send('Incomplete metadata retrieved from the token URI.');
    }

    console.log(`Metadata retrieved: ${name}, ${description}, ${image}`);

    const nft = new NFT({ contractAddress, tokenId, name, description, imageUrl: image });
    await nft.save();

    res.json({ name, description, image });

  } catch (error) {
    console.error(`Error retrieving NFT metadata: ${error.message}`);
    res.status(500).send(`Error retrieving NFT metadata: ${error.message}`);
  }
});

module.exports = router;