import app from "../app";
import db from "../db/connection";
import { seed } from "../db/seeds/seed";
import { testData } from "../db/data/test-data";
import request from "supertest";
import { string } from "pg-format";
import { generateToken } from "../utils/auth-utils";

import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("POST /api/userCollections", () => {
  test("POST 201: returns newly created user collection", () => {
    const requestBody = { collection_name: "My Favourites" };
    const user_id = "4";
    const token = generateToken(user_id);

    return request(app)
      .post("/api/userCollections")
      .set("Cookie", `authToken=${token}`)
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Collection created",
          newCollection: {
            collection_id: expect.any(String),
            user_id: 4,
            collection_name: "My Favourites",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        });
      });
  });
  test("POST 400: returns correct error message if collection name is not provided", () => {
    const requestBody = {};
    const user_id = "4";
    const token = generateToken(user_id);

    return request(app)
      .post("/api/userCollections")
      .set("Cookie", `authToken=${token}`)
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Collection name required");
      });
  });
  test("POST 401: returns correct error message if user is not logged in", () => {
    const requestBody = { collection_name: "My Favourites" };

    return request(app)
      .post("/api/userCollections")
      .send(requestBody)
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("No token provided");
      });
  });
});
describe("GET /api/userCollections", () => {
  test("GET 200: returns empty array if user has no collections", () => {
    const user_id = "4";
    const token = generateToken(user_id);

    return request(app)
      .get("/api/userCollections")
      .set("Cookie", `authToken=${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.collections).toEqual([]);
      });
  });
  test("GET 200: returns all collections for authenticated user", () => {
    const user_id = "1";
    const token = generateToken(user_id);

    return request(app)
      .get("/api/userCollections")
      .set("Cookie", `authToken=${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.collections)).toBe(true);
        expect(body.collections.length).toBeGreaterThan(0);
        expect(body.collections[0]).toEqual(
          expect.objectContaining({
            collection_id: expect.any(String),
            user_id: 1,
            collection_name: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          })
        );
      });
  });
  test("GET 401: returns correct error message if user is not logged in", () => {
    return request(app)
      .get("/api/userCollections")
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("No token provided");
      });
  });
});
describe("GET /api/userCollections/:collection_id", () => {
  test("GET 200: returns correct collection object for logged in user", () => {
    const collection_id = "70f5dd38-0ce4-4a64-8c87-e93a9944125f";
    const user_id = "1";
    const token = generateToken(user_id);

    return request(app)
      .get(`/api/userCollections/${collection_id}`)
      .set("Cookie", `authToken=${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.collection).toEqual(
          expect.objectContaining({
            collection_id: "70f5dd38-0ce4-4a64-8c87-e93a9944125f",
            user_id: 1,
            collection_name: "Impressionism Favorites",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          })
        );
      });
  });
  test("GET 404: returns correct error message if collection does not exist", () => {
    const collection_id = "70f5dd38-0ce4-4a64-8c87-e93a9944444f";
    const user_id = "1";
    const token = generateToken(user_id);

    return request(app)
      .get(`/api/userCollections/${collection_id}`)
      .set("Cookie", `authToken=${token}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Collection not found");
      });
  });
  test("GET 404: returns correct error message if collection belongs to another user", () => {
    const collection_id = "e2ec43a0-b677-40cb-9407-a0c855102c6a";
    const user_id = "1";
    const token = generateToken(user_id);

    return request(app)
      .get(`/api/userCollections/${collection_id}`)
      .set("Cookie", `authToken=${token}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Collection not found");
      });
  });
});
describe("DELETE /api/userCollections/:collection_id", () => {
  test("DELETE 204: deletes a collection if it belongs to the logged in user", () => {
    const collection_id = "70f5dd38-0ce4-4a64-8c87-e93a9944125f";
    const user_id = "1";
    const token = generateToken(user_id);

    return request(app)
      .delete(`/api/userCollections/${collection_id}`)
      .set("Cookie", `authToken=${token}`)
      .expect(204)
      .then(() => {
        return request(app)
          .get(`/api/userCollections/${collection_id}`)
          .set("Cookie", `authToken=${token}`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Collection not found");
          });
      });
  });
  test("DELETE 404: returns correct error message if the collection does not exist", () => {
    const collection_id = "70f5dd38-0ce4-4a64-8c87-e93a9944444f";
    const user_id = "1";
    const token = generateToken(user_id);

    return request(app)
      .delete(`/api/userCollections/${collection_id}`)
      .set("Cookie", `authToken=${token}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Collection not found");
      });
  });
  test("DELETE 404: returns correct error message if the collection belongs to another user", () => {
    const collection_id = "70f5dd38-0ce4-4a64-8c87-e93a9944125f";
    const user_id = "2";
    const token = generateToken(user_id);

    return request(app)
      .delete(`/api/userCollections/${collection_id}`)
      .set("Cookie", `authToken=${token}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Collection not found");
      });
  });
  test("DELETE 401: returns correct error message if user is not logged in", () => {
    const collectionId = "70f5dd38-0ce4-4a64-8c87-e93a9944125f";

    return request(app)
      .delete(`/api/userCollections/${collectionId}`)
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toEqual("No token provided");
      });
  });
});
