import request from "supertest";
import app from "../app";
import db from "../db/connection";
import { seed } from "../db/seeds/seed";
import { testData } from "../db/data/test-data";
import { generateToken } from "../utils/auth-utils";

beforeEach(() => {
  return seed(testData);
});

afterAll(() => db.end());

describe("POST /api/collectionItems", () => {
  test("POST 201: adds an item to a collection if user is logged in", () => {
    const requestBody = {
      collection_id: "70f5dd38-0ce4-4a64-8c87-e93a9944125f",
      external_id: 54648,
      api_source: "met_museum",
    };
    const user_id = "1";
    const token = generateToken(user_id);

    return request(app)
      .post("/api/collectionItems")
      .set("Cookie", `authToken=${token}`)
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Item added to collection",
          savedItem: {
            id: expect.any(String),
            collection_id: "70f5dd38-0ce4-4a64-8c87-e93a9944125f",
            external_id: 54648,
            api_source: "met_museum",
            created_at: expect.any(String),
          },
        });
      });
  });
  test("POST 400: returns correct error message if one of the input fields are missing", () => {
    const requestBody = {
      collection_id: "70f5dd38-0ce4-4a64-8c87-e93a9944125f",
      external_id: 54648,
    };
    const user_id = "1";
    const token = generateToken(user_id);

    return request(app)
      .post("/api/collectionItems")
      .set("Cookie", `authToken=${token}`)
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("All fields required");
      });
  });
  test("POST 400: returns correct error message when external_id is not a number", () => {
    const requestBody = {
      collection_id: "70f5dd38-0ce4-4a64-8c87-e93a9944125f",
      external_id: 54648,
    };
    const user_id = "1";
    const token = generateToken(user_id);

    return request(app)
      .post("/api/collectionItems")
      .set("Cookie", `authToken=${token}`)
      .send({
        collection_id: "70f5dd38-0ce4-4a64-8c87-e93a9944125f",
        external_id: "invalid_id",
        api_source: "met_museum",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid external_id: must be a number");
      });
  });
});

describe("GET /api/collectionItems/:collection_id", () => {
  test("GET 200: retrieves all items in a collection", () => {
    const collection_id = "0b8a662e-d03e-43ab-b70d-da901d2e3643";
    const user_id = "1";
    const token = generateToken(user_id);
    return request(app)
      .get(`/api/collectionItems/${collection_id}`)
      .set("Cookie", `authToken=${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.items).toBeInstanceOf(Array);
        if (body.items.length > 0) {
          expect(body.items[0]).toMatchObject({
            external_id: expect.any(Number),
            api_source: expect.any(String),
          });
        }
      });
  });
  test("GET 401: returns correct error message if user is not logged in", () => {
    const collection_id = "70f5dd38-0ce4-4a64-8c87-e93a9944125f";
    return request(app)
      .get(`/api/collectionItems/${collection_id}`)
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("No token provided");
      });
  });
  test("GET 403: returns correct error message if collection_id does not belong to logged in user", () => {
    const collection_id = "52d4c53f-60c2-454a-aa02-206841a60798";
    const user_id = "1";
    const token = generateToken(user_id);
    return request(app)
      .get(`/api/collectionItems/${collection_id}`)
      .set("Cookie", `authToken=${token}`)
      .expect(403)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Unauthorized: Collection does not belong to user"
        );
      });
  });
});
describe("DELETE /api/collectionItems/:collection_id", () => {
  test("DELETE 200: removes an item from a collection", () => {
    const collection_id = "0b8a662e-d03e-43ab-b70d-da901d2e3643";
    const user_id = "1";
    const token = generateToken(user_id);
    return request(app)
      .delete(`/api/collectionItems/${collection_id}`)
      .set("Cookie", `authToken=${token}`)
      .send({
        collection_id: collection_id,
        external_id: 437853,
        api_source: "met_museum",
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toEqual("Item removed from collection");
      });
  });
  test("DELETE 404: returns an error when trying to remove a non-existent item", () => {
    const collection_id = "0b8a662e-d03e-43ab-b70d-da901d2e3643";
    const user_id = "1";
    const token = generateToken(user_id);

    return request(app)
      .delete(`/api/collectionItems/${collection_id}`)
      .set("Cookie", `authToken=${token}`)
      .send({
        collection_id: collection_id,
        external_id: 99999999, // Non-existent ID
        api_source: "met_museum",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Item not found in collection");
      });
  });
});
