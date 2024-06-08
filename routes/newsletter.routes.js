const express = require("express");
const router = express.Router();

const { ArticulosNewsletter, TipoArticulo } = require("../models/newsletter");

router.get("/articulos-newsletter", async (req, res) => {
  const data = await ArticulosNewsletter.findAll();
  res.send(data);
});

module.exports = router;
