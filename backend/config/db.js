import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export let db;

export const initDB = async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("✅ MySQL Connected Successfully");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
    throw err;
  }
};

export const getDB = () => {
  if (!db) throw new Error("Database not initialized. Call initDB() before using the DB.");
  return db;
};