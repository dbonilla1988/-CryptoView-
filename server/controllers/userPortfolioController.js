const PortfolioSchema = require("../models/userPortfolioModel.js");
const mongoose = require("mongoose");

const createPortfolio = async (req, res) => {
  const { id } = req.body;

  const user_id = req.user._id;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (!id) {
    return res
      .status(400)
      .json({ error: "Please provide an ID for the portfolio" });
  }

  try {
    let portfolio = await PortfolioSchema.findOne({ id });

    if (portfolio) {
      return res.status(200).json({ message: "Portfolio already exists" });
    }

    portfolio = await PortfolioSchema.create({
      id,
      user_id,
      transactions: [],
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserPortfolio = async (req, res) => {
  try {
    // 1. Identifier l'utilisateur connecté
    const userId = req.user.id;

    // 2. Utiliser l'identifiant de l'utilisateur pour filtrer les données
    const userFolio = await PortfolioSchema.find({ user_id: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(userFolio);
  } catch (error) {
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la récupération du portfolio de l'utilisateur.",
    });
  }
};

module.exports = { createPortfolio, getUserPortfolio };
