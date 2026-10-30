import { endPoints } from "../constant/Environment";
import { PRODUCT_SLUGS } from "../constant/productPages";

const PUBLIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/pricing", changefreq: "weekly", priority: "0.9" },
  { path: "/apply", changefreq: "monthly", priority: "0.9" },
  { path: "/products", changefreq: "monthly", priority: "0.8" },
  ...PRODUCT_SLUGS.map((slug) => ({ path: `/products/${slug}`, changefreq: "monthly", priority: "0.7" })),
  { path: "/how-it-works", changefreq: "monthly", priority: "0.7" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
];

function escapeXml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildSitemap() {
  const urls = PUBLIC_ROUTES.map(
    ({ path, changefreq, priority }) => `
  <url>
    <loc>${escapeXml(`${endPoints.siteUrl}${path}`)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  ).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>
`;
}

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600");
  res.write(buildSitemap());
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
