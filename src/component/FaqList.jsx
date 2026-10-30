import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from "@mui/material";
import { ExpandMoreRounded as ExpandIcon } from "@mui/icons-material";
import { tokens } from "../theme";

/** Questions as accordions. Answers stay in the HTML while collapsed, so search engines read them. */
const FaqList = ({ items }) => (
  <Stack spacing={1.5}>
    {items.map((item) => (
      <Accordion
        key={item.q}
        disableGutters
        elevation={0}
        sx={{
          border: `1px solid ${tokens.border}`,
          borderRadius: "12px !important",
          bgcolor: "background.paper",
          "&:before": { display: "none" },
          "&.Mui-expanded": { borderColor: "rgba(67, 56, 202,0.35)", boxShadow: "0 12px 30px -18px rgba(15,23,42,0.25)" },
        }}
      >
        <AccordionSummary expandIcon={<ExpandIcon />} sx={{ px: 2.5, "& .MuiAccordionSummary-content": { my: 2 } }}>
          <Typography component="h3" sx={{ fontWeight: 700, color: tokens.ink, fontSize: 16 }}>
            {item.q}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2.5 }}>
          <Typography sx={{ color: "#475569", lineHeight: 1.75 }}>{item.a}</Typography>
        </AccordionDetails>
      </Accordion>
    ))}
  </Stack>
);

export const faqJsonLd = (items) => ({
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export default FaqList;
