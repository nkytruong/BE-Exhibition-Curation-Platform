import { Request, Response, NextFunction } from "express";
import {
  saveArtworkToCollection,
  getSavedCollectionItems,
  removeItemFromCollection,
  checkCollectionOwnership,
} from "../models/collectionItems-model";
import { CollectionItem } from "../types/types";

export function addItemToCollection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    collection_id,
    external_id,
    api_source,
    item_title,
    artist,
    image_url,
    item_created_at,
    added_at,
  } = req.body;

  if (
    collection_id === undefined ||
    external_id === undefined ||
    api_source === undefined ||
    item_title === undefined ||
    artist === undefined ||
    image_url === undefined ||
    item_created_at === undefined
  ) {
    res.status(400).send({ msg: "All fields required" });
    return;
  }

  const parsedExternalId = Number(external_id);
  if (isNaN(parsedExternalId)) {
    res.status(400).send({ msg: "Invalid external_id: must be a number" });
    return;
  }

  saveArtworkToCollection(
    collection_id,
    parsedExternalId,
    api_source,
    item_title,
    artist,
    image_url,
    item_created_at,
    added_at
  )
    .then((savedItem: CollectionItem) => {
      savedItem.external_id = Number(savedItem.external_id);
      res.status(201).send({ msg: "Item added to collection", savedItem });
    })
    .catch(next);
}

export function getCollectionItems(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { collection_id } = req.params;
  const user_id = Number(req.user?.user_id);

  checkCollectionOwnership(collection_id, user_id)
    .then((isOwner) => {
      if (!isOwner) {
        res
          .status(403)
          .send({ msg: "Unauthorized: Collection does not belong to user" });
        return;
      }
      return getSavedCollectionItems(collection_id);
    })
    .then((items: CollectionItem[] | void) => {
      if (items) {
        const formattedItems = items.map((item) => ({
          ...item,
          external_id: Number(item.external_id),
        }));
        res.status(200).send({ items: formattedItems });
      }
    })
    .catch(next);
}

export function deleteItemFromCollection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { collection_id } = req.params;
  const { external_id, api_source } = req.body;

  const parsedExternalId = Number(external_id);
  if (isNaN(parsedExternalId)) {
    res.status(400).send({ msg: "Invalid external_id: must be a number" });
    return;
  }

  removeItemFromCollection(collection_id, parsedExternalId, api_source)
    .then(() => res.status(200).send({ msg: "Item removed from collection" }))
    .catch(next);
}
