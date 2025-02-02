"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const connection_1 = __importDefault(require("../db/connection"));
const seed_1 = require("../db/seeds/seed");
const test_data_1 = require("../db/data/test-data");
const supertest_1 = __importDefault(require("supertest"));
beforeEach(() => {
    return (0, seed_1.seed)(test_data_1.testData);
});
afterAll(() => connection_1.default.end());
describe("/api/users/:user_id", () => {
    test("GET 200: returns a single user object", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/users/1")
            .expect(200)
            .then(({ body }) => {
            expect(body.user).toMatchObject({
                user_id: expect.any(Number),
                email: expect.any(String),
                first_name: expect.any(String),
                surname: expect.any(String),
                password: expect.any(String),
                created_at: expect.any(String)
            });
            console.log("Environment:", process.env.PGDATABASE, process.env.DATABASE_URL);
        });
    });
});
