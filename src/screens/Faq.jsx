import React from "react";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import Layout from "../component/Layout";
import PageHero from "../component/PageHero";
import Reveal from "../component/Reveal";
import FaqList, { faqJsonLd } from "../component/FaqList";
import CtaBand from "../component/CtaBand";
import { ALL_FAQS, FAQ_GROUPS } from "../constant/program";
import { endPoints } from "../constant/Environment";
import { tokens } from "../theme";

const DESCRIPTION = "Answers about the NevTan Partner Program: the commission, payouts, how referrals are tracked and the products you can refer.";

const Faq = () => (
  <Layout title="FAQ" path="/faq" description={DESCRIPTION} jsonLd={{ "@context": "https://schema.org", ...faqJsonLd(ALL_FAQS) }}>
    <PageHero eyebrow="FAQ" title="Frequently asked questions" lead="Everything partners ask us about the program, commission, referrals and products." />

    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
      <Grid container spacing={{ xs: 4, md: 6 }}>
        <Grid item xs={12} md={3} sx={{ display: { xs: "none", md: "block" } }}>
          <Stack component="nav" aria-label="FAQ topics" spacing={0.5} sx={{ position: "sticky", top: 96 }}>
            {FAQ_GROUPS.map((g) => (
              <Box
                key={g.id}
                component="a"
                href={`#${g.id}`}
                sx={{ px: 2, py: 1, borderRadius: 2, color: tokens.body, fontWeight: 600, textDecoration: "none", "&:hover": { bgcolor: tokens.brandSoft, color: tokens.brand } }}
              >
                {g.title}
              </Box>
            ))}
            <Box sx={{ mt: 3, p: 2.5, borderRadius: 3, bgcolor: tokens.brandSoft }}>
              <Typography sx={{ fontWeight: 800, color: tokens.ink, fontSize: 15 }}>Still have a question?</Typography>
              <Box
                component="a"
                href={`mailto:${endPoints.salesEmail}`}
                sx={{ display: "inline-block", mt: 0.5, color: tokens.brand, fontWeight: 700, fontSize: 14, textDecoration: "none" }}
              >
                {endPoints.salesEmail}
              </Box>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={9}>
          <Stack spacing={6}>
            {FAQ_GROUPS.map((g) => (
              <Reveal key={g.id} id={g.id} component="section" sx={{ scrollMarginTop: 96 }}>
                <Typography component="h2" sx={{ fontWeight: 850, fontSize: { xs: 24, md: 28 }, color: tokens.ink, mb: 2.5 }}>
                  {g.title}
                </Typography>
                <FaqList items={g.items} />
              </Reveal>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Container>

    <CtaBand />
  </Layout>
);

export default Faq;
