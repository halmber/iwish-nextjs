"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function signInAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log({ response });
  } catch (error) {
    // if (error instanceof AuthError) {
    //   switch (error.type) {
    //     case "CredentialsSignin":
    //       return "Invalid credentials." as string;
    //     default:
    //       return "Something went wrong." as string;
    //   }
    // }
    throw error;
  }
  redirect("/");
}
