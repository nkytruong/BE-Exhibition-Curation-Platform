import db from "../db/connection";
import { v4 as uuidv4 } from "uuid";

export function postCollection(user_id: number, collection_name: string) {
  const collection_id = uuidv4();

  return db
    .query(
      `INSERT INTO user_collections (collection_id, user_id, collection_name) VALUES ($1, $2, $3) RETURNING *;`,
      [collection_id, user_id, collection_name]
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      console.error("SQL ERROR:", err);
      throw err;
    });
}

export function fetchCollections(user_id: number) {
  return db
    .query(`SELECT * FROM user_collections WHERE user_id = $1;`, [user_id])
    .then(({ rows }) => {
      return rows;
    });
}

export function fetchCollectionById(user_id: number, collection_id: string) {
  return db
    .query(
      `SELECT * FROM user_collections WHERE collection_id = $1 AND user_id = $2;`,
      [collection_id, user_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

export function removeCollectionById(user_id: number, collection_id: string) {
  return db
    .query(
      `DELETE FROM user_collections WHERE collection_id = $1 AND user_id = $2 RETURNING *;`,
      [collection_id, user_id]
    )
    .then(({ rowCount }) => {
      return rowCount;
    });
}
