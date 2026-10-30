import React from "react";
import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import { tokens } from "../theme";

/** The heading band at the top of every page except Home. */
const PageHero = ({ eyebrow, title, lead, children, maxWidth = 820 }) => (
  <Box
    sx={{
      background: `radial-gradient(900px circle at 10% -30%, ${tokens.brandSoftStrong}, transparent 55%), radial-gradient(700px circle at 100% 0%, #e0f2fe, transparent 50%)`,
      borderBottom: `1px solid ${tokens.border}`,
    }}
  >
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
      <Stack spacing={2.25} sx={{ maxWidth }}>
        {eyebrow && (
          <Chip
            label={eyebrow}
            size="small"
            sx={{
              alignSelf: "flex-start",
              bgcolor: "rgba(238, 242, 255,0.9)",
              border: "1px solid rgba(67, 56, 202,0.25)",
              color: tokens.brand,
            }}
          />
        )}
        <Typography component="h1" sx={{ fontWeight: 850, fontSize: { xs: 34, md: 52 }, lineHeight: 1.08, color: tokens.ink }}>
          {title}
        </Typography>
        {lead && (
          <Typography sx={{ fontSize: { xs: 17, md: 20 }, color: "text.secondary", lineHeight: 1.6 }}>{lead}</Typography>
        )}
        {children}
      </Stack>
    </Container>
  </Box>
);

export default PageHero;
