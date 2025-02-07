import { Router } from "express";
import {
  getArtworkDetail,
  searchArtworks,
} from "../controllers/items-controller";

const itemsRouter = Router();

itemsRouter.get("/search", searchArtworks);
itemsRouter.get("/:id", getArtworkDetail);

export default itemsRouter;
