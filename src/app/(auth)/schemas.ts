import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Username must be at least 2 characters."),
  email: z.string().trim().email(),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});
export type SignUpSchemaType = z.infer<typeof signUpSchema>;

export const signInSchema = signUpSchema.omit({ name: true });
export type SignInSchemaType = z.infer<typeof signInSchema>;
