import express from "express";
import {
  addItemToCollection,
  getCollectionItems,
  deleteItemFromCollection,
} from "../controllers/collectionItems-controller";
import { authenticateUser } from "../middleware/auth-middleware";

export const collectionItemsRouter = express.Router();

// ✅ Fetch all items in a collection
collectionItemsRouter
  .route("/:collection_id")
  .get(authenticateUser, getCollectionItems);

// ✅ Add an item to a collection
collectionItemsRouter.route("/").post(authenticateUser, addItemToCollection);

// ✅ Remove an item from a collection
collectionItemsRouter
  .route("/:collection_id")
  .delete(authenticateUser, deleteItemFromCollection);
