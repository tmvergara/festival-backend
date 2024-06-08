const express = require("express");
const router = express.Router();

const db = require("../base-orm/sequelize-init");

router.get("/api/artistas", async (req, res) => {
    let data = await db.artistas.findAll()
})