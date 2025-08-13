"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore"; // Adjust path

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // 1. This state tracks if we are on the client and the store has been hydrated.
  const [isClient, setIsClient] = useState(false);

  // 2. This effect runs only once on the client after mount.
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 3. This effect handles the redirection logic.
  useEffect(() => {
    // Wait until we are sure we are on the client before checking authentication.
    if (isClient && !isAuthenticated) {
      router.push("/login");
    }
  }, [isClient, isAuthenticated, router]);

  // 4. While we wait for the client to mount and state to hydrate, show a spinner.
  if (!isClient) {
    return <LoadingSpinner />;
  }

  // 5. If the user is authenticated, show the page content.
  // If not, the useEffect above will redirect them, so we show a spinner in the meantime.
  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    return <LoadingSpinner />;
  }
}
