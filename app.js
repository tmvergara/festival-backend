const express = require("express");
const db = require("./config/sequelize-init");
const { ArticulosNewsletter } = require("./models/newsletter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const newsletterRouter = require("./routes/newsletter.routes");
app.use("/api", newsletterRouter);

db.sequelize
  .sync()
  .then((result) => {
    //console.log(result);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
