// tests/sponsors.test.js
const request = require("supertest");
const app = require("../app");
const { Sponsor, Rubro } = require("../models/sponsors");
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

describe("API Sponsor Routes", () => {
  // GET /api/rubros
  it("should get all rubros", async () => {
    await Rubro.create({ nombre: "Tecnología" }); // Crea un rubro de prueba
    const response = await request(app).get("/api/sponsors/rubros");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].nombre).toBe("Tecnología");
  });

  // GET /api/sponsors
  it("should get all sponsors", async () => {
    const rubro = await Rubro.create({ nombre: "Automotriz" }); // Crear Rubro primero
    await Sponsor.create({
      nombre: "Toyota",
      idRubro: rubro.id,
      presupuestoContribuido: 750000,
      fechaContrato: new Date(),
      activo: true,
    });
    const response = await request(app).get("/api/sponsors");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].nombre).toBe("Toyota");
  });

  // GET /api/sponsors/:id
  it("should get a sponsor by ID", async () => {
    const rubro = await Rubro.create({ nombre: "Banca" });
    const sponsor = await Sponsor.create({
      nombre: "Banco Santander",
      idRubro: rubro.id,
      presupuestoContribuido: 300000,
      fechaContrato: new Date(),
      activo: true,
    });
    const response = await request(app).get(
      `/api/sponsors/${sponsor.idSponsor}`
    );
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe("Banco Santander");
  });

  // POST /api/sponsors
  it("should create a new sponsor", async () => {
    const rubro = await Rubro.create({ nombre: "Alimentos" });
    const newSponsor = {
      nombre: "Nestlé",
      idRubro: rubro.id,
      presupuestoContribuido: 450000,
      fechaContrato: new Date(),
    };
    const response = await request(app).post("/api/sponsors").send(newSponsor);
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe("Nestlé");
  });

  // PUT /api/sponsors/:id
  it("should update a sponsor by ID", async () => {
    const rubro = await Rubro.create({ nombre: "Moda" });
    const sponsor = await Sponsor.create({
      nombre: "Nike",
      idRubro: rubro.id,
      presupuestoContribuido: 600000,
      fechaContrato: new Date(),
      activo: true,
    });
    const updatedSponsor = {
      nombre: "Adidas",
      idRubro: rubro.id,
      presupuestoContribuido: 700000,
      fechaContrato: new Date(),
      activo: true,
    };
    const response = await request(app)
      .put(`/api/sponsors/${sponsor.idSponsor}`)
      .send(updatedSponsor);
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe("Adidas");
  });

  // DELETE /api/sponsors/:id
  it("should toggle the active state of a sponsor by ID", async () => {
    const rubro = await Rubro.create({ nombre: "Tecnología" });
    const sponsor = await Sponsor.create({
      nombre: "Google",
      idRubro: rubro.id,
      presupuestoContribuido: 500000,
      fechaContrato: new Date(),
      activo: true,
    });
    const response = await request(app).delete(
      `/api/sponsors/${sponsor.idSponsor}`
    );
    expect(response.status).toBe(200);

    const updatedSponsor = await Sponsor.findByPk(sponsor.idSponsor);
    expect(updatedSponsor.activo).toBe(false);
  });
});
