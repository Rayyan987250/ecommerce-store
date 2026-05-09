const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  errorCode?: string;
  requestId?: string;

  constructor(message: string, status: number, options?: { errorCode?: string; requestId?: string }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = options?.errorCode;
    this.requestId = options?.requestId;
  }
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  errorCode?: string;
  requestId?: string;
  item?: T;
  items?: T;
  data?: T;
  [key: string]: unknown;
};

let refreshRequest: Promise<boolean> | null = null;

function shouldAttemptRefresh(path: string, status: number, hasRetried: boolean) {
  if (status !== 401 || hasRetried) return false;
  return ![
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/reset-password/request",
    "/auth/reset-password/confirm",
  ].includes(path);
}

async function ensureCsrfCookie() {
  if (readCookie("csrf_token")) return;
  await fetch(`${API_BASE_URL}/auth/csrf-token`, {
    credentials: "include",
  }).catch(() => undefined);
}

async function refreshSession() {
  if (!refreshRequest) {
    refreshRequest = (async () => {
      await ensureCsrfCookie();
      const headers = new Headers({ "Content-Type": "application/json" });
      const csrfToken = readCookie("csrf_token");
      if (csrfToken) {
        headers.set("x-csrf-token", csrfToken);
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({}),
      });

      return response.ok;
    })().finally(() => {
      refreshRequest = null;
    });
  }

  return refreshRequest;
}

type ApiRequestOptions = {
  hasRetried?: boolean;
};

export async function apiRequest<T>(path: string, init?: RequestInit, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
  const method = init?.method?.toUpperCase() || "GET";
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  if (method !== "GET" && method !== "HEAD") {
    const csrfToken = readCookie("csrf_token");
    if (csrfToken) {
      headers.set("x-csrf-token", csrfToken);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  const payload = (await response.json().catch(() => ({}))) as ApiResponse<T>;
  if (shouldAttemptRefresh(path, response.status, Boolean(options.hasRetried))) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return apiRequest<T>(path, init, { hasRetried: true });
    }
  }

  if (!response.ok) {
    const details = [
      payload.message || "Request failed",
      payload.errorCode ? `code: ${payload.errorCode}` : null,
      payload.requestId ? `request: ${payload.requestId}` : null,
    ]
      .filter(Boolean)
      .join(" | ");
    throw new ApiError(details, response.status, {
      errorCode: payload.errorCode,
      requestId: payload.requestId,
    });
  }

  return payload;
}

export { API_BASE_URL };
