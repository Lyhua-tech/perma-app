import { SidebarProvider } from "@/components/ui/sidebar";
import AuthGuard from "@/components/auth-guard";
import DashboardLayout from "@/components/app-layout"; // Import your new component

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        {/* Use the new client component to wrap your page content */}
        <DashboardLayout>{children}</DashboardLayout>
      </SidebarProvider>
    </AuthGuard>
  );
}
