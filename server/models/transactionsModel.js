const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  address: { type: String, required: true },
  to: { type: String, required: true },
  value: { type: String, required: true },
  blockNumber: { type: String, required: true },
  hash: { type: String, required: true, unique: true }, // Ensure hash is unique
  timeStamp: { type: String, required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;