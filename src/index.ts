import express from "express";
import { ZodError } from "zod";
import {ConnectDb} from "./db/db";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import { Usermodel } from "./model/userSchema";
import { signupSchema } from "./zodSchema/signupSchema";
import {JWT_SECRET} from "./config/config";
import {Usermiddleware} from "./middleware/middleware";
import {ContentModel} from "./model/contentSchema";
const app = express();



app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {

     const firstName = req.body.firstName;
     const lastName = req.body.lastName;
     const emailId=req.body.emailId;
     const password=req.body.password;
  try {
    //zod validation and password hash
    signupSchema.parse({ firstName:firstName,lastName:lastName, emailId:emailId,password:password }); //zod validartion
    

    const passwordHash=await bcrypt.hash(password,10);
    await Usermodel.create({
      firstName:firstName,
      lastName:lastName,
      emailId:emailId,
      password: passwordHash,
    });

    res.json({
      message: "User Signup Succesfully",
    });
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: err.errors });
    }

    res.status(500).json({ error: String(err) });

  }
});

app.post("/api/v1/login",async  (req, res) => {
     const {emailId,password}=req.body;

     try{
            const User=await Usermodel.findOne({emailId:emailId});

     if(!User){
       throw new Error("Email Id is not Present in Db");
     }
     
       const confirmPassword=await bcrypt.compare(password,User.password);

       if(confirmPassword){
        const token=jwt.sign({
          id:User._id
        },JWT_SECRET,{expiresIn:"1d"});
        
         res.json({
        message:"User Login SuccesFull",
        token
         })
        }

        else{
         throw new Error("Password is Invalid");
      }



      }
    
    catch(err){
       if (err instanceof Error) {
    res.status(400).send("ERROR: " + err.message);
  } else {
    res.status(400).send("ERROR: " + String(err));
  }
      

     }

     


});

interface AuthenticatedRequest extends Request {
  userId?: string;
}

app.post("/api/v1/content",Usermiddleware,async (req, res) => {

  try{

     const link=req.body.link;
     const type=req.body.type;
     const title=req.body.title;

    await ContentModel.create({
      link,
      type,
      title,
      userId:(req as any).userId,
      tags:[]
     });


     res.json({
      message:"Content Added Succlesfull"
     })

  }
  catch(err){
    res.send(403).json({
      message:String(err)
    })
  }
     
     
      
});

app.get("/api/v1/content",Usermiddleware,async (req, res) => {

  try{
       const userId=(req as any).userId;

       const content=await ContentModel.find({
        userId:userId
       }).populate("userId"," firstName")

       res.json({
        Content:content
       })
    

  }
  catch(err){
       res.status(400).send("Error: "+ String(err));
    
    }
  
  
  
  
});
 
     
     
      


app.post("/api/v1/brain/share", (req, res) => {
     
});

app.delete("/api/v1/content",Usermiddleware, async (req, res) => {

  try{

    const contentId=req.body.contentId;
    const userId=(req as any).userId;

  await ContentModel.deleteOne({
    contentId,
    userId:userId
    
  })

  res.status(200).json({
    message:"Deleted Succesfully"
  })


  }
  catch(err){

    res.status(403).json({
      message:"Trying to delete a doc you dont own",
      Error:String(err)
    })

  }

  

});

app.get("/api/v1/brain/:sharelink", (req, res) => {});




ConnectDb().then(()=>{
    console.log("Database Connection Establised");
    app.listen(3000,()=>{
        console.log("Listening on port 300")
    });
}).catch((err)=>{
    console.log("Enable to connect to the database",err);
});
