const mongoose = require("mongoose");
const PromoCode = require("../models/promoCode.model");
const PromoUsage = require("../models/promoUsage.model");
const calculateCashback = require("../utils/cashBackCalculator");

async function validatePromo(code, rechargeAmount, userId) {
  const promo = await PromoCode.findOne({ code });

  if (!promo || !promo.isActive) {
    return { valid: false, message: "Invalid or inactive promo code" };
  }
  const now = new Date();

  if (now < promo.validFrom || now > promo.validTill) {
    return { valid: false, message: "Promo code is expired" };
  }
  if (
    rechargeAmount < promo.minRechargeAmount ||
    rechargeAmount > promo.maxRechargeAmount
  ) {
    return { valid: false, message: "Recharge amount not eligible" };
  }

  if (!promo.isGlobal && !promo.allowedUsers.includes(userId)) {
    return { valid: false, message: "User not eligible for this promo" };
  }

  if (promo.currentToUsageLimit >= promo.totalUsageLimit) {
    return { valid: false, message: "Promo code usage exhausted" };
  }

  const userUsageCount = await PromoUsage.countDocuments({
    promoId: promo._id,
    userId,
  });

  if (userUsageCount >= promo.perUserLimit)
    return { valid: false, message: "User limit exceeded" };

  const cashback = calculateCashback(promo, rechargeAmount);

  return { valid: true, cashback };
}

async function applyPromo(code, rechargeAmount, userId, transactionId) {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const validation = await validatePromo(code, rechargeAmount, userId);

    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const promo = await PromoCode.findOneAndUpdate(
      {
        code,

        currentTotalUsage: { $lt: validation.totalUsageLimit },
      },

      { $inc: { currentTotalUsage: 1 } },

      { new: true, session },
    );

    if (!promo) throw new Error("Promo exhausted");

    await PromoUsage.create(
      [
        {
          promoId: promo._id,

          userId,

          transactionId,

          cashbackAmount: validation.cashback,
        },
      ],

      { session },
    );

    await session.commitTransaction();

    return { success: true, cashback: validation.cashback };
  } catch (err) {
    await session.abortTransaction();

    return { success: false, message: err.message };
  } finally {
    session.endSession();
  }
}

module.exports = {
  validatePromo,

  applyPromo,
};
