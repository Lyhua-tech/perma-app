"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { useSidebar } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the mobile state and the function to change it from the sidebar context
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      {/* Your existing AppSidebar component */}
      <AppSidebar />

      {/* Main content area that fills the remaining space */}
      <div className="flex flex-1 flex-col">
        {/* Header that is ONLY visible on mobile screens */}
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 md:hidden">
          {/* This is the hamburger menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenMobile(!openMobile)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <h1 className="ml-4 text-xl font-semibold">Menu</h1>
        </header>

        {/* Your page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* Optional: A backdrop that appears when the mobile menu is open */}
      {openMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}
    </div>
  );
}
