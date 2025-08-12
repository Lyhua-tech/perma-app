import { create } from "zustand";
import api, { setAuthToken } from "../api"; // Assuming your api.ts is in ../
import Router from "next/router";

// Define the shape of the user object returned from your API
interface User {
  userId: number;
  username: string;
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
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string | null) => void; // ✅ add this
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  login: async (email, password) => {
    const response = await api.post<LoginResponse>("/auth/user/login", {
      email,
      password,
    });
    const { accessToken, user } = response.data;
    setAuthToken(accessToken);
    set({ accessToken, user });
  },

  logout: async () => {
    try {
      await api.post("/auth/user/logout");
    } catch (error) {
      console.error("Server logout failed", error);
    } finally {
      set({ user: null, accessToken: null });
      setAuthToken(null);
      Router.push("/auth/user/login");
    }
  },

  setTokens: (accessToken) => {
    set({ accessToken });
    setAuthToken(accessToken);
  },
}));
