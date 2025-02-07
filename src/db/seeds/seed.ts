// import { Collection, CollectionItem, SeedData, User } from "../../types/types";
// import { hashPassword } from "../../utils/auth-utils";
// import db from "../connection";
// import format from "pg-format";

// export function seed({ users, userCollections, collectionItems }: SeedData) {
//   return db
//     .query(`DROP TABLE IF EXISTS collection_items;`)
//     .then(() => {
//       return db.query(`DROP TABLE IF EXISTS user_collections;`);
//     })
//     .then(() => {
//       return db.query(`DROP TABLE IF EXISTS users;`);
//     })
//     .then(() => {
//       return db.query(`
//         CREATE TABLE users(
//             user_id SERIAL PRIMARY KEY,
//             email VARCHAR(50) NOT NULL UNIQUE,
//             first_name VARCHAR(50) NOT NULL,
//             surname VARCHAR(50) NOT NULL,
//             hashed_password VARCHAR(100) NOT NULL,
//             created_at TIMESTAMP DEFAULT NOW()
//         );`);
//     })
//     .then(() => {
//       return db.query(`
//         CREATE TABLE user_collections(
//             collection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//             user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
//             collection_name VARCHAR(100) NOT NULL,
//             created_at TIMESTAMP DEFAULT NOW(),
//             updated_at TIMESTAMP DEFAULT NOW()
//         );`);
//     })
//     .then(() => {
//       return db.query(`
//         CREATE TABLE collection_items(
//             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//             collection_id UUID REFERENCES user_collections(collection_id) ON DELETE CASCADE,
//             external_id BIGINT NOT NULL,
//             api_source VARCHAR(100) NOT NULL,
//             item_title VARCHAR(255) NOT NULL,
//             artist VARCHAR(255) NOT NULL,
//             image_url VARCHAR(255) NOT NULL,
//             item_created_at VARCHAR(255) NOT NULL,
//             added_at TIMESTAMP DEFAULT NOW(),
//             UNIQUE(collection_id, external_id, api_source)
//         );`);
//     })
//     .then(() => {
//       return Promise.all(
//         users.map((user) => {
//           return hashPassword(user.password);
//         })
//       ).then((hashedPasswords) => {
//         const insertUsersQueryStr = format(
//           `INSERT INTO users (email, first_name, surname, hashed_password, created_at) VALUES %L;`,
//           users.map((user: User, index: number) => [
//             user.email,
//             user.first_name,
//             user.surname,
//             hashedPasswords[index],
//             user.created_at,
//           ])
//         );
//         return db.query(insertUsersQueryStr);
//       });
//     })
//     .then(() => {
//       const insertUserCollectionsQueryStr = format(
//         `INSERT INTO user_collections ( user_id, collection_name, created_at, updated_at) VALUES %L;`,
//         userCollections.map((collection: Collection) => [
//           collection.user_id,
//           collection.collection_name,
//           collection.created_at,
//           collection.updated_at,
//         ])
//       );
//       return db.query(insertUserCollectionsQueryStr);
//     })
//     .then(() => {
//       const insertCollectionItemQueryStr = format(
//         `INSERT INTO collection_items (collection_id, external_id, api_source, item_title, artist, image_url, item_created_at) VALUES %L;`,
//         collectionItems.map((collectionItem: CollectionItem) => [
//           collectionItem.collection_id,
//           collectionItem.external_id,
//           collectionItem.api_source,
//           collectionItem.item_title,
//           collectionItem.artist,
//           collectionItem.image_url,
//           collectionItem.item_created_at,
//         ])
//       );
//       return db.query(insertCollectionItemQueryStr);
//     });
// }

import { Collection, CollectionItem, SeedData, User } from "../../types/types";
import { hashPassword } from "../../utils/auth-utils";
import db from "../connection";
import format from "pg-format";

export function seed({ users, userCollections, collectionItems }: SeedData) {
  return db
    .query("BEGIN;") // ✅ Start transaction for atomicity
    .then(() =>
      db.query(`
        DROP TABLE IF EXISTS collection_items;
        DROP TABLE IF EXISTS user_collections;
        DROP TABLE IF EXISTS users;
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE users(
            user_id SERIAL PRIMARY KEY,
            email VARCHAR(50) NOT NULL UNIQUE,
            first_name VARCHAR(50) NOT NULL,
            surname VARCHAR(50) NOT NULL,
            hashed_password VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );`)
    )
    .then(() =>
      db.query(`
        CREATE TABLE user_collections(
            collection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
            collection_name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );`)
    )
    .then(() =>
      db.query(`
        CREATE TABLE collection_items(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            collection_id UUID REFERENCES user_collections(collection_id) ON DELETE CASCADE,
            external_id BIGINT NOT NULL,
            api_source VARCHAR(100) NOT NULL,
            item_title VARCHAR(255) NOT NULL,
            artist VARCHAR(255) NOT NULL,
            image_url VARCHAR(255) NOT NULL,
            item_created_at VARCHAR(255) NOT NULL,
            added_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(collection_id, external_id, api_source)
        );`)
    )
    .then(() => {
      // ✅ Insert users first
      return Promise.all(
        users.map((user) => hashPassword(user.password))
      ).then((hashedPasswords) => {
        const insertUsersQueryStr = format(
          `INSERT INTO users (email, first_name, surname, hashed_password, created_at) VALUES %L RETURNING user_id;`,
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
    .then(({ rows: insertedUsers }) => {
      // ✅ Ensure `userCollections` references a valid `user_id`
      const userIdMap = new Map(users.map((user, index) => [user.email, insertedUsers[index].user_id]));

      const insertUserCollectionsQueryStr = format(
        `INSERT INTO user_collections (user_id, collection_name, created_at, updated_at) VALUES %L RETURNING collection_id;`,
        userCollections.map((collection: Collection) => [
          collection.user_id,
          collection.collection_name,
          collection.created_at,
          collection.updated_at,
        ])
      );
      return db.query(insertUserCollectionsQueryStr);
    })
    .then(({ rows: insertedCollections }) => {
      // ✅ Ensure `collectionItems` references a valid `collection_id`
      const collectionIdMap = new Map(
        userCollections.map((collection, index) => [
          collection.collection_name,
          insertedCollections[index].collection_id,
        ])
      );

      const formattedCollectionItems = collectionItems.map(
        (collectionItem: CollectionItem) => [
          collectionIdMap.get(collectionItem.collection_id) || collectionItem.collection_id, // Ensure valid ID
          collectionItem.external_id,
          collectionItem.api_source,
          collectionItem.item_title,
          collectionItem.artist,
          collectionItem.image_url,
          collectionItem.item_created_at,
        ]
      );

      const insertCollectionItemQueryStr = format(
        `INSERT INTO collection_items (collection_id, external_id, api_source, item_title, artist, image_url, item_created_at) VALUES %L;`,
        formattedCollectionItems
      );

      return db.query(insertCollectionItemQueryStr);
    })
    .then(() => db.query("COMMIT;")) // Commit transaction
    .catch((err) => {
      db.query("ROLLBACK;"); // Rollback transaction on error
      console.error("Seeding error:", err);
      throw err;
    });
}
