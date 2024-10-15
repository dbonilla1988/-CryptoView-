const express = require("express");
const {
  createTransaction,
  getTransactions,
} = require("../controllers/transactionsController.js");
const requireAuth = require("../middleware/requireAuth.js");

const router = express.Router();

router.use(requireAuth);

router.post("/", createTransaction);

router.get("/", getTransactions);

module.exports = router;
