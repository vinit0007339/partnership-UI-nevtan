import React from "react";
import Link from "next/link";
import { Box, Button, Stack, Typography } from "@mui/material";
import { ArrowForwardRounded as ArrowIcon } from "@mui/icons-material";
import Reveal from "./Reveal";
import { endPoints } from "../constant/Environment";
import { REVIEW_TIME } from "../constant/program";
import { tokens } from "../theme";

/** The closing call to action at the bottom of every page. */
const CtaBand = ({
  title = "Ready to grow with NevTan?",
  subtitle = `Apply in about two minutes. Our team replies within ${REVIEW_TIME}.`,
}) => (
  <Box component="section" sx={{ px: 2, py: { xs: 6, md: 9 } }}>
    <Reveal
      sx={{
        maxWidth: 1140,
        mx: "auto",
        borderRadius: 5,
        px: { xs: 3, md: 8 },
        py: { xs: 5, md: 8 },
        textAlign: "center",
        color: "#fff",
        background: `radial-gradient(700px circle at 0% 0%, rgba(129, 140, 248,0.35), transparent 55%), radial-gradient(600px circle at 100% 100%, rgba(99, 102, 241,0.25), transparent 55%), linear-gradient(135deg, ${tokens.deep} 0%, #3730a3 100%)`,
        boxShadow: "0 30px 60px -30px rgba(30, 27, 75,0.6)",
      }}
    >
      <Typography component="h2" sx={{ fontWeight: 850, fontSize: { xs: 28, md: 42 }, lineHeight: 1.15 }}>
        {title}
      </Typography>
      <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.8)", fontSize: { xs: 16, md: 19 } }}>{subtitle}</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center" sx={{ mt: 4 }}>
        <Button
          component={Link}
          href="/apply"
          size="large"
          endIcon={<ArrowIcon />}
          sx={{
            bgcolor: "#fff",
            color: tokens.brand,
            px: 4,
            py: 1.4,
            fontSize: "1.05rem",
            fontWeight: 800,
            "&:hover": { bgcolor: tokens.brandSoft },
          }}
        >
          Apply now
        </Button>
        <Button
          href={`mailto:${endPoints.salesEmail}`}
          size="large"
          variant="outlined"
          sx={{
            color: "#fff",
            borderColor: "rgba(255,255,255,0.5)",
            px: 4,
            py: 1.4,
            fontSize: "1.05rem",
            "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
          }}
        >
          Talk to our team
        </Button>
      </Stack>
    </Reveal>
  </Box>
);

export default CtaBand;
