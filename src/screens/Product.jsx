import React from "react";
import Link from "next/link";
import { Box, Breadcrumbs, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import {
  ArrowForwardRounded as ArrowIcon,
  CheckCircleRounded as CheckIcon,
  OpenInNewRounded as OpenIcon,
  ShieldOutlined as ShieldIcon,
} from "@mui/icons-material";
import Layout from "../component/Layout";
import Reveal from "../component/Reveal";
import SectionHeading from "../component/SectionHeading";
import AppIcon from "../component/AppIcon";
import ProductWindow from "../component/ProductWindow";
import FaqList, { faqJsonLd } from "../component/FaqList";
import CtaBand from "../component/CtaBand";
import { APPS, appByCode } from "../constant/products";
import { productBySlug } from "../constant/productPages";
import { endPoints } from "../constant/Environment";
import { tokens } from "../theme";

const Product = ({ slug }) => {
  const product = productBySlug(slug);
  const { app } = product;
  const otherApps = APPS.filter((a) => a.code !== app.code);

  const partnerPoints = [
    app.free ? `Free for every client, on every NevTan Workspace plan` : `Included in every paid NevTan Workspace plan`,
    "Earn commission on what your clients pay, on terms agreed with you",
    "NevTan bills and supports your clients",
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Products", item: `${endPoints.siteUrl}/products` },
          { "@type": "ListItem", position: 2, name: app.title, item: `${endPoints.siteUrl}/products/${slug}` },
        ],
      },
      ...(product.faq?.length ? [faqJsonLd(product.faq)] : []),
    ],
  };

  return (
    <Layout title={`Refer ${app.title}`} path={`/products/${slug}`} description={product.metaDescription} jsonLd={jsonLd}>
      {/* Hero */}
      <Box
        sx={{
          background: `radial-gradient(900px circle at 0% -20%, ${app.soft}, transparent 55%), radial-gradient(700px circle at 100% 10%, ${tokens.brandSoft}, transparent 50%)`,
          borderBottom: `1px solid ${tokens.border}`,
        }}
      >
        <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 7, md: 10 } }}>
          <Breadcrumbs sx={{ mb: { xs: 3, md: 5 }, fontSize: 14 }}>
            <Box component={Link} href="/products" sx={{ color: tokens.muted, textDecoration: "none", "&:hover": { color: tokens.brand } }}>
              Products
            </Box>
            <Typography sx={{ color: tokens.ink, fontSize: 14, fontWeight: 600 }}>{app.title}</Typography>
          </Breadcrumbs>
          <Grid container spacing={{ xs: 5, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <AppIcon app={app} size={52} />
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: tokens.ink }}>{app.title}</Typography>
                    <Chip
                      size="small"
                      label={app.free ? "Free for every client" : "In every paid plan"}
                      sx={{ height: 20, fontSize: 11, bgcolor: app.free ? tokens.brandSoftStrong : app.soft, color: tokens.ink }}
                    />
                  </Box>
                </Stack>
                <Typography component="h1" sx={{ fontWeight: 850, fontSize: { xs: 34, md: 48 }, lineHeight: 1.08, color: tokens.ink }}>
                  {product.headline}
                </Typography>
                <Typography sx={{ fontSize: { xs: 17, md: 19 }, color: "text.secondary", lineHeight: 1.6 }}>{product.lead}</Typography>
                <Stack spacing={1}>
                  {product.highlights.map((h) => (
                    <Stack key={h} direction="row" spacing={1} alignItems="center">
                      <CheckIcon sx={{ fontSize: 20, color: app.color }} />
                      <Typography sx={{ fontWeight: 600, color: tokens.body }}>{h}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 1 }}>
                  <Button component={Link} href="/apply" variant="contained" size="large" endIcon={<ArrowIcon />} sx={{ px: 3.5, py: 1.3 }}>
                    Apply to refer {app.name}
                  </Button>
                  <Button component={Link} href="/pricing" variant="outlined" size="large" sx={{ px: 3, py: 1.3, color: tokens.brand, borderColor: tokens.brand }}>
                    See the plans
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <ProductWindow app={app} demo={product.demo} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Why refer */}
      <Container maxWidth="lg" sx={{ mt: { xs: -3.5, md: -4.5 } }}>
        <Reveal
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "#fff",
            border: `1px solid ${tokens.border}`,
            boxShadow: "0 24px 50px -36px rgba(15,23,42,0.45)",
          }}
        >
          {partnerPoints.map((p) => (
            <Stack key={p} direction="row" spacing={1.25} alignItems="center" sx={{ px: 3, py: 2.25, outline: `1px solid ${tokens.border}` }}>
              <CheckIcon sx={{ color: tokens.brand }} />
              <Typography sx={{ fontWeight: 700, color: tokens.ink, fontSize: 15 }}>{p}</Typography>
            </Stack>
          ))}
        </Reveal>
      </Container>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 } }}>
        <SectionHeading eyebrow="What your clients get" title={product.features.title} subtitle={product.features.lead} />
        <Grid container spacing={2.5}>
          {product.features.items.map((f, i) => (
            <Grid item xs={12} sm={6} md={4} key={f.title}>
              <Reveal delay={(i % 3) * 70} sx={{ height: "100%", p: 3, borderRadius: 4, border: `1px solid ${tokens.border}`, bgcolor: "#fff" }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: app.color, mb: 2, boxShadow: `0 0 0 6px ${app.soft}` }} />
                <Typography component="h3" sx={{ fontWeight: 800, color: tokens.ink, mb: 0.75 }}>
                  {f.title}
                </Typography>
                <Typography sx={{ color: tokens.muted, fontSize: 14.5, lineHeight: 1.65 }}>{f.text}</Typography>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Spotlights */}
      {product.spotlights.length > 0 && (
        <Box sx={{ bgcolor: tokens.tint, borderTop: `1px solid ${tokens.border}`, borderBottom: `1px solid ${tokens.border}` }}>
          <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 } }}>
            <Stack spacing={{ xs: 6, md: 9 }}>
              {product.spotlights.map((s, i) => (
                <Reveal key={s.id}>
                  <Grid container spacing={{ xs: 3, md: 8 }} alignItems="center" direction={i % 2 ? "row-reverse" : "row"}>
                    <Grid item xs={12} md={6}>
                      <Typography sx={{ color: app.color, fontWeight: 800, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
                        {s.eyebrow}
                      </Typography>
                      <Typography component="h2" sx={{ mt: 1, fontWeight: 850, fontSize: { xs: 26, md: 34 }, lineHeight: 1.2, color: tokens.ink }}>
                        {s.title}
                      </Typography>
                      <Typography sx={{ mt: 1.5, color: tokens.muted, fontSize: 17, lineHeight: 1.65 }}>{s.text}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack
                        spacing={1.5}
                        sx={{
                          p: { xs: 3, md: 4 },
                          borderRadius: 5,
                          bgcolor: "#fff",
                          border: `1px solid ${tokens.border}`,
                          boxShadow: "0 30px 60px -45px rgba(15,23,42,0.5)",
                          background: `linear-gradient(150deg, ${app.soft} 0%, #ffffff 55%)`,
                        }}
                      >
                        {s.points.map((p) => (
                          <Stack key={p} direction="row" spacing={1.5} alignItems="flex-start">
                            <CheckIcon sx={{ color: app.color, mt: "2px" }} />
                            <Typography sx={{ color: tokens.ink, fontWeight: 600, lineHeight: 1.5 }}>{p}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                </Reveal>
              ))}
            </Stack>
          </Container>
        </Box>
      )}

      {/* Works with */}
      {product.worksWith.length > 0 && (
        <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 11 } }}>
          <SectionHeading eyebrow="Better together" title="Works with the rest of the suite" />
          <Grid container spacing={2.5} justifyContent="center">
            {product.worksWith.map((w) => {
              const other = appByCode(w.code);
              return (
                <Grid item xs={12} md={6} key={w.code}>
                  <Reveal
                    component={Link}
                    href={`/products/${other.slug}`}
                    sx={{
                      height: "100%",
                      display: "flex",
                      gap: 2,
                      p: 3,
                      borderRadius: 4,
                      border: `1px solid ${tokens.border}`,
                      textDecoration: "none",
                      "&:hover": { borderColor: other.color },
                    }}
                  >
                    <AppIcon app={other} size={44} />
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: tokens.ink }}>{other.title}</Typography>
                      <Typography sx={{ color: tokens.muted, fontSize: 14.5, lineHeight: 1.6 }}>{w.text}</Typography>
                    </Box>
                  </Reveal>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      )}

      {/* Security */}
      {product.security && (
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 } }}>
          <Box
            sx={{
              borderRadius: 5,
              p: { xs: 3, md: 6 },
              background: `radial-gradient(700px circle at 0% 0%, rgba(129, 140, 248,0.25), transparent 55%), ${tokens.deep}`,
            }}
          >
            <SectionHeading dark eyebrow="Security" title={product.security.title} subtitle={product.security.lead} />
            <Grid container spacing={2}>
              {product.security.items.map((item, i) => (
                <Grid item xs={12} sm={6} md={4} key={item.title}>
                  <Reveal delay={(i % 3) * 70} sx={{ height: "100%", p: 2.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <ShieldIcon sx={{ color: "#a5b4fc", mb: 1 }} />
                    <Typography component="h3" sx={{ fontWeight: 800, color: "#fff", mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6 }}>{item.text}</Typography>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      )}

      {/* FAQ */}
      {product.faq?.length > 0 && (
        <Container maxWidth="md" sx={{ pt: product.security ? 0 : { xs: 8, md: 11 }, pb: { xs: 4, md: 6 } }}>
          <SectionHeading title={`${app.title} questions`} />
          <Reveal>
            <FaqList items={product.faq} />
          </Reveal>
          {product.docsUrl && (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button href={product.docsUrl} target="_blank" rel="noopener noreferrer" endIcon={<OpenIcon />} sx={{ color: tokens.brand }}>
                {product.docsLabel || `Read the ${app.title} docs`}
              </Button>
            </Box>
          )}
        </Container>
      )}

      {/* More products */}
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 } }}>
        <Typography sx={{ textAlign: "center", fontWeight: 800, color: tokens.ink, mb: 2.5 }}>More you can refer</Typography>
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.5} justifyContent="center">
          {otherApps.map((a) => (
            <Stack
              key={a.code}
              component={Link}
              href={`/products/${a.slug}`}
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ pl: 1, pr: 2, py: 0.75, borderRadius: 10, border: `1px solid ${tokens.border}`, textDecoration: "none", "&:hover": { borderColor: a.color } }}
            >
              <AppIcon app={a} size={28} />
              <Typography sx={{ fontWeight: 700, color: tokens.ink, fontSize: 14 }}>{a.title}</Typography>
            </Stack>
          ))}
        </Stack>
      </Container>

      <CtaBand title={`Earn on every ${app.title} client you refer`} />
    </Layout>
  );
};

export default Product;
