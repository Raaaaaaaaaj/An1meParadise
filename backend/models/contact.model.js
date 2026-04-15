import { db } from "../config/db.js";

// ✅ ADD CONTACT MESSAGE
export const addContactMessage = async (data) => {
  const sql = `
    INSERT INTO contact_messages 
    (name, email, number, message)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, data);
  return result;
};


// ✅ GET ALL MESSAGES (ADMIN USE)
export const getAllMessages = async () => {
  const sql = `
    SELECT * FROM contact_messages
    ORDER BY id DESC
  `;
  const [rows] = await db.query(sql);
  return rows;
};


// ✅ GET SINGLE MESSAGE BY ID
export const getMessageById = async (id) => {
  const sql = `
    SELECT * FROM contact_messages
    WHERE id = ?
  `;
  const [rows] = await db.query(sql, [id]);
  return rows[0];
};


// ✅ DELETE MESSAGE
export const deleteMessage = async (id) => {
  const sql = `
    DELETE FROM contact_messages WHERE id = ?
  `;
  const [result] = await db.query(sql, [id]);
  return result;
};