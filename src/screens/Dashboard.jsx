import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CheckRounded as CopiedIcon, ContentCopyRounded as CopyIcon, LinkRounded as LinkIcon } from "@mui/icons-material";
import Layout from "../component/Layout";
import { DataTable, MoneyLines, Panel, StatusChip } from "../component/ConsoleParts";
import { endPoints } from "../constant/Environment";
import { REFERRAL_WINDOW } from "../constant/program";
import { apiData, apiMessage, authAxios } from "../Utility/axiosInstances";
import { formatDate, formatMoney, formatMonth } from "../Utility/format";
import useRequireAuth from "../Utility/useRequireAuth";
import { tokens } from "../theme";

const SHARE_STEPS = [
  "Copy your referral link above.",
  "Send it to a client, or add it to your website, proposals and emails.",
  "When they start a trial or subscribe to NevTan Workspace, they show up here.",
];

const StatTile = ({ label, value, hint, strong }) => (
  <Paper
    elevation={0}
    sx={{
      height: "100%",
      p: 2.5,
      borderRadius: 4,
      border: `1px solid ${strong ? tokens.brand : tokens.border}`,
      bgcolor: strong ? tokens.brandSoft : "#fff",
    }}
  >
    <Typography sx={{ color: tokens.muted, fontSize: 13, fontWeight: 700 }}>{label}</Typography>
    <Typography sx={{ fontWeight: 850, fontSize: { xs: 24, md: 28 }, color: strong ? tokens.brandDark : tokens.ink, lineHeight: 1.2, mt: 0.5 }}>
      {value}
    </Typography>
    {hint && <Typography sx={{ color: tokens.muted, fontSize: 12.5, mt: 0.5 }}>{hint}</Typography>}
  </Paper>
);

const ReferralLink = ({ partner }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(partner.referralLink);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Panel title="Your referral link" subtitle={`Clients who open it are remembered for ${REFERRAL_WINDOW}.`}>
      <Stack spacing={2} sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <TextField
            value={partner.referralLink}
            fullWidth
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon sx={{ color: tokens.brand }} />
                </InputAdornment>
              ),
            }}
            inputProps={{ "aria-label": "Your referral link", onFocus: (e) => e.target.select() }}
          />
          <Button
            variant="contained"
            onClick={copy}
            startIcon={copied ? <CopiedIcon /> : <CopyIcon />}
            sx={{ px: 3, whiteSpace: "nowrap", flexShrink: 0 }}
          >
            {copied ? "Copied" : "Copy link"}
          </Button>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
          <Typography sx={{ color: tokens.muted, fontSize: 14 }}>Partner code</Typography>
          <Chip label={partner.code} size="small" sx={{ fontWeight: 800, letterSpacing: 0.5, bgcolor: tokens.brandSoft, color: tokens.brandDark }} />
        </Stack>
      </Stack>
      <Snackbar open={copied} autoHideDuration={2500} onClose={() => setCopied(false)} message="Referral link copied" />
    </Panel>
  );
};

const EarningsSummary = ({ summary }) => {
  if (!summary.length) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatTile label="This month" value="—" hint="Earnings appear after your first client pays" strong />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatTile label="Owed to you" value="—" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatTile label="Total earned" value="—" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatTile label="Total paid" value="—" />
        </Grid>
      </Grid>
    );
  }
  return (
    <Stack spacing={2}>
      {summary.map((s) => (
        <Box key={s.currency}>
          {summary.length > 1 && <Typography sx={{ fontWeight: 800, color: tokens.ink, mb: 1 }}>{s.currency}</Typography>}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <StatTile label="This month" value={formatMoney(s.thisMonth, s.currency)} hint="So far, paid after the month ends" strong />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatTile label="Owed to you" value={formatMoney(s.owed, s.currency)} hint="From months that have ended" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatTile label="Total earned" value={formatMoney(s.totalEarned, s.currency)} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatTile label="Total paid" value={formatMoney(s.totalPaid, s.currency)} />
            </Grid>
          </Grid>
        </Box>
      ))}
    </Stack>
  );
};

const NoClients = () => (
  <Stack spacing={2} sx={{ p: { xs: 3, md: 4 } }}>
    <Typography sx={{ fontWeight: 800, fontSize: 18, color: tokens.ink }}>No clients yet</Typography>
    <Stack spacing={1.25}>
      {SHARE_STEPS.map((step, i) => (
        <Stack key={step} direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              flexShrink: 0,
              width: 26,
              height: 26,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              fontSize: 13,
              fontWeight: 800,
              color: tokens.brand,
              bgcolor: tokens.brandSoft,
            }}
          >
            {i + 1}
          </Box>
          <Typography sx={{ color: tokens.body }}>{step}</Typography>
        </Stack>
      ))}
    </Stack>
  </Stack>
);

const CLIENT_COLUMNS = [
  {
    key: "name",
    label: "Client",
    render: (c) => (
      <Box>
        <Typography sx={{ fontWeight: 700, color: tokens.ink, fontSize: 14 }}>{c.name}</Typography>
        {c.domain && <Typography sx={{ color: tokens.muted, fontSize: 13 }}>{c.domain}</Typography>}
      </Box>
    ),
  },
  { key: "plan", label: "Plan", render: (c) => c.plan || "—" },
  { key: "status", label: "Status", render: (c) => <StatusChip status={c.status} /> },
  { key: "seats", label: "Users", align: "right", render: (c) => c.seats ?? "—" },
  { key: "joinedAt", label: "Joined", render: (c) => formatDate(c.joinedAt) },
  { key: "paid", label: "They paid", align: "right", render: (c) => <MoneyLines items={c.totals} field="paid" /> },
  {
    key: "commission",
    label: "Your commission",
    align: "right",
    render: (c) => (
      <Box sx={{ fontWeight: 800, color: tokens.brandDark }}>
        <MoneyLines items={c.totals} field="commission" />
      </Box>
    ),
  },
];

const MONTH_COLUMNS = [
  { key: "month", label: "Month", render: (m) => formatMonth(m.month) },
  { key: "revenue", label: "Your clients paid", align: "right", render: (m) => formatMoney(m.revenue, m.currency) },
  {
    key: "commission",
    label: "You earned",
    align: "right",
    render: (m) => <Box sx={{ fontWeight: 800, color: tokens.brandDark }}>{formatMoney(m.commission, m.currency)}</Box>,
  },
];

const PAYOUT_COLUMNS = [
  { key: "month", label: "For", render: (p) => formatMonth(p.month) },
  { key: "amount", label: "Amount", align: "right", render: (p) => formatMoney(p.amount, p.currency) },
  { key: "reference", label: "Reference", render: (p) => p.reference || "—" },
  { key: "paidAt", label: "Paid on", render: (p) => formatDate(p.paidAt) },
];

const Dashboard = () => {
  const { ready, user } = useRequireAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await apiData(authAxios.get(endPoints.api.PARTNER_DASHBOARD)));
    } catch (e) {
      setError(apiMessage(e));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (ready) load();
  }, [ready, load]);

  const partner = data?.partner;

  return (
    <Layout title="Dashboard" path="/dashboard" description="Your NevTan partner dashboard." noindex>
      <Box sx={{ bgcolor: tokens.tint, minHeight: "70vh" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          {!ready || (loading && !data) ? (
            <Stack alignItems="center" sx={{ py: 12 }} role="status">
              <CircularProgress />
            </Stack>
          ) : error && !data ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={load}>
                  Try again
                </Button>
              }
            >
              {error}
            </Alert>
          ) : (
            <Stack spacing={3}>
              <Box>
                <Typography sx={{ color: tokens.brand, fontWeight: 800, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
                  Partner dashboard
                </Typography>
                <Typography component="h1" sx={{ fontWeight: 850, fontSize: { xs: 28, md: 36 }, color: tokens.ink, lineHeight: 1.15, mt: 0.5 }}>
                  {partner?.companyName || user?.partner?.companyName}
                </Typography>
                <Typography sx={{ color: tokens.muted, mt: 0.5 }}>
                  Your agreed commission: {partner?.commissionPercent}% of what your clients pay
                  {partner?.since ? ` · Partner since ${formatDate(partner.since)}` : ""}
                </Typography>
              </Box>

              {partner && <ReferralLink partner={partner} />}

              {data.workspaceAvailable === false && (
                <Alert severity="warning">
                  We couldn&apos;t load your clients from NevTan Workspace right now, so the numbers below may be incomplete. Try again in a few
                  minutes.
                </Alert>
              )}

              <EarningsSummary summary={data.summary || []} />

              <Panel title="Your clients" subtitle="Businesses that started a trial or subscribed with your link.">
                {data.clients && data.clients.length ? (
                  <DataTable columns={CLIENT_COLUMNS} rows={data.clients} rowKey={(c) => c.organizationId} />
                ) : (
                  <NoClients />
                )}
              </Panel>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Panel title="Earnings by month" sx={{ height: "100%" }}>
                    <DataTable
                      columns={MONTH_COLUMNS}
                      rows={data.months || []}
                      rowKey={(m) => `${m.month}-${m.currency}`}
                      minWidth={360}
                      empty="Your monthly earnings will show here."
                    />
                  </Panel>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Panel title="Payouts" subtitle="What we have paid you so far." sx={{ height: "100%" }}>
                    <DataTable
                      columns={PAYOUT_COLUMNS}
                      rows={data.payouts || []}
                      rowKey={(p) => `${p.month}-${p.currency}-${p.paidAt}`}
                      minWidth={420}
                      empty="No payouts yet."
                    />
                  </Panel>
                </Grid>
              </Grid>
            </Stack>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default Dashboard;
