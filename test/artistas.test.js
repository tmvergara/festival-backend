const request = require("supertest");
const app = require("../app");
const { Artista, Genero } = require("../models/artistas");
const { sequelize } = require("../config/sequelize-init");

beforeAll(async () => {
    jest.spyOn(console, "log").mockImplementation(() => {}); // Silenciar console.log
    jest.spyOn(console, "warn").mockImplementation(() => {}); // Silenciar console.warn
    jest.spyOn(console, "error").mockImplementation(() => {}); // Silenciar console.error
    await sequelize.sync({ force: true }); // Reinicia la base de datos para pruebas
  });
  
afterAll(async () => {
    console.log.mockRestore(); // Restaurar console.log
    console.warn.mockRestore(); // Restaurar console.warn
    console.error.mockRestore(); // Restaurar console.error
    await sequelize.close(); // Cierra la conexión a la base de datos
  });

describe('API Artistas Routes', () => {
    // GET api/artistas/generos
    it('Should get all genres', async() => {
        // crear un genero de prueba
        await Genero.create({ nombre: 'genre1' }); 
        const response = await request(app).get("/api/artistas/generos");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nombre).toBe('genre1');
    });
    // GET /api/articulos-newsletter
    it("should get all artists", async () => {
        const genero = await Genero.create({
        nombre: "genre2"
        }); // Crear Género primero
        await Artista.create({
        nombre: "Artist1",
        generoId: genero.id,
        oyentesMensuales: 1000,
        fechaOrigen: new Date(),
        activo: true,
        });
        const response = await request(app).get("/api/artistas");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nombre).toBe("Artist1");
    });

    // GET /api/artistas/:id
    it("should get an artist by ID", async () => {
        const genero = await Genero.create({
        nombre: "genre3"
        });
        const artist = await Artista.create({
        nombre: "Artist2",
        generoId: genero.id,
        oyentesMensuales: 1500,
        fechaOrigen: new Date(),
        activo: true,
        });
        const response = await request(app).get(
        `/api/artistas/${artist.idArtista}`
        );
        expect(response.status).toBe(200);
        expect(response.body.nombre).toBe("Artist2");
    });

    // POST /api/artistas
    it("should create a new artist", async () => {
        const genero = await Genero.create({
        nombre: "genre4"
        });
        const newArtist = {
        nombre: "Artist3",
        generoId: genero.id,
        oyentesMensuales: 2000,
        fechaOrigen: new Date()
        };
        const response = await request(app)
        .post("/api/artistas")
        .send(newArtist);
        expect(response.status).toBe(200);
        expect(response.body.nombre).toBe("Artist3");
    });

    // PUT /api/artistas/:id
    it("should update an artist by ID", async () => {
        const genero = await Genero.create({
        nombre: "genre5"
        });
        const artist = await Artista.create({
        nombre: "Artist4",
        generoId: genero.id,
        oyentesMensuales: 2500,
        fechaOrigen: new Date(),
        activo: true,
        });
        const updatedArtist = {
        nombre: "UpdatedArtist4",
        generoId: genero.id,
        oyentesMensuales: 3000,
        fechaOrigen: new Date(),
        activo: true,
        };
        const response = await request(app)
        .put(`/api/artistas/${artist.idArtista}`)
        .send(updatedArtist);
        expect(response.status).toBe(200);
        expect(response.body.nombre).toBe("UpdatedArtist4");
    });

    // DELETE /api/artistas/:id
    it("should toggle the active state of an artist by ID", async () => {
        const genero = await Genero.create({
        nombre: "genre6"
        });
        const artist = await Artista.create({
        nombre: "Artist5",
        generoId: genero.id,
        oyentesMensuales: 3500,
        fechaOrigen: new Date(),
        activo: true,
        });
        const response = await request(app).delete(
        `/api/artistas/${artist.idArtista}`
        );
        expect(response.status).toBe(200);

        const updatedArtist = await Artista.findByPk(artist.idArtista);
        expect(updatedArtist.activo).toBe(false);
    });
});

