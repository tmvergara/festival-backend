// tests/newsletter.test.js
const request = require("supertest");
const app = require("../app");
const { ArticulosNewsletter, TipoArticulo } = require("../models/newsletter");
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

describe("API Newsletter Routes", () => {
  // GET /api/articulos-newsletter/tipos
  it("should get all article types", async () => {
    await TipoArticulo.create({ nombre: "Type1", descripcion: "Description1" }); // Crea un tipo de artículo de prueba
    const response = await request(app).get("/api/articulos-newsletter/tipos");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].nombre).toBe("Type1");
  });

  // GET /api/articulos-newsletter
  it("should get all newsletter articles", async () => {
    const tipoArticulo = await TipoArticulo.create({
      nombre: "Type2",
      descripcion: "Description2",
    }); // Crear TipoArticulo primero
    await ArticulosNewsletter.create({
      titulo: "Article1",
      tipoArticulo_id: tipoArticulo.id,
      contenido: "Content1",
      tiempoLectura: 10,
      fechaPublicacion: new Date(),
      activo: true,
    });
    const response = await request(app).get("/api/articulos-newsletter");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].titulo).toBe("Article1");
  });

  // GET /api/articulos-newsletter/:id
  it("should get a newsletter article by ID", async () => {
    const tipoArticulo = await TipoArticulo.create({
      nombre: "Type3",
      descripcion: "Description3",
    });
    const article = await ArticulosNewsletter.create({
      titulo: "Article2",
      tipoArticulo_id: tipoArticulo.id,
      contenido: "Content2",
      tiempoLectura: 15,
      fechaPublicacion: new Date(),
      activo: true,
    });
    const response = await request(app).get(
      `/api/articulos-newsletter/${article.id}`
    );
    expect(response.status).toBe(200);
    expect(response.body.titulo).toBe("Article2");
  });

  // POST /api/articulos-newsletter
  it("should create a new newsletter article", async () => {
    const tipoArticulo = await TipoArticulo.create({
      nombre: "Type4",
      descripcion: "Description4",
    });
    const newArticle = {
      titulo: "Article3",
      tipoArticulo_id: tipoArticulo.id,
      contenido: "Content3",
      tiempoLectura: 20,
      fechaPublicacion: new Date(),
    };
    const response = await request(app)
      .post("/api/articulos-newsletter")
      .send(newArticle);
    expect(response.status).toBe(200);
    expect(response.body.titulo).toBe("Article3");
  });

  // PUT /api/articulos-newsletter/:id
  it("should update a newsletter article by ID", async () => {
    const tipoArticulo = await TipoArticulo.create({
      nombre: "Type5",
      descripcion: "Description5",
    });
    const article = await ArticulosNewsletter.create({
      titulo: "Article4",
      tipoArticulo_id: tipoArticulo.id,
      contenido: "Content4",
      tiempoLectura: 25,
      fechaPublicacion: new Date(),
      activo: true,
    });
    const updatedArticle = {
      titulo: "UpdatedArticle4",
      tipoArticulo_id: tipoArticulo.id,
      contenido: "UpdatedContent4",
      tiempoLectura: 30,
      fechaPublicacion: new Date(),
      activo: true,
    };
    const response = await request(app)
      .put(`/api/articulos-newsletter/${article.id}`)
      .send(updatedArticle);
    expect(response.status).toBe(200);
    expect(response.body.titulo).toBe("UpdatedArticle4");
  });

  // DELETE /api/articulos-newsletter/:id
  it("should toggle the active state of a newsletter article by ID", async () => {
    const tipoArticulo = await TipoArticulo.create({
      nombre: "Type6",
      descripcion: "Description6",
    });
    const article = await ArticulosNewsletter.create({
      titulo: "Article5",
      tipoArticulo_id: tipoArticulo.id,
      contenido: "Content5",
      tiempoLectura: 35,
      fechaPublicacion: new Date(),
      activo: true,
    });
    const response = await request(app).delete(
      `/api/articulos-newsletter/${article.id}`
    );
    expect(response.status).toBe(200);

    const updatedArticle = await ArticulosNewsletter.findByPk(article.id);
    expect(updatedArticle.activo).toBe(false);
  });
});
