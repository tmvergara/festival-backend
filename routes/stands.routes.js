const express = require("express");
const router = express.Router();

const { Stand, TipologiaStand } = require("../models/stands");
const { sequelize } = require("../config/sequelize-init");

router.get("/stands/tipologia", async (req, res) => {
    try {
        const data = await TipologiaStand.findAll();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            error: "Error al buscar en la BD.",
            msg: error,
        });
    }
});

// get, getById, post, put y delete.
router.get("/stands", async (req, res) => {
    try {
        const data = await Stand.findAll();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            error: "Error al buscar en la BD.",
            msg: error,
        });
    }
});

router.get("/stands/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Stand.findByPk(id);
        if (data) {
            return res.status(200).send(data);
        }
        return res.status(400).send({
            error: "No se encontro ningun elemento con ese ID.",
        });
    } catch (error) {
        res.status(500).send({
            error: "Error al buscar en la BD.",
            msg: error,
        });
    }
});

router.post("/stands", async (req, res) => {
    try {
        const data = await Stand.create({
            id: req.body.id,
            nombre: req.body.nombre,
            tipologiaStand_id: req.body.tipologiaStand_id,
            largo: req.body.largo,
            ancho: req.body.ancho,
            descripcion: req.body.descripcion,
            fechaInstalacion: req.body.fechaInstalacion,
            activo: req.body.activo,
        });
        res.status(200).send(data);
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            res.status(400).json({
                error:
                    "Error de clave foránea. Verifica que el tipoArticulo_id sea válido.",
            });
        } else {
            res
                .status(500)
                .json({ error: "Error al insertar en DB.", msg: error.message });
        }
    }
});

router.put("/stands/:id", async (req, res) => {
    try {
        let stand = await Stand.findByPk(req.params.id);
        if (!stand) {
            return res.status(400).send({
                error: "No se encontro ningun elemento con ese ID.",
            });
        };

        stand.nombre = req.body.nombre;
        stand.tipologiaStand_id = req.body.tipologiaStand_id;
        stand.largo = req.body.largo;
        stand.ancho = req.body.ancho;
        stand.descripcion = req.body.descripcion;
        stand.fechaInstalacion = req.body.fechaInstalacion;
        stand.activo = req.body.activo;
        await stand.save();
        res.status(200).send(stand);
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            res.status(400).json({
                error:
                    "Error de clave foránea. Verifica que el tipologiaStand_id sea válido.",
            });
        } else {
            res
                .status(500)
                .json({ error: "Error al insertar en DB.", msg: error.message });
        }
    }
});

router.delete("/stands/:id", async (req, res) => {
    try {
        const [affectedRows] = await Stand.update(
            { activo: sequelize.literal("CASE WHEN activo = 1 THEN 0 ELSE 1 END") },
            { where: { id: +req.params.id } }
        );
        if (affectedRows === 0) {
            return res.status(400).send({
                error: "No se encontro ningun elemento con ese ID.",
            });
        }

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({
            error: "Se produjo un error al actualizar.",
            msg: error.message,
        });
    }
});

module.exports = router;
