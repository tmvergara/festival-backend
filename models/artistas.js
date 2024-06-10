const { sequelize } = require("../config/sequelize-init");
const { DataTypes } = require("sequelize");

const Artista = sequelize.define("Artista", {
  idArtista: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "Nombre es requerido",
      },
      len: {
        args: [5, 60],
        msg: "Nombre debe ser tipo caracteres, entre 5 y 60 de longitud",
      },
    },
    unique: {
      args: true,
      msg: "este Nombre ya existe en la tabla!",
    },
  },
  fechaOrigen: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: {
        args: true,
        msg: "Fecha origen es requerida",
      },
    },
  },
  oyentesMensuales: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        args: true,
        msg: "Oyentes mensuales es requerido",
      },
    },
  },
  generoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        args: true,
        msg: "Oyentes mensuales es requerido",
      },
    },
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

const Genero = sequelize.define("Genero", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = {
  Artista,
  Genero,
};

