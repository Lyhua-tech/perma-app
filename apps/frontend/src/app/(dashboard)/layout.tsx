import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100 w-full gap-4 p-3">
        <AppSidebar />

        <main className="w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}
