const express = require("express");
const router = express.Router();

const { Artistas } = require("../models/artistas");

router.get("/artistas", async (req, res) => {
  let data = await Artistas.findAll();
});

module.exports = router;
