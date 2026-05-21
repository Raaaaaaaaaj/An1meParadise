import { db } from "../config/db.js";


export const countUsers = async() =>{
    const sql = `
        SELECT COUNT(*) AS totalUsers FROM users
    `
    const [rows] = await db.query(sql);
    return rows[0].totalUsers;
}