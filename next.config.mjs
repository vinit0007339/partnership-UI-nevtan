/** @type {import('next').NextConfig} */

// Reduces a configured URL down to just its origin (scheme://host[:port]), so a
// value with a trailing path can't turn into a path-scoped CSP source.
function originOnly(url) {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

// Report-Only: logs violations to the browser console without blocking anything.
// MUI/Emotion and the GTM/Meta Pixel loaders rely on inline scripts/styles, so an
// enforced script-src/style-src needs nonces first.
function buildCsp() {
  const connectSrc = [
    "'self'",
    originOnly(process.env.NEXT_PUBLIC_API_BASE_URL),
    // Partner sign-in goes straight from the browser to NevTan SSO (src/Utility/sso.js).
    "https://sso.nevtan.com",
    "https://stage-sso.nevtan.com",
    // Live list prices, read from the visitor's browser (src/Utility/workspacePricing.js).
    "https://api-workspace.nevtan.com",
    "https://stage-api-workspace.nevtan.com",
    "https://www.google-analytics.com",
    "https://www.facebook.com",
  ].filter(Boolean);

  const directives = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://connect.facebook.net"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "https:"],
    "font-src": ["'self'"],
    "connect-src": connectSrc,
    "frame-src": ["'self'", "https://www.googletagmanager.com"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  return Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}

// The subset of the policy above that is safe to enforce today.
function buildEnforcedCsp() {
  return ["base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", "object-src 'none'"].join("; ");
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Emits .next/standalone with a self-contained server.js, which is what the Dockerfile runs.
  output: "standalone",
  experimental: {
    // Back/forward between pages returns to where the visitor was. A refresh still starts at the
    // top: _document.jsx turns off the browser's own restore before the page loads.
    scrollRestoration: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: buildEnforcedCsp() },
          { key: "Content-Security-Policy-Report-Only", value: buildCsp() },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
