const { Sequelize } = require("sequelize");
const db = require("aa-sqlite");
require("dotenv").config();

async function crearArtistas() {
  console.log("-> Creando tabla: ");
  await db.run("ACA LA CONSULTA SQL");
  console.log("* Tabla: NOMBRE TABLA - Creada con exito.");
  console.log("Sembrando datos.");
  await db.run("ACA LA CONSULTA PARA INSERTAR DATOS");
}

async function crearStands() {
  console.log("-> Creando tabla: ");
  await db.run("ACA LA CONSULTA SQL");
  console.log("* Tabla: NOMBRE TABLA - Creada con exito.");
  console.log("Sembrando datos.");
  await db.run("ACA LA CONSULTA PARA INSERTAR DATOS");
}

async function crearSponsors() {
  console.log("-> Creando tabla: ");
  await db.run("ACA LA CONSULTA SQL");
  console.log("* Tabla: NOMBRE TABLA - Creada con exito.");
  console.log("Sembrando datos.");
  await db.run("ACA LA CONSULTA PARA INSERTAR DATOS");
}

async function crearNewsletter() {
  //Se debe repetir el codigo para la tabla secundaria ahi adentro tambien
  console.log("-> Creando tabla: ");
  await db.run("ACA LA CONSULTA SQL");
  console.log("* Tabla: NOMBRE TABLA - Creada con exito.");
  console.log("Sembrando datos.");
  await db.run("ACA LA CONSULTA PARA INSERTAR DATOS");
}

async function CrearBaseSiNoExiste() {
  // abrir base, si no existe el archivo/base lo crea
  await db.open("./.data/festival.db");

  let existe = false;
  let res = null;

  //Arreglar con nuestra estructura
  //   res = await db.get(
  //     "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'usuarios'",
  //     []
  //   );

  if (res.contar > 0) existe = true;
  if (!existe) {
    crearArtistas();
    crearStands();
    crearSponsors();
    crearNewsletter();
  }

  // cerrar la base
  db.close();
}

CrearBaseSiNoExiste();

module.exports = CrearBaseSiNoExiste;
