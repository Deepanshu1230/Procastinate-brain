"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = require("./model/userSchema");
const signupSchema_1 = require("./zodSchema/signupSchema");
const config_1 = require("./config/config");
const middleware_1 = require("./middleware/middleware");
const contentSchema_1 = require("./model/contentSchema");
const utils_1 = require("./utils/utils");
const linkSchema_1 = require("./model/linkSchema");
const config_2 = require("./config/config");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["https://brainly0.netlify.app", "http://localhost:5173"],
    credentials: true,
}));
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailId = req.body.emailId;
    const password = req.body.password;
    try {
        //zod validation and password hash
        console.log(req.body);
        signupSchema_1.signupSchema.parse({
            firstName: firstName,
            lastName: lastName,
            emailId: emailId,
            password: password,
        }); //zod validartion
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        yield userSchema_1.Usermodel.create({
            firstName: firstName,
            lastName: lastName,
            emailId: emailId,
            password: passwordHash,
        });
        res.json({
            message: "User Signup Succesfully",
        });
    }
    catch (err) {
        res.status(500).json({ message: String(err) });
        // console.log(err);
    }
}));
app.post("/api/v1/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { emailId, password } = req.body;
    try {
        const User = yield userSchema_1.Usermodel.findOne({ emailId: emailId });
        if (!User) {
            throw new Error("Email Id is not Present in Db");
        }
        const confirmPassword = yield bcrypt_1.default.compare(password, User.password);
        if (confirmPassword) {
            const token = jsonwebtoken_1.default.sign({
                id: User._id,
            }, config_1.JWT_SECRET, { expiresIn: "1d" });
            res.json({
                message: "User Login SuccesFull",
                token,
            });
        }
        else {
            throw new Error("Password is Invalid");
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        }
        else {
            res.status(400).json({ message: String(err) });
        }
    }
}));
app.post("/api/v1/logout", (req, res) => {
    try {
        const token = req.headers.authorization;
        res.json({
            message: "Logout Succesfull",
        });
    }
    catch (err) {
        res.json({
            message: String(err),
        });
    }
});
app.post("/api/v1/content", middleware_1.Usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const link = req.body.link;
        const type = req.body.type;
        const title = req.body.title;
        yield contentSchema_1.ContentModel.create({
            link,
            type,
            title,
            userId: req.userId,
            tags: [],
        });
        res.json({
            message: "Content Added Succlesfull",
        });
    }
    catch (err) {
        res.send(403).json({
            message: String(err),
        });
    }
}));
app.get("/api/v1/content", middleware_1.Usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const content = yield contentSchema_1.ContentModel.find({
            userId: userId,
        }).populate("userId", " firstName");
        res.json({
            Content: content,
        });
    }
    catch (err) {
        res.status(400).send("Error: " + String(err));
    }
}));
app.post("/api/v1/brain/share", middleware_1.Usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { share } = req.body;
        if (share) {
            const existingUser = yield linkSchema_1.LinkModel.findOne({
                userId: userId,
            });
            if (existingUser) {
                res.json({
                    hash: existingUser.hash,
                });
                return;
            }
            const hash = (0, utils_1.random)(10);
            yield linkSchema_1.LinkModel.create({
                userId: userId,
                hash: hash,
            });
            res.json({
                hash,
            });
        }
        else {
            yield linkSchema_1.LinkModel.deleteOne({
                userId: userId,
            });
            res.json({
                message: "Link deleted",
            });
        }
    }
    catch (err) {
        res.status(400).send(String(err));
    }
}));
app.delete("/api/v1/content/:id", middleware_1.Usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contentId = req.params.id;
        const userId = req.userId;
        yield contentSchema_1.ContentModel.deleteOne({
            _id: contentId,
            userId: userId,
        });
        res.status(200).json({
            message: "Deleted Succesfully",
        });
    }
    catch (err) {
        res.status(403).json({
            message: "Trying to delete a doc you dont own",
            Error: String(err),
        });
    }
}));
app.get("/api/v1/brain/:sharelink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = req.params.sharelink;
        const link = yield linkSchema_1.LinkModel.findOne({
            hash,
        });
        if (!link) {
            res.status(411).json({
                message: "Unable to create a Request",
            });
            return;
        }
        const content = yield contentSchema_1.ContentModel.find({
            userId: link.userId,
        });
        //username
        const user = yield userSchema_1.Usermodel.findOne({
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
    }
    catch (err) {
        res.status(400).json({
            Error: String(err),
        });
    }
}));
(0, db_1.ConnectDb)()
    .then(() => {
    console.log("Database Connection Establised");
    app.listen(config_2.PORT, () => {
        console.log("Listening on port " + `${config_2.PORT}`);
    });
})
    .catch((err) => {
    console.log("Enable to connect to the database", err);
});
