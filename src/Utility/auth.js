import { useEffect, useState } from "react";

// The partner session issued by the partner API (POST api/auth/sso/exchange), kept the same way
// NevTan Workspace keeps its own: the token and the signed-in user in localStorage.
const TOKEN_KEY = "partner.token";
const USER_KEY = "partner.user";
const SSO_TOKEN_KEY = "partner.ssoToken";
const EVENT = "partner-auth-change";

function store() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function read(key) {
  try {
    return store()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

export const getToken = () => read(TOKEN_KEY);

export function getUser() {
  try {
    const raw = read(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** user is the API's user plus `home`, where the API says this person belongs. */
export function setSession(token, user) {
  try {
    store()?.setItem(TOKEN_KEY, token);
    store()?.setItem(USER_KEY, JSON.stringify(user || null));
  } catch {
    return;
  }
  notify();
}

export function setUser(user) {
  try {
    store()?.setItem(USER_KEY, JSON.stringify(user || null));
  } catch {
    return;
  }
  notify();
}

export function clearSession() {
  try {
    store()?.removeItem(TOKEN_KEY);
    store()?.removeItem(USER_KEY);
    store()?.removeItem(SSO_TOKEN_KEY);
  } catch {
    return;
  }
  notify();
}

// The SSO token behind the current session, kept so signing out here can end the NevTan
// session everywhere.
export function rememberSsoToken(token) {
  try {
    store()?.setItem(SSO_TOKEN_KEY, token);
  } catch {
    // Sign-out still works; SSO just won't get the token.
  }
}

export const storedSsoToken = () => read(SSO_TOKEN_KEY);

/** Only same-site paths, so ?next can't send anyone to another site after sign-in. */
export function safeNext(value, fallback = null) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return fallback;
  }
  return raw;
}

export const homeOf = (user) => safeNext(user && user.home, "/dashboard");

export const loginHref = (next) => (next ? `/login?next=${encodeURIComponent(next)}` : "/login");

export function useAuth() {
  const [state, setState] = useState({ ready: false, token: null, user: null });

  useEffect(() => {
    const refresh = () => setState({ ready: true, token: getToken(), user: getUser() });
    refresh();
    const onStorage = (event) => {
      if (!event.key || event.key === TOKEN_KEY || event.key === USER_KEY) refresh();
    };
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return { ...state, signedIn: Boolean(state.token) };
}
