import { db } from "../config/db.js";

// ✅ ADD ADDRESS
export const addAddress = async (data) => {
  const sql = `
    INSERT INTO useraddress 
    (user_id, pincode, house_no, strt_add, landmark, state, type, status, name, phNum)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, data);
  return result;
};


// ✅ GET ALL ADDRESSES OF USER
export const getAddressByUser = async (userId) => {
  const sql = `
    SELECT * FROM useraddress
    WHERE user_id = ?
    ORDER BY id DESC
  `;
  const [rows] = await db.query(sql, [userId]);
  return rows;
};


// ✅ UPDATE ADDRESS
export const updateAddress = async (id, data) => {
  const sql = `
    UPDATE useraddress
    SET 
      pincode = ?, 
      house_no = ?, 
      strt_add = ?, 
      landmark = ?, 
      state = ?, 
      type = ?, 
      name = ?, 
      phNum = ?
    WHERE id = ?
  `;
  const [result] = await db.query(sql, [...data, id]);
  return result;
};


// ✅ DELETE ADDRESS
export const deleteAddress = async (id) => {
  const sql = `
    DELETE FROM useraddress WHERE id = ?
  `;
  const [result] = await db.query(sql, [id]);
  return result;
};


// // ✅ SET DEFAULT ADDRESS (status = Active)
// export const setDefaultAddress = async (userId, addressId) => {
//   // Step 1: sabko inactive karo
//   await db.query(
//     `UPDATE useraddress SET status = 'Inactive' WHERE user_id = ?`,
//     [userId]
//   );

//   // Step 2: ek ko active karo
//   const [result] = await db.query(
//     `UPDATE useraddress SET status = 'Active' WHERE id = ? AND user_id = ?`,
//     [addressId, userId]
//   );

//   return result;
// };