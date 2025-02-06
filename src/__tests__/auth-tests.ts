import app from "../app";
import db from "../db/connection";
import { seed } from "../db/seeds/seed";
import { testData } from "../db/data/test-data";
import request from "supertest";
import { string } from "pg-format";

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("/api/auth/register", () => {
  test("POST 201: returns newly created user", () => {
    const requestBody = {
      email: "nikki@example.com",
      first_name: "Nikki",
      surname: "Example",
      password: "password123",
    };
    return request(app)
      .post("/api/auth/register")
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        console.log("Registered User:", body.user);
        expect(body.user).toMatchObject({
          user_id: expect.any(Number),
          email: "nikki@example.com",
          first_name: "Nikki",
          surname: "Example",
          created_at: expect.any(String),
        });
      });
  });
  test("POST 400: returns correct error message if one of the inputs are missing", () => {
    const requestBody = {
      email: "nikki@example.com",
      first_name: "Nikki",
      password: "password123",
    };
    return request(app)
      .post("/api/auth/register")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("All fields are required");
      });
  });
  test("POST 400: returns correct error message if non-string input is provided", () => {
    const requestBody = {
      email: "nikki@example.com",
      first_name: "Nikki",
      surname: "Example",
      password: 123,
    };
    return request(app)
      .post("/api/auth/register")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input: All fields must be strings");
      });
  });
  test("POST 409: returns correct error message if email is already registered", () => {
    const requestBody = {
      email: "jane@example.com",
      first_name: "Jane",
      surname: "Smith",
      password: "janepass",
    };
    return request(app)
      .post("/api/auth/register")
      .send(requestBody)
      .expect(409)
      .then(({ body }) => {
        expect(body.msg).toBe("Account already exists for this email");
      });
  });
});
describe("/api/auth/login", () => {
  test("POST 200: returns correct message with a token and sets auth cookie when user successfully logs in", () => {
    const requestBody = {
      email: "bob@example.com",
      password: "happytrees",
    };
    return request(app)
      .post("/api/auth/login")
      .send(requestBody)
      .expect(200)
      .then(({ body, headers }) => {
        // console.log("🚀 Headers:", headers); // ✅ Debug headers
        expect(body.msg).toBe("Login successful");
        expect(body.token).toEqual(expect.any(String));
        expect(headers["set-cookie"]).toEqual(
          expect.arrayContaining([expect.stringContaining("authToken")])
        );
      });
  });
  test("POST 400: returns correct error message if one of the inputs are missing", () => {
    const requestBody = {
      email: "bob@example.com",
    };
    return request(app)
      .post("/api/auth/login")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Email and Password are both required");
      });
  });
  test("POST 401: returns correct message if the user/account does not exist", () => {
    const requestBody = {
      email: "nikki@example.com",
      password: "hello123",
    };
    return request(app)
      .post("/api/auth/login")
      .send(requestBody)
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid email: User does not exist");
      });
  });
  test("POST 400: returns correct error message if incorrect password", () => {
    const requestBody = {
      email: "bob@example.com",
      password: "hello123",
    };
    return request(app)
      .post("/api/auth/login")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect password");
      });
  });
});
describe("/api/auth/logout", () => {
  test("POST 200: clears authToken cookie on logout", () => {
    return request(app)
      .post("/api/auth/logout")
      .expect(200)
      .then(({ body, headers }) => {
        expect(body.msg).toBe("Logged out successfully");
        expect(headers["set-cookie"]).toEqual(
          expect.arrayContaining([expect.stringContaining("authToken=;")])
        );
      });
  });
});
