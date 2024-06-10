const express = require("express");
const router = express.Router();

const { ArticulosNewsletter, TipoArticulo } = require("../models/newsletter");
const { sequelize } = require("../config/sequelize-init");

router.get("/articulos-newsletter/tipos", async (req, res) => {
  try {
    const data = await TipoArticulo.findAll();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      error: "Error al buscar en la BD.",
      msg: error,
    });
  }
});

// get, getById, post, put y delete.
router.get("/articulos-newsletter", async (req, res) => {
  try {
    const data = await ArticulosNewsletter.findAll();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      error: "Error al buscar en la BD.",
      msg: error,
    });
  }
});

router.get("/articulos-newsletter/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await ArticulosNewsletter.findByPk(id);
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

router.post("/articulos-newsletter", async (req, res) => {
  try {
    const data = await ArticulosNewsletter.create({
      titulo: req.body.titulo,
      tipoArticulo_id: req.body.tipoArticulo_id,
      contenido: req.body.contenido,
      tiempoLectura: req.body.tiempoLectura,
      fechaPublicacion: req.body.fechaPublicacion,
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

router.put("/articulos-newsletter/:id", async (req, res) => {
  try {
    let articulo = await ArticulosNewsletter.findByPk(req.params.id);
    if (!articulo) {
      return res.status(400).send({
        error: "No se encontro ningun elemento con ese ID.",
      });
    }

    articulo.titulo = req.body.titulo;
    articulo.tipoArticulo_id = req.body.tipoArticulo_id;
    articulo.contenido = req.body.contenido;
    articulo.tiempoLectura = req.body.tiempoLectura;
    articulo.fechaPublicacion = req.body.fechaPublicacion;
    articulo.activo = req.body.activo;
    await articulo.save();
    res.status(200).send(articulo);
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

router.delete("/articulos-newsletter/:id", async (req, res) => {
  // Baja lógica
  try {
    const [affectedRows] = await ArticulosNewsletter.update(
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
