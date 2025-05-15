import { Notifications, NotificationType } from "@prisma/client";

export type NotificationData = Notifications & {
  notifier: {
    image: string | null;
    name: string | null;
    id: string;
    email: string | null;
  };
};

export function getNotificationMessage(notification: NotificationData): string {
  const name = notification.notifier.name || "Someone";

  switch (notification.type) {
    case NotificationType.FRIEND_REQUEST:
      return `${name} sent you a friend request`;

    case NotificationType.FRIEND_ACCEPTED:
      return `${name} accepted your friend request`;

    case NotificationType.FRIEND_REJECTED:
      return `${name} rejected your friend request`;

    default:
      return "You have a new notification";
  }
}
