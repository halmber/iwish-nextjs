"use client";

import { Bell, LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "next-auth";
import UserAvatarItem from "./user-avatar-item";
import { signOutAction } from "@/app/(dashboard)/actions";
import { ProfileDialog } from "@/components/ProfileDialog";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface NavUserProps {
  user?: User;
  ntfBadge: string | null;
}

export function NavUser({ ntfBadge }: NavUserProps) {
  const { isMobile } = useSidebar();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <UserAvatarItem user={user} />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserAvatarItem user={user} showChevron={false} />
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setOpen((prev) => !prev)}>
                  <UserIcon />
                  Account
                </DropdownMenuItem>
                <Link
                  href="/notifications"
                  className="flex items-center gap-2 w-full"
                >
                  <DropdownMenuItem className="w-full">
                    <div className="relative">
                      <Bell size={16} />
                      {ntfBadge && ntfBadge != "0" && (
                        <span className="absolute -top-1 -right-1 flex h-3 min-w-2 items-center justify-center rounded-full bg-red-500 p-1 text-xs font-medium">
                          {+ntfBadge < 100 ? ntfBadge : "99+"}
                        </span>
                      )}
                    </div>

                    <span>Notifications</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOutAction}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <ProfileDialog
        user={user}
        open={open}
        onClose={() => setOpen((prev) => !prev)}
      />
    </>
  );
}
