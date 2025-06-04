//mongodb+srv://deepanshukohli042:<db_password>@lumeberjack.h1m50.mongodb.net/?retryWrites=true&w=majority&appName=Lumeberjack//
import mongoose from "mongoose";
//mongodb+srv://deepanshukohli042:pMj47rTJ33vailTY@lumeberjack.h1m50.mongodb.net/?retryWrites=true&w=majority&appName=Lumeberjack//
//mongodb+srv://deepanshukohli042:pMj47rTJ33vailTY@lumeberjack.h1m50.mongodb.net/

export const ConnectDb= async()=>{
         await mongoose.connect("mongodb+srv://deepanshukohli042:3iMyxaIfQKSe106r@lumeberjack.h1m50.mongodb.net/secondBrain");
}





