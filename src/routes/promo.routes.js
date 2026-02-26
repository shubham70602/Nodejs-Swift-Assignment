const express = require("express");
const router = express.Router();

const promoController = require("../controllers/promo.controller");
const authMiddleware = require("../middlewares/auth.middleware");
router.post("/validate", authMiddleware, promoController.validate);
router.post("/apply", authMiddleware, promoController.apply);

module.exports = router;
