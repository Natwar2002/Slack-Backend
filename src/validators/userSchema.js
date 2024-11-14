import { z } from "zod";

export const userSignUpSchema = z.object({
    email: z.string().email(),
    username: z.string().min(1),
    password: z.string()
});