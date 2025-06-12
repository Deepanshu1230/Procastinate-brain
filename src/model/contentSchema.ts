import mongoose from "mongoose";
import { Schema,model } from "mongoose";


const contentSchema=new Schema({
   
    type:{
        type:String,
    },
      
    link:{
        type:String,
        required:true
    },
    
    title:{
        type:String,
        required:true
       
    },

    tags:[{
        type:mongoose.Types.ObjectId,
        ref:"Tag"

    }],

    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },


   
        




}, {
        timestamps:true
    });


export const ContentModel=model("Content",contentSchema);