// Thin wrapper around window.fbq (Meta Pixel). A no-op when the Pixel didn't load
// (ad blocker, NEXT_PUBLIC_META_PIXEL_ID unset, SSR).
export const trackMetaEvent = (eventName, params) => {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", eventName, params || {});
};
