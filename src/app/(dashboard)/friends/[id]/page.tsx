import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Gift } from "lucide-react";
import { FriendshipStatus } from "@prisma/client";
import { auth } from "@/auth";
import { VISIBILITY } from "@/lib/constants";

export default async function FriendProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session || !session?.user?.id) {
    redirect("/");
  }

  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        {
          senderId: session.user.id,
          receiverId: id,
          status: FriendshipStatus.ACCEPTED,
        },
        {
          senderId: id,
          receiverId: session.user.id,
          status: FriendshipStatus.ACCEPTED,
        },
      ],
    },
  });

  if (!friendship) {
    notFound();
  }

  const friend = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  if (!friend) {
    notFound();
  }

  const wishlists = await prisma.list.findMany({
    where: {
      userId: id,
      visibility: VISIBILITY.PUBLIC,
      type: "wishlist",
    },
    include: {
      _count: {
        select: { wishes: true },
      },
    },
  });

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative h-32 w-32 rounded-full overflow-hidden">
                  {friend.image ? (
                    <Image
                      src={friend.image || "/"}
                      alt={friend.name || "Friend"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl">
                {friend.name || "User"}
              </CardTitle>
              <CardDescription>{friend.email}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Public Wishlists</h2>

          {wishlists.length === 0 ? (
            <div className="text-center p-8 bg-muted rounded-lg">
              <p className="text-muted-foreground">
                This user doesn't have any public wishlists.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishlists.map((list) => (
                <Card key={list.id}>
                  <CardHeader>
                    <CardTitle>{list.name}</CardTitle>
                    <CardDescription>{list.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Gift className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{list._count.wishes} items</span>
                      </div>
                      <Link href={`/friends/${id}/lists/${list.id}`}>
                        <Button size="sm">View List</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
