import app from "../app";
import db from "../db/connection";
import { seed } from "../db/seeds/seed";
import { testData } from "../db/data/test-data";
import request from "supertest";
import { string } from "pg-format";
import { generateToken, hashPassword, verifyToken } from "../utils/auth-utils";
import jwt from "jsonwebtoken";

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("generateToken", () => {
  test("generates a valid JWT token containing correct user id", () => {
    const user_id = "3";
    const token = generateToken(user_id);
    expect(typeof token).toBe("string");

    const decoded = jwt.decode(token);
    console.log("Decoded token:", decoded);

    expect(decoded).toHaveProperty("user_id", user_id);
    expect(decoded).toHaveProperty("iat");
    expect(decoded).toHaveProperty("exp");
  });
});
describe("hashPassword", () => {
  test("hashes a string password", () => {
    const password = "password123";
    return hashPassword(password).then((hashedPassword) => {
      expect(typeof hashedPassword).toBe("string");
      expect(hashedPassword.length).toBe(60);
      expect(hashedPassword).not.toBe(password);
    });
  });
});
describe("verifyToken", () => {
  test("verifies a valid token and returns correct payload", () => {
    const user_id = "1";
    const token = generateToken(user_id);
    const decoded = verifyToken(token);
    expect(decoded).toHaveProperty("user_id", user_id);
  });
});
