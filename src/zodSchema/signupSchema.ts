import {z} from "zod";


export const signupSchema=z.object({
    firstName:z.string().min(4,"Enter the Valid name"),
    lastName:z.string(),
    emailId:z.string().email("Invalid email Format"),
    password:z.string().min(6,"Password must be of the 6 length"),
})

// export type Signinput=z.infer<typeof signupSchema>;
