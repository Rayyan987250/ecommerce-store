"use client";

import { apiRequest } from "@/services/http";
import { useMutation } from "@tanstack/react-query";

type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

type AuthResponse = {
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  };
  csrfToken: string;
};

async function fetchCsrfToken() {
  await apiRequest("/auth/csrf-token");
}

async function login(payload: AuthPayload) {
  await fetchCsrfToken();
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
  });
}

async function signup(payload: AuthPayload) {
  await fetchCsrfToken();
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    }),
  });
}

export function useLoginMutation() {
  return useMutation({ mutationFn: login });
}

export function useSignupMutation() {
  return useMutation({ mutationFn: signup });
}
