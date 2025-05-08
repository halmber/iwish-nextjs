"use server";
import { auth, signOut } from "@/auth";
import { profileFormSchema, ProfileFormSchemaType } from "./schemas";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FriendshipStatus } from "@prisma/client";

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
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: "Failed to update profile. Please try again.",
    };
  }
}

// Send a friend request
export async function sendFriendRequest(receiverId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to send a friend request." };
  }

  const senderId = session.user.id;

  // Don't allow sending requests to yourself
  if (senderId === receiverId) {
    return { error: "You cannot send a friend request to yourself." };
  }

  // Check if a friendship already exists
  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
  });

  if (existingFriendship) {
    if (existingFriendship.status === FriendshipStatus.ACCEPTED) {
      return { error: "You are already friends with this user." };
    } else if (existingFriendship.status === FriendshipStatus.PENDING) {
      if (existingFriendship.senderId === senderId) {
        return {
          error: "You have already sent a friend request to this user.",
        };
      } else {
        return {
          error:
            "This user has already sent you a friend request. Check your notifications.",
        };
      }
    } else if (existingFriendship.status === FriendshipStatus.REJECTED) {
      // If previously rejected, allow to send again by updating the status
      await prisma.friendship.update({
        where: { id: existingFriendship.id },
        data: {
          status: FriendshipStatus.PENDING,
          senderId: senderId,
          receiverId: receiverId,
          updatedAt: new Date(),
        },
      });

      // Create a notification for the receiver
      // const sender = await prisma.user.findUnique({
      //   where: { id: senderId },
      //   select: { name: true, email: true },
      // });

      // const senderName = sender?.name || sender?.email || "Someone";

      // await prisma.notification.create({
      //   data: {
      //     userId: receiverId,
      //     type: "friend_request",
      //     message: `${senderName} sent you a friend request.`,
      //     data: { friendshipId: existingFriendship.id },
      //   },
      // });

      revalidatePath("/friends");
      return { success: true, friendship: existingFriendship };
    }
  }

  // Create the friendship with PENDING status
  try {
    const friendship = await prisma.friendship.create({
      data: {
        senderId,
        receiverId,
        status: FriendshipStatus.PENDING,
      },
    });

    // Create a notification for the receiver
    // const sender = await prisma.user.findUnique({
    //   where: { id: senderId },
    //   select: { name: true, email: true },
    // });

    // const senderName = sender?.name || sender?.email || "Someone";

    // await prisma.notification.create({
    //   data: {
    //     userId: receiverId,
    //     type: "friend_request",
    //     message: `${senderName} sent you a friend request.`,
    //     data: { friendshipId: friendship.id },
    //   },
    // });

    revalidatePath("/friends");
    return { success: true, friendship };
  } catch (error) {
    console.error("Error sending friend request:", error);
    return { error: "Failed to send friend request. Please try again." };
  }
}

// Accept a friend request
export async function acceptFriendRequest(friendshipId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to accept a friend request." };
  }

  const userId = session.user.id;

  try {
    // Get the friendship
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
      include: { sender: true },
    });

    if (!friendship) {
      return { error: "Friend request not found." };
    }

    if (friendship.receiverId !== userId) {
      return { error: "You are not authorized to accept this friend request." };
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      return { error: "This friend request has already been processed." };
    }

    // Update the friendship status
    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: FriendshipStatus.ACCEPTED },
    });

    // Create a notification for the sender
    // const receiver = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { name: true, email: true },
    // });

    // const receiverName = receiver?.name || receiver?.email || "Someone";

    // await prisma.notification.create({
    //   data: {
    //     userId: friendship.senderId,
    //     type: "friend_accepted",
    //     message: `${receiverName} accepted your friend request.`,
    //     data: { friendshipId: friendship.id },
    //   },
    // });

    // // Mark the original notification as read
    // await prisma.notification.updateMany({
    //   where: {
    //     userId,
    //     type: "friend_request",
    //     data: { path: "$.friendshipId", equals: friendshipId },
    //   },
    //   data: { read: true },
    // });

    revalidatePath("/friends");
    revalidatePath("/notifications");
    return { success: true, friendship: updatedFriendship };
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return { error: "Failed to accept friend request. Please try again." };
  }
}

// Decline a friend request
export async function declineFriendRequest(friendshipId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to decline a friend request." };
  }

  const userId = session.user.id;

  try {
    // Get the friendship
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      return { error: "Friend request not found." };
    }

    if (friendship.receiverId !== userId) {
      return {
        error: "You are not authorized to decline this friend request.",
      };
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      return { error: "This friend request has already been processed." };
    }

    // Update the friendship status
    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: FriendshipStatus.REJECTED },
    });

    // Mark the notification as read
    // await prisma.notification.updateMany({
    //   where: {
    //     userId,
    //     type: "friend_request",
    //     data: { path: "$.friendshipId", equals: friendshipId },
    //   },
    //   data: { read: true },
    // });

    revalidatePath("/friends");
    revalidatePath("/notifications");
    return { success: true, friendship: updatedFriendship };
  } catch (error) {
    console.error("Error declining friend request:", error);
    return { error: "Failed to decline friend request. Please try again." };
  }
}

// Remove a friend
export async function removeFriend(friendId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to remove a friend." };
  }

  const userId = session.user.id;

  try {
    await prisma.friendship.deleteMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: friendId,
            status: FriendshipStatus.ACCEPTED,
          },
          {
            senderId: friendId,
            receiverId: userId,
            status: FriendshipStatus.ACCEPTED,
          },
        ],
      },
    });

    revalidatePath("/friends");
    return { success: true };
  } catch (error) {
    console.error("Error removing friend:", error);
    return { error: "Failed to remove friend. Please try again." };
  }
}

export async function getFriends() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to view your friends." };
  }

  const userId = session.user.id;

  try {
    // Get friendships where the user is either sender or receiver and status is ACCEPTED
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId, status: FriendshipStatus.ACCEPTED },
          { receiverId: userId, status: FriendshipStatus.ACCEPTED },
        ],
      },
      select: {
        senderId: true,
        receiverId: true,
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    const friends = friendships.map((f) =>
      f.senderId === userId ? f.receiver : f.sender,
    );

    return { success: true, friends };
  } catch (error) {
    console.error("Error getting friends:", error);
    return { error: "Failed to get friends. Please try again." };
  }
}

export async function searchUsers(query: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to search for users." };
  }

  const userId = session.user.id;

  if (!query || query.length < 2) {
    return { users: [] };
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: userId },
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      take: 10,
    });

    // Get friendships to check status
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });

    const usersWithStatus = users.map((user) => {
      const sentFriendship = friendships.find(
        (f) => f.senderId === userId && f.receiverId === user.id,
      );
      const receivedFriendship = friendships.find(
        (f) => f.senderId === user.id && f.receiverId === userId,
      );

      let status = "none";
      let friendshipId = null;

      if (sentFriendship) {
        status = sentFriendship.status.toLowerCase();
        friendshipId = sentFriendship.id;
      } else if (receivedFriendship) {
        status = `received_${receivedFriendship.status.toLowerCase()}`;
        friendshipId = receivedFriendship.id;
      }

      return {
        ...user,
        status,
        friendshipId,
      };
    });

    return { success: true, users: usersWithStatus };
  } catch (error) {
    console.error("Error searching users:", error);
    return { error: "Failed to search users. Please try again." };
  }
}
