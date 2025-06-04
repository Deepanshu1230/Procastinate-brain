import { NextFunction,Request,Response} from "express";
import  jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/config";


  interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const Usermiddleware=(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    try{

        const header=req.headers["authorization"];

    const decode=jwt.verify(header as string,JWT_SECRET) as {id:string};

    if(decode){
        req.userId=decode.id;
        next();
    }
    else{
        res.status(403).json({
            message:"Unable to login"
        })
    }


    }
    catch(err){
        
            res.send("Error: "+String(err));
        

    }
    
 
    
}