import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, User } from "lucide-react";
import { FriendshipStatus } from "@prisma/client";
import { auth } from "@/auth";
import DesireLevel from "@/app/(dashboard)/lists/[id]/DesireLevel";
import { Badge } from "@/components/ui/badge";

export default async function FriendWishlistPage({
  params,
}: {
  params: Promise<{ id: string; listId: string }>;
}) {
  const { id, listId } = await params;
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

  const list = await prisma.list.findUnique({
    where: {
      id: listId,
      userId: id,
      visibility: "public",
      type: "wishlist",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      wishes: true,
    },
  });

  if (!list) {
    notFound();
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-12 w-12 rounded-full overflow-hidden">
          {list.user.image ? (
            <Image
              src={list.user.image || "/"}
              alt={list.user.name || "Friend"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{list.name}</h1>
          <p className="text-muted-foreground">
            {list.user.name || list.user.email}&apos;s wishlist
          </p>
        </div>
      </div>

      {list.description && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <p>{list.description}</p>
        </div>
      )}

      {list.wishes.length === 0 ? (
        <div className="text-center p-8 bg-muted rounded-lg">
          <p className="text-muted-foreground">This wishlist is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.wishes.map((wish) => (
            <Card key={wish.id}>
              <CardHeader>
                {wish.url ? (
                  <a
                    href={wish.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    <CardTitle>{wish.title}</CardTitle>
                    <ExternalLink className="size-4 ml-4" />
                  </a>
                ) : (
                  <CardTitle>{wish.title}</CardTitle>
                )}

                <CardDescription className="line-clamp-2 min-h-[2lh] text-muted-foreground">
                  {wish.description || "No description provided"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <DesireLevel desireLvl={wish.desireLvl} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge>
                      {wish.price} {wish.currency}
                    </Badge>
                    {wish.desiredGiftDate && (
                      <div>
                        <span className="font-medium">Desired by:</span>{" "}
                        {new Date(wish.desiredGiftDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
