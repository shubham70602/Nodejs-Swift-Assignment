const mongoose = require("mongoose");
const { type } = require("os");
const { ref } = require("process");
const promoUsageSchema = new mongoose.Schema(
  {
    promoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PromoCode",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    cashbackAmount: Number,
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("PromoUsage", promoUsageSchema);
