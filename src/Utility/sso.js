import { endPoints } from "../constant/Environment";
import { apiData, axiosInstance } from "./axiosInstances";
import { clearSession, storedSsoToken } from "./auth";

// NevTan SSO owns every NevTan account. The partner site never stores passwords: these calls go
// straight from the browser to SSO (as NevTan Workspace does), and the SSO token they return is
// turned into a partner session with POST api/auth/sso/exchange. The partner API only issues one
// to approved partners and NevTan admins.

const CLIENT_ID = "nevtan-partner";
const SIGNED_OUT_KEY = "partner.signedOut";
const CHECK_TIMEOUT_MS = 4000;
let configPromise = null;

function ssoError(message, status) {
  const error = new Error(message);
  error.userMessage = message;
  error.status = status;
  return error;
}

// Loaded once per page; a failed load is retried next time.
export function fetchSsoConfig() {
  if (!configPromise) {
    configPromise = apiData(axiosInstance.get(endPoints.api.AUTH_CONFIG))
      .then((config) => {
        if (!config || !config.ssoBaseUrl) throw ssoError("Sign-in is not set up yet. Please try again later.");
        return { ssoBaseUrl: String(config.ssoBaseUrl).replace(/\/+$/, ""), clientId: config.clientId || CLIENT_ID };
      })
      .catch((error) => {
        configPromise = null;
        throw error;
      });
  }
  return configPromise;
}

function messageOf(body, fallback) {
  if (!body) return fallback;
  if (typeof body === "string") return body;
  return body.message || body.detail || body.error || fallback;
}

async function ssoPost(config, path, body, headers = {}) {
  let res;
  try {
    res = await fetch(`${config.ssoBaseUrl}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw ssoError("We couldn't reach NevTan sign-in. Check your connection and try again.", 0);
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok || (data && (data.success === false || data.status === "FAILED"))) {
    throw ssoError(messageOf(data, `Something went wrong (${res.status}). Please try again.`), res.status);
  }
  return data;
}

// Is this browser signed in to NevTan (Workspace, Mail, Drive…)? Uses the SSO cookie, which is only
// sent on NevTan's own domains. { active: true, token } | { active: false } | null when SSO
// couldn't say (offline, slow).
export async function ssoSessionStatus(config) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
  try {
    const params = new URLSearchParams({ clientId: config.clientId });
    const res = await fetch(`${config.ssoBaseUrl}/auth/session-check?${params.toString()}`, {
      credentials: "include",
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const body = await res.json();
    const data = (body && body.data) || body || {};
    if (data.active === true) return { active: true, token: data.accessToken || null };
    if (data.active === false) return { active: false };
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function ssoSignIn(config, email, password) {
  const body = await ssoPost(config, "/auth/signin", { email, password });
  const token = body && ((body.data && body.data.accessToken) || body.accessToken);
  if (!token) throw ssoError("Sign-in did not return a session. Please try again.", 200);
  return token;
}

/** The new account's state: { status: "pending_verification", email } when it must be verified first. */
export async function ssoSignUp(config, { firstName, lastName, email, password, confirmPassword }) {
  const body = await ssoPost(config, "/auth/signup", { firstName, lastName, email, password, confirmPassword, source: config.clientId });
  return (body && body.data && typeof body.data === "object" ? body.data : body) || {};
}

export function ssoResendVerification(config, email) {
  return ssoPost(config, "/auth/resend-verification", { email });
}

export function ssoForgotPassword(config, email) {
  return ssoPost(config, "/auth/forgot-password", { email, callbackUrl: `${window.location.origin}/reset-password` });
}

export function ssoResetPassword(config, token, newPassword) {
  return ssoPost(config, "/auth/reset-password", { token, newPassword });
}

/** SSO token → partner session: { token, expiresIn, user, home }. */
export function exchangeSsoToken(ssoToken) {
  return apiData(axiosInstance.post(endPoints.api.AUTH_EXCHANGE, { token: ssoToken }));
}

// After someone signs out here, don't sign them straight back in from the SSO cookie for the rest
// of this tab session. Signing in clears it.
export function signedOutHere() {
  try {
    return window.sessionStorage.getItem(SIGNED_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSignedIn() {
  try {
    window.sessionStorage.removeItem(SIGNED_OUT_KEY);
  } catch {
    // Nothing to clear.
  }
}

/** Signs out of the partner site and of every other NevTan app in this browser. */
export async function signOutEverywhere() {
  try {
    window.sessionStorage.setItem(SIGNED_OUT_KEY, "1");
  } catch {
    // Auto sign-in may still be skipped because SSO ended the session.
  }
  const token = storedSsoToken();
  try {
    const config = await fetchSsoConfig();
    await ssoPost(config, "/oauth/logout", undefined, token ? { Authorization: `Bearer ${token}` } : {});
  } catch {
    // Still sign out here below.
  }
  clearSession();
}

// "Your email isn't verified yet" style errors, so the page can offer to resend the link.
export const needsVerification = (error) => /verif/i.test((error && (error.userMessage || error.message)) || "");
