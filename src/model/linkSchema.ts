import mongoose from "mongoose";
import {Schema,model} from "mongoose";



const LinkSchema=new Schema({
    hash:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    }

})


export const LinkModel=model("Link",LinkSchema);