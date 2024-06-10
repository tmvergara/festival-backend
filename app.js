const express = require("express");
const db = require("./config/sequelize-init");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const newsletterRouter = require("./routes/newsletter.routes");
app.use("/api", newsletterRouter);

// Sincronización de la base de datos
db.sequelize.sync().catch((err) => {
  console.error("Unable to connect to the database:", err);
});

module.exports = app;
