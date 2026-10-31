import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CheckCircleRounded as CheckIcon } from "@mui/icons-material";
import Layout from "../component/Layout";
import SignInLockNotice from "../component/SignInLockNotice";
import { apiMessage } from "../Utility/axiosInstances";
import { getToken, getUser, homeOf, rememberSsoToken, safeNext, setSession, useAuth } from "../Utility/auth";
import {
  exchangeSsoToken,
  fetchSsoConfig,
  markSignedIn,
  needsVerification,
  signedOutHere,
  ssoForgotPassword,
  ssoResendVerification,
  ssoSessionStatus,
  ssoSignIn,
  ssoSignUp,
} from "../Utility/sso";
import { formatCountdown, lockAppliesTo, lockMillisLeft, readSignInLock } from "../Utility/signInLock";
import useClock from "../Utility/useClock";
import { tokens } from "../theme";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

const DASHBOARD_POINTS = [
  "Your personal referral link",
  "Every client you've referred, with their plan",
  "What you've earned, and what's owed",
  "Every payout we've made to you",
];

const Heading = ({ title, text }) => (
  <Box sx={{ mb: 3 }}>
    <Typography component="h1" sx={{ fontWeight: 850, fontSize: { xs: 26, md: 30 }, color: tokens.ink, lineHeight: 1.2 }}>
      {title}
    </Typography>
    {text && <Typography sx={{ mt: 1, color: tokens.muted, lineHeight: 1.6 }}>{text}</Typography>}
  </Box>
);

const InlineButton = ({ children, onClick, disabled }) => (
  <MuiLink component="button" type="button" onClick={onClick} disabled={disabled} underline="hover" sx={{ fontWeight: 700, color: tokens.brand, verticalAlign: "baseline" }}>
    {children}
  </MuiLink>
);

const SubmitButton = ({ busy, disabled, children, fullWidth = true }) => (
  <Button
    type="submit"
    variant="contained"
    size="large"
    fullWidth={fullWidth}
    disabled={busy || disabled}
    startIcon={busy ? <CircularProgress size={18} color="inherit" /> : null}
    sx={{ py: 1.25, fontWeight: 800 }}
  >
    {children}
  </Button>
);

const Login = () => {
  const router = useRouter();
  const auth = useAuth();
  const started = useRef(false);
  const requested = safeNext(router.query.next);

  const [config, setConfig] = useState(null);
  const [view, setView] = useState("loading");
  const [loadError, setLoadError] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [signInLock, setSignInLock] = useState(null);

  const lockClock = useClock(signInLock?.unlockAt);
  const lockedMillis = lockAppliesTo(signInLock, email) ? lockMillisLeft(signInLock, lockClock) : 0;

  const go = (target) => {
    setErrors({});
    setNotice(null);
    setPassword("");
    setConfirm("");
    setView(target);
  };

  const finish = useCallback(
    async (ssoToken) => {
      const session = await exchangeSsoToken(ssoToken);
      if (!session || !session.token) throw new Error("Sign-in did not return a session. Please try again.");
      const user = { ...session.user, home: session.home };
      rememberSsoToken(ssoToken);
      markSignedIn();
      setSession(session.token, user);
      await router.replace(requested || homeOf(user));
    },
    [router, requested]
  );

  const start = useCallback(async () => {
    setView("loading");
    setLoadError(null);
    if (getToken()) {
      router.replace(requested || homeOf(getUser()));
      return;
    }
    let loaded;
    try {
      loaded = await fetchSsoConfig();
      setConfig(loaded);
    } catch (error) {
      setLoadError(apiMessage(error));
      setView("error");
      return;
    }
    // Already signed in to another NevTan app: use that account straight away.
    if (!signedOutHere()) {
      const status = await ssoSessionStatus(loaded);
      if (status && status.active && status.token) {
        try {
          await finish(status.token);
          return;
        } catch (error) {
          setErrors({ form: apiMessage(error) });
        }
      }
    }
    setView(router.query.mode === "signup" ? "signup" : "signin");
  }, [router, requested, finish]);

  useEffect(() => {
    if (!router.isReady || !auth.ready || started.current) return;
    started.current = true;
    start();
  }, [router.isReady, auth.ready, start]);

  const signIn = async () => {
    const problems = {};
    if (!EMAIL.test(email.trim())) problems.email = "Enter a valid email address.";
    if (!password) problems.password = "Enter your password.";
    if (Object.keys(problems).length) {
      setErrors(problems);
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const ssoToken = await ssoSignIn(config, email.trim(), password);
      setSignInLock(null);
      await finish(ssoToken);
    } catch (error) {
      const lock = readSignInLock(error, email);
      if (lock) setSignInLock(lock);
      else setErrors({ form: apiMessage(error), verify: needsVerification(error) });
      setBusy(false);
    }
  };

  const signUp = async () => {
    const problems = {};
    if (!firstName.trim()) problems.firstName = "Enter your first name.";
    if (!EMAIL.test(email.trim())) problems.email = "Enter a valid email address.";
    if (password.length < MIN_PASSWORD) problems.password = `Use ${MIN_PASSWORD} or more characters.`;
    if (confirm !== password) problems.confirm = "Those passwords didn't match. Try again.";
    if (Object.keys(problems).length) {
      setErrors(problems);
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const result = await ssoSignUp(config, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        confirmPassword: confirm,
      });
      if (result.email) setEmail(result.email);
      go(result.status === "pending_verification" ? "verify" : "signin");
    } catch (error) {
      setErrors({ form: apiMessage(error) });
    }
    setBusy(false);
  };

  const resend = async () => {
    setBusy(true);
    try {
      await ssoResendVerification(config, email.trim());
      setNotice(`We sent a new link to ${email.trim()}.`);
    } catch (error) {
      setNotice(apiMessage(error));
    }
    setBusy(false);
  };

  const forgot = async () => {
    if (!EMAIL.test(email.trim())) {
      setErrors({ email: "Enter a valid email address." });
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      await ssoForgotPassword(config, email.trim());
      go("forgot-sent");
    } catch (error) {
      setErrors({ email: apiMessage(error) });
    }
    setBusy(false);
  };

  const submit = (handler) => (event) => {
    event.preventDefault();
    handler();
  };

  const passwordToggle = (
    <FormControlLabel
      control={<Checkbox size="small" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />}
      label={<Typography sx={{ fontSize: 14, color: tokens.body }}>Show password</Typography>}
    />
  );

  let screen;
  if (view === "loading") {
    screen = (
      <Stack spacing={2} alignItems="center" sx={{ py: 8 }} role="status">
        <CircularProgress />
        <Typography sx={{ color: tokens.muted }}>Checking your NevTan account…</Typography>
      </Stack>
    );
  } else if (view === "error") {
    screen = (
      <>
        <Heading title="Partner sign in" />
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
        <Button variant="contained" onClick={start}>
          Try again
        </Button>
      </>
    );
  } else if (view === "signin") {
    screen = (
      <Box component="form" onSubmit={submit(signIn)} noValidate>
        <Heading title="Partner sign in" text="Use the NevTan account on the email you applied with." />
        <Stack spacing={2.25}>
          {errors.form && (
            <Alert
              severity="error"
              action={
                errors.verify ? (
                  <Button color="inherit" size="small" onClick={resend} disabled={busy}>
                    Resend link
                  </Button>
                ) : null
              }
            >
              {errors.form}
            </Alert>
          )}
          {notice && <Alert severity="info">{notice}</Alert>}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
            autoComplete="username"
            autoFocus
            fullWidth
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
            autoComplete="current-password"
            fullWidth
          />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {passwordToggle}
            <InlineButton onClick={() => go("forgot")}>Forgot password?</InlineButton>
          </Stack>
          {lockedMillis > 0 && <SignInLockNotice lock={signInLock} millisLeft={lockedMillis} onResetPassword={() => go("forgot")} />}
          <SubmitButton busy={busy} disabled={lockedMillis > 0}>
            {lockedMillis > 0 ? `Try again in ${formatCountdown(lockedMillis)}` : "Sign in"}
          </SubmitButton>
          <Typography sx={{ fontSize: 14, color: tokens.muted, textAlign: "center" }}>
            No NevTan account yet? <InlineButton onClick={() => go("signup")}>Create a NevTan account</InlineButton>
          </Typography>
        </Stack>
      </Box>
    );
  } else if (view === "signup") {
    screen = (
      <Box component="form" onSubmit={submit(signUp)} noValidate>
        <Heading
          title="Create your NevTan account"
          text="Use the same email you applied with. One account signs you in to the partner dashboard and every NevTan app."
        />
        <Stack spacing={2.25}>
          {errors.form && <Alert severity="error">{errors.form}</Alert>}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
              autoComplete="given-name"
              autoFocus
              fullWidth
            />
            <TextField label="Surname (optional)" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" fullWidth />
          </Stack>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
            autoComplete="email"
            fullWidth
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(errors.password)}
              helperText={errors.password || `${MIN_PASSWORD} or more characters`}
              autoComplete="new-password"
              fullWidth
            />
            <TextField
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={Boolean(errors.confirm)}
              helperText={errors.confirm}
              autoComplete="new-password"
              fullWidth
            />
          </Stack>
          {passwordToggle}
          <SubmitButton busy={busy}>Create account</SubmitButton>
          <Typography sx={{ fontSize: 14, color: tokens.muted, textAlign: "center" }}>
            Already have an account? <InlineButton onClick={() => go("signin")}>Sign in</InlineButton>
          </Typography>
        </Stack>
      </Box>
    );
  } else if (view === "verify") {
    screen = (
      <>
        <Heading
          title="Check your email"
          text={`We sent a verification link to ${email}. Open it to finish creating your NevTan account, then sign in here.`}
        />
        {notice && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {notice}
          </Alert>
        )}
        <Stack direction="row" spacing={1.5}>
          <Button variant="contained" onClick={() => go("signin")}>
            Sign in
          </Button>
          <Button onClick={resend} disabled={busy}>
            Send the link again
          </Button>
        </Stack>
      </>
    );
  } else if (view === "forgot") {
    screen = (
      <Box component="form" onSubmit={submit(forgot)} noValidate>
        <Heading title="Reset your password" text="Enter the email of your NevTan account and we'll send you a link to choose a new password." />
        <Stack spacing={2.25}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
            autoComplete="email"
            autoFocus
            fullWidth
          />
          <Stack direction="row" spacing={1.5} justifyContent="space-between">
            <Button onClick={() => go("signin")}>Back</Button>
            <SubmitButton busy={busy} fullWidth={false}>
              Send link
            </SubmitButton>
          </Stack>
        </Stack>
      </Box>
    );
  } else if (view === "forgot-sent") {
    screen = (
      <>
        <Heading title="Check your email" text={`If ${email} has a NevTan account, a link to reset your password is on its way.`} />
        <Button variant="contained" onClick={() => go("signin")}>
          Back to sign in
        </Button>
      </>
    );
  }

  return (
    <Layout title={view === "signup" ? "Create account" : "Partner sign in"} path="/login" description="Sign in to the NevTan partner dashboard." noindex>
      <Box sx={{ background: `radial-gradient(900px circle at 0% -10%, ${tokens.brandSoftStrong}, transparent 50%), ${tokens.tint}` }}>
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 9 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 5, border: `1px solid ${tokens.border}`, boxShadow: "0 40px 80px -50px rgba(15,23,42,0.45)" }}>
                {screen}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack
                spacing={2.5}
                justifyContent="center"
                sx={{
                  height: "100%",
                  p: { xs: 3, md: 5 },
                  borderRadius: 5,
                  color: "#fff",
                  background: `radial-gradient(500px circle at 100% 0%, rgba(129, 140, 248,0.3), transparent 60%), ${tokens.deep}`,
                }}
              >
                <Typography sx={{ color: "#a5b4fc", fontWeight: 800, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
                  Partner dashboard
                </Typography>
                <Typography component="h2" sx={{ fontWeight: 850, fontSize: { xs: 24, md: 28 }, lineHeight: 1.25 }}>
                  Everything you earn, in one place
                </Typography>
                <Stack spacing={1.5}>
                  {DASHBOARD_POINTS.map((point) => (
                    <Stack key={point} direction="row" spacing={1.25} alignItems="center">
                      <CheckIcon sx={{ color: "#a5b4fc" }} />
                      <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>{point}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6 }}>
                  The dashboard opens once our team has approved your application.{" "}
                  <Box component={Link} href="/apply" sx={{ color: "#fff", fontWeight: 700 }}>
                    Not a partner yet? Apply
                  </Box>
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default Login;
