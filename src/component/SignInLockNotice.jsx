import React from "react";
import { Alert, AlertTitle, Box, Link as MuiLink } from "@mui/material";
import { SIGN_IN_LOCK, formatCountdown, formatLocalTime } from "../Utility/signInLock";
import { tokens } from "../theme";

const SignInLockNotice = ({ lock, millisLeft, onResetPassword }) => {
  const network = lock.kind === SIGN_IN_LOCK.NETWORK;
  return (
    <Alert severity="warning" sx={{ textAlign: "left" }}>
      <AlertTitle sx={{ fontWeight: 700 }}>{network ? "Too many sign-in attempts" : "Account temporarily locked"}</AlertTitle>
      {network ? "Too many sign-in attempts came from your network." : "Too many wrong passwords were entered for this account."}{" "}
      You can try again at {formatLocalTime(lock.unlockAt)}, in{" "}
      <Box component="span" aria-hidden="true" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
        {formatCountdown(millisLeft)}
      </Box>
      .
      {!network && lock.canResetPassword && (
        <Box sx={{ mt: 0.75 }}>
          Can&apos;t wait?{" "}
          <MuiLink
            component="button"
            type="button"
            onClick={onResetPassword}
            underline="hover"
            sx={{ fontWeight: 700, color: tokens.brand, verticalAlign: "baseline" }}
          >
            Reset your password
          </MuiLink>{" "}
          to unlock it now.
        </Box>
      )}
      {!network && !lock.canResetPassword && (
        <Box sx={{ mt: 0.75 }}>
          Can&apos;t wait? Ask your domain admin to unlock your account from Admin → Mailboxes in NevTan Mail.
        </Box>
      )}
    </Alert>
  );
};

export default SignInLockNotice;
