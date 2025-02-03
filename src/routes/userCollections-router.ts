import express from "express";
import { authenticateUser } from "../middleware/auth-middleware";
import {
  addCollection,
  deleteCollectionById,
  getCollectionById,
  getCollections,
} from "../controllers/userCollections-controller";

export const userCollectionsRouter = express.Router();

userCollectionsRouter
  .route("/")
  .post(authenticateUser, addCollection)
  .get(authenticateUser, getCollections);
userCollectionsRouter
  .route("/:collection_id")
  .get(authenticateUser, getCollectionById)
  .delete(authenticateUser, deleteCollectionById);
