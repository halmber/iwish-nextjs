"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown } from "lucide-react";
import { UserAvatarSkeleton } from "./nav-skeleton";
import { User } from "next-auth";
import UserAvatar from "./UserAvatar";

interface UserAvatarItemProps {
  showChevron?: boolean;
  user: User | null;
}

export default function UserAvatarItem({
  showChevron = true,
  user,
}: UserAvatarItemProps) {
  if (!user) return <UserAvatarSkeleton />;

  return (
    <>
      <UserAvatar name={user.name!} image={user.image!} />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user.name}</span>
        <span className="truncate text-xs">{user.email}</span>
      </div>
      {showChevron && <ChevronsUpDown className="ml-auto size-4" />}
    </>
  );
}
