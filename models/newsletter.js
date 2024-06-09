const { sequelize } = require("../config/sequelize-init");
const { DataTypes } = require("sequelize");

const TipoArticulo = sequelize.define(
  "TipoArticulo",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "TipoArticulo",
    timestamps: false,
  }
);

const ArticulosNewsletter = sequelize.define(
  "ArticulosNewsletter",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipoArticulo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TipoArticulo, // Nombre del modelo con el que está relacionada la FK
        key: "id",
      },
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tiempoLectura: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fechaPublicacion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "ArticulosNewsletter",
    timestamps: false,
  }
);

TipoArticulo.hasMany(ArticulosNewsletter, {
  foreignKey: "tipoArticulo_id",
});
ArticulosNewsletter.belongsTo(TipoArticulo, {
  foreignKey: "tipoArticulo_id",
});

module.exports = {
  TipoArticulo,
  ArticulosNewsletter,
};
