import mongoose from "mongoose";
import { model,Schema} from "mongoose";



const UserSchema=new Schema({

    firstName:{
        type:String,
        required:true,
        unique:true,

    },

    lastName:{
        type:String
    },

    emailId:{
        type:String,
        unique:true,
        lowercase:true,
        required:true,
        trim:true,
      
    },

    password:{
        type:String,
        required:true

    },

  

    
    
   
});




export const Usermodel=model("User",UserSchema);