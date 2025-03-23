"use server";
import { auth, signOut } from "@/auth";
import { profileFormSchema, ProfileFormSchemaType } from "./schemas";
import { prisma } from "@/lib/prisma";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateProfile(data: ProfileFormSchemaType) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to update your profile." };
  }

  const parsed = profileFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.toString(),
    };
  }

  try {
    if (!session?.user?.email)
      return { success: false, error: "User email not found." };

    const existingUser = await prisma.user.findUnique({
      where: { email: session?.user?.email },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return { success: false, error: "Email is already taken." };
    }

    // Handle image upload if provided
    // let imageUrl = undefined;
    // const image = formData.get("image") as File;

    // if (image && image.size > 0) {
    //   try {
    //     const blob = await uploadToBlob(image);
    //     imageUrl = blob.url;
    //   } catch (error) {
    //     console.error("Error uploading image:", error);
    //     return { error: "Failed to upload image. Please try again." };
    //   }
    // }

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        // ...(imageUrl && { image: imageUrl }),
      },
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    return {
      success: false,
      error: "Failed to update profile. Please try again.",
    };
  }
}
