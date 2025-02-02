import { NextFunction, Request, Response } from "express";
import { fetchUser } from "../models/users-model";
import {
  clearToken,
  generateToken,
  hashPassword,
  verifyPassword,
} from "../utils/auth-utils";
import { createUser, findUserByEmail } from "../models/auth-model";

export function registerUser(req: Request, res: Response, next: NextFunction) {
  const { email, first_name, surname, password } = req.body;

  if (!email || !first_name || !surname || !password) {
    res.status(400).send({ msg: "All fields are required" });
    return;
  }

  if (
    typeof email !== "string" ||
    typeof first_name !== "string" ||
    typeof surname !== "string" ||
    typeof password !== "string"
  ) {
    res.status(400).send({ msg: "Invalid input: All fields must be strings" });
    return;
  }

  findUserByEmail(email)
    .then((existingUser) => {
      if (existingUser) {
        return Promise.reject({
          status: 409,
          msg: "Account already exists for this email",
        });
      }
      return createUser(email, first_name, surname, password);
    })
    .then((newUser) => {
      const token = generateToken(newUser.user_id);

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      });
      res.status(201).send({
        msg: "User registered and logged in successfully",
        user: newUser,
        token,
      });
    })
    .catch(next);
}

// const authenticateUser = (req: Request, res: Response) => {};

export function loginUser(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ msg: "Email and Password are both required" });
    return;
  }

  findUserByEmail(email)
    .then((user) => {
      if (!user) {
        return Promise.reject({
          status: 401,
          msg: "Invalid email: User does not exist",
        });
      }
      return verifyPassword(password, user.hashed_password).then((isMatch) => {
        if (!isMatch) {
          return Promise.reject({
            status: 400,
            msg: "Incorrect password",
          });
        }
        const token = generateToken(user.userId);

        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600000,
        });
        res.status(200).send({ msg: "Login successful", token });
      });
    })
    .catch(next);
}

export function logoutUser(req: Request, res: Response) {
  clearToken(res);
  res.status(200).send({ msg: "Logged out successfully" });
}
