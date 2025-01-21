import { Collection, Item, SeedData, User } from "../../types/types";
import { hashPassword } from "../../utils/auth_utils";
import db from "../connection";
import format from "pg-format";

// change item_id to integer/number

export function seed({
  users,
  userCollections,
  items,
  collectionItems,
}: SeedData) {
  return db
    .query(`DROP TABLE IF EXISTS collection_items;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS items;`);
    })
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
            password VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE user_collections(
            collection_id UUID PRIMARY KEY,
            user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
            collection_name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE items(
            item_id UUID PRIMARY KEY,
            external_id VARCHAR(255) NOT NULL,
            api_source VARCHAR (255) NOT NULL,
            classification VARCHAR(50) NOT NULL,
            item_title VARCHAR(255) NOT NULL,
            artist VARCHAR(255) NOT NULL,
            thumbnail_url TEXT,
            full_image_url TEXT,
            details_url TEXT,
            date_created VARCHAR(50)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE collection_items(
            relationship_id UUID PRIMARY KEY,
            collection_id UUID REFERENCES user_collections(collection_id) ON DELETE CASCADE,
            item_id UUID REFERENCES items(item_id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT NOW()
        );`);
    })
    .then(() => {
      return Promise.all(
        users.map((user) => {
          return hashPassword(user.password);
        })
      ).then((hashedPasswords) => {
        const insertUsersQueryStr = format(
          `INSERT INTO users (user_id, first_name, surname, password, created_at) VALUES %L;`,
          users.map((user: User, index: number) => [
            user.user_id,
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
                collection.updated_at
            ])
        )
        return db.query(insertUserCollectionsQueryStr)
    })
    .then(() => {
        const insertItemsQueryStr = format(
            `INSERT INTO items (item_id, external_id, api_source, classification, item_title, artist, thumbnail_url, details_url, date_created) VALUES %L;`,
            items.map((item: Item) => [
                item.item_id,
                item.external_id,
                item.api_source,
                item.classification,
                item.item_title,
                item.artist,
                item.thumbnail_url,
                item.full_image_url,
                item.details_url,
                item.date_created
            ])
        )
        return db.query(insertItemsQueryStr)
    })
    .then(() => {
        const insertCollectionItemQueryStr = format(
            `INSERT INTO collection_items (relationship_id, collection_id, item_id, created_at) VALUES %L;`,
            collectionItems.map((collectionItem) => [
                collectionItem.relationship_id,
                collectionItem.collection_id,
                collectionItem.item_id,
                collectionItem.created_at
            ])
        )
        return db.query(insertCollectionItemQueryStr)
    })
}
