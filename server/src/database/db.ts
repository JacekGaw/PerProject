import "dotenv/config";
import pkg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from 'drizzle-orm/node-postgres/migrator';
const { Pool } = pkg;
import * as schema from "./schemas.js";

export const pool = new Pool({
  connectionString: process.env.DB_URL,
});

const db = drizzle(pool, {schema});

export const runDB = async () => {
  try {
    const res = await pool.query('SELECT 1');
    console.log('Database connection successful:', res.rows[0]);
    console.log('Migration started');
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migration completed');
  } catch (err) {
    console.error("Error during connection or migration database: ", err);
  }
}

export default db;
