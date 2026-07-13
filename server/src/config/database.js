import mysql from 'mysql2/promise';
import { env } from './env.js';

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
  charset: 'utf8mb4',
});

let databaseStatus = 'disconnected';

export function getDatabaseStatus() {
  return databaseStatus;
}

export async function testDatabaseConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    databaseStatus = 'connected';
  } finally {
    connection.release();
  }
}

export async function withTransaction(callback) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
