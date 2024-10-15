const express = require("express");
const {
  createPortfolio,
  getUserPortfolio,
} = require("../controllers/userPortfolioController.js");
const requireAuth = require("../middleware/requireAuth.js");

const router = express.Router();

router.use(requireAuth);

router.post("/", createPortfolio);

router.get("/", getUserPortfolio);

module.exports = router;