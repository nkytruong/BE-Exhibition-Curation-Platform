import { Router } from "express";
import { searchArtworks } from "../controllers/items-controller";

const itemsRouter = Router();

// GET /api/artworks/search?q=monet&page=1&artist=Monet
itemsRouter.get("/search", searchArtworks);

export default itemsRouter;
