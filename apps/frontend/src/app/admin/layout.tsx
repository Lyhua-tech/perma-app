import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AdminGuard from "@/components/admin-guard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminGuard>
        <div className="flex min-h-screen bg-gray-100 w-full gap-4 p-3">
          <AppSidebar />

          <main className="w-full">{children}</main>
        </div>
      </AdminGuard>
    </SidebarProvider>
  );
}
