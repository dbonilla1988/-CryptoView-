const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
  name: String,
  description: String,
  imageUrl: String,
});

const NFT = mongoose.model("NFT", nftSchema);
module.exports = NFT;
