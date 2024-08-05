import "dotenv/config";
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise'

// Ensure the DB_URL is defined
const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  throw new Error('DB_URL environment variable is not defined');
}

const pool = mysql.createPool(dbUrl);

const db = drizzle(pool);

export async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log('Database connection successful');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

export default db;
