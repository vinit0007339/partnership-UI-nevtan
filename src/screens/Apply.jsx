import React from "react";
import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import {
  CheckCircleRounded as CheckIcon,
  MailOutlineRounded as MailIcon,
} from "@mui/icons-material";
import Layout from "../component/Layout";
import ApplicationForm from "../component/ApplicationForm";
import { endPoints } from "../constant/Environment";
import { REVIEW_TIME, STEPS, TERMS_AGREED } from "../constant/program";
import { tokens } from "../theme";

const DESCRIPTION = `Apply to the NevTan Partner Program in about two minutes. Earn commission on what your clients pay for NevTan Workspace, and get a reply within ${REVIEW_TIME}.`;

const TERMS = [
  "Commission on what your clients pay",
  TERMS_AGREED,
  "NevTan bills and supports your clients",
];

const Apply = () => (
  <Layout title="Apply" path="/apply" description={DESCRIPTION}>
    <Box
      sx={{
        background: `radial-gradient(900px circle at 0% -10%, ${tokens.brandSoftStrong}, transparent 50%), radial-gradient(700px circle at 100% 0%, #e0f2fe, transparent 45%), ${tokens.tint}`,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 9 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid item xs={12} md={5}>
            <Stack spacing={3} sx={{ position: { md: "sticky" }, top: { md: 100 } }}>
              <Typography component="h1" sx={{ fontWeight: 850, fontSize: { xs: 34, md: 46 }, lineHeight: 1.08, color: tokens.ink }}>
                Become a NevTan partner
              </Typography>
              <Typography sx={{ fontSize: { xs: 17, md: 19 }, color: "text.secondary", lineHeight: 1.6 }}>
                Tell us about your business. It takes about two minutes, and our team replies within {REVIEW_TIME}.
              </Typography>

              <Stack spacing={1.25}>
                {TERMS.map((t) => (
                  <Stack key={t} direction="row" spacing={1.25} alignItems="center">
                    <CheckIcon sx={{ color: tokens.brand }} />
                    <Typography sx={{ fontWeight: 600, color: tokens.ink }}>{t}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Box sx={{ p: 3, borderRadius: 4, bgcolor: "#fff", border: `1px solid ${tokens.border}` }}>
                <Typography sx={{ fontWeight: 800, color: tokens.ink, mb: 2 }}>What happens next</Typography>
                <Stack spacing={2}>
                  {STEPS.slice(1, 4).map((s, i) => (
                    <Stack key={s.title} direction="row" spacing={1.5}>
                      <Box
                        sx={{
                          flexShrink: 0,
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 13,
                          fontWeight: 800,
                          color: tokens.brand,
                          bgcolor: tokens.brandSoft,
                        }}
                      >
                        {i + 1}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: tokens.ink, fontSize: 15 }}>{s.title}</Typography>
                        <Typography sx={{ color: tokens.muted, fontSize: 14, lineHeight: 1.55 }}>{s.copy}</Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: tokens.muted }}>
                <MailIcon sx={{ fontSize: 20 }} />
                <Typography sx={{ fontSize: 14 }}>
                  Questions first? Email{" "}
                  <Box component="a" href={`mailto:${endPoints.salesEmail}`} sx={{ color: tokens.brand, fontWeight: 700, textDecoration: "none" }}>
                    {endPoints.salesEmail}
                  </Box>
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 5,
                border: `1px solid ${tokens.border}`,
                boxShadow: "0 40px 80px -50px rgba(15,23,42,0.45)",
              }}
            >
              <ApplicationForm />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </Layout>
);

export default Apply;
