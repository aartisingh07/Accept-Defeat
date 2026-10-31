/**
 * Tab-specific storage utility for Accept&Defeat.
 * Uses sessionStorage to ensure authenticating in one tab does not bleed into another.
 * Uses BroadcastChannel to detect and isolate duplicated tabs.
 */

const runtimeInstanceId = 'rt_' + Math.random().toString(36).substring(2, 10);

export const getTabId = () => {
  let tabId = sessionStorage.getItem('ad_tab_id');
  if (!tabId) {
    tabId = 'tab_' + (window.crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15));
    sessionStorage.setItem('ad_tab_id', tabId);
  }
  return tabId;
};

export const setTabId = (tabId) => {
  if (tabId && tabId.trim()) {
    sessionStorage.setItem('ad_tab_id', tabId.trim());
  }
};

export const getTabToken = () => sessionStorage.getItem('ad_auth_token');
export const setTabToken = (token) => {
  if (token) {
    sessionStorage.setItem('ad_auth_token', token);
  }
};
export const removeTabToken = () => sessionStorage.removeItem('ad_auth_token');

export const getTabUser = () => {
  try {
    const raw = sessionStorage.getItem('ad_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setTabUser = (user) => {
  if (user) {
    sessionStorage.setItem('ad_auth_user', JSON.stringify(user));
  }
};
export const removeTabUser = () => sessionStorage.removeItem('ad_auth_user');

export const clearTabSession = () => {
  removeTabToken();
  removeTabUser();
};

// --- DUPLICATE TAB DETECTION VIA BROADCAST CHANNEL ---
// When a browser tab is duplicated, the browser clones sessionStorage (including tabId and token).
// BroadcastChannel enables the tabs to detect collision so duplicate tabs cannot reuse the authenticated session.
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  const tabChannel = new BroadcastChannel('ad_tab_collision_channel');

  tabChannel.onmessage = (event) => {
    const data = event.data;
    if (!data) return;

    // Another tab is checking if this tabId is already running
    if (data.type === 'WHO_OWNS_TAB') {
      const myTabId = sessionStorage.getItem('ad_tab_id');
      if (myTabId && myTabId === data.tabId && data.senderId !== runtimeInstanceId) {
        // We are the established primary tab, reply that we own it
        tabChannel.postMessage({
          type: 'TAB_OWNED_BY_PRIMARY',
          tabId: myTabId,
          primarySenderId: runtimeInstanceId,
        });
      }
    }

    // A response was received indicating another tab is already using this tabId (this tab is a duplicate)
    if (data.type === 'TAB_OWNED_BY_PRIMARY') {
      const myTabId = sessionStorage.getItem('ad_tab_id');
      if (myTabId && myTabId === data.tabId && data.primarySenderId !== runtimeInstanceId) {
        // Clear cloned credentials from duplicate tab
        clearTabSession();
        // Assign a brand-new unique tabId to this duplicated tab
        const freshTabId = 'tab_' + (window.crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15));
        sessionStorage.setItem('ad_tab_id', freshTabId);
        // Notify application to reset authenticated state
        window.dispatchEvent(new CustomEvent('ad_tab_duplicated'));
      }
    }
  };

  // On page load, if a tabId and token exist, query other tabs to verify whether this is a duplicated tab
  const currentTabId = sessionStorage.getItem('ad_tab_id');
  const currentToken = sessionStorage.getItem('ad_auth_token');
  if (currentTabId && currentToken) {
    tabChannel.postMessage({
      type: 'WHO_OWNS_TAB',
      tabId: currentTabId,
      senderId: runtimeInstanceId,
    });
  }
}

// --- TAB CLOSE BEACON ---
// Notifies the backend when this tab is closed so opening a fresh tab doesn't lock you out.
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => {
    const tabId = sessionStorage.getItem('ad_tab_id');
    const token = sessionStorage.getItem('ad_auth_token');
    if (tabId && token) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      navigator.sendBeacon(`${apiUrl}/auth/tab-closed?tabId=${encodeURIComponent(tabId)}`);
    }
  });
}

// --- TAB LIVENESS CHANNEL ---
// Responds to queries checking whether an authenticated tab is actually alive right now.
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  const livenessChannel = new BroadcastChannel('ad_tab_liveness_channel');
  livenessChannel.onmessage = (e) => {
    if (e.data?.type === 'PING_TAB_ALIVE') {
      const currentToken = sessionStorage.getItem('ad_auth_token');
      const myTabId = sessionStorage.getItem('ad_tab_id');
      if (currentToken && myTabId && myTabId !== e.data.senderTabId) {
        livenessChannel.postMessage({
          type: 'PONG_TAB_ALIVE',
          tabId: myTabId,
        });
      }
    }
  };
}

/**
 * Checks if any other browser tab is currently open and authenticated.
 * Returns true if an active tab responds, false if all other tabs were closed.
 */
export const isAnyTabActive = (timeoutMs = 150) => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      return resolve(false);
    }
    const checkChannel = new BroadcastChannel('ad_tab_liveness_channel');
    let answered = false;

    checkChannel.onmessage = (e) => {
      if (e.data?.type === 'PONG_TAB_ALIVE') {
        answered = true;
        checkChannel.close();
        resolve(true);
      }
    };

    checkChannel.postMessage({
      type: 'PING_TAB_ALIVE',
      senderTabId: getTabId(),
    });

    setTimeout(() => {
      if (!answered) {
        checkChannel.close();
        resolve(false);
      }
    }, timeoutMs);
  });
};
