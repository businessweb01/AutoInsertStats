// db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let host = process.env.DB_HOST;

try {
  const connection = await mysql.createConnection({
    host,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  await connection.ping();
  console.log(`[✔] Connected to DB via host: ${host}`);
  await connection.end();
} catch (err) {
  console.warn(`[⚠️] Failed on hostname, trying fallback IP...`);
  host = 'ftp.multinetworkcatv.com '; // 👈 replace with actual fallback IP

  try {
    const connection = await mysql.createConnection({
    host: process.env.DB_HOST || host,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    await connection.ping();
    console.log(`[✔] Connected to DB via fallback IP: ${host}`);
    await connection.end();
  } catch (err2) {
    console.error('[❌] DB connection failed:', err2.message);
    process.exit(1);
  }
}

// 🔁 Export pool for queries
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
