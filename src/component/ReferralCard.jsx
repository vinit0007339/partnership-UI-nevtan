import React from "react";
import Link from "next/link";
import { Box, Chip, Stack, Typography } from "@mui/material";
import {
  ArrowForwardRounded as ArrowIcon,
  LinkRounded as LinkIcon,
  PaymentsOutlined as EarnIcon,
  ShoppingCartOutlined as SubscribeIcon,
} from "@mui/icons-material";
import AppIcon from "./AppIcon";
import { PAID_APPS } from "../constant/products";
import { tokens } from "../theme";

const FLOW = [
  { Icon: LinkIcon, title: "You share your link", copy: "Send your personal referral link to a client." },
  { Icon: SubscribeIcon, title: "Your client subscribes", copy: "They pick a NevTan Workspace plan. NevTan bills and supports them." },
  { Icon: EarnIcon, title: "You earn commission", copy: "On what they pay, at the rate agreed with you when you're approved." },
];

/** Home hero card: how one referral turns into commission. It states no rate: terms are agreed per partner. */
const ReferralCard = () => (
  <Box sx={{ position: "relative", maxWidth: 460, mx: "auto", width: "100%" }}>
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        p: { xs: 3, sm: 3.5 },
        borderRadius: 5,
        bgcolor: "#fff",
        border: `1px solid ${tokens.border}`,
        boxShadow: "0 50px 90px -40px rgba(15,23,42,0.45), 0 0 0 10px rgba(255,255,255,0.55)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Chip label="How a referral works" size="small" sx={{ bgcolor: tokens.brandSoft, color: tokens.brandDark }} />
        <Stack direction="row" spacing={0.5}>
          {PAID_APPS.map((app) => (
            <AppIcon key={app.code} app={app} size={24} />
          ))}
        </Stack>
      </Stack>
      <Stack spacing={2.25}>
        {FLOW.map(({ Icon, title, copy }) => (
          <Stack key={title} direction="row" spacing={1.75} alignItems="flex-start">
            <Box sx={{ flexShrink: 0, width: 42, height: 42, borderRadius: 2.5, bgcolor: tokens.brand, color: "#fff", display: "grid", placeItems: "center" }}>
              <Icon />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: tokens.ink }}>{title}</Typography>
              <Typography sx={{ color: tokens.muted, fontSize: 14, lineHeight: 1.5 }}>{copy}</Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
      <Box
        component={Link}
        href="/how-it-works"
        sx={{ mt: 3, display: "inline-flex", alignItems: "center", gap: 0.5, color: tokens.brand, fontWeight: 700, fontSize: 14, textDecoration: "none" }}
      >
        See the full process
        <ArrowIcon sx={{ fontSize: 18 }} />
      </Box>
    </Box>
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        inset: "-12% -10% auto auto",
        width: 220,
        height: 220,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(129, 140, 248,0.45), transparent 70%)",
        filter: "blur(10px)",
      }}
    />
  </Box>
);

export default ReferralCard;
