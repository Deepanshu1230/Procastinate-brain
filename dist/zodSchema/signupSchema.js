"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(4, "Enter the Valid name"),
    lastName: zod_1.z.string(),
    emailId: zod_1.z.string().email("Invalid email Format"),
    password: zod_1.z.string().min(6, "Password must be of the 6 length"),
});
// export type Signinput=z.infer<typeof signupSchema>;
