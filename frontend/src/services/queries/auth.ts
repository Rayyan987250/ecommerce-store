"use client";

import { apiRequest } from "@/services/http";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import type { AuthUser } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

type AuthResponse = {
  success: boolean;
  message: string;
  data: AuthUser;
  csrfToken?: string;
};

type LogoutResponse = {
  success: boolean;
  message: string;
};

type PasswordResetRequestResponse = {
  success: boolean;
  message: string;
  data?: {
    resetUrl?: string;
  };
};

type PasswordResetConfirmResponse = {
  success: boolean;
  message: string;
};

const sessionQueryKey = ["auth", "profile"] as const;

export async function fetchCsrfToken() {
  await apiRequest("/auth/csrf-token");
}

export async function getProfile() {
  const response = await apiRequest<AuthUser>("/auth/profile");
  return response.data as AuthUser;
}

export async function getOptionalProfile() {
  try {
    return await getProfile();
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Not authorized") || message.includes("Not authorized to access this route")) {
      return null;
    }
    throw error;
  }
}

async function login(payload: AuthPayload) {
  await fetchCsrfToken();
  return apiRequest<AuthUser>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
  }) as Promise<AuthResponse>;
}

async function signup(payload: AuthPayload) {
  await fetchCsrfToken();
  return apiRequest<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    }),
  }) as Promise<AuthResponse>;
}

async function logout() {
  await fetchCsrfToken();
  return apiRequest<LogoutResponse>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({}),
  }) as Promise<LogoutResponse>;
}

async function requestPasswordReset(email: string) {
  return apiRequest<PasswordResetRequestResponse>("/auth/reset-password/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  }) as Promise<PasswordResetRequestResponse>;
}

async function confirmPasswordReset(payload: { token: string; password: string }) {
  return apiRequest<PasswordResetConfirmResponse>("/auth/reset-password/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<PasswordResetConfirmResponse>;
}

export function useSessionQuery() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: getOptionalProfile,
    retry: false,
    staleTime: 30_000,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      useAuthStore.getState().setUser(response.data);
      void queryClient.setQueryData(sessionQueryKey, response.data);
    },
  });
}

export function useSignupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      useAuthStore.getState().setUser(response.data);
      void queryClient.setQueryData(sessionQueryKey, response.data);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      useAuthStore.getState().clearUser();
      useCartStore.getState().resetAfterSignOut();
      void queryClient.setQueryData(sessionQueryKey, null);
    },
  });
}

export function useRequestPasswordResetMutation() {
  return useMutation({
    mutationFn: requestPasswordReset,
  });
}

export function useConfirmPasswordResetMutation() {
  return useMutation({
    mutationFn: confirmPasswordReset,
  });
}
