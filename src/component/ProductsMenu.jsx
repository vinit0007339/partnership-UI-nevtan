import React, { useState } from "react";
import Link from "next/link";
import { Box, Button, Chip, Divider, Menu, Stack, Typography } from "@mui/material";
import {
  ArrowForwardRounded as ArrowIcon,
  KeyboardArrowDownRounded as ArrowDownIcon,
} from "@mui/icons-material";
import AppIcon from "./AppIcon";
import { APPS } from "../constant/products";
import { tokens } from "../theme";

/** "Products" dropdown: every NevTan app, each linking to its page on this site. */
const ProductsMenu = ({ active }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const close = () => setAnchorEl(null);

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        endIcon={<ArrowDownIcon sx={{ transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "none" }} />}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          color: active ? tokens.brand : tokens.body,
          fontWeight: active ? 800 : 600,
          px: 1.5,
          "&:hover": { color: tokens.brand, bgcolor: tokens.brandSoft },
        }}
      >
        Products
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1,
              width: 560,
              maxWidth: "calc(100vw - 24px)",
              borderRadius: 3,
              border: `1px solid ${tokens.border}`,
              boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
              p: 1.5,
            },
          },
        }}
        MenuListProps={{ sx: { p: 0 } }}
      >
        <Typography sx={{ px: 1.5, pt: 0.5, pb: 1, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: tokens.brand }}>
          Everything you can refer
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 0.5 }}>
          {APPS.map((app) => (
            <Box
              key={app.code}
              component={Link}
              href={`/products/${app.slug}`}
              onClick={close}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                textDecoration: "none",
                transition: "background-color 0.15s ease",
                "&:hover": { bgcolor: tokens.tint },
              }}
            >
              <AppIcon app={app} size={38} />
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <Typography sx={{ fontSize: 14, fontWeight: 800, color: tokens.ink }}>{app.title}</Typography>
                  {app.free && (
                    <Chip label="Free" size="small" sx={{ height: 18, fontSize: 10, bgcolor: tokens.brandSoftStrong, color: tokens.brandDark }} />
                  )}
                </Stack>
                <Typography sx={{ fontSize: 12, color: tokens.muted, lineHeight: 1.4 }}>{app.description}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Divider sx={{ my: 1 }} />
        <Stack direction="row" justifyContent="space-between" sx={{ px: 1.5, py: 0.5 }}>
          {[
            { label: "All products", href: "/products" },
            { label: "Plans", href: "/pricing" },
          ].map((link) => (
            <Box
              key={link.href}
              component={Link}
              href={link.href}
              onClick={close}
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: tokens.brand, fontWeight: 700, fontSize: 13, textDecoration: "none" }}
            >
              {link.label}
              <ArrowIcon sx={{ fontSize: 16 }} />
            </Box>
          ))}
        </Stack>
      </Menu>
    </>
  );
};

export default ProductsMenu;
