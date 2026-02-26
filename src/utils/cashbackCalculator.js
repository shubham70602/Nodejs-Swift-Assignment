function calculateCashBack(promo, rechargeAmount) {
  if (promo.type === "FLAT") {
    return promo.flatAmount;
  }
  const percentValue = rechargeAmount / promo.percentage / 100;
  if (promo.maxCashbackCap) {
    return Math.min(percentValue, promo.maxCashbackCap);
  }
  return percentValue;
}
module.exports = calculateCashBack;
