import { db } from "../config/db.js";
import {countUsers} from '../models/users.model.js';

export const getUserCount = async(req, res)=>{
    try{
        const totalUsers = await countUsers();
        res.json({totalUsers});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}