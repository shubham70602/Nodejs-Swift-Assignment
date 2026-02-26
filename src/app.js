const express = require("express");
const promoRoutes = require("./routes/promo.routes");
const app = express();
app.use(express.json());
app.use("/api/promos", promoRoutes);
module.exports = app;
