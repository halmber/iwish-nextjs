"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown } from "lucide-react";
import { UserAvatarSkeleton } from "./nav-skeleton";
import { User } from "next-auth";

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
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage
          className=" object-cover"
          src={user.image || ""}
          alt={user.name || "User image"}
        />
        <AvatarFallback className="rounded-lg">
          {user.name
            ?.split(" ")
            .map((n) => n[0].toLocaleUpperCase())
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user.name}</span>
        <span className="truncate text-xs">{user.email}</span>
      </div>
      {showChevron && <ChevronsUpDown className="ml-auto size-4" />}
    </>
  );
}
