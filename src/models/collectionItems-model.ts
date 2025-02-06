// src/models/collectionItems-model.ts
import db from "../db/connection";
import { CollectionItem } from "../types/types";

export function saveArtworkToCollection(
  collection_id: string,
  external_id: number,
  api_source: string,
  item_title: string,
  artist: string,
  image_url: string,
  item_created_at: string,
  added_at?: string
): Promise<CollectionItem> {
  return db
    .query(
      `INSERT INTO collection_items 
         (collection_id, external_id, api_source, item_title, artist, image_url, item_created_at, added_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT DO NOTHING 
       RETURNING id, collection_id, external_id, api_source, item_title, artist, image_url, item_created_at, added_at;`,
      [
        collection_id,
        external_id,
        api_source,
        item_title,
        artist,
        image_url,
        item_created_at,
        added_at || new Date().toISOString(),
      ]
    )
    .then(({ rows }) => rows[0]);
}

export function checkCollectionOwnership(
  collection_id: string,
  user_id: number
) {
  return db
    .query(
      `SELECT 1 FROM user_collections WHERE collection_id = $1 AND user_id = $2;`,
      [collection_id, user_id]
    )
    .then(({ rows }) => rows.length > 0);
}

export function getSavedCollectionItems(
  collection_id: string
): Promise<CollectionItem[]> {
  return db
    .query(
      `SELECT id, collection_id, external_id, api_source, item_title, artist, image_url, item_created_at, added_at 
       FROM collection_items 
       WHERE collection_id = $1;`,
      [collection_id]
    )
    .then(({ rows }) => rows);
}

export function removeItemFromCollection(
  collection_id: string,
  external_id: number,
  api_source: string
): Promise<CollectionItem> {
  return db
    .query(
      `DELETE FROM collection_items 
       WHERE collection_id = $1 AND external_id = $2 AND api_source = $3 
       RETURNING id, collection_id, external_id, api_source, item_title, artist, image_url, item_created_at, added_at;`,
      [collection_id, external_id, api_source]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Item not found in collection",
        });
      }
      return rows[0];
    });
}
