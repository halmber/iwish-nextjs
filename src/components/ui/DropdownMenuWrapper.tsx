import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { ReactNode } from "react";
import { useSidebar } from "./sidebar";

interface DropdownMenuWrapperProps {
  children: ReactNode;
}

export default function DropdownMenuWrapper({
  children,
}: DropdownMenuWrapperProps) {
  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="hover:bg-secondary rounded-2xl p-1"
      >
        <MoreVertical className="size-8" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
