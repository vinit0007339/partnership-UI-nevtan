export const SIGN_IN_LOCK = {
  ACCOUNT: "account",
  NETWORK: "network",
};

const normalEmail = (email) => (email || "").trim().toLowerCase();

export function readSignInLock(error, email, now = Date.now()) {
  const status = error && error.status;
  if (status !== 423 && status !== 429) return null;
  const seconds = Number(error.retryAfterSeconds);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  return {
    kind: status === 429 ? SIGN_IN_LOCK.NETWORK : SIGN_IN_LOCK.ACCOUNT,
    email: normalEmail(email),
    seconds,
    unlockAt: now + seconds * 1000,
    canResetPassword: error.canResetPassword !== false,
  };
}

export function lockMillisLeft(lock, now = Date.now()) {
  if (!lock) return 0;
  return Math.max(0, Math.min(lock.seconds * 1000, lock.unlockAt - now));
}

export const lockAppliesTo = (lock, email) =>
  Boolean(lock) && (lock.kind === SIGN_IN_LOCK.NETWORK || lock.email === normalEmail(email));

const pad2 = (value) => String(value).padStart(2, "0");

export function formatCountdown(millis) {
  const total = Math.max(0, Math.ceil(millis / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours > 0 ? `${hours}:${pad2(minutes)}:${pad2(seconds)}` : `${minutes}:${pad2(seconds)}`;
}

export function formatLocalTime(instant, timeZone) {
  return new Date(instant).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    ...(timeZone ? { timeZone } : {}),
  });
}
