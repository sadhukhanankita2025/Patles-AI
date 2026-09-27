import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SessionUser, getSessionUser, getAuthToken, saveSession, clearSession, authFetch } from '../utils/session';

interface AuthContextType {
  user: SessionUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(() => getSessionUser());
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getSessionUser()));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await authFetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          const storedToken = getAuthToken() || undefined;
          saveSession(data.user, storedToken);
          setUser(data.user);
          setIsAuthenticated(true);
          return true;
        }
      }
      // If 401 or failed, check if we had a stored user that is now invalid
      clearSession();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      return false;
    } catch {
      // In case of network errors, preserve local session if present or reset
      const local = getSessionUser();
      if (!local) {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      }
      return Boolean(local);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Invalid email or password.' };
      }

      saveSession(data.user, data.token);
      setUser(data.user);
      setToken(data.token || null);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Unable to connect to authentication server.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      saveSession(data.user, data.token);
      setUser(data.user);
      setToken(data.token || null);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Unable to connect to authentication server.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authFetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout network error (clearing local session anyway):', err);
    } finally {
      clearSession();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
