import React, { useEffect } from "react";
import Link from "next/link";
import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import {
  AppsOutlined as SuiteIcon,
  ArrowForwardRounded as ArrowIcon,
  AutoAwesomeOutlined as FreeIcon,
  CheckCircleRounded as CheckIcon,
  CodeOutlined as FreelancerIcon,
  Groups2Outlined as CommunityIcon,
  InsightsOutlined as DashboardIcon,
  LanOutlined as MspIcon,
  PaymentsOutlined as RecurringIcon,
  ReceiptLongOutlined as BillingIcon,
  VerifiedUserOutlined as SecurityIcon,
  WebOutlined as AgencyIcon,
} from "@mui/icons-material";
import Layout from "../component/Layout";
import Reveal from "../component/Reveal";
import SectionHeading from "../component/SectionHeading";
import AppIcon from "../component/AppIcon";
import ReferralCard from "../component/ReferralCard";
import FaqList, { faqJsonLd } from "../component/FaqList";
import CtaBand from "../component/CtaBand";
import { FREE_APPS, PAID_APPS } from "../constant/products";
import { productBySlug } from "../constant/productPages";
import {
  AUDIENCES,
  BENEFITS,
  FREE_APP_NAMES,
  HOME_FAQS,
  PAID_APP_NAMES,
  REVIEW_TIME,
  STEPS,
  TERMS,
} from "../constant/program";
import { endPoints } from "../constant/Environment";
import { formatMoney } from "../Utility/format";
import { listPrice, paidPlans, useVisitorPricing } from "../Utility/workspacePricing";
import { trackMetaEvent } from "../Utility/metaPixel";
import { tokens } from "../theme";

const DESCRIPTION = `Join the NevTan Partner Program: refer clients to NevTan Workspace — ${PAID_APP_NAMES}, plus free NevTan ${FREE_APP_NAMES} — and earn commission on what they pay, on terms agreed with you when you're approved.`;

const BENEFIT_ICONS = {
  recurring: RecurringIcon,
  billing: BillingIcon,
  suite: SuiteIcon,
  free: FreeIcon,
  dashboard: DashboardIcon,
  security: SecurityIcon,
};

const AUDIENCE_ICONS = {
  agency: AgencyIcon,
  msp: MspIcon,
  freelancer: FreelancerIcon,
  community: CommunityIcon,
};

const HERO_CHECKS = ["Commission terms agreed with you", "NevTan bills your clients", `Reply within ${REVIEW_TIME}`];

const cardSx = {
  height: "100%",
  p: 3,
  borderRadius: 4,
  bgcolor: "#fff",
  border: `1px solid ${tokens.border}`,
  transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
};

const IconTile = ({ Icon }) => (
  <Box
    sx={{
      width: 48,
      height: 48,
      borderRadius: 3,
      display: "grid",
      placeItems: "center",
      color: tokens.brand,
      background: `linear-gradient(135deg, ${tokens.brandSoft} 0%, ${tokens.brandSoftStrong} 100%)`,
      mb: 2,
    }}
  >
    <Icon />
  </Box>
);

const AppCard = ({ app }) => {
  const page = productBySlug(app.slug);
  return (
    <Box
      component={Link}
      href={`/products/${app.slug}`}
      sx={{
        ...cardSx,
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        position: "relative",
        overflow: "hidden",
        "&:before": { content: '""', position: "absolute", inset: "0 0 auto 0", height: 4, bgcolor: app.color },
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 24px 48px -28px rgba(15,23,42,0.35)", borderColor: "transparent" },
      }}
    >
      <AppIcon app={app} size={52} />
      <Typography component="h3" sx={{ mt: 2, fontWeight: 800, fontSize: 19, color: tokens.ink }}>
        {app.title}
      </Typography>
      <Typography sx={{ color: tokens.muted, mt: 0.5, mb: 2 }}>{page ? page.headline : app.description}</Typography>
      {page && (
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75} sx={{ mb: 2 }}>
          {page.highlights.map((h) => (
            <Chip key={h} label={h} size="small" sx={{ bgcolor: app.soft, color: tokens.ink, fontWeight: 600 }} />
          ))}
        </Stack>
      )}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: "auto", color: tokens.brand, fontWeight: 700, fontSize: 14 }}>
        <span>Learn more</span>
        <ArrowIcon sx={{ fontSize: 18 }} />
      </Stack>
    </Box>
  );
};

const Home = ({ pricing: serverPricing }) => {
  const pricing = useVisitorPricing(serverPricing);
  const plans = paidPlans(pricing);

  useEffect(() => {
    trackMetaEvent("ViewContent", { content_name: "Partner Program", content_category: "landing" });
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${endPoints.siteUrl}/#webpage`,
        url: `${endPoints.siteUrl}/`,
        name: "NevTan Partner Program",
        description: DESCRIPTION,
        isPartOf: { "@id": `${endPoints.siteUrl}/#website` },
        inLanguage: "en",
      },
      faqJsonLd(HOME_FAQS),
    ],
  };

  return (
    <Layout description={DESCRIPTION} jsonLd={jsonLd}>
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background: `radial-gradient(1000px circle at 0% -10%, ${tokens.brandSoftStrong}, transparent 50%), radial-gradient(900px circle at 100% 0%, #e0f2fe, transparent 45%), linear-gradient(180deg, #ffffff 0%, ${tokens.tint} 100%)`,
        }}
      >
        <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 10, md: 14 } }}>
          <Grid container spacing={{ xs: 6, md: 6 }} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Chip
                  label="NevTan Partner Program"
                  size="small"
                  sx={{ alignSelf: "flex-start", bgcolor: "rgba(238, 242, 255,0.9)", border: "1px solid rgba(67, 56, 202,0.25)", color: tokens.brand }}
                />
                <Typography
                  component="h1"
                  sx={{ fontWeight: 850, fontSize: { xs: 40, sm: 50, md: 62 }, lineHeight: 1.03, letterSpacing: "-0.02em", color: tokens.ink }}
                >
                  Earn with the{" "}
                  <Box
                    component="span"
                    sx={{
                      background: `linear-gradient(120deg, ${tokens.brandBright} 0%, ${tokens.brand} 60%, #3730a3 100%)`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    NevTan suite
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: { xs: 18, md: 21 }, color: "text.secondary", lineHeight: 1.55, maxWidth: 580 }}>
                  Recommend business email, file storage, e-signatures, marketing and cloud to your clients. They
                  subscribe to NevTan Workspace with your link, NevTan bills them, and you earn commission on what
                  they pay, on terms agreed with you.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    component={Link}
                    href="/apply"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowIcon />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${tokens.brandBright} 0%, ${tokens.brand} 100%)`,
                      "&:hover": { background: `linear-gradient(135deg, ${tokens.brand} 0%, ${tokens.brandDark} 100%)` },
                    }}
                  >
                    Apply in 2 minutes
                  </Button>
                  <Button
                    component={Link}
                    href="/pricing"
                    variant="outlined"
                    size="large"
                    sx={{ py: 1.5, px: 3.5, fontSize: "1.05rem", color: tokens.brand, borderColor: tokens.brand, bgcolor: "rgba(255,255,255,0.7)" }}
                  >
                    See the plans
                  </Button>
                </Stack>
                <Stack direction="row" flexWrap="wrap" useFlexGap spacing={2.5}>
                  {HERO_CHECKS.map((text) => (
                    <Stack key={text} direction="row" spacing={0.75} alignItems="center">
                      <CheckIcon sx={{ fontSize: 20, color: tokens.brand }} />
                      <Typography sx={{ fontWeight: 600, color: tokens.body, fontSize: 15 }}>{text}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <ReferralCard />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Terms */}
      <Container maxWidth="lg" sx={{ mt: { xs: -6, md: -8 }, position: "relative", zIndex: 2 }}>
        <Reveal
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
            bgcolor: "#fff",
            borderRadius: 4,
            border: `1px solid ${tokens.border}`,
            boxShadow: "0 30px 60px -40px rgba(15,23,42,0.45)",
            overflow: "hidden",
          }}
        >
          {TERMS.map((t) => (
            <Box key={t.label} sx={{ p: { xs: 2.5, md: 3.5 }, textAlign: "center", outline: `1px solid ${tokens.border}` }}>
              <Typography sx={{ fontWeight: 850, fontSize: { xs: 26, md: 34 }, color: tokens.brand, lineHeight: 1.15 }}>{t.value}</Typography>
              <Typography sx={{ color: tokens.muted, fontSize: 14, mt: 0.5 }}>{t.label}</Typography>
            </Box>
          ))}
        </Reveal>
      </Container>

      {/* Apps */}
      <Container maxWidth="lg" sx={{ py: { xs: 9, md: 12 } }}>
        <SectionHeading
          eyebrow="The NevTan suite"
          title="Everything your clients need, in one plan"
          subtitle={`Every NevTan Workspace plan includes ${PAID_APP_NAMES} — so one referral covers everything, not five products.`}
        />
        <Grid container spacing={2.5}>
          {PAID_APPS.map((app, i) => (
            <Grid item xs={12} sm={6} md={4} key={app.code}>
              <Reveal delay={(i % 3) * 80} sx={{ height: "100%" }}>
                <AppCard app={app} />
              </Reveal>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Reveal delay={160} sx={{ height: "100%" }}>
              <Stack
                justifyContent="space-between"
                sx={{
                  ...cardSx,
                  border: "none",
                  color: "#fff",
                  background: `radial-gradient(400px circle at 100% 0%, rgba(129, 140, 248,0.35), transparent 60%), ${tokens.deep}`,
                }}
              >
                <Box>
                  <Typography sx={{ color: "#a5b4fc", fontWeight: 800, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
                    One plan, every app
                  </Typography>
                  <Typography component="h3" sx={{ mt: 1, fontWeight: 800, fontSize: 22, lineHeight: 1.25 }}>
                    Refer the whole suite as one NevTan Workspace plan
                  </Typography>
                  <Typography sx={{ mt: 1, color: "rgba(255,255,255,0.75)" }}>
                    Starter, Standard and Plus for every size of client — one referral covers everything they need.
                  </Typography>
                </Box>
                <Button component={Link} href="/pricing" endIcon={<ArrowIcon />} sx={{ mt: 3, alignSelf: "flex-start", bgcolor: "#fff", color: tokens.brand, "&:hover": { bgcolor: tokens.brandSoft } }}>
                  Compare plans
                </Button>
              </Stack>
            </Reveal>
          </Grid>
        </Grid>

        <Reveal
          sx={{
            mt: 2.5,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: `1px dashed rgba(67, 56, 202,0.4)`,
            bgcolor: tokens.brandSoft,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 20, color: tokens.ink }}>Free for every client: NevTan {FREE_APP_NAMES}</Typography>
            <Typography sx={{ color: tokens.muted, mt: 0.5 }}>
              On every plan, at no cost to your clients — extra value that makes NevTan easy to recommend.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {FREE_APPS.map((app) => (
              <Stack
                key={app.code}
                component={Link}
                href={`/products/${app.slug}`}
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ px: 2, py: 1.5, borderRadius: 3, bgcolor: "#fff", border: `1px solid ${tokens.border}`, textDecoration: "none", "&:hover": { borderColor: app.color } }}
              >
                <AppIcon app={app} size={40} />
                <Box>
                  <Typography sx={{ fontWeight: 800, color: tokens.ink }}>{app.title}</Typography>
                  <Typography sx={{ fontSize: 13, color: tokens.muted }}>{app.description}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Reveal>
      </Container>

      {/* Why NevTan */}
      <Box sx={{ bgcolor: tokens.tint, borderTop: `1px solid ${tokens.border}`, borderBottom: `1px solid ${tokens.border}` }}>
        <Container maxWidth="lg" sx={{ py: { xs: 9, md: 12 } }}>
          <SectionHeading
            eyebrow="Why partner with NevTan"
            title="A program built so you earn on every client"
            subtitle="Recommend a complete, modern suite — NevTan does the billing and support, you earn commission."
          />
          <Grid container spacing={2.5}>
            {BENEFITS.map((b, i) => {
              const Icon = BENEFIT_ICONS[b.key];
              return (
                <Grid item xs={12} sm={6} md={4} key={b.key}>
                  <Reveal delay={(i % 3) * 80} sx={{ ...cardSx, "&:hover": { boxShadow: "0 24px 48px -30px rgba(15,23,42,0.35)" } }}>
                    <IconTile Icon={Icon} />
                    <Typography component="h3" sx={{ fontWeight: 800, fontSize: 18, color: tokens.ink, mb: 0.75 }}>
                      {b.title}
                    </Typography>
                    <Typography sx={{ color: tokens.muted, lineHeight: 1.65 }}>{b.copy}</Typography>
                  </Reveal>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Who it's for */}
      <Container maxWidth="lg" sx={{ py: { xs: 9, md: 12 } }}>
        <SectionHeading
          eyebrow="Who it's for"
          title="Built for people businesses already trust"
          subtitle="If your clients ask you which tools to use, NevTan gives you a complete suite to recommend — and pays you for it."
        />
        <Grid container spacing={2.5}>
          {AUDIENCES.map((a, i) => {
            const Icon = AUDIENCE_ICONS[a.key];
            return (
              <Grid item xs={12} sm={6} md={3} key={a.key}>
                <Reveal delay={i * 70} sx={cardSx}>
                  <IconTile Icon={Icon} />
                  <Typography component="h3" sx={{ fontWeight: 800, fontSize: 17, color: tokens.ink, mb: 0.75 }}>
                    {a.title}
                  </Typography>
                  <Typography sx={{ color: tokens.muted, fontSize: 14.5, lineHeight: 1.65 }}>{a.copy}</Typography>
                </Reveal>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* How it works */}
      <Box sx={{ bgcolor: tokens.tint, borderTop: `1px solid ${tokens.border}`, borderBottom: `1px solid ${tokens.border}` }}>
        <Container maxWidth="lg" sx={{ py: { xs: 9, md: 12 } }}>
          <SectionHeading eyebrow="How it works" title="From application to your first payout" />
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(5, 1fr)" }, gap: 2.5 }}>
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} sx={{ ...cardSx, position: "relative" }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 850,
                    color: "#fff",
                    background: `linear-gradient(135deg, ${tokens.brandBright} 0%, ${tokens.brand} 100%)`,
                    mb: 2,
                  }}
                >
                  {i + 1}
                </Box>
                <Typography component="h3" sx={{ fontWeight: 800, color: tokens.ink, mb: 0.75 }}>
                  {s.title}
                </Typography>
                <Typography sx={{ color: tokens.muted, fontSize: 14, lineHeight: 1.6 }}>{s.copy}</Typography>
              </Reveal>
            ))}
          </Box>
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Button component={Link} href="/how-it-works" endIcon={<ArrowIcon />} sx={{ color: tokens.brand, fontSize: 16 }}>
              See the full process
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Pricing */}
      <Box sx={{ background: `radial-gradient(900px circle at 0% 0%, rgba(129, 140, 248,0.22), transparent 50%), ${tokens.deep}` }}>
        <Container maxWidth="lg" sx={{ py: { xs: 9, md: 12 } }}>
          <SectionHeading
            dark
            eyebrow="The plans"
            title="Plans your clients can choose"
            subtitle={
              plans.length
                ? `Live NevTan Workspace list prices in ${pricing.currency}, per user a month, billed annually.`
                : "Every NevTan Workspace plan includes the whole suite."
            }
          />
          {plans.length > 0 && (
            <Grid container spacing={2.5} justifyContent="center">
              {plans.map((plan, i) => {
                const list = listPrice(plan, true);
                return (
                  <Grid item xs={12} sm={6} md={4} key={plan.code}>
                    <Reveal
                      delay={i * 80}
                      sx={{
                        height: "100%",
                        p: 3.5,
                        borderRadius: 4,
                        bgcolor: plan.mostPopular ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
                        border: plan.mostPopular ? "1px solid #a5b4fc" : "1px solid rgba(255,255,255,0.14)",
                        color: "#fff",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography component="h3" sx={{ fontWeight: 800, fontSize: 20 }}>
                          {plan.name}
                        </Typography>
                        {plan.mostPopular && <Chip label="Most popular" size="small" sx={{ bgcolor: "#a5b4fc", color: tokens.deep }} />}
                      </Stack>
                      <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ mt: 2 }}>
                        <Typography sx={{ fontWeight: 850, fontSize: 38, lineHeight: 1.1 }}>
                          {formatMoney(list, pricing.currency)}
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>per user / month</Typography>
                      </Stack>
                      <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 14, mt: 1.5 }}>{plan.description}</Typography>
                    </Reveal>
                  </Grid>
                );
              })}
            </Grid>
          )}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center" sx={{ mt: 5 }}>
            <Button
              component={Link}
              href="/pricing"
              size="large"
              endIcon={<ArrowIcon />}
              sx={{ bgcolor: "#fff", color: tokens.brand, px: 4, py: 1.4, fontWeight: 800, "&:hover": { bgcolor: tokens.brandSoft } }}
            >
              Compare plans
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* FAQ */}
      <Container maxWidth="md" sx={{ py: { xs: 9, md: 12 } }}>
        <SectionHeading eyebrow="FAQ" title="Questions partners ask" />
        <Reveal>
          <FaqList items={HOME_FAQS} />
        </Reveal>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button component={Link} href="/faq" endIcon={<ArrowIcon />} sx={{ color: tokens.brand, fontSize: 16 }}>
            See all questions
          </Button>
        </Box>
      </Container>

      <CtaBand />
    </Layout>
  );
};

export default Home;
