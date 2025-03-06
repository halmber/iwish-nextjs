"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteListAction(id: string) {
  try {
    // ! add ownerId checking
    await prisma.list.delete({
      where: { id },
    });

    revalidatePath(`/lists`);

    return {
      success: true,
    };
  } catch (error) {
    return { success: false, error: `Failed deleting list: ${error}` };
  }
}
