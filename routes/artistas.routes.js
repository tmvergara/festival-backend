const express = require("express");
const router = express.Router();

const { Artista, Genero } = require("../models/artistas");
const { sequelize } = require("../config/sequelize-init");

router.get("/artistas/generos", async (req, res) => {
  try {
    const data = await Genero.findAll();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      error: "Error al buscar en la BD.",
      msg: error,
    });
  }
});


// get, getById, post, put y delete.
router.get("/artistas", async (req, res) => {
  try {
    const data = await Artista.findAll();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      error: "Error al buscar en la BD.",
      msg: error,
    });
  }
});

router.get("/artistas/:id", async(req, res) => {
  const id = req.params.id
  try {
    const data = await Artista.findByPk(id);
    if (data) {
      return res.status(200).send(data);
    }
    else {
      return res.status(400).send({
        error: "No se encontro ningun elemento con ese ID.",
      });
    }
  } catch (error) {
    res.status(500).send({
      error: "Error al buscar en la BD.",
      msg: error,
    });
  }
});

router.post("/artistas", async (req, res) => {
  try {
    const data = await Artista.create({
      nombre: req.body.nombre,
      fechaOrigen: req.body.fechaOrigen,
      oyentesMensuales: req.body.oyentesMensuales,
      generoId: req.body.generoId
    });
    res.status(200).send(data);
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      res.status(400).json({
        error:
          "Error de clave foránea. Verifica que el generoId sea válido.",
      });
    } else {
      res
        .status(500)
        .json({ error: "Error al insertar en DB.", msg: error.message });
    }
  }
});

router.put("/artistas/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let artista = await Artista.findByPk(id);
    if (!artista) {
      return res.status(400).send({
        error: "No se encontro ningun elemento con ese ID.",
      });
    }
    artista.nombre = req.body.nombre;
    artista.fechaOrigen = req.body.fechaOrigen;
    artista.oyentesMensuales = req.body.oyentesMensuales;
    artista.generoId = req.body.generoId;
    artista.activo = req.body.activo;
    await artista.save();
    res.status(200).send(artista);
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      res.status(400).json({
        error:
          "Error de clave foránea. Verifica que el generoId sea válido.",
      });
    } else {
      res
        .status(500)
        .json({ error: "Error al insertar en DB.", msg: error.message });
    }
  }
});

router.delete("/artistas/:id", async(req, res) => {
  // Baja logica
  try {
    const [ affectedRows ] = await Artista.update(
      { activo: sequelize.literal("CASE WHEN activo = 1 THEN 0 ELSE 1 END")},
      { where: {idArtista: +req.params.id}}
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
