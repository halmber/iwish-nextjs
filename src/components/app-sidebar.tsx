"use client";

import { Search, Home, List, Bell, Users } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavPinned } from "@/components/nav-pinned";
import { NavUser } from "@/components/nav-user";
import { LogoHeader } from "@/components/logo-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Lists",
      url: "/lists",
      icon: List,
    },
    {
      title: "Friends",
      url: "#",
      icon: Users,
    },
    {
      title: "Notification",
      url: "#",
      icon: Bell,
      badge: "10",
    },
  ],
  pinned: [
    {
      name: "My wishlist",
      url: "#",
      // icon: ,
    },
    {
      name: "Daria's wishlist",
      url: "#",
      // icon: ,
    },
    {
      name: "Petra's wishlist",
      url: "#",
      // icon: ,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoHeader />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavPinned pinned={data.pinned} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
