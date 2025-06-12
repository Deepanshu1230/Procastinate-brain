import {DB_URL} from "../config/config"
import mongoose from "mongoose";


export const ConnectDb= async()=>{
         await mongoose.connect(DB_URL);
}





