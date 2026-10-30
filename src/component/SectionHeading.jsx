import React from "react";
import { Stack, Typography } from "@mui/material";
import Reveal from "./Reveal";
import { tokens } from "../theme";

const SectionHeading = ({ eyebrow, title, subtitle, align = "center", dark = false, id }) => (
  <Reveal sx={{ mb: { xs: 4, md: 6 } }}>
    <Stack spacing={1.25} sx={{ textAlign: align, alignItems: align === "center" ? "center" : "flex-start" }}>
      {eyebrow && (
        <Typography
          sx={{
            color: dark ? "#a5b4fc" : tokens.brand,
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography
        id={id}
        component="h2"
        sx={{
          fontWeight: 800,
          fontSize: { xs: 28, md: 40 },
          lineHeight: 1.15,
          color: dark ? "#fff" : tokens.ink,
          maxWidth: 780,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            color: dark ? "rgba(255,255,255,0.72)" : "text.secondary",
            fontSize: { xs: 16, md: 18 },
            lineHeight: 1.6,
            maxWidth: 680,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Stack>
  </Reveal>
);

export default SectionHeading;
