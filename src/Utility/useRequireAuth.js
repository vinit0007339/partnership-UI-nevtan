import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { endPoints } from "../constant/Environment";
import { apiData, authAxios } from "./axiosInstances";
import { clearSession, getUser, loginHref, setUser, useAuth } from "./auth";

/**
 * Guards a signed-in page. `admin` pages are for NevTan staff; the others need a partner account.
 * Anyone else is sent where they belong (sign-in, the dashboard or the admin). Returns the user once
 * the page may render.
 */
export default function useRequireAuth({ admin = false } = {}) {
  const router = useRouter();
  const { ready, token, user } = useAuth();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!ready || !router.isReady) return;
    if (!token) {
      router.replace(loginHref(router.asPath));
      return;
    }
    const elsewhere = admin ? (user?.partner ? "/dashboard" : null) : user?.admin ? "/admin" : null;
    if (admin ? !user?.admin : !user?.partner) {
      // A session with neither role is no use anywhere, and /login would send it straight back.
      if (!elsewhere) clearSession();
      router.replace(elsewhere || "/login");
      return;
    }
    setAllowed(true);
  }, [ready, token, user, admin, router]);

  // Once per page: picks up changes since sign-in, such as a partner account being suspended.
  useEffect(() => {
    if (!ready || !token) return;
    apiData(authAxios.get(endPoints.api.AUTH_ME))
      .then((me) => setUser({ ...me, home: getUser()?.home }))
      .catch((error) => {
        if (error?.response?.status === 403) {
          clearSession();
          router.replace("/login");
        }
      });
    // Runs once per sign-in, not on every navigation.
  }, [ready, token]);

  return { ready: allowed, user };
}
