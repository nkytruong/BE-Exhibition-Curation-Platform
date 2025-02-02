import express from "express";
import { getUser } from "../controllers/users-controller";

export const usersRouter = express.Router();

usersRouter.route("/:user_id").get(getUser);

