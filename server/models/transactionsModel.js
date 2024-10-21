const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  address: { type: String, required: true },
  to: { type: String, required: true },
  value: { type: String, required: true },
  blockNumber: { type: String, required: true },
  hash: { type: String, required: true, unique: true }, // Make hash unique to avoid duplicates
  timeStamp: { type: String, required: true },
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;