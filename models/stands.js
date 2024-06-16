const { sequelize } = require("../config/sequelize-init");
const { DataTypes } = require("sequelize");

const TipologiaStand = sequelize.define("TipologiaStand", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "Por favor, ingrese el nombre del tipo de stand",
            },
        },
    },
    precioXMC: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "Por favor, ingrese el precio por metro cuadrado para este tipo de stand",
            },
        },
    },
},
    {
        tableName: "TipologiaStand",
        timestamps: false,
    }
);

const Stand = sequelize.define("Stand", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "Por favor, ingrese un nombre para el stand",
            },
        },
    },
    tipologiaStand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "Por favor, ingrese el id de la tipología para el stand",
            },
        },
        references: {
            model: TipologiaStand, // Nombre del modelo con el que está relacionada la FK
            key: "id",
        },
    },
    largo: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "Por favor, ingrese el largo del stand",
            },
        },
    },
    ancho: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "Por favor, ingrese el ancho del stand",
            },
        },
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    fechaInstalacion: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: "Por favor, ingrese la fecha de instalación del stand",
            },
        },
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        validate: {
            notNull: {
                args: true,
                msg: "Por favor, ingrese si el staqnd está activo o no",
            },
        },
    }
},
    {
        tableName: "Stand",
        timestamps: false,
    }
)

TipologiaStand.hasMany(Stand, {
    foreignKey: "tipologiaStand_id",
});
Stand.belongsTo(TipologiaStand, {
    foreignKey: "tipologiaStand_id",
});

module.exports = {
    Stand,
    TipologiaStand
}
