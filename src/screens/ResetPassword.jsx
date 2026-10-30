import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Alert, Box, Button, Checkbox, CircularProgress, Container, FormControlLabel, Paper, Stack, TextField, Typography } from "@mui/material";
import Layout from "../component/Layout";
import { apiMessage } from "../Utility/axiosInstances";
import { fetchSsoConfig, ssoResetPassword } from "../Utility/sso";
import { tokens } from "../theme";

const MIN_PASSWORD = 8;

/** Landing page for the "reset your password" email NevTan SSO sends from the partner sign-in. */
const ResetPassword = () => {
  const router = useRouter();
  const token = Array.isArray(router.query.token) ? router.query.token[0] : router.query.token;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const problems = {};
    if (password.length < MIN_PASSWORD) problems.password = `Use ${MIN_PASSWORD} or more characters.`;
    if (confirm !== password) problems.confirm = "Those passwords didn't match. Try again.";
    if (Object.keys(problems).length) {
      setErrors(problems);
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      await ssoResetPassword(await fetchSsoConfig(), token, password);
      setDone(true);
    } catch (error) {
      setErrors({ form: apiMessage(error) });
    }
    setBusy(false);
  };

  let content;
  if (done) {
    content = (
      <Stack spacing={2}>
        <Typography component="h1" sx={{ fontWeight: 850, fontSize: 28, color: tokens.ink }}>
          Password changed
        </Typography>
        <Typography sx={{ color: tokens.muted }}>Use your new password to sign in to the partner dashboard and every other NevTan app.</Typography>
        <Button component={Link} href="/login" variant="contained" sx={{ alignSelf: "flex-start" }}>
          Sign in
        </Button>
      </Stack>
    );
  } else if (router.isReady && !token) {
    content = (
      <Stack spacing={2}>
        <Typography component="h1" sx={{ fontWeight: 850, fontSize: 28, color: tokens.ink }}>
          This link isn&apos;t complete
        </Typography>
        <Typography sx={{ color: tokens.muted }}>Open the link from your email again, or ask for a new one.</Typography>
        <Button component={Link} href="/login" variant="contained" sx={{ alignSelf: "flex-start" }}>
          Back to sign in
        </Button>
      </Stack>
    );
  } else {
    content = (
      <Box component="form" onSubmit={submit} noValidate>
        <Typography component="h1" sx={{ fontWeight: 850, fontSize: 28, color: tokens.ink, mb: 3 }}>
          Choose a new password
        </Typography>
        <Stack spacing={2.25}>
          {errors.form && <Alert severity="error">{errors.form}</Alert>}
          <TextField
            label="New password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
            autoComplete="new-password"
            fullWidth
          />
          <TextField
            label="Confirm password"
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={Boolean(errors.confirm)}
            helperText={errors.confirm}
            autoComplete="new-password"
            fullWidth
          />
          <FormControlLabel control={<Checkbox size="small" checked={show} onChange={(e) => setShow(e.target.checked)} />} label="Show password" />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={busy}
            startIcon={busy ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ alignSelf: "flex-start", px: 4 }}
          >
            Change password
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Layout title="Reset password" path="/reset-password" description="Choose a new password for your NevTan account." noindex>
      <Box sx={{ bgcolor: tokens.tint }}>
        <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 5, border: `1px solid ${tokens.border}` }}>
            {content}
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default ResetPassword;
