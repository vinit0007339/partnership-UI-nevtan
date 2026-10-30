import { createTheme } from "@mui/material/styles";

// Brand colours used directly in sx props across the site.
export const tokens = {
  brand: "#4338ca",
  brandBright: "#6366f1",
  brandDark: "#3730a3",
  brandSoft: "#eef2ff",
  brandSoftStrong: "#e0e7ff",
  ink: "#0f172a",
  body: "#334155",
  muted: "#64748b",
  border: "#e2e8f0",
  tint: "#f8fafc",
  deep: "#1e1b4b",
};

// Same type scale as the other NevTan sites, with an indigo brand so the partner site reads as its own program.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4338ca",
      light: "#818cf8",
      dark: "#3730a3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2563eb",
      light: "#60a5fa",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
    error: {
      main: "#dc2626",
      light: "#fee2e2",
      dark: "#991b1b",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
      disabled: "#94a3b8",
    },
    divider: "#dbe3ec",
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontSize: "2.25rem", lineHeight: 1.15, fontWeight: 750, letterSpacing: 0 },
    h2: { fontSize: "1.75rem", lineHeight: 1.2, fontWeight: 750, letterSpacing: 0 },
    h3: { fontSize: "1.45rem", lineHeight: 1.25, fontWeight: 720, letterSpacing: 0 },
    h4: { fontSize: "1.25rem", lineHeight: 1.25, fontWeight: 720, letterSpacing: 0 },
    h5: { fontSize: "1.125rem", lineHeight: 1.35, fontWeight: 700, letterSpacing: 0 },
    h6: { fontSize: "1rem", lineHeight: 1.4, fontWeight: 700, letterSpacing: 0 },
    body1: { fontSize: "0.9375rem", lineHeight: 1.55, letterSpacing: 0 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5, letterSpacing: 0 },
    button: { fontWeight: 700, letterSpacing: 0, textTransform: "none" },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 36,
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 700,
        },
        containedPrimary: {
          backgroundColor: "#4338ca",
          boxShadow: "0 10px 22px rgba(67, 56, 202, 0.18)",
          "&:hover": {
            backgroundColor: "#3730a3",
            boxShadow: "0 14px 28px rgba(67, 56, 202, 0.24)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "#ffffff",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#cbd5e1",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#94a3b8",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4338ca",
            borderWidth: 2,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#64748b",
          "&.Mui-focused": {
            color: "#4338ca",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          border: "1px solid #e2e8f0",
          boxShadow: "0 18px 48px rgba(15, 23, 42, 0.16)",
        },
      },
    },
  },
});

export default theme;
