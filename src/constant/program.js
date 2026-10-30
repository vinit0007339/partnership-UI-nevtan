import { APPS, FREE_APPS, PAID_APPS, listNames } from "./products";

// The partner program's terms. Every page reads them from here, so a change is made once.
// The commission rate and payout schedule are agreed with each partner when they're approved, so
// the public site never states them; an approved partner sees their own rate in the dashboard.
export const TERMS_AGREED = "Your commission rate and payout terms are agreed with you when your application is approved.";
export const REVIEW_TIME = "one business day";
// How long a referral link is remembered in the visitor's browser.
export const REFERRAL_WINDOW = "90 days";

export const PAID_APP_NAMES = listNames(PAID_APPS);
export const FREE_APP_NAMES = listNames(FREE_APPS);

export const TERMS = [
  { value: "Your terms", label: "commission agreed with you on approval" },
  { value: "No billing", label: "NevTan bills and supports your clients" },
  { value: `${APPS.length} apps`, label: "in every NevTan Workspace plan you refer" },
  { value: "1 day", label: "to review your application" },
];

export const AUDIENCES = [
  {
    key: "agency",
    title: "Web & digital agencies",
    copy: "Recommend business email, storage and marketing to every client whose website you build or run.",
  },
  {
    key: "msp",
    title: "IT consultants & MSPs",
    copy: "Point the businesses you support to one affordable suite and earn on every plan they buy.",
  },
  {
    key: "freelancer",
    title: "Freelancers & web developers",
    copy: "Hand every new project a professional setup — domain mailboxes, files and e-signatures — and get paid for it.",
  },
  {
    key: "community",
    title: "Communities, creators & educators",
    copy: "Share NevTan with the founders and small teams who follow you, and earn when they subscribe.",
  },
];

export const STEPS = [
  {
    title: "Apply",
    copy: "Tell us about your business and the clients you work with. It takes about two minutes.",
    detail:
      "Share your company, your website, the country you work in, how many clients you serve and the NevTan apps you want to recommend.",
  },
  {
    title: "Get approved",
    copy: `Our team reviews every application and replies within ${REVIEW_TIME}.`,
    detail:
      "We reply to the email address you applied with. Once you're approved, sign in to the partner dashboard with your NevTan account on that same email.",
  },
  {
    title: "Share your link",
    copy: "Copy your referral link from the dashboard and send it to your clients.",
    detail: `The link opens NevTan Workspace pricing and is remembered in your client's browser for ${REFERRAL_WINDOW}, so they can come back and subscribe later.`,
  },
  {
    title: "Your client subscribes",
    copy: "Your client picks a NevTan Workspace plan and pays NevTan directly.",
    detail:
      "NevTan handles checkout, billing and support. Your client becomes yours in the dashboard as soon as they start a trial or subscribe.",
  },
  {
    title: "Earn commission",
    copy: "You earn commission on what your clients pay, on the terms agreed with you.",
    detail:
      "Your commission rate and payout schedule are agreed with our team when you're approved. Your dashboard shows every client, what they paid and what you've earned.",
  },
];

export const BENEFITS = [
  {
    key: "recurring",
    title: "Commission on what clients pay",
    copy: "Earn on the NevTan Workspace plans your referred clients pay for, at a rate agreed with you when you join.",
  },
  {
    key: "billing",
    title: "No billing, no invoices",
    copy: "Your clients pay NevTan directly. We handle checkout, invoices, payment reminders and support.",
  },
  {
    key: "suite",
    title: "One link, the whole suite",
    copy: `${PAID_APP_NAMES} come in one plan, so a single referral covers everything your client needs.`,
  },
  {
    key: "free",
    title: "AI and Office free for every client",
    copy: `NevTan ${FREE_APP_NAMES} are free on every plan — extra value that makes NevTan easy to recommend.`,
  },
  {
    key: "dashboard",
    title: "See every referral",
    copy: "Your dashboard shows each client you referred, their plan, what they paid and what you earned.",
  },
  {
    key: "security",
    title: "Security clients can trust",
    copy: "TLS encryption, audit trails, admin roles and one sign-in across every NevTan app.",
  },
];

export const NEVTAN_DOES = [
  "Builds and runs the NevTan apps your clients use",
  "Bills your clients and handles their payments",
  "Supports your clients",
  "Tracks every client you refer",
  "Pays your commission on the terms agreed with you",
];

export const PARTNER_DOES = [
  "Finds the businesses that need NevTan",
  "Shares a personal referral link with them",
  "Helps them choose a plan and get started",
];

// What the application form asks for, so applicants know before they start.
export const APPLICATION_FIELDS = [
  "Your name and work email",
  "Company name and website",
  "Country and phone number",
  "How many clients you work with",
  "The NevTan apps you want to recommend",
];

export const FAQ_GROUPS = [
  {
    id: "program",
    title: "The program",
    items: [
      {
        q: "What is the NevTan Partner Program?",
        a: "It rewards businesses that recommend NevTan. You refer clients to NevTan Workspace with your own link, NevTan bills them, and you earn commission on what they pay, on terms agreed with you.",
      },
      {
        q: "Who can apply?",
        a: "Agencies, IT consultants and MSPs, freelancers and web developers, and communities or educators who work with businesses. Tell us about yours in the application.",
      },
      {
        q: "How long does approval take?",
        a: `Our team reviews every application and replies within ${REVIEW_TIME}. Once approved, you sign in with your NevTan account on the email you applied with.`,
      },
    ],
  },
  {
    id: "commission",
    title: "Commission and payouts",
    items: [
      {
        q: "How much do partners earn?",
        a: "Commission is agreed with each partner. Our team discusses the rate and payout terms with you while reviewing your application, and confirms them when you're approved. Your dashboard then shows your rate.",
      },
      {
        q: "When do I get paid?",
        a: "On the payout schedule agreed with you. Your dashboard shows what you've earned, what's owed and what's been paid.",
      },
      {
        q: "In which currency?",
        a: "In the currency your client pays in. A client paying in INR earns you INR; a client paying in USD earns you USD.",
      },
      {
        q: "Do free trials count?",
        a: "A trial makes the client yours, but commission starts with their first payment.",
      },
    ],
  },
  {
    id: "referrals",
    title: "Referrals",
    items: [
      {
        q: "How are my referrals tracked?",
        a: `Your link adds your partner code to NevTan Workspace. The code is remembered in your client's browser for ${REFERRAL_WINDOW}; when they start a trial or subscribe, they're added to your dashboard.`,
      },
      {
        q: "Can I claim a business that already uses NevTan?",
        a: "No. Only clients who haven't paid NevTan Workspace before can be referred. Existing paying customers stay where they are.",
      },
      {
        q: "What if two partners refer the same client?",
        a: "The first partner whose link the client signs up with keeps the client.",
      },
      {
        q: "Who bills my clients?",
        a: "NevTan does. Your clients pay NevTan directly at NevTan Workspace's prices, and NevTan supports them.",
      },
      {
        q: "Can I manage my clients' accounts?",
        a: "Not yet. Today the dashboard shows your clients and earnings, and your clients manage their own accounts.",
      },
    ],
  },
  {
    id: "products",
    title: "The products",
    items: [
      {
        q: "Which products can I refer?",
        a: `Every NevTan Workspace plan includes ${PAID_APP_NAMES}. NevTan ${FREE_APP_NAMES} are free for everyone, on every plan.`,
      },
      {
        q: `Are NevTan ${FREE_APP_NAMES} really free?`,
        a: "Yes. They are free for everyone with a NevTan account, on every plan.",
      },
      {
        q: "How is my clients' data protected?",
        a: "Every app runs over TLS, with admin roles, audit trails and one sign-in across the suite. Each product page lists its own safeguards.",
      },
    ],
  },
];

export const ALL_FAQS = FAQ_GROUPS.flatMap((group) => group.items);
export const HOME_FAQS = [
  FAQ_GROUPS[1].items[0],
  FAQ_GROUPS[1].items[1],
  FAQ_GROUPS[1].items[3],
  FAQ_GROUPS[2].items[0],
  FAQ_GROUPS[2].items[3],
];
