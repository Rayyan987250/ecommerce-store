"use client";

import { apiRequest } from "@/services/http";
import type { SystemStatus } from "@/types";
import { useQuery } from "@tanstack/react-query";

async function getSystemStatus() {
  const response = await apiRequest<SystemStatus>("/system/status");
  return response.data as SystemStatus;
}

export function useSystemStatusQuery() {
  return useQuery({
    queryKey: ["system-status"],
    queryFn: getSystemStatus,
    refetchInterval: 30_000,
    retry: 1,
  });
}
