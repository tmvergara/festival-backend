const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.NODE_ENV === "test" ? ":memory:" : "./.data/festival.db", // Utiliza ':memory:' solo para tests
  logging: false,
});

module.exports = { sequelize };
