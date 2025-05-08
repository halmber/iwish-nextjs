"use server";

import { signIn } from "@/auth";
import { signInSchema, SignInSchemaType } from "../schemas";

export async function signInAction(data: SignInSchemaType) {
  const parsed = signInSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.toString(),
    };
  }

  const { email, password } = parsed.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: `Invalid credentials: ${error}` };
  }
}
