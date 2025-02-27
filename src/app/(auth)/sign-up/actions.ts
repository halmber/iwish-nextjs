"use server";

import { prisma } from "@/lib/prisma";
import { signUpSchema, SignUpSchemaType } from "../schemas";
import { hash } from "bcryptjs";

export async function signUpAction(data: SignUpSchemaType) {
  const parsed = signUpSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.toString(),
    };
  }

  try {
    const { name, email, password } = parsed.data;
    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: `Failed to create account: ${error}` };
  }
}
