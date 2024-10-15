const mongoose = require("mongoose");
const { Schema } = mongoose;

const PortfolioSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transactions",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", PortfolioSchema);
