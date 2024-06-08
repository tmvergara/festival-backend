require("./database");
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("sqlite:" + "./.data/festival.bd");

const Artistas = require("../models/artistas");

module.exports = { sequelize, Artistas };
