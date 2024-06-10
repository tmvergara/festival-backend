const db = require("aa-sqlite");
require("dotenv").config();

async function crearArtistas() {
  let existe = false;
  let res = null;

  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'Genero'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      "CREATE table Genero( id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(60));"
    );
    console.log("* Tabla: Género - Creada con exito.");
    console.log("Sembrando datos.");
    await db.run(`INSERT INTO Genero (nombre) VALUES
                ('Rock'),
                ('Pop'),
                ('R&B'),
                ('Hip-Hop'),
                ('Electronic')
                ;`); 
  }

  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name = 'Artista'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE table Artista( 
      idArtista INTEGER PRIMARY KEY AUTOINCREMENT, 
      nombre VARCHAR(60),
      fechaOrigen DATE,
      oyentesMensuales INTEGER,
      generoId INTEGER,
      activo BOOLEAN DEFAULT 1,
      FOREIGN KEY (generoId) REFERENCES Genero(id)
      );`
    );
    console.log("* Tabla: Artista - Creada con exito.");
    
    console.log("Sembrando datos.");
    await db.run(
      `INSERT INTO artista (nombre, fechaOrigen, oyentesMensuales, generoId, activo) VALUES
      ('Foo Fighters', '1994-10-17', 23000000, 1, 1),
      ('Måneskin', '2016-01-01', 22000000, 1, 1),
      ('The Weeknd', '2010-01-01', 75000000, 3, 1),
      ('Arctic Monkeys', '2002-01-01', 28000000, 1, 1),
      ('Kendrick Lamar', '2004-01-01', 32000000, 4, 1),
      ('Daft Punk', '1993-01-01', 18000000, 5, 1),
      ('Taylor Swift', '2006-01-01', 82000000, 2, 1),
      ('Calvin Harris', '2006-01-01', 35000000, 5, 1),
      ('Radiohead', '1985-01-01', 20000000, 1, 1),
      ('Billie Eilish', '2015-01-01', 45000000, 2, 1),`
    );
  }
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
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'TipoArticulos'",
    []
  );

  if (res.contar > 0) existe = true;
  if (!existe) {
    // Crear la tabla secundaria primero
    console.log("-> Creando tabla: TipoArticulos");
    await db.run(`CREATE TABLE TipoArticulo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(255),
    descripcion VARCHAR(255)
  );`);
    console.log("* Tabla: TipoArticulos - Creada con éxito.");
    console.log("Sembrando datos.");
    await db.run(`INSERT INTO TipoArticulo (nombre, descripcion) VALUES
    ('Noticias', 'Últimas noticias y actualizaciones del mundo de la música'),
    ('Novedades de Entradas', 'Información sobre nuevas entradas disponibles para festivales'),
    ('Sorteos', 'Participa y gana entradas y otros premios'),
    ('Promociones', 'Ofertas especiales y descuentos para eventos'),
    ('Artistas Destacados', 'Conoce a los artistas más destacados de los festivales');`);
  }

  // Crear la tabla primaria
  console.log("-> Creando tabla: ArticulosNewsletter");
  await db.run(`CREATE TABLE ArticulosNewsletter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo VARCHAR(255),
    tipoArticulo_id INTEGER,
    contenido TEXT,
    tiempoLectura INTEGER,
    fechaPublicacion DATE,
    activo BOOLEAN DEFAULT 1,
    FOREIGN KEY (tipoArticulo_id) REFERENCES TipoArticulo(id)
  );`);
  console.log("* Tabla: ArticulosNewsletter - Creada con éxito.");
  console.log("Sembrando datos.");
  await db.run(`INSERT INTO ArticulosNewsletter (titulo, tipoArticulo_id, contenido, tiempoLectura, fechaPublicacion, activo) VALUES
    ('Festival de Primavera: Nuevas Confirmaciones', 1, '<h1>Festival de Primavera</h1><p>¡Grandes noticias! Se han confirmado nuevas bandas para el Festival de Primavera. No te lo pierdas.</p>', 5, '2024-06-01', 1),
    ('Entradas Early Bird para el Festival de Verano', 2, '<h1>Entradas Early Bird</h1><p>Consigue tus entradas Early Bird para el Festival de Verano a un precio especial. Oferta válida hasta fin de mes.</p><img src="earlybird.jpg" alt="Entradas Early Bird">', 4, '2024-06-02', 1),
    ('Sorteo: Gana Entradas VIP', 3, '<h1>Gana Entradas VIP</h1><p>Participa en nuestro sorteo y gana entradas VIP para el Festival de Otoño. ¡No te lo pierdas!</p><img src="sorteo.jpg" alt="Sorteo VIP">', 3, '2024-06-03', 1),
    ('Descuento Especial en Merchandising', 4, '<h1>Descuento en Merchandising</h1><p>Obtén un 20% de descuento en todo el merchandising del Festival de Invierno.</p><img src="merchandising.jpg" alt="Descuento en Merchandising">', 2, '2024-06-04', 1),
    ('Artista Destacado: DJ Sunset', 5, '<h1>DJ Sunset</h1><p>Conoce a DJ Sunset, el artista destacado de esta semana. Lee su entrevista exclusiva y descubre más sobre su música.</p><img src="djsunset.jpg" alt="DJ Sunset">', 6, '2024-06-05', 1),
    ('Nuevas Medidas de Seguridad para Festivales', 1, '<h1>Medidas de Seguridad</h1><p>Conoce las nuevas medidas de seguridad que se implementarán en los próximos festivales para garantizar tu bienestar.</p>', 4, '2024-06-06', 1),
    ('Venta de Entradas para el Festival de Jazz', 2, '<h1>Festival de Jazz</h1><p>Las entradas para el Festival de Jazz ya están a la venta. ¡Asegura la tuya!</p><img src="jazz.jpg" alt="Festival de Jazz">', 3, '2024-06-07', 1),
    ('Sorteo: Conoce a tu Banda Favorita', 3, '<h1>Conoce a tu Banda Favorita</h1><p>Participa en nuestro sorteo y gana la oportunidad de conocer a tu banda favorita en el backstage.</p><img src="banda.jpg" alt="Conoce a tu Banda Favorita">', 5, '2024-06-08', 1),
    ('Promoción de 2x1 en Bebidas', 4, '<h1>Promoción 2x1</h1><p>Disfruta de una promoción de 2x1 en bebidas en el próximo festival. ¡Salud!</p><img src="bebidas.jpg" alt="Promoción 2x1 en Bebidas">', 2, '2024-06-09', 1),
    ('Artista Destacado: The Rockers', 5, '<h1>The Rockers</h1><p>Conoce a The Rockers, la banda destacada de esta semana. Descubre más sobre su historia y música.</p><img src="therockers.jpg" alt="The Rockers">', 6, '2024-06-10', 1),
    ('Nuevos Patrocinadores para el Festival de Música Electrónica', 1, '<h1>Patrocinadores</h1><p>Estamos emocionados de anunciar nuevos patrocinadores para el Festival de Música Electrónica. Descubre quiénes son.</p>', 4, '2024-06-11', 1);
  `);
}

async function CrearBaseSiNoExiste() {
  // abrir base, si no existe el archivo/base lo crea
  await db.open("./.data/festival.db");

  let existe = false;
  let res = null;

  // Arreglar con nuestra estructura
  // El siguiente pedazo se repite 4 veces para cada una de las tablas principales, se verifica si existe la tabla y sino se la crea
  // y se la siembre
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'ArticulosNewsletter'",
    []
  );

  if (res.contar > 0) existe = true;
  if (!existe) {
    crearNewsletter();
  }
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'Artista'",
    []
  );

  if (res.contar > 0) existe = true;
  if (!existe) {
    crearArtistas();
  }

  // cerrar la base
  //   db.close();
}

CrearBaseSiNoExiste();

module.exports = CrearBaseSiNoExiste;
