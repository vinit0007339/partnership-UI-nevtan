import React, { useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Fade, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { CheckCircleOutlined as SuccessIcon, SendOutlined as SendIcon } from "@mui/icons-material";
import { axiosInstance } from "../Utility/axiosInstances";
import { endPoints } from "../constant/Environment";
import { APPS } from "../constant/products";
import { REVIEW_TIME } from "../constant/program";
import { tokens } from "../theme";

const clientCountOptions = [
  { value: "1-10", label: "1–10 clients" },
  { value: "11-50", label: "11–50 clients" },
  { value: "51-200", label: "51–200 clients" },
  { value: "200+", label: "More than 200 clients" },
];

const initialForm = {
  name: "",
  email: "",
  companyName: "",
  website: "",
  country: "",
  phone: "",
  clientCount: "",
  products: [],
  message: "",
  fax: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_ERROR = "We couldn't submit your application. Please try again in a moment.";

const ApplicationForm = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(DEFAULT_ERROR);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleProduct = (name) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(name)
        ? prev.products.filter((p) => p !== name)
        : [...prev.products, name],
    }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!EMAIL_PATTERN.test(form.email.trim())) next.email = "Enter a valid email address";
    if (!form.companyName.trim()) next.companyName = "Company name is required";
    if (!form.country.trim()) next.country = "Country is required";
    if (!form.clientCount) next.clientCount = "Choose how many clients you serve";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      const res = await axiosInstance.post(endPoints.api.PARTNER_APPLICATIONS, {
        name: form.name.trim(),
        email: form.email.trim(),
        companyName: form.companyName.trim(),
        website: form.website.trim(),
        country: form.country.trim(),
        phone: form.phone.trim(),
        clientCount: form.clientCount,
        products: form.products,
        message: form.message.trim(),
        fax: form.fax,
      });
      if (res?.data?.status !== "SUCCESS") {
        setErrorMessage(res?.data?.message || DEFAULT_ERROR);
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || DEFAULT_ERROR);
      setStatus("error");
    }
  };

  const submitting = status === "submitting";

  if (status === "success") {
    return (
      <Fade in>
        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ py: 6 }}>
          <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: tokens.brandSoft, color: tokens.brand, display: "grid", placeItems: "center" }}>
            <SuccessIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 800 }}>
            Application received
          </Typography>
          <Typography sx={{ color: "text.secondary", maxWidth: 420 }}>
            Thanks for applying. Our team will review your application and reply within {REVIEW_TIME}, to the email
            address you gave us.
          </Typography>
        </Stack>
      </Fade>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 800 }}>
          Your application
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Fields marked * are required.
        </Typography>
      </Stack>

      <Stack spacing={2.5}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
          <TextField
            label="Your name"
            value={form.name}
            onChange={handleChange("name")}
            error={Boolean(errors.name)}
            helperText={errors.name}
            inputProps={{ maxLength: 150 }}
            autoComplete="name"
            fullWidth
            required
            disabled={submitting}
          />
          <TextField
            label="Work email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            error={Boolean(errors.email)}
            helperText={errors.email}
            inputProps={{ maxLength: 200 }}
            autoComplete="email"
            fullWidth
            required
            disabled={submitting}
          />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
          <TextField
            label="Company name"
            value={form.companyName}
            onChange={handleChange("companyName")}
            error={Boolean(errors.companyName)}
            helperText={errors.companyName}
            inputProps={{ maxLength: 200 }}
            autoComplete="organization"
            fullWidth
            required
            disabled={submitting}
          />
          <TextField
            label="Company website"
            value={form.website}
            onChange={handleChange("website")}
            inputProps={{ maxLength: 255 }}
            autoComplete="url"
            fullWidth
            disabled={submitting}
          />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
          <TextField
            label="Country"
            value={form.country}
            onChange={handleChange("country")}
            error={Boolean(errors.country)}
            helperText={errors.country}
            inputProps={{ maxLength: 100 }}
            autoComplete="country-name"
            fullWidth
            required
            disabled={submitting}
          />
          <TextField
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={handleChange("phone")}
            inputProps={{ maxLength: 50 }}
            autoComplete="tel"
            fullWidth
            disabled={submitting}
          />
        </Stack>
        <TextField
          select
          label="How many clients do you serve?"
          value={form.clientCount}
          onChange={handleChange("clientCount")}
          error={Boolean(errors.clientCount)}
          helperText={errors.clientCount}
          fullWidth
          required
          disabled={submitting}
        >
          {clientCountOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            Apps you want to recommend
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            {APPS.map((app) => {
              const selected = form.products.includes(app.title);
              return (
                <Chip
                  key={app.code}
                  avatar={<Box component="img" src={app.icon} alt="" sx={{ objectFit: "contain", bgcolor: "transparent" }} />}
                  label={app.title}
                  onClick={() => toggleProduct(app.title)}
                  disabled={submitting}
                  variant={selected ? "filled" : "outlined"}
                  aria-pressed={selected}
                  sx={{
                    fontWeight: 600,
                    ...(selected
                      ? { bgcolor: tokens.brand, color: "#fff", "&:hover": { bgcolor: tokens.brandDark } }
                      : { borderColor: tokens.border, color: tokens.ink }),
                  }}
                />
              );
            })}
          </Stack>
        </Box>
        <TextField
          label="Anything else we should know?"
          value={form.message}
          onChange={handleChange("message")}
          inputProps={{ maxLength: 5000 }}
          fullWidth
          multiline
          minRows={3}
          disabled={submitting}
        />

        {/* Honeypot: off-screen so people never fill it in; the API drops any submission that does. */}
        <Box aria-hidden="true" sx={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
          <TextField label="Fax" tabIndex={-1} autoComplete="off" value={form.fax} onChange={handleChange("fax")} />
        </Box>

        {status === "error" && (
          <Alert severity="error" onClose={() => setStatus("idle")}>
            {errorMessage}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
          sx={{ alignSelf: "flex-start", px: 4, py: 1.3, fontWeight: 800 }}
        >
          {submitting ? "Submitting…" : "Submit application"}
        </Button>
      </Stack>
    </Box>
  );
};

export default ApplicationForm;
