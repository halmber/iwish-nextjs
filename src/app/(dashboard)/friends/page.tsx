import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FriendshipStatus } from "@prisma/client";
import { auth } from "@/auth";
import { FriendsList } from "./FriendsList";
import { UserSearch } from "./UserSearch";
import { getFriends } from "../actions";

export default async function FriendsPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/");
  }

  const result = await getFriends();
  const friends = result?.friends || [];

  if (result.error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Friends</h1>
        <p>{result.error}</p>
      </div>
    );
  }

  const pendingRequests = await prisma.friendship.findMany({
    where: {
      receiverId: session.user.id,
      status: FriendshipStatus.PENDING,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Friends</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <FriendsList friends={friends} pendingRequests={pendingRequests} />
        </div>
        <div>
          <UserSearch />
        </div>
      </div>
    </div>
  );
}
