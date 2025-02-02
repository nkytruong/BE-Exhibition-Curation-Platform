import app from "../app";
import db from "../db/connection";
import { seed } from "../db/seeds/seed";
import { testData } from "../db/data/test-data";
import request from "supertest"
import { string } from "pg-format";

beforeEach(() => {
    return seed(testData)
})
afterAll(() => db.end())

describe("/api/users/:user_id", () => {
    test("GET 200: returns a single user object", () => {
        return request(app)
        .get("/api/users/1")
        .expect(200)
        .then(({body}) => {
            expect(body.user).toMatchObject({
                user_id: expect.any(Number),
                email: expect.any(String),
                first_name: expect.any(String),
                surname: expect.any(String),
                hashed_password: expect.any(String),
                created_at: expect.any(String)
            })
            // console.log("Returned User:", body.user)
            // console.log("Environment:", process.env.PGDATABASE, process.env.DATABASE_URL);
        })
    })
    test("GET 404: returns correct error message if passed user id that does not exist", () => {
        return request(app)
        .get("/api/users/9999")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("User Not Found")
        })
    });
    test("GET 400: returns correct error message if passed invalid user id", () => {
        return request(app)
        .get("/api/users/bread")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid User ID")
        })
    })
})