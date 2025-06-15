"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const contentSchema = new mongoose_2.Schema({
    type: {
        type: String,
    },
    link: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tags: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "Tag"
        }],
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {
    timestamps: true
});
exports.ContentModel = (0, mongoose_2.model)("Content", contentSchema);
