"use client";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import clsx from "clsx";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const logoutAction = useAuthStore((state) => state.logout);

  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => logoutAction(),

    onSuccess: () => {
      toast.success(`Welcome back`);

      router.push("/admin");
    },

    onError: (error: AxiosError<ApiError>) => {
      // 4. We can provide a more specific error message from the backend.
      const errorMessage =
        error.response?.data?.message ||
        "Invalid credentials. Please try again.";
      toast.error(errorMessage);
      console.error(error);
    },
  });
  const { open } = useSidebar();

  const handleLogout = () => {
    mutation.mutate;
  };
  return (
    <Sidebar className="m-3 rounded-lg" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex justify-between flex-row items-center overflow-hidden">
            {/* Label + trigger in one container */}
            <div
              className={clsx(
                "flex items-center transition-all duration-300 ease-in-out overflow-hidden",
                open ? "w-full opacity-100" : "w-8 opacity-0"
              )}
            >
              <SidebarGroupLabel>Application</SidebarGroupLabel>
            </div>

            <SidebarTrigger
              className={clsx("transition-all duration-300 ease-in-out")}
            />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={logoutAction}>Log out</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
