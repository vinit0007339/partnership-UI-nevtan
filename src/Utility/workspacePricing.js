import { useEffect, useState } from "react";
import { endPoints } from "../constant/Environment";

// Every list price on this site is read live from NevTan Workspace's public pricing API, so it
// always matches what Workspace sells.
//
// Workspace prices each request for the caller's country. Pages load prices on the server first
// (getStaticProps, refreshed hourly) so they render with real numbers, then the visitor's browser
// asks again so prices switch to the visitor's own currency. That second request only succeeds
// once Workspace allows this site's origin (WORKSPACE_CORS_ORIGINS on the Workspace API); until
// then visitors see the server's prices, which are labelled with their currency.
const PRICING_URL = `${endPoints.workspaceApiBaseUrl}/api/public/pricing`;

// Keeps only what the pages render, so page props stay small.
function slim(data) {
  if (!data || !Array.isArray(data.packages)) return null;
  return {
    country: data.country || null,
    currency: String(data.currency || "usd").toUpperCase(),
    contactSalesUrl: data.contactSalesUrl || `mailto:${endPoints.salesEmail}`,
    packages: data.packages.map((p) => ({
      code: p.code,
      name: p.name,
      description: p.description || "",
      storageGbPerUser: p.storageGbPerUser || 0,
      trialDays: p.trialDays || 0,
      mostPopular: Boolean(p.mostPopular),
      contactSales: Boolean(p.contactSales),
      free: Boolean(p.free),
      includesFrom: p.includesFrom || null,
      monthly: p.monthly ? p.monthly.perUserPerMonth : null,
      annual: p.annual ? p.annual.perUserPerMonth : null,
      annualDiscountPercent: (p.annual && p.annual.discountPercent) || 0,
      highlights: (p.highlights || [])
        .filter((h) => h.showOnPricing !== false)
        .map((h) => h.display || h.name)
        .filter(Boolean),
    })),
  };
}

async function requestPricing(signal) {
  const response = await fetch(PRICING_URL, { headers: { Accept: "application/json" }, signal });
  const payload = await response.json();
  if (!response.ok || payload?.status !== "SUCCESS") {
    throw new Error(`Workspace pricing answered ${response.status}`);
  }
  const pricing = slim(payload.data);
  if (!pricing) throw new Error("Workspace pricing had no plans");
  return pricing;
}

/** For getStaticProps. Never throws: without prices a page still renders and links to Workspace. */
export async function loadPricing() {
  try {
    return await requestPricing(AbortSignal.timeout(8000));
  } catch (error) {
    console.error(`Could not load NevTan Workspace pricing: ${error.message}`);
    return null;
  }
}

/** Starts from the server's prices, then switches to the visitor's own when Workspace allows it. */
export function useVisitorPricing(initial) {
  const [pricing, setPricing] = useState(initial);

  useEffect(() => {
    const controller = new AbortController();
    requestPricing(controller.signal)
      .then(setPricing)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return pricing;
}

/** Plans a referred client can buy in checkout: paid, priced and not "contact sales". */
export const paidPlans = (pricing) =>
  (pricing?.packages || []).filter((p) => !p.free && !p.contactSales && p.monthly !== null);

export const enterprisePlan = (pricing) => (pricing?.packages || []).find((p) => p.contactSales) || null;

export const featuredPlan = (pricing) => {
  const plans = paidPlans(pricing);
  return plans.find((p) => p.mostPopular) || plans[0] || null;
};

export const maxAnnualDiscount = (pricing) =>
  paidPlans(pricing).reduce((max, p) => Math.max(max, p.annualDiscountPercent), 0);

export const trialDays = (pricing) => paidPlans(pricing).reduce((max, p) => Math.max(max, p.trialDays), 0);

/** Per-user monthly list price for the chosen billing period. */
export const listPrice = (plan, annual) => (annual && plan.annual !== null ? plan.annual : plan.monthly);
