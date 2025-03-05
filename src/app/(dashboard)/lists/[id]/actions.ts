"use server";

import { prisma } from "@/lib/prisma";
import { wishSchema, WishSchemaType } from "./schemas";
import { revalidatePath } from "next/cache";

export async function editWishAction(data: WishSchemaType, id: string) {
  const { success, data: safeData, error } = wishSchema.safeParse(data);

  if (!success) {
    return {
      success: false,
      error: error.toString(),
    };
  }

  try {
    // ! add ownerid checking
    const wish = await prisma.wish.update({
      where: { id },
      data: {
        ...safeData,
        desiredGiftDate: safeData?.desiredGiftDate?.toISOString(),
      },
    });

    revalidatePath(`/lists/${id}`);

    return {
      success: true,
      data: wish,
    };
  } catch (error) {
    return { success: false, error: `Failed editing wish: ${error}` };
  }
}

export async function deleteWishAction(id: string) {
  try {
    // ! add ownerId checking
    await prisma.wish.delete({
      where: { id },
    });

    revalidatePath(`/lists/${id}`);

    return {
      success: true,
    };
  } catch (error) {
    return { success: false, error: `Failed deleting wish: ${error}` };
  }
}
