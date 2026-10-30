import React from "react";
import Link from "next/link";
import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import { ArrowForwardRounded as ArrowIcon, CheckRounded as CheckIcon } from "@mui/icons-material";
import Layout from "../component/Layout";
import PageHero from "../component/PageHero";
import Reveal from "../component/Reveal";
import AppIcon from "../component/AppIcon";
import CtaBand from "../component/CtaBand";
import { APPS } from "../constant/products";
import { productBySlug } from "../constant/productPages";
import { FREE_APP_NAMES, PAID_APP_NAMES } from "../constant/program";
import { tokens } from "../theme";

const DESCRIPTION = `Every NevTan app you can refer: ${PAID_APP_NAMES} in every NevTan Workspace plan, plus NevTan ${FREE_APP_NAMES} free for every client.`;

const Products = () => (
  <Layout title="Products you can refer" path="/products" description={DESCRIPTION}>
    <PageHero
      eyebrow="Products"
      title="Everything you can refer"
      lead={`${APPS.length} NevTan apps, one referral link. Every NevTan Workspace plan includes ${PAID_APP_NAMES} — and NevTan ${FREE_APP_NAMES} are free for every client.`}
    />

    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
      <Grid container spacing={3}>
        {APPS.map((app, i) => {
          const page = productBySlug(app.slug);
          return (
            <Grid item xs={12} md={6} key={app.code}>
              <Reveal
                delay={(i % 2) * 80}
                sx={{
                  height: "100%",
                  p: { xs: 3, md: 4 },
                  borderRadius: 5,
                  bgcolor: "#fff",
                  border: `1px solid ${tokens.border}`,
                  background: `linear-gradient(160deg, ${app.soft} 0%, #ffffff 45%)`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
                  <AppIcon app={app} size={56} />
                  <Box>
                    <Typography component="h2" sx={{ fontWeight: 850, fontSize: 24, color: tokens.ink }}>
                      {app.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={app.free ? "Free for every client" : "In every paid plan"}
                      sx={{ mt: 0.5, bgcolor: app.free ? tokens.brandSoftStrong : "#fff", color: app.free ? tokens.brandDark : tokens.body, border: `1px solid ${tokens.border}` }}
                    />
                  </Box>
                </Stack>
                <Typography sx={{ fontWeight: 800, fontSize: 19, color: tokens.ink, mb: 1 }}>{page.headline}</Typography>
                <Typography sx={{ color: tokens.muted, lineHeight: 1.65, mb: 2.5 }}>{page.lead}</Typography>
                <Stack spacing={1} sx={{ mb: 3 }}>
                  {page.highlights.map((h) => (
                    <Stack key={h} direction="row" spacing={1} alignItems="center">
                      <CheckIcon sx={{ fontSize: 18, color: app.color }} />
                      <Typography sx={{ fontSize: 14.5, color: tokens.body, fontWeight: 600 }}>{h}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Stack direction="row" spacing={1.5} sx={{ mt: "auto" }}>
                  <Button component={Link} href={`/products/${app.slug}`} variant="contained" endIcon={<ArrowIcon />}>
                    Explore {app.name}
                  </Button>
                  <Button href={app.url} target="_blank" rel="noopener noreferrer" sx={{ color: tokens.brand }}>
                    Visit site
                  </Button>
                </Stack>
              </Reveal>
            </Grid>
          );
        })}
        <Grid item xs={12} md={6}>
          <Reveal
            delay={80}
            sx={{
              height: "100%",
              p: { xs: 3, md: 4 },
              borderRadius: 5,
              color: "#fff",
              background: `radial-gradient(500px circle at 100% 0%, rgba(129, 140, 248,0.35), transparent 60%), ${tokens.deep}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ color: "#a5b4fc", fontWeight: 800, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
                One plan, every app
              </Typography>
              <Typography component="h2" sx={{ mt: 1, fontWeight: 850, fontSize: { xs: 26, md: 30 }, lineHeight: 1.2 }}>
                Refer the suite as one NevTan Workspace plan
              </Typography>
              <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.65 }}>
                Starter, Standard and Plus give every client the whole suite, sized to their team — and you earn commission
                on each one.
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/pricing"
              endIcon={<ArrowIcon />}
              sx={{ mt: 4, alignSelf: "flex-start", bgcolor: "#fff", color: tokens.brand, px: 3, "&:hover": { bgcolor: tokens.brandSoft } }}
            >
              See the plans
            </Button>
          </Reveal>
        </Grid>
      </Grid>
    </Container>

    <CtaBand />
  </Layout>
);

export default Products;
