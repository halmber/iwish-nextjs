"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

export default function ListMenuDropdown() {
  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="hover:bg-secondary rounded-md"
        onClick={(e) => e.stopPropagation()} // ! PROBLEM
      >
        <MoreVertical className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenuItem>
          <Pencil />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash2 className="text-rose-500" />
          <span className="text-rose-500">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
