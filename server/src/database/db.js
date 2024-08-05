import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise'

const pool = mysql.createPool(process.env.DB_URL);

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
