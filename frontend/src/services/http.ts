const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
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
  if (!response.ok) {
    const details = [
      payload.message || "Request failed",
      payload.errorCode ? `code: ${payload.errorCode}` : null,
      payload.requestId ? `request: ${payload.requestId}` : null,
    ]
      .filter(Boolean)
      .join(" | ");
    throw new Error(details);
  }

  return payload;
}

export { API_BASE_URL };
