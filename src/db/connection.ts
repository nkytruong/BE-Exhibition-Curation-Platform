import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

const ENV = process.env.NODE_ENV || "development";

// Load environment variables from the appropriate .env file
dotenv.config({
  // path: `${__dirname}/../.env.${ENV}`,
  path: `.env.${ENV}`
});

// console.log(`🔍 Using environment file: .env.${ENV}`);
console.log(`📌 PGDATABASE:`, process.env.PGDATABASE);
// console.log(`📌 DATABASE_URL:`, process.env.DATABASE_URL);

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config: PoolConfig = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2; // Limit the number of connections in production
}

const db = new Pool(config);

export default db;
