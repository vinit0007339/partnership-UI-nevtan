import React, { useState } from "react";
import { Box, Button, Chip, Container, Grid, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import {
  AutorenewRounded as RecurringIcon,
  CurrencyExchangeOutlined as CurrencyIcon,
  OpenInNewRounded as OpenIcon,
  PercentRounded as CommissionIcon,
  ReceiptLongOutlined as BillingIcon,
} from "@mui/icons-material";
import Layout from "../component/Layout";
import PageHero from "../component/PageHero";
import PlanCards from "../component/PlanCards";
import SectionHeading from "../component/SectionHeading";
import Reveal from "../component/Reveal";
import FaqList, { faqJsonLd } from "../component/FaqList";
import CtaBand from "../component/CtaBand";
import { FAQ_GROUPS } from "../constant/program";
import { endPoints } from "../constant/Environment";
import { maxAnnualDiscount, paidPlans, trialDays, useVisitorPricing } from "../Utility/workspacePricing";
import { tokens } from "../theme";

const DESCRIPTION =
  "The NevTan Workspace plans NevTan partners refer, with live list prices. Commission terms are agreed with each partner when they're approved.";

const COMMISSION_FAQS = FAQ_GROUPS.find((g) => g.id === "commission").items;

const HOW_IT_WORKS = [
  { Icon: CommissionIcon, title: "Terms agreed with you", copy: "Your commission rate and payout terms are set with our team when you're approved." },
  { Icon: RecurringIcon, title: "Every paid plan counts", copy: "You earn on the NevTan Workspace plans your referred clients pay for." },
  { Icon: BillingIcon, title: "NevTan bills the client", copy: "Your clients pay NevTan directly. No invoices or payment chasing for you." },
  { Icon: CurrencyIcon, title: "Live list prices", copy: "Prices follow NevTan Workspace, in the currency for your region." },
];

const toggleSx = {
  bgcolor: "#fff",
  "& .MuiToggleButton-root": {
    textTransform: "none",
    fontWeight: 700,
    px: 3,
    py: 1,
    color: tokens.body,
    borderColor: tokens.border,
    "&.Mui-selected": { bgcolor: tokens.brand, color: "#fff", "&:hover": { bgcolor: tokens.brandDark } },
  },
};

const Pricing = ({ pricing: serverPricing }) => {
  const pricing = useVisitorPricing(serverPricing);
  const [annual, setAnnual] = useState(true);
  const plans = paidPlans(pricing);
  const discount = maxAnnualDiscount(pricing);
  const days = trialDays(pricing);

  const chips = [
    "Commission terms agreed with you",
    pricing && `Prices in ${pricing.currency}`,
    days > 0 && `${days}-day free trial for your clients`,
  ].filter(Boolean);

  return (
    <Layout
      title="Plans"
      path="/pricing"
      description={DESCRIPTION}
      jsonLd={{ "@context": "https://schema.org", ...faqJsonLd(COMMISSION_FAQS) }}
    >
      <PageHero
        eyebrow="Plans"
        title="The NevTan Workspace plans you refer"
        lead="Your clients pay NevTan Workspace's list price. These are the live list prices; your commission terms are agreed with you when you're approved."
      >
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
          {chips.map((c) => (
            <Chip key={c} label={c} sx={{ bgcolor: "#fff", border: `1px solid ${tokens.border}`, color: tokens.ink }} />
          ))}
        </Stack>
      </PageHero>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        {plans.length > 0 ? (
          <>
            <Stack alignItems="center" sx={{ mb: 6 }}>
              <ToggleButtonGroup exclusive value={annual ? "annual" : "monthly"} onChange={(_, v) => v && setAnnual(v === "annual")} sx={toggleSx}>
                <ToggleButton value="annual">Annual{discount > 0 ? ` · save ${discount}%` : ""}</ToggleButton>
                <ToggleButton value="monthly">Monthly</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <PlanCards pricing={pricing} annual={annual} />
            <Typography sx={{ mt: 4, textAlign: "center", color: tokens.muted, fontSize: 14 }}>
              NevTan Workspace list prices in {pricing.currency}, per user a month.{" "}
              <Box
                component="a"
                href={`${endPoints.workspaceUrl}/pricing`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: tokens.brand, fontWeight: 700, textDecoration: "none" }}
              >
                Compare every feature on NevTan Workspace
              </Box>
              .
            </Typography>
          </>
        ) : (
          <Stack spacing={2} alignItems="center" textAlign="center" sx={{ py: 6, px: 3, borderRadius: 4, border: `1px dashed ${tokens.border}` }}>
            <Typography sx={{ fontWeight: 800, fontSize: 20, color: tokens.ink }}>Live prices aren&apos;t available right now</Typography>
            <Typography sx={{ color: tokens.muted, maxWidth: 520 }}>
              Your clients pay NevTan Workspace&apos;s list price. See today&apos;s prices on NevTan Workspace.
            </Typography>
            <Button href={`${endPoints.workspaceUrl}/pricing`} target="_blank" rel="noopener noreferrer" variant="contained" endIcon={<OpenIcon />}>
              See NevTan Workspace prices
            </Button>
          </Stack>
        )}
      </Container>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 } }}>
        <SectionHeading eyebrow="The terms" title="How partner commission works" />
        <Grid container spacing={2.5}>
          {HOW_IT_WORKS.map(({ Icon, title, copy }, i) => (
            <Grid item xs={12} sm={6} md={3} key={title}>
              <Reveal delay={i * 70} sx={{ height: "100%", p: 3, borderRadius: 4, border: `1px solid ${tokens.border}`, bgcolor: "#fff" }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 3, display: "grid", placeItems: "center", color: tokens.brand, bgcolor: tokens.brandSoft, mb: 2 }}>
                  <Icon />
                </Box>
                <Typography component="h3" sx={{ fontWeight: 800, color: tokens.ink, mb: 0.5 }}>
                  {title}
                </Typography>
                <Typography sx={{ color: tokens.muted, fontSize: 14.5, lineHeight: 1.6 }}>{copy}</Typography>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="md" sx={{ pb: { xs: 4, md: 6 } }}>
        <SectionHeading title="Commission questions" />
        <Reveal>
          <FaqList items={COMMISSION_FAQS} />
        </Reveal>
      </Container>

      <CtaBand title="Start earning with NevTan" />
    </Layout>
  );
};

export default Pricing;
