import { NextFunction, Request, Response } from "express";
import {
  fetchCollectionById,
  fetchCollections,
  postCollection,
  removeCollectionById,
} from "../models/userCollections-model";

export function addCollection(req: Request, res: Response, next: NextFunction) {
  const { collection_name } = req.body;
  const user_id = Number(req.user?.user_id);

  if (!collection_name) {
    res.status(400).send({ msg: "Collection name required" });
    return;
  }

  postCollection(user_id, collection_name)
    .then((newCollection) => {
      res.status(201).send({ msg: "Collection created", newCollection });
    })
    .catch(next);
}

export function getCollections(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user_id = Number(req.user?.user_id);

  fetchCollections(user_id)
    .then((collections) => {
      res.status(200).send({ collections });
    })
    .catch(next);
}

export function getCollectionById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { collection_id } = req.params;
  const user_id = Number(req.user?.user_id);

  fetchCollectionById(user_id, collection_id)
    .then((collection) => {
      if (!collection) {
        return Promise.reject({ status: 404, msg: "Collection not found" });
      }
      res.status(200).send({ collection });
    })
    .catch(next);
}

export function deleteCollectionById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { collection_id } = req.params;
  const user_id = Number(req.user?.user_id);

  removeCollectionById(user_id, collection_id)
    .then((deletedRowCount) => {
      if (deletedRowCount === 0) {
        return Promise.reject({ status: 404, msg: "Collection not found" });
      }
      res.status(204).send();
    })
    .catch(next);
}
