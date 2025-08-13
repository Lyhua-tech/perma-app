"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return; // Wait until we are on the client
    }

    // First, check if the user is authenticated at all
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // If they are authenticated, check their role
    if (user?.role !== "admin") {
      // ✅ If not an admin, redirect to the inventory page
      router.push("/inventory");
      return;
    }
  }, [isClient, isAuthenticated, user, router]);

  // Show a spinner while checks are running
  if (!isClient || !isAuthenticated || user?.role !== "admin") {
    return <LoadingSpinner />;
  }

  // If all checks pass, render the admin content
  return <>{children}</>;
}
