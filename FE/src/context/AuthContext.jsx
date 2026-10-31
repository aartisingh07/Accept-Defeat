import { useState, useEffect, useCallback, useRef } from 'react';
import authService from '../services/authService';
import { AuthContext } from './AuthContextDef';
import {
  getTabToken,
  setTabToken,
  getTabUser,
  setTabUser,
  clearTabSession,
} from '../utils/tabSession';

const IDLE_LIMIT_MS = 15 * 60 * 1000; // 15 Minutes idle limit
const PING_THROTTLE_MS = 60 * 1000;   // Throttled heartbeat at most once per 60 seconds

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getTabToken());
  const [user, setUser] = useState(() => getTabUser());
  const [isLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [sessionNotice, setSessionNotice] = useState(null);

  const lastActivityRef = useRef(0);
  const lastPingRef = useRef(0);

  // Background profile sync on initial load if token exists in this tab
  useEffect(() => {
    let isMounted = true;
    if (token) {
      authService
        .getCurrentUser()
        .then((fresh) => {
          if (isMounted && fresh) {
            setUser(fresh);
            setTabUser(fresh);
          }
        })
        .catch(() => {
          // If server rejects session on load, clear tab state
          clearTabSession();
          setUser(null);
          setToken(null);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Handle session timeout events dispatched from api.js interceptor
  useEffect(() => {
    const handleExpired = (e) => {
      const reason = e.detail?.reason;
      setUser(null);
      setToken(null);
      setSessionNotice(
        reason === 'idle'
          ? 'Your session expired due to inactivity. Please log in again.'
          : 'Your session has expired. Please log in again.'
      );
    };

    const handleDuplicated = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('ad_session_expired', handleExpired);
    window.addEventListener('ad_tab_duplicated', handleDuplicated);
    return () => {
      window.removeEventListener('ad_session_expired', handleExpired);
      window.removeEventListener('ad_tab_duplicated', handleDuplicated);
    };
  }, []);

  // Idle Timer & Activity Listener (Requirement 2)
  useEffect(() => {
    if (!token) return;

    const onUserActivity = () => {
      const now = Date.now();
      lastActivityRef.current = now;

      // Throttle backend activity ping to at most once per 60s
      if (now - lastPingRef.current > PING_THROTTLE_MS) {
        lastPingRef.current = now;
        authService.pingActivity();
      }
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach((evt) =>
      window.addEventListener(evt, onUserActivity, { passive: true })
    );

    // Periodically verify idle timeout every 15 seconds
    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > IDLE_LIMIT_MS) {
        clearTabSession();
        setUser(null);
        setToken(null);
        setSessionNotice('Your session expired due to inactivity. Please log in again.');
      }
    }, 15000);

    return () => {
      clearInterval(interval);
      activityEvents.forEach((evt) => window.removeEventListener(evt, onUserActivity));
    };
  }, [token]);

  const login = async ({ identifier, password }) => {
    setAuthError(null);
    setSessionNotice(null);
    const data = await authService.login({ identifier, password });

    if (data.token) {
      setTabToken(data.token);
      setToken(data.token);
    }

    if (data.user) {
      setTabUser(data.user);
      setUser(data.user);
    }

    lastActivityRef.current = Date.now();
    return data;
  };

  const signup = async ({ username, email, password }) => {
    setAuthError(null);
    setSessionNotice(null);
    const data = await authService.signup({ username, email, password });

    if (data.token) {
      setTabToken(data.token);
      setToken(data.token);
    }

    if (data.user) {
      setTabUser(data.user);
      setUser(data.user);
    }

    lastActivityRef.current = Date.now();
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearTabSession();
      setUser(null);
      setToken(null);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      setTabUser(next);
      return next;
    });
  };

  const refreshSession = useCallback(async () => {
    const freshUser = await authService.getCurrentUser();
    if (freshUser) {
      setUser(freshUser);
      setTabUser(freshUser);
    }
  }, []);

  const hasActiveSession = Boolean((token || getTabToken()) && (user || getTabUser()));

  const value = {
    user: user || getTabUser(),
    token: token || getTabToken(),
    isAuthenticated: hasActiveSession,
    isLoading,
    authError,
    sessionNotice,
    clearSessionNotice: () => setSessionNotice(null),
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
