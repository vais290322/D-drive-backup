// Minimal API client to interact with backend when VITE_API_BASE_URL is set
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

const TOKEN_KEY = 'digital_dreems_token';

export function hasBackend(): boolean {
  return !!API_BASE;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function request(path: string, opts: RequestInit = {}) {
  if (!API_BASE) throw new Error('API base URL not configured');

  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string,string> || {}),
  };

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
  });

  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch(e) { data = text; }

  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || 'API error');
    (err as any).status = res.status;
    (err as any).data = data;
    throw err;
  }

  return data;
}

export default {
  API_BASE,
  hasBackend,
  request,
  getToken,
  setToken,
};
