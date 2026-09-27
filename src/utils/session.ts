export interface SessionUser {
  id: string;
  email: string;
  name: string;
  created_at?: string;
  provider?: string;
}

const SESSION_KEY = 'patles_session_user';
const TOKEN_KEY = 'patles_auth_token';

export const getSessionUser = (): SessionUser | null => {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    return value ? (JSON.parse(value) as SessionUser) : null;
  } catch {
    return null;
  }
};

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const saveSession = (user: SessionUser, token?: string): void => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch (err) {
    console.warn('Failed to save session to localStorage:', err);
  }
};

export const saveSessionUser = (email: string, name?: string, id?: string, token?: string): SessionUser => {
  const user: SessionUser = {
    id: id || `usr_${email.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 48)}`,
    email,
    name: name || email.split('@')[0] || 'Developer'
  };
  saveSession(user, token);
  return user;
};

export const clearSession = (): void => {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.warn('Failed to clear session from localStorage:', err);
  }
};

/**
 * Authenticated fetch helper: automatically attaches Authorization header and includes cookies
 */
export const authFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const token = getAuthToken();
  const headers = new Headers(init?.headers);

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    credentials: 'include',
    headers
  });
};
