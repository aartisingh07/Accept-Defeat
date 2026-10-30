import { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { AuthContext } from './AuthContextDef';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ad_auth_token'));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ad_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Background profile sync on initial load if token exists
  useEffect(() => {
    let isMounted = true;
    if (token) {
      authService
        .getCurrentUser()
        .then((fresh) => {
          if (isMounted && fresh) {
            setUser(fresh);
            localStorage.setItem('ad_auth_user', JSON.stringify(fresh));
          }
        })
        .catch(() => {
          // Keep existing cached profile
        });
    }
    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async ({ identifier, password }) => {
    setAuthError(null);
    const data = await authService.login({ identifier, password });

    if (data.token) {
      localStorage.setItem('ad_auth_token', data.token);
      setToken(data.token);
    }

    if (data.user) {
      localStorage.setItem('ad_auth_user', JSON.stringify(data.user));
      setUser(data.user);
    }

    return data;
  };

  const signup = async ({ username, email, password }) => {
    setAuthError(null);
    const data = await authService.signup({ username, email, password });

    if (data.token) {
      localStorage.setItem('ad_auth_token', data.token);
      setToken(data.token);
    }

    if (data.user) {
      localStorage.setItem('ad_auth_user', JSON.stringify(data.user));
      setUser(data.user);
    }

    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('ad_auth_token');
      localStorage.removeItem('ad_auth_user');
      setUser(null);
      setToken(null);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('ad_auth_user', JSON.stringify(next));
      return next;
    });
  };

  const refreshSession = useCallback(async () => {
    const freshUser = await authService.getCurrentUser();
    if (freshUser) {
      setUser(freshUser);
      localStorage.setItem('ad_auth_user', JSON.stringify(freshUser));
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    authError,
    setAuthError,
    login,
    signup,
    logout,
    updateUser,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
