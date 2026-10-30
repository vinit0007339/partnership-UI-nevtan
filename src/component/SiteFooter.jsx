import React from "react";
import Link from "next/link";
import { Box, Container, Stack, Typography } from "@mui/material";
import { MailOutlineRounded as MailIcon, OpenInNewRounded as OpenIcon } from "@mui/icons-material";
import { APPS } from "../constant/products";
import { endPoints } from "../constant/Environment";
import { tokens } from "../theme";

// Pages on this site use `href`; other NevTan sites set `external`.
const footerColumns = [
  {
    heading: "Partner program",
    links: [
      { label: "Overview", href: "/" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Plans", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
      { label: "Apply now", href: "/apply" },
      { label: "Partner sign in", href: "/login" },
    ],
  },
  {
    heading: "Products",
    links: [{ label: "All products", href: "/products" }, ...APPS.map((app) => ({ label: app.title, href: `/products/${app.slug}` }))],
  },
  {
    heading: "NevTan",
    links: [
      { label: "NevTan Workspace", href: endPoints.workspaceUrl, external: true },
      { label: "Contact us", href: endPoints.contactUrl, external: true },
      { label: "Security", href: `${endPoints.mailSiteUrl}/security`, external: true },
      { label: "Support", href: `${endPoints.mailSiteUrl}/support`, external: true },
    ],
  },
];

const legalLinks = [
  { label: "Privacy Policy", href: `${endPoints.mailSiteUrl}/privacy-policy` },
  { label: "Terms of Service", href: `${endPoints.mailSiteUrl}/terms` },
];

const linkSx = {
  color: "rgba(255,255,255,0.72)",
  textDecoration: "none",
  fontSize: 14,
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  transition: "color 0.15s ease",
  "&:hover": { color: "#fff" },
};

const SiteFooter = () => (
  <Box component="footer" sx={{ bgcolor: tokens.deep, color: "#fff" }}>
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 5, md: 8 } }}>
        <Box sx={{ flex: { md: "0 0 300px" } }}>
          <Box
            component="img"
            src="/nevtan-logo-white.png"
            alt="NevTan"
            width={211}
            height={70}
            sx={{ width: 132, height: "auto", display: "block", mb: 2 }}
          />
          <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.7, mb: 2.5 }}>
            Recommend the whole NevTan suite — email, storage, e-signatures, marketing, cloud and AI — to your
            clients, and earn commission on what they pay.
          </Typography>
          <Box component="a" href={`mailto:${endPoints.salesEmail}`} sx={{ ...linkSx, color: "#a5b4fc", fontWeight: 600 }}>
            <MailIcon sx={{ fontSize: 18 }} />
            {endPoints.salesEmail}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
            columnGap: 4,
            rowGap: 4,
          }}
        >
          {footerColumns.map((col) => (
            <Box key={col.heading}>
              <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: "#818cf8", mb: 2 }}>
                {col.heading}
              </Typography>
              <Stack spacing={1.25}>
                {col.links.map((l) =>
                  l.external ? (
                    <Box key={l.label} component="a" href={l.href} target="_blank" rel="noopener noreferrer" sx={linkSx}>
                      {l.label}
                      <OpenIcon sx={{ fontSize: 13, opacity: 0.6 }} />
                    </Box>
                  ) : (
                    <Box key={l.label} component={Link} href={l.href} sx={linkSx}>
                      {l.label}
                    </Box>
                  )
                )}
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>

    <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
      <Container maxWidth="lg" sx={{ py: 2.5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
            © {new Date().getFullYear()} NevTan, Inc. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={{ xs: 2, sm: 3 }} flexWrap="wrap" rowGap={1}>
            {legalLinks.map((l) => (
              <Box
                key={l.href}
                component="a"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13, "&:hover": { color: "#fff" } }}
              >
                {l.label}
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  </Box>
);

export default SiteFooter;
