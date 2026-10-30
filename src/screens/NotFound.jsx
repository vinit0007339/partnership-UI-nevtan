import React from "react";
import Link from "next/link";
import { Button, Container, Stack, Typography } from "@mui/material";
import Layout from "../component/Layout";
import { tokens } from "../theme";

const NotFound = () => (
  <Layout title="Page not found" path="/404" description="This page doesn't exist on the NevTan Partner Program site.">
    <Container maxWidth="sm" sx={{ py: { xs: 10, md: 16 } }}>
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Typography sx={{ fontWeight: 850, fontSize: 72, lineHeight: 1, color: tokens.brand }}>404</Typography>
        <Typography component="h1" sx={{ fontWeight: 850, fontSize: 28, color: tokens.ink }}>
          We couldn&apos;t find that page
        </Typography>
        <Typography sx={{ color: tokens.muted }}>It may have moved. These are good places to start:</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 1 }}>
          <Button component={Link} href="/" variant="contained">
            Partner Program home
          </Button>
          <Button component={Link} href="/pricing" variant="outlined" sx={{ color: tokens.brand, borderColor: tokens.brand }}>
            See the plans
          </Button>
        </Stack>
      </Stack>
    </Container>
  </Layout>
);

export default NotFound;
