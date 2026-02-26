const promoService = require("../service/promo.service");

exports.validate = async (req, res) => {
  const { code, rechargeAmount } = req.body;

  const userId = req.user.id;

  const result = await promoService.validatePromo(code, rechargeAmount, userId);
  res.json(result);
};

exports.apply = async (req, res) => {
  const { code, rechargeAmount, transactionId } = req.body;
  const userId = req.user.id;
  const result = await promoService.applyPromo(
    code,
    rechargeAmount,
    userId,
    transactionId,
  );
  res.json(result);
};
