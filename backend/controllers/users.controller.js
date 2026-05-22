import { db } from "../config/db.js";
import {countUsers, getAllUsers} from '../models/users.model.js';

// Get All users count for CRM
export const getUserCount = async(req, res)=>{
    try{
        const totalUsers = await countUsers();
        res.json({totalUsers});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

// Get all Users for CRM
export const getUserData = async(req, res)=>{
    try{
        const userData = await getAllUsers();
        res.status(200).json({userData})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}