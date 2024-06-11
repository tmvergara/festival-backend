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

describe('API Stands Routes', () => {
    // GET /stands/tipologia
    it('Should get all TipologiaStand', async () => {
        // crear una tipología de stand de prueba
        await TipologiaStand.create({ nombre: 'Tipologia1', precioXMC: 100.0 });
        const response = await request(app).get("/stands/tipologia");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nombre).toBe('Tipologia1');
    });

    // GET /stands
    it("should get all stands", async () => {
        const tipologia = await TipologiaStand.create({
            nombre: "Tipologia2",
            precioXMC: 200.0,
        });
        await Stand.create({
            nombre: "Stand1",
            tipologiaStand_id: tipologia.id,
            largo: 5.0,
            ancho: 5.0,
            fechaInstalacion: new Date(),
            activo: true,
        });
        const response = await request(app).get("/stands");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nombre).toBe("Stand1");
    });

    // GET /stands/:id
    it("should get a stand by ID", async () => {
        const tipologia = await TipologiaStand.create({
            nombre: "Tipologia3",
            precioXMC: 300.0,
        });
        const stand = await Stand.create({
            nombre: "Stand2",
            tipologiaStand_id: tipologia.id,
            largo: 6.0,
            ancho: 6.0,
            fechaInstalacion: new Date(),
            activo: true,
        });
        const response = await request(app).get(`/stands/${stand.id}`);
        expect(response.status).toBe(200);
        expect(response.body.nombre).toBe("Stand2");
    });

    // POST /stands
    it("should create a new stand", async () => {
        const tipologia = await TipologiaStand.create({
            nombre: "Tipologia4",
            precioXMC: 400.0,
        });
        const newStand = {
            nombre: "Stand3",
            tipologiaStand_id: tipologia.id,
            largo: 7.0,
            ancho: 7.0,
            fechaInstalacion: new Date(),
            activo: true,
        };
        const response = await request(app)
            .post("/stands")
            .send(newStand);
        expect(response.status).toBe(200);
        expect(response.body.nombre).toBe("Stand3");
    });

    // PUT /stands/:id
    it("should update a stand by ID", async () => {
        const tipologia = await TipologiaStand.create({
            nombre: "Tipologia5",
            precioXMC: 500.0,
        });
        const stand = await Stand.create({
            nombre: "Stand4",
            tipologiaStand_id: tipologia.id,
            largo: 8.0,
            ancho: 8.0,
            fechaInstalacion: new Date(),
            activo: true,
        });
        const updatedStand = {
            nombre: "UpdatedStand4",
            tipologiaStand_id: tipologia.id,
            largo: 9.0,
            ancho: 9.0,
            fechaInstalacion: new Date(),
            activo: true,
        };
        const response = await request(app)
            .put(`/stands/${stand.id}`)
            .send(updatedStand);
        expect(response.status).toBe(200);
        expect(response.body.nombre).toBe("UpdatedStand4");
    });

    // DELETE /stands/:id
    it("should toggle the active state of a stand by ID", async () => {
        const tipologia = await TipologiaStand.create({
            nombre: "Tipologia6",
            precioXMC: 600.0,
        });
        const stand = await Stand.create({
            nombre: "Stand5",
            tipologiaStand_id: tipologia.id,
            largo: 10.0,
            ancho: 10.0,
            fechaInstalacion: new Date(),
            activo: true,
        });
        const response = await request(app).delete(`/stands/${stand.id}`);
        expect(response.status).toBe(200);

        const updatedStand = await Stand.findByPk(stand.id);
        expect(updatedStand.activo).toBe(false);
    });
});
