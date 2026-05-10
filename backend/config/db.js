// import mysql from "mysql2/promise";
// import dotenv from "dotenv";
// dotenv.config();
// export let db;
// export const initDB = async () => {
//   try {
//     db = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//     });
//     console.log("✅ MySQL Connected Successfully");
//   } catch (err) {
//     console.error("❌ DB Connection Failed:", err.message);
//     throw err;
//   }
// };
// export const getDB = () => {
//   if (!db) throw new Error("Database not initialized. Call initDB() before using the DB.");
//   return db;
// };

// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// export const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,

//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});