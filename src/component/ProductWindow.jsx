import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { CheckCircleRounded as CheckIcon } from "@mui/icons-material";
import AppIcon from "./AppIcon";
import { tokens } from "../theme";

const TONES = {
  success: { bg: "#dcfce7", fg: "#166534" },
  warning: { bg: "#fef3c7", fg: "#92400e" },
  primary: { bg: "#e0e7ff", fg: "#3730a3" },
  default: { bg: "#f1f5f9", fg: "#475569" },
};

/**
 * A browser-window mock of a NevTan app, drawn from the product's `demo` content — the same rows
 * each product's own site shows. Decorative: hidden from screen readers.
 */
const ProductWindow = ({ app, demo }) => (
  <Box
    aria-hidden="true"
    sx={{
      position: "relative",
      borderRadius: 4,
      bgcolor: "#fff",
      border: `1px solid ${tokens.border}`,
      boxShadow: "0 40px 80px -40px rgba(15,23,42,0.45), 0 0 0 8px rgba(255,255,255,0.6)",
      overflow: "hidden",
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2, py: 1.25, borderBottom: `1px solid ${tokens.border}`, bgcolor: tokens.tint }}>
      {["#f87171", "#fbbf24", "#34d399"].map((c) => (
        <Box key={c} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c }} />
      ))}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1.5 }}>
        <AppIcon app={app} size={22} />
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: tokens.ink }}>
          {app.title} · {demo.title}
        </Typography>
      </Stack>
    </Stack>

    <Box sx={{ display: "flex", minHeight: 260 }}>
      <Box sx={{ display: { xs: "none", sm: "block" }, width: 150, flexShrink: 0, borderRight: `1px solid ${tokens.border}`, p: 1.25 }}>
        {demo.sidebar.map((item, i) => (
          <Typography
            key={item}
            sx={{
              fontSize: 13,
              px: 1.25,
              py: 0.75,
              mb: 0.25,
              borderRadius: 1.5,
              fontWeight: i === 0 ? 700 : 500,
              color: i === 0 ? app.color : tokens.muted,
              bgcolor: i === 0 ? app.soft : "transparent",
            }}
          >
            {item}
          </Typography>
        ))}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {demo.rows.map((row) => {
          const tone = TONES[row.tone] || TONES.default;
          return (
            <Stack
              key={row.a}
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${tokens.border}` }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 700, color: tokens.ink }}>
                  {row.a}
                </Typography>
                <Typography noWrap sx={{ fontSize: 12, color: tokens.muted }}>
                  {row.b}
                </Typography>
              </Box>
              {row.tag && (
                <Box sx={{ flexShrink: 0, fontSize: 11, fontWeight: 700, px: 1, py: 0.25, borderRadius: 10, bgcolor: tone.bg, color: tone.fg }}>
                  {row.tag}
                </Box>
              )}
            </Stack>
          );
        })}
      </Box>
    </Box>

    {demo.toast && (
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          position: "absolute",
          right: 16,
          bottom: 16,
          maxWidth: "calc(100% - 32px)",
          px: 1.75,
          py: 1,
          borderRadius: 2,
          bgcolor: tokens.ink,
          color: "#fff",
          boxShadow: "0 12px 24px rgba(15,23,42,0.3)",
        }}
      >
        <CheckIcon sx={{ fontSize: 18, color: "#a5b4fc" }} />
        <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>{demo.toast}</Typography>
      </Stack>
    )}
  </Box>
);

export default ProductWindow;
