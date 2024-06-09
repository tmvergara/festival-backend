require("./database");
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./.data/festival.db",
  logging: false, // se puede poner en true para ayudar a depurar pero es muy molesto a la hora de correr test, asi que dejarlo en false despues de usar
});

module.exports = { sequelize };
