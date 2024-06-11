const express = require("express");
const router = express.Router();

const { Sponsor, Rubro } = require("../models/sponsor");
const { sequelize } = require("../config/sequelize-init");

router.get("/rubros", async (req, res) => {
    try {
        const data = await Rubro.findAll();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            error: "Error al buscar en la BD.",
            msg: error,
        });
    }
});

// Rutas para Sponsor
router.get("/sponsors", async (req, res) => {
    try {
        const data = await Sponsor.findAll();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            error: "Error al buscar en la BD.",
            msg: error,
        });
    }
});

router.get("/sponsors/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Sponsor.findByPk(id);
        if (data) {
            return res.status(200).send(data);
        } else {
            return res.status(400).send({
                error: "No se encontró ningún elemento con ese ID.",
            });
        }
    } catch (error) {
        res.status(500).send({
            error: "Error al buscar en la BD.",
            msg: error,
        });
    }
});

router.post("/sponsors", async (req, res) => {
    try {
        const data = await Sponsor.create({
            nombre: req.body.nombre,
            idRubro: req.body.idRubro,
            presupuestoContribuido: req.body.presupuestoContribuido,
            fechaContrato: req.body.fechaContrato,
            activo: req.body.activo,
        });
        res.status(200).send(data);
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            res.status(400).json({
                error: "Error de clave foránea. Verifica que el idRubro sea válido.",
            });
        } else {
            res.status(500).json({ error: "Error al insertar en DB.", msg: error.message });
        }
    }
});

router.put("/sponsors/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let sponsor = await Sponsor.findByPk(id);
        if (!sponsor) {
            return res.status(400).send({
                error: "No se encontró ningún elemento con ese ID.",
            });
        }
        sponsor.nombre = req.body.nombre;
        sponsor.idRubro = req.body.idRubro;
        sponsor.presupuestoContribuido = req.body.presupuestoContribuido;
        sponsor.fechaContrato = req.body.fechaContrato;
        sponsor.activo = req.body.activo;
        await sponsor.save();
        res.status(200).send(sponsor);
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            res.status(400).json({
                error: "Error de clave foránea. Verifica que el idRubro sea válido.",
            });
        } else {
            res.status(500).json({ error: "Error al actualizar en DB.", msg: error.message });
        }
    }
});

router.delete("/sponsors/:id", async (req, res) => {
    try {
        const [affectedRows] = await Sponsor.update(
            { activo: sequelize.literal("CASE WHEN activo = 1 THEN 0 ELSE 1 END") },
            { where: { idSponsor: +req.params.id } }
        );
        if (affectedRows === 0) {
            return res.status(400).send({
                error: "No se encontró ningún elemento con ese ID.",
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
