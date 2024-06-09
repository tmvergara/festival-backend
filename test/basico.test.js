// tests/api.test.js
const request = require("supertest");
const app = require("../app");
const db = require("../config/sequelize-init");

beforeAll(async () => {
  // Conecta a la base de datos de pruebas
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  // Cierra la conexión a la base de datos después de las pruebas
  await db.sequelize.close();
});

describe("Ejemplo simple, test que no falla", () => {
  it("Simplemente compruebo si true === true", () => {
    expect(true).toBe(true);
  });
});

describe("GET 404", () => {
  it("Debería devolver error 404.", async () => {
    const res = await request(app).get("/urlinexistente");
    expect(res.statusCode).toEqual(404);
  });
});
