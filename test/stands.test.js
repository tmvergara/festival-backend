// tests/stands.test.js
const request = require("supertest");
const app = require("../app");
const { Stand, TipologiaStand } = require("../models/stands");
const { sequelize } = require("../config/sequelize-init");

beforeAll(async () => {
    jest.spyOn(console, "log").mockImplementation(() => { }); // Silenciar console.log
    jest.spyOn(console, "warn").mockImplementation(() => { }); // Silenciar console.warn
    jest.spyOn(console, "error").mockImplementation(() => { }); // Silenciar console.error
    await sequelize.sync({ force: true }); // Reinicia la base de datos para pruebas
});

afterAll(async () => {
    console.log.mockRestore(); // Restaurar console.log
    console.warn.mockRestore(); // Restaurar console.warn
    console.error.mockRestore(); // Restaurar console.error
    await sequelize.close(); // Cierra la conexión a la base de datos
});

describe("API Stands Routes", () => {
    // GET /api/stands/tipologia
    it("should get all tipologias", async () => {
        await TipologiaStand.create({ nombre: "VIP", precioXMC: 100 }); // Crea un tipo de stand de prueba
        const response = await request(app).get("/api/stands/tipologia");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nombre).toBe("VIP");
    });

    // GET /api/stands
    it("should get all stands", async () => {
        const tipologia = await TipologiaStand.create({
            nombre: "Premium",
            precioXMC: 200,
        }); // Crear TipologiaStand primero
        await Stand.create({
            nombre: "Stand1",
            tipologiaStand_id: tipologia.id,
            largo: 10,
            ancho: 10,
            descripcion: "Stand description",
            fechaInstalacion: new Date(),
            activo: true,
        });
        const response = await request(app).get("/api/stands");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nombre).toBe("Stand1");
    });

    // GET /api/stands/:id
    it("should get a stand by ID", async () => {
        const tipologia = await TipologiaStand.create({
            nombre: "General",
            precioXMC: 50,
        });
        const stand = await Stand.create({
            nombre: "Stand2",
            tipologiaStand_id: tipologia.id,
            largo: 12,
            ancho: 12,
            descripcion: "Stand description",
            fechaInstalacion: new Date(),
            activo: true,
        });
        const response = await request(app).get(`/api/stands/${stand.id}`);
        expect(response.status).toBe(200);
        expect(response.body.nombre).toBe("Stand2");
    });

    // POST /api/stands
    it("should create a new stand", async () => {
        const tipologia = await TipologiaStand.create({
            nombre: "Exclusive",
            precioXMC: 300,
        });
        const newStand = {
            nombre: "Stand3",
            tipologiaStand_id: tipologia.id,
            largo: 15,
            ancho: 15,
            descripcion: "New stand description",
            fechaInstalacion: new Date(),
            activo: true,
        };
        const response = await request(app).post("/api/stands").send(newStand);
        expect(response.status).toBe(200);
        expect(response.body.nombre).toBe("Stand3");
    });

    // PUT /api/stands/:id
    it("should update a stand by ID", async () => {
        const tipologia = await TipologiaStand.create({
            nombre: "Standard",
            precioXMC: 150,
        });
        const stand = await Stand.create({
            nombre: "Stand4",
            tipologiaStand_id: tipologia.id,
            largo: 20,
            ancho: 20,
            descripcion: "Stand description",
            fechaInstalacion: new Date(),
            activo: true,
        });
        const updatedStand = {
            nombre: "UpdatedStand4",
            tipologiaStand_id: tipologia.id,
            largo: 22,
            ancho: 22,
            descripcion: "Updated description",
            fechaInstalacion: new Date(),
            activo: true,
        };
        const response = await request(app)
            .put(`/api/stands/${stand.id}`)
            .send(updatedStand);
        expect(response.status).toBe(200);
        expect(response.body.nombre).toBe("UpdatedStand4");
    });

    // DELETE /api/stands/:id
    it("should toggle the active state of a stand by ID", async () => {
        const tipologia = await TipologiaStand.create({
            nombre: "Basic",
            precioXMC: 80,
        });
        const stand = await Stand.create({
            nombre: "Stand5",
            tipologiaStand_id: tipologia.id,
            largo: 25,
            ancho: 25,
            descripcion: "Stand description",
            fechaInstalacion: new Date(),
            activo: true,
        });
        const response = await request(app).delete(`/api/stands/${stand.id}`);
        expect(response.status).toBe(200);

        const updatedStand = await Stand.findByPk(stand.id);
        expect(updatedStand.activo).toBe(false);
    });
});
