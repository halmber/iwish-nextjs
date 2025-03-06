"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { wishlistSchema, WishlistSchemaType } from "./schemas";

export async function editWishlistAction(data: WishlistSchemaType, id: string) {
  const { success, data: safeData, error } = wishlistSchema.safeParse(data);

  if (!success) {
    return {
      success: false,
      error: error.toString(),
    };
  }

  try {
    // ! add ownerId checking
    const wishlist = await prisma.list.update({
      where: { id },
      data: {
        ...safeData,
      },
    });

    revalidatePath(`/lists`);

    return {
      success: true,
      data: wishlist,
    };
  } catch (error) {
    return { success: false, error: `Failed editing wishlist: ${error}` };
  }
}

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
