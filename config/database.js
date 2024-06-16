const db = require("aa-sqlite");
const fs = require("fs");
require("dotenv").config();

async function crearTabla(nombreTabla, scriptCreacion, scriptInsercion) {
  const res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= ?",
    [nombreTabla]
  );

  if (res.contar === 0) {
    await db.run(scriptCreacion);
    console.log(`* Tabla: ${nombreTabla} - Creada con éxito.`);
    console.log("Sembrando datos.");
    await db.run(scriptInsercion);
  }
}

async function crearArtistas() {
  await crearTabla(
    "Genero",
    `CREATE table Genero(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(60)
    );`,
    `INSERT INTO Genero (nombre) VALUES
      ('Rock'),
      ('Pop'),
      ('R&B'),
      ('Hip-Hop'),
      ('Electronic');`
  );

  await crearTabla(
    "Artista",
    `CREATE table Artista(
      idArtista INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(60),
      fechaOrigen DATE,
      oyentesMensuales INTEGER,
      generoId INTEGER,
      activo BOOLEAN DEFAULT 1,
      FOREIGN KEY (generoId) REFERENCES Genero(id)
    );`,
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

async function crearNewsletter() {
  await crearTabla(
    "TipoArticulo",
    `CREATE TABLE TipoArticulo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(255),
      descripcion VARCHAR(255)
    );`,
    `INSERT INTO TipoArticulo (nombre, descripcion) VALUES
      ('Noticias', 'Últimas noticias y actualizaciones del mundo de la música'),
      ('Novedades de Entradas', 'Información sobre nuevas entradas disponibles para festivales'),
      ('Sorteos', 'Participa y gana entradas y otros premios'),
      ('Promociones', 'Ofertas especiales y descuentos para eventos'),
      ('Artistas Destacados', 'Conoce a los artistas más destacados de los festivales');`
  );

  await crearTabla(
    "ArticulosNewsletter",
    `CREATE TABLE ArticulosNewsletter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo VARCHAR(255),
      tipoArticulo_id INTEGER,
      contenido TEXT,
      tiempoLectura INTEGER,
      fechaPublicacion DATE,
      activo BOOLEAN DEFAULT 1,
      FOREIGN KEY (tipoArticulo_id) REFERENCES TipoArticulo(id)
    );`,
    `INSERT INTO ArticulosNewsletter (titulo, tipoArticulo_id, contenido, tiempoLectura, fechaPublicacion, activo) VALUES
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
    ('Nuevos Patrocinadores para el Festival de Música Electrónica', 1, '<h1>Patrocinadores</h1><p>Estamos emocionados de anunciar nuevos patrocinadores para el Festival de Música Electrónica. Descubre quiénes son.</p><p>Patrocinadores:</p><ul><li>Empresa 1</li><li>Empresa 2</li><li>Empresa 3</li></ul>', 4, '2024-06-11', 1);`
  );
}

async function crearSponsors() {
  await crearTabla(
    "Rubro",
    `CREATE table Rubro(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100)
    );`,
    `INSERT INTO Rubro (nombre) VALUES
      ('Tecnología'),
      ('Automotriz'),
      ('Banca'),
      ('Alimentos'),
      ('Moda');`
  );

  await crearTabla(
    "Sponsor",
    `CREATE table Sponsor(
      idSponsor INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100),
      idRubro INTEGER,
      presupuestoContribuido INTEGER,
      fechaContrato DATE,
      activo BOOLEAN DEFAULT 1,
      FOREIGN KEY (idRubro) REFERENCES Rubro(id)
    );`,
    `INSERT INTO Sponsor (nombre, idRubro, presupuestoContribuido, fechaContrato, activo) VALUES
      ('Google', 1, 500000, '2022-01-01', 1),
      ('Toyota', 2, 750000, '2021-06-15', 1),
      ('Banco Santander', 3, 300000, '2023-03-20', 1),
      ('Nestlé', 4, 450000, '2022-09-10', 1),
      ('Nike', 5, 600000, '2021-11-25', 1),
      ('Microsoft', 1, 700000, '2023-05-05', 1),
      ('Ford', 2, 650000, '2022-07-18', 1),
      ('BBVA', 3, 400000, '2023-02-14', 1),
      ('Coca-Cola', 4, 550000, '2021-08-30', 1),
      ('Adidas', 5, 500000, '2022-12-01', 1);`
  );
}

async function crearStands() {
  await crearTabla(
    "TipologiaStand",
    `CREATE table TipologiaStand(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100),
      precioXMC FLOAT
    );`,
    `INSERT INTO TipologiaStand (nombre, precioXMC) VALUES
      ('VIP', 500.0),
      ('Premium', 300.0),
      ('General', 100.0);`
  );

  await crearTabla(
    "Stand",
    `CREATE table Stand(
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      nombre VARCHAR(60),
      tipologiaStand_id INTEGER,
      largo FLOAT,
      ancho FLOAT,
      descripcion TEXT,
      fechaInstalacion DATE,
      activo BOOLEAN DEFAULT 1,
      FOREIGN KEY (tipologiaStand_id) REFERENCES TipologiaStand(id)
    );`,
    `INSERT INTO Stand (nombre, tipologiaStand_id, largo, ancho, descripcion, fechaInstalacion, activo) VALUES
      ('Stand Google', 1, 12.0, 12.0, 'Stand VIP de Google con experiencias tecnológicas avanzadas', '2024-06-11', 1),
      ('Stand Toyota', 2, 10.0, 10.0, 'Stand Premium de Toyota con exhibición de vehículos híbridos', '2024-06-12', 1),
      ('Stand Santander', 3, 8.0, 8.0, 'Stand General de Santander con asesoría financiera gratuita', '2024-06-13', 1),
      ('Stand Nestle', 1, 15.0, 15.0, 'Stand VIP de Nestle con degustaciones gourmet', '2024-06-14', 1),
      ('Stand Nike', 2, 12.0, 12.0, 'Stand Premium de Nike con sesiones de entrenamiento en vivo', '2024-06-15', 1),
      ('Stand Microsoft', 3, 10.0, 10.0, 'Stand General de Microsoft con demos de software', '2024-06-16', 1),
      ('Stand Ford', 1, 20.0, 20.0, 'Stand VIP de Ford con pruebas de manejo exclusivas', '2024-06-17', 1),
      ('Stand BBVA', 2, 15.0, 15.0, 'Stand Premium de BBVA con consultas financieras personalizadas', '2024-06-18', 1),
      ('Stand Coca-Cola', 3, 12.0, 12.0, 'Stand General de Coca-Cola con promociones y regalos', '2024-06-19', 1),
      ('Stand Adidas', 1, 18.0, 18.0, 'Stand VIP de Adidas con lanzamientos de productos exclusivos', '2024-06-20', 1);`
  );
}

async function CrearBaseSiNoExiste() {
  if (!fs.existsSync("./.data")) {
    fs.mkdirSync("./.data");
  }

  await db.open("./.data/festival.db");

  await crearNewsletter();
  await crearArtistas();
  await crearSponsors();
  await crearStands();

  await db.close();
}

module.exports = CrearBaseSiNoExiste;
