import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Response } from "express";
import dotenv from "dotenv";

const ENV = process.env.NODE_ENV || "development";

// Load environment variables from the appropriate .env file
dotenv.config({
  path: `${__dirname}/../.env.${ENV}`,
});

export function generateToken(userId: string): string {
  const jwtSecret: Secret = process.env.JWT_SECRET as string;
  const token = jwt.sign({ userId }, jwtSecret, { expiresIn: "365d" });
  return token;
}

export function verifyToken(token: string) {
    const jwtSecret: Secret = process.env.JWT_SECRET as string
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; iat: number; exp: number }
    return decoded
}

export function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function clearToken( res: Response): void {
  res.cookie("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  })
}

export function getUserIdFromToken(req: Request) {

}