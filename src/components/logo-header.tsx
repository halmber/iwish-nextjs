"use client";

import logo from "../../public/logo-test.png";
import Image from "next/image";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export function LogoHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-default"
        >
          <Image src={logo} alt={"Logo"} width={32} height={32} />
          <h3 className="font-bold">iWish</h3>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
