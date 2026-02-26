const mongoose = require("mongoose");
const { type } = require("os");

const promoCodeSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },

    minRechargeAmount: { type: Number, default: 0 },
    maxRechargeAmount: { type: Number, default: 100000 },
    isGlobal: { type: Boolean, default: true },
    allowedUsers: [{ type: mongoose.Schema.Types.ObjectId }],
    cashBackType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      required: true,
    },
    flatAmount: Number,
    percentage: Number,
    maxCashbackCap: Number,
    perUserLimit: { type: Number, default: 1 },
    totalUsageLimit: { type: Number, default: 1000 },
    currentToUsageLimit: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    validFrom: Date,
    validTill: Date,
  },
  { timestamps: true },
);
module.exports = mongoose.model("PromoCode", promoCodeSchema);
