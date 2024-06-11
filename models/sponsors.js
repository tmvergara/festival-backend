const { sequelize } = require("../config/sequelize-init");
const { DataTypes } = require("sequelize");

const Sponsor = sequelize.define("Sponsor", {
    idSponsor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Nombre es requerido",
            },
            len: {
                args: [5, 100],
                msg: "Nombre debe ser entre 5 y 100 caracteres",
            },
        },
        unique: {
            args: true,
            msg: "Este Nombre ya existe en la tabla!",
        },
    },
    idRubro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "Rubro es requerido",
            },
        },
    },
    presupuestoContribuido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "Presupuesto Contribuido es requerido",
            },
        },
    },
    fechaContrato: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "Fecha de Contrato es requerida",
            },
        },
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
},
    {
        tableName: "Sponsors",
        timestamps: false,
    });

const Rubro = sequelize.define("Rubro", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
    {
        tableName: "Rubro",
        timestamps: false,
    });

Sponsor.belongsTo(Rubro, { foreignKey: 'idRubro', as: 'rubro' });

module.exports = {
    Sponsor,
    Rubro,
};