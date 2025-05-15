import { auth } from "@/auth";
import { NotificationItem } from "@/components/NotificationItem";
import { prisma } from "@/lib/prisma";
import { BellIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { NotificationsDropdown } from "./NotificationsDropdownю";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/");
  }
  const notifications = await prisma.notifications.findMany({
    where: {
      notifiedId: session.user.id,
    },
    include: {
      notifier: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-0 flex items-center justify-center gap-2">
          <BellIcon className="w-6 h-6" /> <span>Notifications</span>
        </h1>

        <NotificationsDropdown />
      </div>

      {notifications.length === 0 ? (
        <p className="text-muted-foreground">No notifications to display.</p>
      ) : (
        <div className="flex flex-col space-y-3">
          {notifications.map((nft) => (
            <NotificationItem key={nft.id} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
}
