import { db } from "../config/db.js";

// Count User model for CRM
export const countUsers = async() =>{
    const sql = `
        SELECT COUNT(*) AS totalUsers FROM users
    `
    const [rows] = await db.query(sql);
    return rows[0].totalUsers;
}

// Get All Users
export const getAllUsers = async() =>{
    const sql = `
        SELECT * FROM users
    `;
    const [rows] = await db.query(sql);
    return rows; 
}