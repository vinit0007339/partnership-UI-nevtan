import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataTable, Panel } from "../ConsoleParts";
import { endPoints } from "../../constant/Environment";
import { apiData, apiMessage, authAxios } from "../../Utility/axiosInstances";
import { formatMoney, formatMonth } from "../../Utility/format";
import { tokens } from "../../theme";

// "YYYY-MM" of the month before this one: the month normally being paid out.
function lastMonth() {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

const PayoutsTab = () => {
  const [month, setMonth] = useState(lastMonth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(null);
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [formError, setFormError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async (selected) => {
    if (!/^\d{4}-\d{2}$/.test(selected)) return;
    setLoading(true);
    setError(null);
    try {
      setData(await apiData(authAxios.get(endPoints.api.ADMIN_PAYOUTS, { params: { month: selected } })));
    } catch (e) {
      setError(apiMessage(e));
      setData(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load(month);
  }, [month, load]);

  const openPay = (row) => {
    setPaying(row);
    setAmount(String(row.due));
    setReference("");
    setFormError(null);
  };

  const pay = async () => {
    const value = Number(amount);
    if (!(value > 0)) {
      setFormError("Enter an amount above zero.");
      return;
    }
    if (value > paying.due + 0.005) {
      setFormError(`That's more than the ${formatMoney(paying.due, paying.currency)} due.`);
      return;
    }
    setBusy(true);
    setFormError(null);
    try {
      await apiData(
        authAxios.post(endPoints.api.ADMIN_PAYOUTS, {
          partnerId: paying.partnerId,
          month: data.month,
          currency: paying.currency,
          amount: value,
          reference: reference.trim(),
        })
      );
      setToast({ severity: "success", text: `Recorded ${formatMoney(value, paying.currency)} to ${paying.companyName}.` });
      setPaying(null);
      await load(month);
    } catch (e) {
      setFormError(apiMessage(e));
    }
    setBusy(false);
  };

  const closed = Boolean(data?.closed);
  const columns = [
    {
      key: "partner",
      label: "Partner",
      render: (r) => (
        <Box>
          <Typography sx={{ fontWeight: 700, color: tokens.ink, fontSize: 14 }}>{r.companyName}</Typography>
          <Typography sx={{ color: tokens.muted, fontSize: 13 }}>{r.code}</Typography>
        </Box>
      ),
    },
    { key: "currency", label: "Currency" },
    { key: "earned", label: "Earned", align: "right", render: (r) => formatMoney(r.earned, r.currency) },
    { key: "paid", label: "Paid", align: "right", render: (r) => formatMoney(r.paid, r.currency) },
    {
      key: "due",
      label: "Due",
      align: "right",
      render: (r) => <Box sx={{ fontWeight: 800, color: r.due > 0 ? tokens.brandDark : tokens.muted }}>{formatMoney(r.due, r.currency)}</Box>,
    },
    {
      key: "action",
      label: "",
      align: "right",
      render: (r) => (
        <Button size="small" variant="outlined" onClick={() => openPay(r)} disabled={!closed || !(r.due > 0)}>
          Mark paid
        </Button>
      ),
    },
  ];

  return (
    <Panel
      title="Payouts"
      subtitle="Commission each partner earned in the month, what's been paid and what's still due."
      action={
        <TextField
          type="month"
          size="small"
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 180 }}
        />
      }
    >
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      {data && !closed && (
        <Alert severity="info" sx={{ m: 2 }}>
          {formatMonth(data.month)} isn&apos;t over yet. Payouts can be recorded once the month has ended.
        </Alert>
      )}
      {loading ? (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress size={28} />
        </Stack>
      ) : (
        data && (
          <DataTable
            columns={columns}
            rows={data.rows || []}
            rowKey={(r) => `${r.partnerId}-${r.currency}`}
            empty={`No partner earned commission in ${formatMonth(data.month)}.`}
            minWidth={760}
          />
        )
      )}

      <Dialog open={Boolean(paying)} onClose={() => !busy && setPaying(null)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>Record a payout</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: tokens.muted, mb: 2.5 }}>
            {paying?.companyName} · commission for {data ? formatMonth(data.month) : ""}. Pay them first, then record it here.
          </Typography>
          <Stack spacing={2}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              label="Amount paid"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{ endAdornment: <InputAdornment position="end">{paying?.currency}</InputAdornment> }}
              helperText={paying ? `Due: ${formatMoney(paying.due, paying.currency)}` : ""}
              fullWidth
              autoFocus
            />
            <TextField
              label="Payment reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              inputProps={{ maxLength: 200 }}
              helperText="Bank transfer or transaction id, shown to the partner"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPaying(null)} disabled={busy}>
            Cancel
          </Button>
          <Button variant="contained" onClick={pay} disabled={busy} startIcon={busy ? <CircularProgress size={16} color="inherit" /> : null}>
            Record payout
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={5000} onClose={() => setToast(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        {toast ? (
          <Alert severity={toast.severity} onClose={() => setToast(null)} variant="filled">
            {toast.text}
          </Alert>
        ) : (
          <Box />
        )}
      </Snackbar>
    </Panel>
  );
};

export default PayoutsTab;
