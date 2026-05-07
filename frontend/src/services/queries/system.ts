"use client";

import { apiRequest } from "@/services/http";
import { useQuery } from "@tanstack/react-query";

type SystemStatusResponse = {
  status: "ok";
  message: string;
  data: {
    database: "connected";
    databaseTime: string | null;
    users: number;
    products: number;
  };
  requestId?: string;
  timestamp: string;
};

async function getSystemStatus() {
  const response = await apiRequest<SystemStatusResponse>("/system/status");
  return response;
}

export function useSystemStatusQuery() {
  return useQuery({
    queryKey: ["system-status"],
    queryFn: getSystemStatus,
    refetchInterval: 30_000,
    retry: 1,
  });
}
