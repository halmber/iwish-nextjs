"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import {
  getNotificationMessage,
  NotificationData,
} from "@/utils/getNotificationMessage";
import { NotificationType } from "@prisma/client";
import { FRIENDS_TABS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { markNotificationAsRead } from "@/app/(dashboard)/actions";

export function NotificationItem({ nft }: { nft: NotificationData }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleClick = async () => {
    // Mark the notification as read
    const tab =
      nft.type === NotificationType.FRIEND_REQUEST
        ? FRIENDS_TABS.REQUESTS
        : FRIENDS_TABS.FRIENDS;

    if (nft.read) {
      router.push(`/friends?tab=${tab}`);
      return;
    }

    const { succes, error } = await markNotificationAsRead(nft.id);
    if (!succes || error) {
      toast({ title: "Error", description: error, variant: "destructive" });
      return;
    }

    router.push(`/friends?tab=${tab}`);
  };

  return (
    <Card
      className={cn(
        "transition cursor-pointer hover:bg-accent",
        nft.read ? "opacity-70" : "border-primary border",
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <UserAvatar name={nft.notifier.name} image={nft.notifier.image} />
          <p>{getNotificationMessage(nft)}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(nft.createdAt).toLocaleString("uk-UA")}
        </p>
      </CardContent>
    </Card>
  );
}
