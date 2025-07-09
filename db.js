// db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let host = process.env.DB_HOST;
const fallbackHost = '103.231.161.234'; // 👈 replace with actual IP if needed

async function determineHost() {
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
    return host;
  } catch (err) {
    console.warn(`[⚠️] Failed on hostname (${host}), trying fallback IP...`);

    try {
      const connection = await mysql.createConnection({
        host: fallbackHost,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
      await connection.ping();
      console.log(`[✔] Connected to DB via fallback IP: ${fallbackHost}`);
      await connection.end();
      return fallbackHost;
    } catch (err2) {
      console.error('[❌] DB connection failed:', err2.message);
      process.exit(1);
    }
  }
}

// Create and export the pool after determining the working host
const resolvedHost = await determineHost();

export const pool = mysql.createPool({
  host: resolvedHost,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
