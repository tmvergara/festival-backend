const db = require("aa-sqlite");
const fs = require("fs");
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
      `INSERT INTO Artista (nombre, fechaOrigen, oyentesMensuales, generoId, activo) VALUES
  ('Foo Fighters', '1994-10-17', 23000000, 1, 1),
  ('Måneskin', '2016-01-01', 22000000, 1, 1),
  ('The Weeknd', '2010-01-01', 75000000, 3, 1),
  ('Arctic Monkeys', '2002-01-01', 28000000, 1, 1),
  ('Kendrick Lamar', '2004-01-01', 32000000, 4, 1),
  ('Daft Punk', '1993-01-01', 18000000, 5, 1),
  ('Taylor Swift', '2006-01-01', 82000000, 2, 1),
  ('Calvin Harris', '2006-01-01', 35000000, 5, 1),
  ('Radiohead', '1985-01-01', 20000000, 1, 1),
  ('Billie Eilish', '2015-01-01', 45000000, 2, 1);`
    );
  }
}

async function crearNewsletter() {
  let res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'TipoArticulo'",
    []
  );

  let existe = false;
  if (res.contar > 0) existe = true;
  if (!existe) {
    // Crear la tabla secundaria primero
    console.log("-> Creando tabla: TipoArticulo");
    await db.run(`CREATE TABLE TipoArticulo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(255),
    descripcion VARCHAR(255)
  );`);
    console.log("* Tabla: TipoArticulo - Creada con éxito.");
    console.log("Sembrando datos.");
    await db.run(`INSERT INTO TipoArticulo (nombre, descripcion) VALUES
    ('Noticias', 'Últimas noticias y actualizaciones del mundo de la música'),
    ('Novedades de Entradas', 'Información sobre nuevas entradas disponibles para festivales'),
    ('Sorteos', 'Participa y gana entradas y otros premios'),
    ('Promociones', 'Ofertas especiales y descuentos para eventos'),
    ('Artistas Destacados', 'Conoce a los artistas más destacados de los festivales');`);
  }

  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'ArticulosNewsletter'",
    []
  );

  existe = false;
  if (res.contar > 0) existe = true;
  if (!existe) {
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
    ('Festival de Primavera: Nuevas Confirmaciones', 1, '<h1>Festival de Primavera</h1><p>¡Grandes noticias! Se han confirmado nuevas bandas para el Festival de Primavera. No te lo pierdas.</p><ul><li>Banda 1</li><li>Banda 2</li><li>Banda 3</li></ul><p>Este año, el festival contará con más actividades y sorpresas para todos los asistentes. No olvides revisar el horario completo en nuestra página web.</p>', 5, '2024-06-01', 1),
    ('Entradas Early Bird para el Festival de Verano', 2, '<h1>Entradas Early Bird</h1><p>Consigue tus entradas Early Bird para el Festival de Verano a un precio especial. Oferta válida hasta fin de mes.</p><p>Beneficios de las entradas Early Bird:</p><ul><li>Descuento exclusivo</li><li>Acceso prioritario</li><li>Merchandising de regalo</li></ul><img src="https://via.placeholder.com/300x200?text=Entradas+Early+Bird" class="ml-auto mr-auto" alt="Entradas Early Bird">', 4, '2024-06-02', 1),
    ('Sorteo: Gana Entradas VIP', 3, '<h1>Gana Entradas VIP</h1><p>Participa en nuestro sorteo y gana entradas VIP para el Festival de Otoño. ¡No te lo pierdas!</p><ol><li>Regístrate en nuestra página web.</li><li>Comparte el evento en tus redes sociales.</li><li>Etiqueta a 3 amigos.</li></ol><img src="https://via.placeholder.com/300x200?text=Sorteo+VIP" class="ml-auto mr-auto" alt="Sorteo VIP">', 3, '2024-06-03', 1),
    ('Descuento Especial en Merchandising', 4, '<h1>Descuento en Merchandising</h1><p>Obtén un 20% de descuento en todo el merchandising del Festival de Invierno.</p><p>Artículos disponibles:</p><ul><li>Camisetas</li><li>Gorras</li><li>Pulseras</li><li>Posters</li></ul><img src="https://via.placeholder.com/300x200?text=Merchandising+Descuento" class="ml-auto mr-auto" alt="Descuento en Merchandising">', 2, '2024-06-04', 1),
    ('Artista Destacado: DJ Sunset', 5, '<h1>DJ Sunset</h1><p>Conoce a DJ Sunset, el artista destacado de esta semana. Lee su entrevista exclusiva y descubre más sobre su música.</p><p>Temas populares:</p><ol><li>Hit 1</li><li>Hit 2</li><li>Hit 3</li></ol><img src="https://via.placeholder.com/300x200?text=DJ+Sunset" class="ml-auto mr-auto" alt="DJ Sunset">', 6, '2024-06-05', 1),
    ('Nuevas Medidas de Seguridad para Festivales', 1, '<h1>Medidas de Seguridad</h1><p>Conoce las nuevas medidas de seguridad que se implementarán en los próximos festivales para garantizar tu bienestar.</p><p>Medidas destacadas:</p><ul><li>Control de acceso riguroso</li><li>Puestos de atención médica</li><li>Protocolos de emergencia</li><li>Seguridad adicional en las zonas de acampada</li></ul>', 4, '2024-06-06', 1),
    ('Venta de Entradas para el Festival de Jazz', 2, '<h1>Festival de Jazz</h1><p>Las entradas para el Festival de Jazz ya están a la venta. ¡Asegura la tuya!</p><p>Disfruta de los mejores artistas del jazz en un evento único:</p><ul><li>Artista 1</li><li>Artista 2</li><li>Artista 3</li></ul><img src="https://via.placeholder.com/300x200?text=Festival+de+Jazz" class="ml-auto mr-auto" alt="Festival de Jazz">', 3, '2024-06-07', 1),
    ('Sorteo: Conoce a tu Banda Favorita', 3, '<h1>Conoce a tu Banda Favorita</h1><p>Participa en nuestro sorteo y gana la oportunidad de conocer a tu banda favorita en el backstage.</p><p>Para participar:</p><ol><li>Compra tu entrada</li><li>Regístrate en el sorteo</li><li>Espera el anuncio de los ganadores</li></ol><img src="https://via.placeholder.com/300x200?text=Conoce+a+tu+Banda+Favorita" class="ml-auto mr-auto" alt="Conoce a tu Banda Favorita">', 5, '2024-06-08', 1),
    ('Promoción de 2x1 en Bebidas', 4, '<h1>Promoción 2x1</h1><p>Disfruta de una promoción de 2x1 en bebidas en el próximo festival. ¡Salud!</p><p>Bebidas incluidas:</p><ul><li>Cerveza</li><li>Vino</li><li>Refrescos</li><li>Cócteles</li></ul><img src="https://via.placeholder.com/300x200?text=Promoción+2x1+Bebidas" class="ml-auto mr-auto" alt="Promoción 2x1 en Bebidas">', 2, '2024-06-09', 1),
    ('Artista Destacado: The Rockers', 5, '<h1>The Rockers</h1><p>Conoce a The Rockers, la banda destacada de esta semana. Descubre más sobre su historia y música.</p><p>Álbumes más populares:</p><ol><li>Álbum 1</li><li>Álbum 2</li><li>Álbum 3</li></ol><img src="https://via.placeholder.com/300x200?text=The+Rockers" class="ml-auto mr-auto" alt="The Rockers">', 6, '2024-06-10', 1),
    ('Nuevos Patrocinadores para el Festival de Música Electrónica', 1, '<h1>Patrocinadores</h1><p>Estamos emocionados de anunciar nuevos patrocinadores para el Festival de Música Electrónica. Descubre quiénes son.</p><p>Patrocinadores:</p><ul><li>Empresa 1</li><li>Empresa 2</li><li>Empresa 3</li></ul>', 4, '2024-06-11', 1);
`);
  }
}

async function CrearBaseSiNoExiste() {
  // Verificar si la carpeta .data existe, si no, crearla
  if (!fs.existsSync("./.data")) {
    fs.mkdirSync("./.data");
  }

  // abrir base, si no existe el archivo/base lo crea
  await db.open("./.data/festival.db");

  let existe = false;
  let res = null;

  // Verificar y crear tablas
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'ArticulosNewsletter'",
    []
  );

  if (res.contar > 0) existe = true;
  if (!existe) {
    await crearNewsletter();
  }
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'Artista'",
    []
  );

  if (res.contar > 0) existe = true;
  if (!existe) {
    await crearArtistas();
  }

  // cerrar la base
  await db.close();
}

CrearBaseSiNoExiste();

module.exports = CrearBaseSiNoExiste;
