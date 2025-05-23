import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { ToggleThemeBtn } from "@/components/ToggleThemeBtn";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return (
    <SidebarProvider>
      <SessionProvider>
        {/* !!pass the user to the sidebar and get it thanks to the react function cache!! */}
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex flex-1 items-center justify-between pr-4">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </div>
              <ToggleThemeBtn />
            </div>
          </header>
          {children}
        </SidebarInset>
      </SessionProvider>
    </SidebarProvider>
  );
}
