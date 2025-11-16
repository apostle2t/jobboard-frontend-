export const API_BASE_URL = 
  typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_API_BASE_URL
    ? (window as any).NEXT_PUBLIC_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const TOKEN_KEY = "auth_token";

export function saveToken(token: string | null) {
  if (typeof window === 'undefined') return; // SSR safety
  
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null; // SSR safety
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window === 'undefined') return; // SSR safety
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers || {});

  // Only set Content-Type for JSON bodies (not FormData)
  if (init.body != null && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(input, {
    ...init,
    headers,
  });

  // Handle 401 Unauthorized - token expired or invalid
  if (res.status === 401) {
    clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login?error=session_expired';
    }
  }

  return res;
}
