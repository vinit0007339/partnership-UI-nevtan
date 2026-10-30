const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const appMode = process.env.NEXT_PUBLIC_APP_ENV || "localhost";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://partner.nevtan.com").replace(/\/+$/, "");

if (!apiBaseUrl) {
  console.error("NEXT_PUBLIC_API_BASE_URL is not configured for this build profile.");
}

const isStage = appMode === "stage";

// NevTan Workspace sells the plans partners refer clients to; its /pricing page and public pricing
// API are the source of every list price on this site.
const workspaceUrl = isStage ? "https://stage-workspace.nevtan.com" : "https://workspace.nevtan.com";
const workspaceApiBaseUrl = (
  process.env.NEXT_PUBLIC_WORKSPACE_API_BASE ||
  (isStage ? "https://stage-api-workspace.nevtan.com" : "https://api-workspace.nevtan.com")
).replace(/\/+$/, "");

// The Mail site hosts NevTan's contact form and legal pages.
const mailSiteUrl = "https://mail.nevtan.com";

export const endPoints = {
  apiBaseUrl,
  siteUrl,
  workspaceUrl,
  workspaceApiBaseUrl,
  mailSiteUrl,
  contactUrl: `${mailSiteUrl}/contact`,
  salesEmail: "sales@nevtan.com",

  api: {
    PARTNER_APPLICATIONS: "api/public/partner-applications",
    AUTH_CONFIG: "api/auth/config",
    AUTH_EXCHANGE: "api/auth/sso/exchange",
    AUTH_ME: "api/auth/me",
    PARTNER_DASHBOARD: "api/partner/dashboard",
    ADMIN_APPLICATIONS: "api/admin/applications",
    ADMIN_PARTNERS: "api/admin/partners",
    ADMIN_PAYOUTS: "api/admin/payouts",
  },
  mode: appMode,
  isStage,
};
