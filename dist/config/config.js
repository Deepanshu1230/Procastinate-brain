"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.DB_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getEnv(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`Missing env variable: ${name}`);
    return value;
}
exports.PORT = getEnv("PORT") || 3000;
exports.DB_URL = getEnv("DATA_BASE_URL");
exports.JWT_SECRET = getEnv("JWT_TOKEN");
