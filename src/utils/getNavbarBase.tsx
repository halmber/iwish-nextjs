import { Bell, Home, List, Search, Users } from "lucide-react";

export const getNavbarBase = (notificationCount: string) => {
  return {
    navMain: [
      {
        title: "Search",
        url: "#",
        icon: Search,
      },
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "Lists",
        url: "/lists",
        icon: List,
      },
      {
        title: "Friends",
        url: "/friends",
        icon: Users,
      },
      {
        title: "Notifications",
        url: "/notifications",
        icon: Bell,
        badge: notificationCount,
      },
    ],
    pinned: [
      // {
      //   name: "My wishlist",
      //   url: "#",
      //   // icon: ,
      // },
      // {
      //   name: "Daria's wishlist",
      //   url: "#",
      //   // icon: ,
      // },
      // {
      //   name: "Petra's wishlist",
      //   url: "#",
      //   // icon: ,
      // },
    ],
  };
};
