"use client";

import { useSessionQuery } from "@/services/queries/auth";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

function AuthBootstrap() {
  const sessionQuery = useSessionQuery();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    if (sessionQuery.isSuccess) {
      if (sessionQuery.data) {
        setUser(sessionQuery.data);
      } else {
        clearUser();
        if (useCartStore.getState().ownerUserId) {
          useCartStore.getState().resetAfterSignOut();
        }
      }
      setInitialized(true);
    }
  }, [clearUser, sessionQuery.data, sessionQuery.isSuccess, setInitialized, setUser]);

  useEffect(() => {
    if (sessionQuery.isError) {
      setInitialized(true);
    }
  }, [sessionQuery.isError, setInitialized]);

  return null;
}

function CartBootstrap() {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const loadServerCart = useCartStore((state) => state.loadServerCart);
  const claimOwnership = useCartStore((state) => state.claimOwnership);
  const ownerUserId = useCartStore((state) => state.ownerUserId);
  const resetForUserSwitch = useCartStore((state) => state.resetForUserSwitch);
  const itemCount = useCartStore((state) => state.itemCount);
  const lastSyncedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      lastSyncedUserId.current = null;
      return;
    }

    if (lastSyncedUserId.current === user._id) {
      return;
    }

    lastSyncedUserId.current = user._id;

    if (ownerUserId && ownerUserId !== user._id) {
      resetForUserSwitch(user._id);
      void loadServerCart();
      return;
    }

    if (!ownerUserId && itemCount > 0) {
      void useCartStore
        .getState()
        .mergeServerCart()
        .catch(() => {
          void loadServerCart();
        });
      return;
    }

    if (!ownerUserId) {
      claimOwnership(user._id);
    }

    void loadServerCart();
  }, [claimOwnership, initialized, itemCount, loadServerCart, ownerUserId, resetForUserSwitch, user]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      <CartBootstrap />
      {children}
    </QueryClientProvider>
  );
}
