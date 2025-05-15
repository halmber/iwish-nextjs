"use client";
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
import { useEffect, useMemo, useState } from "react";
import { getUnreadNotificationCount } from "@/app/(dashboard)/actions";
import { useSession } from "next-auth/react";
import { getNavbarBase } from "@/utils/getNavbarBase";
import { useToast } from "@/hooks/use-toast";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [notificationCount, setNotificationCount] = useState<string>("");
  const { data: session } = useSession();
  const { toast } = useToast();

  const data = useMemo(() => {
    return getNavbarBase(notificationCount);
  }, [notificationCount]);

  useEffect(() => {
    if (!session?.user?.id) return;
    async function fetchCount() {
      const { succes, data, error } = await getUnreadNotificationCount(
        session?.user?.id as string,
      );
      if (succes) setNotificationCount(data.toString());
      if (error)
        toast({ title: "Error", description: error, variant: "destructive" });
    }

    fetchCount();
  }, [session?.user?.id]);

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
