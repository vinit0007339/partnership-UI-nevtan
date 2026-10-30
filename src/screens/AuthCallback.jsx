import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Alert, Box, Button, CircularProgress, Container, Paper, Stack, Typography } from "@mui/material";
import Layout from "../component/Layout";
import { apiMessage } from "../Utility/axiosInstances";
import { homeOf, rememberSsoToken, setSession } from "../Utility/auth";
import { exchangeSsoToken, markSignedIn } from "../Utility/sso";
import { tokens } from "../theme";

const queryValue = (value) => (Array.isArray(value) ? value[0] : value) || null;

// Where NevTan SSO sends people back to this site (the nevtan-partner client's login URL), for
// example after they verify the email of a new NevTan account. It arrives with ?sso_token= or ?token=.
const AuthCallback = () => {
  const router = useRouter();
  const ran = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady || ran.current) return;
    ran.current = true;

    const ssoToken = queryValue(router.query.sso_token) || queryValue(router.query.token);
    if (!ssoToken) {
      router.replace("/login");
      return;
    }

    exchangeSsoToken(ssoToken)
      .then((session) => {
        if (!session || !session.token) throw new Error("Sign-in did not return a session. Please try again.");
        const user = { ...session.user, home: session.home };
        rememberSsoToken(ssoToken);
        markSignedIn();
        setSession(session.token, user);
        return router.replace(homeOf(user));
      })
      .catch((e) => setError(apiMessage(e, "We couldn't sign you in. Please try again.")));
  }, [router]);

  return (
    <Layout title="Signing in" path="/auth/callback" description="Signing in to the NevTan partner dashboard." noindex>
      <Box sx={{ bgcolor: tokens.tint }}>
        <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 5, border: `1px solid ${tokens.border}` }}>
            {error ? (
              <Stack spacing={2.5}>
                <Typography component="h1" sx={{ fontWeight: 850, fontSize: { xs: 24, md: 28 }, color: tokens.ink }}>
                  We couldn't open your dashboard
                </Typography>
                <Alert severity="info">{error}</Alert>
                <Stack direction="row" spacing={1.5}>
                  <Button component={Link} href="/login" variant="contained">
                    Back to sign in
                  </Button>
                  <Button component={Link} href="/" sx={{ color: tokens.body }}>
                    Home
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Stack spacing={2} alignItems="center" role="status" sx={{ py: 2 }}>
                <CircularProgress />
                <Typography sx={{ color: tokens.muted }}>Signing you in…</Typography>
              </Stack>
            )}
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default AuthCallback;
