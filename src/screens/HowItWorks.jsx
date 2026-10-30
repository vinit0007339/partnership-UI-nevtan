import React from "react";
import Link from "next/link";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import {
  ArrowForwardRounded as ArrowIcon,
  CheckCircleRounded as CheckIcon,
  HandshakeOutlined as PartnerIcon,
} from "@mui/icons-material";
import Layout from "../component/Layout";
import PageHero from "../component/PageHero";
import Reveal from "../component/Reveal";
import SectionHeading from "../component/SectionHeading";
import CtaBand from "../component/CtaBand";
import { APPLICATION_FIELDS, NEVTAN_DOES, PARTNER_DOES, REVIEW_TIME, STEPS } from "../constant/program";
import { tokens } from "../theme";

const DESCRIPTION = `How the NevTan Partner Program works: apply in two minutes, get a reply within ${REVIEW_TIME}, share your referral link and earn commission on what your clients pay, on terms agreed with you.`;

const RoleCard = ({ title, items, Icon, dark }) => (
  <Reveal
    sx={{
      height: "100%",
      p: { xs: 3, md: 4 },
      borderRadius: 5,
      ...(dark
        ? { color: "#fff", background: `radial-gradient(500px circle at 100% 0%, rgba(129, 140, 248,0.3), transparent 60%), ${tokens.deep}` }
        : { bgcolor: "#fff", border: `1px solid ${tokens.border}` }),
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
      {Icon ? (
        <Box sx={{ width: 44, height: 44, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: tokens.brandSoft, color: tokens.brand }}>
          <Icon />
        </Box>
      ) : (
        <Box component="img" src="/favicon.png" alt="" sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: "#fff", p: 0.75 }} />
      )}
      <Typography component="h3" sx={{ fontWeight: 850, fontSize: 22 }}>
        {title}
      </Typography>
    </Stack>
    <Stack spacing={1.75}>
      {items.map((item) => (
        <Stack key={item} direction="row" spacing={1.25} alignItems="flex-start">
          <CheckIcon sx={{ color: dark ? "#a5b4fc" : tokens.brand, mt: "1px" }} />
          <Typography sx={{ color: dark ? "rgba(255,255,255,0.85)" : tokens.body, lineHeight: 1.55 }}>{item}</Typography>
        </Stack>
      ))}
    </Stack>
  </Reveal>
);

const HowItWorks = () => (
  <Layout title="How it works" path="/how-it-works" description={DESCRIPTION}>
    <PageHero
      eyebrow="How it works"
      title="From application to your first payout"
      lead="Five steps take you from applying to earning on every client you refer. Here's what happens at each one."
    />

    <Container maxWidth="md" sx={{ py: { xs: 7, md: 10 } }}>
      <Box sx={{ position: "relative" }}>
        <Box
          aria-hidden="true"
          sx={{ position: "absolute", left: { xs: 23, md: 27 }, top: 24, bottom: 24, width: 2, bgcolor: tokens.brandSoftStrong }}
        />
        <Stack spacing={{ xs: 3, md: 4 }}>
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 60} sx={{ position: "relative", display: "flex", gap: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  flexShrink: 0,
                  width: { xs: 48, md: 56 },
                  height: { xs: 48, md: 56 },
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 850,
                  fontSize: { xs: 18, md: 20 },
                  color: "#fff",
                  background: `linear-gradient(135deg, ${tokens.brandBright} 0%, ${tokens.brand} 100%)`,
                  boxShadow: "0 0 0 6px #fff",
                  zIndex: 1,
                }}
              >
                {i + 1}
              </Box>
              <Box sx={{ flex: 1, p: { xs: 2.5, md: 3.5 }, borderRadius: 4, border: `1px solid ${tokens.border}`, bgcolor: "#fff" }}>
                <Typography component="h2" sx={{ fontWeight: 850, fontSize: { xs: 20, md: 24 }, color: tokens.ink }}>
                  {step.title}
                </Typography>
                <Typography sx={{ mt: 1, color: tokens.ink, fontWeight: 600, lineHeight: 1.6 }}>{step.copy}</Typography>
                <Typography sx={{ mt: 1, color: tokens.muted, lineHeight: 1.7 }}>{step.detail}</Typography>
                {i === 0 && (
                  <Button component={Link} href="/apply" endIcon={<ArrowIcon />} sx={{ mt: 1.5, ml: -1, color: tokens.brand }}>
                    Start your application
                  </Button>
                )}
              </Box>
            </Reveal>
          ))}
        </Stack>
      </Box>
    </Container>

    <Box sx={{ bgcolor: tokens.tint, borderTop: `1px solid ${tokens.border}`, borderBottom: `1px solid ${tokens.border}` }}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 } }}>
        <SectionHeading eyebrow="Who does what" title="A clear split between you and NevTan" />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <RoleCard title="NevTan" items={NEVTAN_DOES} dark />
          </Grid>
          <Grid item xs={12} md={6}>
            <RoleCard title="You, the partner" items={PARTNER_DOES} Icon={PartnerIcon} />
          </Grid>
        </Grid>
      </Container>
    </Box>

    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 } }}>
      <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
        <Grid item xs={12} md={6}>
          <SectionHeading
            align="left"
            eyebrow="Before you apply"
            title="What we'll ask you"
            subtitle="The application takes about two minutes. Have these ready:"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Reveal sx={{ p: { xs: 3, md: 4 }, borderRadius: 5, border: `1px solid ${tokens.border}`, bgcolor: "#fff" }}>
            <Stack spacing={1.75}>
              {APPLICATION_FIELDS.map((f) => (
                <Stack key={f} direction="row" spacing={1.25} alignItems="center">
                  <CheckIcon sx={{ color: tokens.brand }} />
                  <Typography sx={{ color: tokens.ink, fontWeight: 600 }}>{f}</Typography>
                </Stack>
              ))}
            </Stack>
            <Button component={Link} href="/apply" variant="contained" endIcon={<ArrowIcon />} sx={{ mt: 3 }}>
              Apply now
            </Button>
          </Reveal>
        </Grid>
      </Grid>
    </Container>

    <CtaBand />
  </Layout>
);

export default HowItWorks;
