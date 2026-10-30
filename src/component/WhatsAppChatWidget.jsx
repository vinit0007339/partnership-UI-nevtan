import React, { useEffect, useRef, useState } from "react";
import { Box, Button, ButtonBase, Grow, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { Close as CloseIcon, WhatsApp as WhatsAppIcon } from "@mui/icons-material";
import { whatsAppLink } from "../constant/support";

const WHATSAPP_GREEN = "#25D366";
const HEADER_BG = "#4338ca";
const SEEN_KEY = "nevtan-whatsapp-widget-seen";
const HOVER_CLOSE_MS = 350;

const readSeen = () => {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

const markSeen = () => {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    return;
  }
};

const TypingDots = () => (
  <Stack
    direction="row"
    spacing={0.5}
    sx={{
      "@keyframes waTyping": {
        "0%, 60%, 100%": { transform: "translateY(0)", opacity: 0.45 },
        "30%": { transform: "translateY(-4px)", opacity: 1 },
      },
    }}
  >
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          bgcolor: "#94a3b8",
          animation: "waTyping 1.2s ease-in-out infinite",
          animationDelay: `${i * 0.15}s`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      />
    ))}
  </Stack>
);

const Bubble = ({ children }) => (
  <Box
    sx={{
      position: "relative",
      alignSelf: "flex-start",
      maxWidth: "85%",
      bgcolor: "#ffffff",
      borderRadius: "0 12px 12px 12px",
      px: 1.75,
      py: 1.25,
      ml: 1,
      boxShadow: "0 1px 1.5px rgba(15, 23, 42, 0.13)",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: -8,
        width: 0,
        height: 0,
        borderTop: "10px solid #ffffff",
        borderLeft: "8px solid transparent",
      },
    }}
  >
    {children}
  </Box>
);

// Copied from NevTan Mail (CylonMailUi/src/component/WhatsAppChatWidget.jsx); only the defaults,
// the avatar and the mobile offsets (Mail clears a bottom bar this site doesn't have) differ.
const WhatsAppChatWidget = ({
  name = "NevTan Partner Team",
  replyTime = "Typically replies within a day",
  greeting = "Hi there 👋",
  prompt = "Questions about partnering with NevTan?",
  message = "Hi, I have a question about the NevTan Partner Program.",
  fabSize = 56,
  fabSx,
  cardSx,
  hidden = false,
}) => {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [sentAt, setSentAt] = useState("");
  const greeted = useRef(false);
  const pinned = useRef(false);
  const closeTimer = useRef(null);

  const cancelClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const close = () => {
    cancelClose();
    pinned.current = false;
    setOpen(false);
  };

  const openChat = () => {
    cancelClose();
    if (!open) setSentAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setShowDot(false);
    markSeen();
    setOpen(true);
  };

  const onPointerEnter = (e) => {
    if (e.pointerType !== "mouse") return;
    openChat();
  };

  const onPointerLeave = (e) => {
    if (e.pointerType !== "mouse" || pinned.current) return;
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_MS);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    setShowDot(!readSeen());
  }, []);

  useEffect(() => {
    if (hidden) close();
  }, [hidden]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open || greeted.current) return undefined;
    greeted.current = true;
    setTyping(true);
    const timer = setTimeout(() => setTyping(false), 900);
    return () => clearTimeout(timer);
  }, [open]);

  const onFabClick = () => {
    if (open && pinned.current) {
      close();
      return;
    }
    pinned.current = true;
    openChat();
  };

  if (hidden) return null;

  return (
    <>
      <Grow in={open} style={{ transformOrigin: "bottom right" }} unmountOnExit>
        <Paper
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          role="dialog"
          aria-label={`Chat with ${name} on WhatsApp`}
          elevation={0}
          sx={{
            position: "fixed",
            right: { xs: 16, md: 32 },
            bottom: { xs: 88, sm: 96, md: 104 },
            zIndex: 1060,
            width: { xs: "calc(100vw - 32px)", sm: 360 },
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 18px 48px rgba(15, 23, 42, 0.24), 0 2px 6px rgba(15, 23, 42, 0.08)",
            "@media print": { display: "none" },
            ...cardSx,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.75}
            sx={{ bgcolor: HEADER_BG, color: "#fff", px: 2.25, py: 2, pr: 6, position: "relative" }}
          >
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  bgcolor: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Box component="img" src="/favicon.png" alt="" sx={{ width: 34, height: 34 }} />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  right: 1,
                  bottom: 1,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "#4ade80",
                  border: `2px solid ${HEADER_BG}`,
                }}
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 17, lineHeight: 1.3 }}>{name}</Typography>
              <Typography sx={{ fontSize: 13, color: "rgba(255, 255, 255, 0.82)" }}>{replyTime}</Typography>
            </Box>
            <IconButton
              aria-label="Close chat"
              onClick={close}
              size="small"
              sx={{ position: "absolute", top: 8, right: 8, color: "rgba(255, 255, 255, 0.85)" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack
            spacing={2.5}
            sx={{
              px: 2,
              pt: 2.5,
              pb: 2.75,
              minHeight: 190,
              bgcolor: "#efeae2",
              backgroundImage: "radial-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          >
            <Bubble>
              {typing ? (
                <Box sx={{ py: 0.75, px: 0.25 }}>
                  <TypingDots />
                </Box>
              ) : (
                <>
                  <Typography sx={{ fontSize: 15, color: "#111b21", mb: 0.5 }}>{greeting}</Typography>
                  <Stack direction="row" alignItems="flex-end" spacing={1.5}>
                    <Typography sx={{ fontSize: 15, color: "#111b21" }}>{prompt}</Typography>
                    <Typography sx={{ fontSize: 11, color: "#667781", flexShrink: 0 }}>{sentAt}</Typography>
                  </Stack>
                </>
              )}
            </Bubble>

            <Button
              component="a"
              href={whatsAppLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              disableElevation
              startIcon={<WhatsAppIcon sx={{ fontSize: "24px !important" }} />}
              onClick={close}
              sx={{
                alignSelf: "center",
                borderRadius: 999,
                px: 3.5,
                py: 1.25,
                mt: "auto !important",
                fontSize: 16,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: WHATSAPP_GREEN,
                color: "#fff",
                boxShadow: "0 6px 16px rgba(37, 211, 102, 0.35)",
                "&:hover": { bgcolor: "#1ebe5b", boxShadow: "0 8px 20px rgba(37, 211, 102, 0.45)" },
              }}
            >
              Chat on WhatsApp
            </Button>
          </Stack>
        </Paper>
      </Grow>

      <Tooltip title={open ? "" : "Chat with us on WhatsApp"} placement="left">
        <ButtonBase
          onClick={onFabClick}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
          aria-expanded={open}
          aria-haspopup="dialog"
          sx={{
            position: "fixed",
            right: { xs: 16, md: 32 },
            bottom: { xs: 16, sm: 24, md: 32 },
            zIndex: 1050,
            width: fabSize,
            height: fabSize,
            borderRadius: "50%",
            bgcolor: "#ffffff",
            color: WHATSAPP_GREEN,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.18), 0 1px 3px rgba(15, 23, 42, 0.1)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 12px 28px rgba(15, 23, 42, 0.22), 0 1px 3px rgba(15, 23, 42, 0.1)",
            },
            "@media print": { display: "none" },
            ...fabSx,
          }}
        >
          <WhatsAppIcon sx={{ fontSize: Math.round(fabSize * 0.57) }} />
          {showDot && (
            <Box
              sx={{
                position: "absolute",
                top: 3,
                right: 3,
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#ef4444",
                border: "2px solid #ffffff",
              }}
            />
          )}
        </ButtonBase>
      </Tooltip>
    </>
  );
};

export default WhatsAppChatWidget;
