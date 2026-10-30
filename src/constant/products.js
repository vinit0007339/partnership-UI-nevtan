import { endPoints } from "./Environment";

// Each app's own site, for the same environment as this build.
const APP_URLS = endPoints.isStage
  ? {
      MAIL: "https://stage-mail.nevtan.com",
      DRIVE: "https://stage-drive.nevtan.com",
      ENGAGE: "https://stage-engage.nevtan.com",
      SIGN: "https://stage-sign.nevtan.com",
      CLOUD: "https://stage-cloud.nevtan.com",
      AI: "https://ai-stage.nevtan.com",
      OFFICE: "https://office.nevtan.com",
    }
  : {
      MAIL: "https://mail.nevtan.com",
      DRIVE: "https://drive.nevtan.com",
      ENGAGE: "https://engage.nevtan.com",
      SIGN: "https://sign.nevtan.com",
      CLOUD: "https://cloud.nevtan.com",
      AI: "https://ai.nevtan.com",
      OFFICE: "https://office.nevtan.com",
    };

/**
 * The NevTan apps, in the same order, names and colours as NevTan Workspace. Every paid
 * Workspace plan includes the first five; NevTan AI and Office are free for everyone.
 */
export const APPS = [
  {
    code: "MAIL",
    slug: "mail",
    name: "Mail",
    title: "NevTan Mail",
    description: "Business email on your own domain.",
    icon: "/product-icons/nevtan-mail.png",
    color: "#d93025",
    soft: "#fce8e6",
    free: false,
  },
  {
    code: "DRIVE",
    slug: "drive",
    name: "Drive",
    title: "NevTan Drive",
    description: "Store, share and edit files.",
    icon: "/product-icons/nevtan-drive.svg",
    color: "#f9ab00",
    soft: "#fef7e0",
    free: false,
  },
  {
    code: "ENGAGE",
    slug: "engage",
    name: "Engage",
    title: "NevTan Engage",
    description: "Email, SMS and WhatsApp campaigns.",
    icon: "/product-icons/nevtan-engage.png",
    color: "#009688",
    soft: "#e0f2f1",
    free: false,
  },
  {
    code: "SIGN",
    slug: "sign",
    name: "Sign",
    title: "NevTan Sign",
    description: "Send and sign agreements.",
    icon: "/product-icons/nevtan-sign.png",
    color: "#1a73e8",
    soft: "#e8f0fe",
    free: false,
  },
  {
    code: "CLOUD",
    slug: "cloud",
    name: "Cloud",
    title: "NevTan Cloud",
    description: "Host apps, databases and storage.",
    icon: "/product-icons/nevtan-cloud.png",
    color: "#1d9e75",
    soft: "#e8f6f1",
    free: false,
  },
  {
    code: "AI",
    slug: "ai",
    name: "AI",
    title: "NevTan AI",
    description: "Chat, write and research.",
    icon: "/product-icons/nevtan-ai-upload.png",
    color: "#8430ce",
    soft: "#f3e8fd",
    free: true,
  },
  {
    code: "OFFICE",
    slug: "office",
    name: "Office",
    title: "NevTan Office",
    description: "Docs, Sheets, Slides and PDFs.",
    icon: "/product-icons/nevtan-office.png",
    color: "#e8710a",
    soft: "#feefe3",
    free: true,
  },
].map((app) => ({ ...app, url: `${APP_URLS[app.code]}/` }));

export const PAID_APPS = APPS.filter((app) => !app.free);
export const FREE_APPS = APPS.filter((app) => app.free);

const BY_CODE = Object.fromEntries(APPS.map((app) => [app.code, app]));

export function appByCode(code) {
  return BY_CODE[String(code || "").toUpperCase()] || null;
}

export const listNames = (apps) =>
  new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(apps.map((app) => app.name));
