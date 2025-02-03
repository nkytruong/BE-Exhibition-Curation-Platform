import { Collection, CollectionItem, SeedData, User } from "../../types/types";
import { hashPassword } from "../../utils/auth-utils";
import db from "../connection";
import format from "pg-format";

export function seed({
  users,
  userCollections,
  collectionItems,
}: SeedData) {
  return db
    .query(`DROP TABLE IF EXISTS collection_items;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS user_collections;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users(
            user_id SERIAL PRIMARY KEY,
            email VARCHAR(50) NOT NULL UNIQUE,
            first_name VARCHAR(50) NOT NULL,
            surname VARCHAR(50) NOT NULL,
            hashed_password VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE user_collections(
            collection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
            collection_name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE collection_items(
            relationship_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            collection_id UUID REFERENCES user_collections(collection_id) ON DELETE CASCADE,
            external_id BIGINT NOT NULL,
            api_source VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(collection_id, external_id, api_source)
        );`);
    })
    .then(() => {
      return Promise.all(
        users.map((user) => {
          return hashPassword(user.password);
        })
      ).then((hashedPasswords) => {
        const insertUsersQueryStr = format(
          `INSERT INTO users (email, first_name, surname, hashed_password, created_at) VALUES %L;`,
          users.map((user: User, index: number) => [
            user.email,
            user.first_name,
            user.surname,
            hashedPasswords[index],
            user.created_at,
          ])
        );
        return db.query(insertUsersQueryStr);
      });
    })
    .then(() => {
      const insertUserCollectionsQueryStr = format(
        `INSERT INTO user_collections (collection_id, user_id, collection_name, created_at, updated_at) VALUES %L;`,
        userCollections.map((collection: Collection) => [
          collection.collection_id,
          collection.user_id,
          collection.collection_name,
          collection.created_at,
          collection.updated_at,
        ])
      );
      return db.query(insertUserCollectionsQueryStr);
    })
    .then(() => {
      const insertCollectionItemQueryStr = format(
        `INSERT INTO collection_items (relationship_id, collection_id, external_id, api_source, created_at) VALUES %L;`,
        collectionItems.map((collectionItem: CollectionItem) => [
          collectionItem.relationship_id,
          collectionItem.collection_id,
          collectionItem.external_id,
          collectionItem.api_source,
          collectionItem.created_at,
        ])
      );
      return db.query(insertCollectionItemQueryStr);
    });
}
