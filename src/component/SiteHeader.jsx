import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { CloseRounded as CloseIcon, LogoutRounded as SignOutIcon, MenuRounded as MenuIcon } from "@mui/icons-material";
import ProductsMenu from "./ProductsMenu";
import AppIcon from "./AppIcon";
import { APPS } from "../constant/products";
import { homeOf, useAuth } from "../Utility/auth";
import { signOutEverywhere } from "../Utility/sso";
import { tokens } from "../theme";

const NAV_LINKS = [
  { label: "Plans", href: "/pricing" },
  { label: "How it works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
];

const MOBILE_LINKS = [{ label: "Home", href: "/" }, { label: "All products", href: "/products" }, ...NAV_LINKS];

const isActive = (pathname, href) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

const SiteHeader = () => {
  const router = useRouter();
  const { pathname, asPath } = router;
  const { signedIn, user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);
  const homeHref = homeOf(user);
  const homeLabel = homeHref === "/admin" ? "Admin" : "Dashboard";

  const signOut = async () => {
    setSigningOut(true);
    closeDrawer();
    await signOutEverywhere();
    setSigningOut(false);
    router.push("/");
  };

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        borderBottom: `1px solid ${tokens.border}`,
        bgcolor: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Box
        sx={{
          maxWidth: 1240,
          mx: "auto",
          px: { xs: 2, md: 4 },
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          component={Link}
          href="/"
          aria-label="NevTan Partner Program home"
          sx={{ textDecoration: "none" }}
        >
          <Box
            component="img"
            src="/nevtan-logo.png"
            alt="NevTan"
            width={1137}
            height={419}
            sx={{ width: { xs: 92, sm: 104 }, height: "auto", display: "block" }}
          />
          <Box sx={{ display: { xs: "none", sm: "block" }, height: 22, width: "1px", bgcolor: tokens.border }} />
          <Typography sx={{ display: { xs: "none", sm: "block" }, fontWeight: 700, fontSize: 14, color: tokens.brand }}>
            Partner Program
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Stack direction="row" alignItems="center" spacing={0.25} sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <ProductsMenu active={isActive(pathname, "/products")} />
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  sx={{
                    color: active ? tokens.brand : tokens.body,
                    fontWeight: active ? 800 : 600,
                    px: 1.5,
                    "&:hover": { color: tokens.brand, bgcolor: tokens.brandSoft },
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Stack>
          {signedIn ? (
            <>
              <Button component={Link} href={homeHref} variant="contained" sx={{ px: { xs: 1.75, sm: 2.5 }, whiteSpace: "nowrap" }}>
                {homeLabel}
              </Button>
              <Tooltip title="Sign out">
                <span>
                  <IconButton
                    onClick={signOut}
                    disabled={signingOut}
                    aria-label="Sign out"
                    sx={{ display: { xs: "none", sm: "inline-flex" }, color: tokens.body }}
                  >
                    <SignOutIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          ) : (
            <>
              <Button
                component={Link}
                href="/login"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  color: tokens.brand,
                  fontWeight: 700,
                  px: 1.75,
                  whiteSpace: "nowrap",
                  "&:hover": { bgcolor: tokens.brandSoft },
                }}
              >
                Partner sign in
              </Button>
              <Button component={Link} href="/apply" variant="contained" sx={{ px: { xs: 1.75, sm: 2.5 }, whiteSpace: "nowrap" }}>
                Apply now
              </Button>
            </>
          )}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            sx={{ display: { xs: "inline-flex", md: "none" }, color: tokens.body }}
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      </Box>

      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer} PaperProps={{ sx: { width: 320, maxWidth: "88vw" } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, height: 68 }}>
          <Typography sx={{ fontWeight: 800, color: tokens.brand }}>Partner Program</Typography>
          <IconButton onClick={closeDrawer} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        <List sx={{ px: 1 }}>
          {MOBILE_LINKS.map((link) => (
            <ListItemButton
              key={link.href}
              component={Link}
              href={link.href}
              onClick={closeDrawer}
              selected={link.href === "/products" ? pathname === "/products" : isActive(pathname, link.href)}
              sx={{ borderRadius: 2 }}
            >
              <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <Typography sx={{ px: 3, pt: 2, pb: 1, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: tokens.muted }}>
          Products
        </Typography>
        <List sx={{ px: 1 }}>
          {APPS.map((app) => (
            <ListItemButton
              key={app.code}
              component={Link}
              href={`/products/${app.slug}`}
              onClick={closeDrawer}
              selected={asPath === `/products/${app.slug}`}
              sx={{ borderRadius: 2, gap: 1.5 }}
            >
              <AppIcon app={app} size={30} />
              <ListItemText primary={app.title} primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }} />
            </ListItemButton>
          ))}
        </List>
        <Stack spacing={1} sx={{ p: 2, mt: "auto" }}>
          {signedIn ? (
            <>
              <Button component={Link} href={homeHref} onClick={closeDrawer} variant="contained" fullWidth size="large">
                {homeLabel}
              </Button>
              <Button onClick={signOut} disabled={signingOut} startIcon={<SignOutIcon />} fullWidth size="large" sx={{ color: tokens.body }}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} href="/apply" onClick={closeDrawer} variant="contained" fullWidth size="large">
                Apply now
              </Button>
              <Button component={Link} href="/login" onClick={closeDrawer} fullWidth size="large" sx={{ color: tokens.brand }}>
                Partner sign in
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </Box>
  );
};

export default SiteHeader;
