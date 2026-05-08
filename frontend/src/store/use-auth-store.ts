"use client";

import type { AuthUser } from "@/types";
import { create } from "zustand";

type AuthStoreState = {
  user: AuthUser | null;
  initialized: boolean;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
  setInitialized: (initialized: boolean) => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  initialized: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setInitialized: (initialized) => set({ initialized }),
}));
