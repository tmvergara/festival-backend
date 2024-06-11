const express = require("express");
const db = require("./config/sequelize-init");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const newsletterRouter = require("./routes/newsletter.routes");
app.use("/api", newsletterRouter);
const artistasRouter = require("./routes/artistas.routes")
app.use("/api", artistasRouter)
const standsRouter = require("./routes/stands.routes")
app.use("/api", standsRouter)

// Sincronización de la base de datos
db.sequelize.sync().catch((err) => {
  console.error("Unable to connect to the database:", err);
});

module.exports = app;
