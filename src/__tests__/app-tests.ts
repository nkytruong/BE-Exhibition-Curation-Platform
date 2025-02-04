import app from "../app";
import db from "../db/connection";
import { seed } from "../db/seeds/seed";
import { testData } from "../db/data/test-data";
import request from "supertest";
import endpoints from "../../endpoints.json"

beforeEach(() => {
    return seed(testData);
  });
  afterAll(() => db.end());

describe("GET /api", () => {
    test("GET 200: returns object describing all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            console.log("ENDPOINTS", body.endpoints)
          expect(body.endpoints).toEqual(endpoints);
        });
    })
})