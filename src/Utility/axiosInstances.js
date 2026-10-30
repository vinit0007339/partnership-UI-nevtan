import axios from "axios";

import { endPoints } from "../constant/Environment";
import { clearSession, getToken, loginHref } from "./auth";

export const BASE_URL = endPoints.apiBaseUrl;

const DEFAULT_ERROR = "Something went wrong. Please try again in a moment.";

// Public pages (the application form, sign-in): no auth token.
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// The dashboard and the NevTan admin: every request carries the partner session.
export const authAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

authAxios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      clearSession();
      if (window.location.pathname !== "/login") {
        window.location.assign(loginHref(`${window.location.pathname}${window.location.search}`));
      }
    }
    return Promise.reject(error);
  }
);

/**
 * What to show for a failed request: the message the API or NevTan SSO sent (always safe to show
 * as-is), or a connection message when nothing answered.
 */
export function apiMessage(error, fallback = DEFAULT_ERROR) {
  if (!error) return fallback;
  if (error.userMessage) return error.userMessage;
  const fromApi = error.response?.data?.message;
  if (fromApi) return fromApi;
  if (!error.response) return "We couldn't reach NevTan. Check your connection and try again.";
  return fallback;
}

/** Unwraps the {status, message, data} envelope, throwing on anything but SUCCESS. */
export async function apiData(request) {
  const response = await request;
  const body = response?.data;
  if (!body || body.status !== "SUCCESS") {
    const error = new Error(body?.message || DEFAULT_ERROR);
    error.userMessage = body?.message || DEFAULT_ERROR;
    error.response = response;
    throw error;
  }
  return body.data;
}
