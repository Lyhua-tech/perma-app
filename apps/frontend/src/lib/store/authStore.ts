import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import api, { setAuthToken } from "../api"; // Assuming your api.ts is in ../
import { toast } from "sonner";

// Define the shape of the user object returned from your API
interface User {
  userId: number;
  email: string;
  role: "admin" | "inventory_owner" | "inventory_manager";
  // Add any other user fields you expect, e.g., email, firstName
}

// Define the shape of the login response from your API
interface LoginResponse {
  accessToken: string;
  user: User;
}

// Define the shape of your Zustand store's state and actions
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string | null) => void; // ✅ add this
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      // --- Initial State ---
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // --- Actions ---
      login: async (email: string, password: string): Promise<User> => {
        const response = await api.post<LoginResponse>("/auth/user/login", {
          email,
          password,
        });
        const { accessToken } = response.data;
        const decoded = jwtDecode<User>(accessToken);
        const userInfo = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        };
        setAuthToken(accessToken);
        set({ accessToken, user: userInfo, isAuthenticated: true });

        return userInfo;
      },

      logout: async () => {
        try {
          const ok = await api.post("/auth/user/logout");
          if (ok) toast.success("Successfully logout.");
        } catch (error) {
          console.error("Server logout failed", error);
        } finally {
          // The redirect should be handled in the component
          set({ user: null, accessToken: null, isAuthenticated: false });
          setAuthToken(null);
        }
      },

      setTokens: (accessToken) => {
        set({ accessToken, isAuthenticated: !!accessToken });
        setAuthToken(accessToken);
      },
    }),
    {
      // ✅ 3. Provide the configuration for the "folder"
      name: "auth-storage", // This is the name of the item in localStorage
    }
  )
);
