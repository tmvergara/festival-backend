require("./database");
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./.data/festival.db",
});

module.exports = { sequelize };
