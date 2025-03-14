"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { wishlistSchema, WishlistSchemaType } from "./schemas";
import { auth } from "@/auth";

export async function createWishlistAction(data: WishlistSchemaType) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }
  const { success, data: safeData, error } = wishlistSchema.safeParse(data);

  if (!success) {
    return {
      success: false,
      error: error.toString(),
    };
  }

  try {
    // ! add ownerId checking
    const wishlist = await prisma.list.create({
      data: {
        ...safeData,
        type: "wishlist",
        userId: session.user.id,
      },
    });

    revalidatePath(`/lists`);

    return {
      success: true,
      data: wishlist,
    };
  } catch (error) {
    return { success: false, error: `Failed creating wishlist: ${error}` };
  }
}

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

export async function getListsOptions() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
      data: [],
    };
  }
  try {
    // ! add ownerId checking
    const lists = await prisma.list.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      success: true,
      data: lists,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed deleting list: ${error}`,
      data: [],
    };
  }
}
