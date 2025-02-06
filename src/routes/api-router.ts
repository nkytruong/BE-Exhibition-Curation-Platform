import express from "express";
import { usersRouter } from "./users-router";
import { authRouter } from "./auth-router";
import { userCollectionsRouter } from "./userCollections-router";
import { collectionItemsRouter } from "./collectionItems-router";
import { getEndpoints } from "../controllers/app-controller";
import itemsRouter from "./items-router";

export const apiRouter = express.Router();

apiRouter.get("/", getEndpoints);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/userCollections", userCollectionsRouter);
apiRouter.use("/collectionItems", collectionItemsRouter);
apiRouter.use("/items", itemsRouter);
