import express from "express";
import { ZodError } from "zod";
import { ConnectDb } from "./db/db";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usermodel } from "./model/userSchema";
import { signupSchema } from "./zodSchema/signupSchema";
import { JWT_SECRET } from "./config/config";
import { Usermiddleware } from "./middleware/middleware";
import { ContentModel } from "./model/contentSchema";
import { random } from "./utils/utils";
import { LinkModel } from "./model/linkSchema";
import { PORT } from "./config/config";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({
  origin:"https://brainly0.netlify.app",
  credentials:true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
dotenv.config();

app.post("/api/v1/signup", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailId = req.body.emailId;
  const password = req.body.password;
  try {
    //zod validation and password hash
    console.log(req.body);
    signupSchema.parse({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: password,
    }); //zod validartion

    const passwordHash = await bcrypt.hash(password, 10);
    await Usermodel.create({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: passwordHash,
    });

    res.json({
      message: "User Signup Succesfully",
    });
  } catch (err) {
    res.status(500).json({ message: String(err) });
    // console.log(err);
  }
});

app.post("/api/v1/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const User = await Usermodel.findOne({ emailId: emailId });

    if (!User) {
      throw new Error("Email Id is not Present in Db");
    }

    const confirmPassword = await bcrypt.compare(password, User.password);

    if (confirmPassword) {
      const token = jwt.sign(
        {
          id: User._id,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "User Login SuccesFull",
        token,
      });
    } else {
      throw new Error("Password is Invalid");
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: String(err) });
    }
  }
});

app.post("/api/v1/logout", (req, res) => {
  try {
    const token = req.headers.authorization;

    res.json({
      message: "Logout Succesfull",
    });
  } catch (err) {
    res.json({
      message: String(err),
    });
  }
});

interface AuthenticatedRequest extends Request {
  userId?: string;
}

app.post("/api/v1/content", Usermiddleware, async (req, res) => {
  try {
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;

    await ContentModel.create({
      link,
      type,
      title,
      userId: (req as any).userId,
      tags: [],
    });

    res.json({
      message: "Content Added Succlesfull",
    });
  } catch (err) {
    res.send(403).json({
      message: String(err),
    });
  }
});

app.get("/api/v1/content", Usermiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;

    const content = await ContentModel.find({
      userId: userId,
    }).populate("userId", " firstName");

    res.json({
      Content: content,
    });
  } catch (err) {
    res.status(400).send("Error: " + String(err));
  }
});

app.post("/api/v1/brain/share", Usermiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { share } = req.body;

    if (share) {
      const existingUser = await LinkModel.findOne({
        userId: userId,
      });

      if (existingUser) {
        res.json({
          hash: existingUser.hash,
        });
        return;
      }

      const hash = random(10);

      await LinkModel.create({
        userId: userId,
        hash: hash,
      });

      res.json({
        hash,
      });
    } else {
      await LinkModel.deleteOne({
        userId: userId,
      });

      res.json({
        message: "Link deleted",
      });
    }
  } catch (err) {
    res.status(400).send(String(err));
  }
});

app.delete("/api/v1/content/:id", Usermiddleware, async (req, res) => {
  try {
    const contentId = req.params.id;
    const userId = (req as any).userId;

    await ContentModel.deleteOne({
      _id: contentId,
      userId: userId,
    });

    res.status(200).json({
      message: "Deleted Succesfully",
    });
  } catch (err) {
    res.status(403).json({
      message: "Trying to delete a doc you dont own",
      Error: String(err),
    });
  }
});

app.get("/api/v1/brain/:sharelink", async (req, res) => {
  try {
    const hash = req.params.sharelink;

    const link = await LinkModel.findOne({
      hash,
    });

    if (!link) {
      res.status(411).json({
        message: "Unable to create a Request",
      });

      return;
    }

    const content = await ContentModel.find({
      userId: link.userId,
    });

    //username

    const user = await Usermodel.findOne({
      _id: link.userId,
    });

    if (!user) {
      res.status(411).json({
        message: "Dont no why unable to get user",
      });

      return;
    }

    res.json({
      username: user.firstName,
      content,
    });
  } catch (err) {
    res.status(400).json({
      Error: String(err),
    });
  }
});

ConnectDb()
  .then(() => {
    console.log("Database Connection Establised");
    app.listen(PORT, () => {
      console.log("Listening on port " + `${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Enable to connect to the database", err);
  });
