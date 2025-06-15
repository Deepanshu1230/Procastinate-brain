"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usermiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const Usermiddleware = (req, res, next) => {
    try {
        const header = req.headers["authorization"];
        const decode = jsonwebtoken_1.default.verify(header, config_1.JWT_SECRET);
        if (decode) {
            req.userId = decode.id;
            next();
        }
        else {
            res.status(403).json({
                message: "Unable to login",
            });
        }
    }
    catch (err) {
        res.send("Error: " + String(err));
    }
};
exports.Usermiddleware = Usermiddleware;
