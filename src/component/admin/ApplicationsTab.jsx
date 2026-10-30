import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { KeyboardArrowDownRounded as ExpandIcon, KeyboardArrowUpRounded as CollapseIcon } from "@mui/icons-material";
import { Panel, StatusChip } from "../ConsoleParts";
import { endPoints } from "../../constant/Environment";
import { apiData, apiMessage, authAxios } from "../../Utility/axiosInstances";
import { formatDate } from "../../Utility/format";
import { tokens } from "../../theme";

const FILTERS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ALL", label: "All" },
];

const headSx = { fontWeight: 700, color: tokens.muted, fontSize: 13, bgcolor: tokens.tint, whiteSpace: "nowrap" };

const Detail = ({ label, children }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Typography sx={{ color: tokens.muted, fontSize: 12.5, fontWeight: 700 }}>{label}</Typography>
    <Typography component="div" sx={{ color: tokens.ink, fontSize: 14, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
      {children || "—"}
    </Typography>
  </Grid>
);

const ApplicationRow = ({ app, open, onToggle, onApprove, onReject, busy }) => (
  <Fragment>
    <TableRow hover sx={{ "& > td": { borderBottom: open ? "none" : undefined } }}>
      <TableCell padding="checkbox">
        <IconButton size="small" onClick={onToggle} aria-label={open ? "Hide details" : "Show details"} aria-expanded={open}>
          {open ? <CollapseIcon /> : <ExpandIcon />}
        </IconButton>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontWeight: 700, color: tokens.ink, fontSize: 14 }}>{app.companyName}</Typography>
        {app.website && <Typography sx={{ color: tokens.muted, fontSize: 13 }}>{app.website}</Typography>}
      </TableCell>
      <TableCell>
        <Typography sx={{ color: tokens.ink, fontSize: 14 }}>{app.name}</Typography>
        <Typography sx={{ color: tokens.muted, fontSize: 13 }}>{app.email}</Typography>
      </TableCell>
      <TableCell sx={{ fontSize: 14 }}>{app.country}</TableCell>
      <TableCell sx={{ fontSize: 14, whiteSpace: "nowrap" }}>{app.clientCount}</TableCell>
      <TableCell sx={{ fontSize: 14, whiteSpace: "nowrap" }}>{formatDate(app.createdAt)}</TableCell>
      <TableCell>
        <StatusChip status={app.status} />
      </TableCell>
      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
        {app.status === "PENDING" && (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              size="small"
              variant="contained"
              onClick={onApprove}
              disabled={busy}
              startIcon={busy ? <CircularProgress size={14} color="inherit" /> : null}
            >
              Approve
            </Button>
            <Button size="small" color="error" onClick={onReject} disabled={busy}>
              Reject
            </Button>
          </Stack>
        )}
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell colSpan={8} sx={{ py: 0, bgcolor: tokens.tint }}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Grid container spacing={2} sx={{ py: 2.5, px: 1 }}>
            <Detail label="Phone">{app.phone}</Detail>
            <Detail label="Website">{app.website}</Detail>
            <Detail label="Apps they want to recommend">{app.products}</Detail>
            <Grid item xs={12}>
              <Typography sx={{ color: tokens.muted, fontSize: 12.5, fontWeight: 700 }}>Message</Typography>
              <Typography sx={{ color: tokens.ink, fontSize: 14, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{app.message || "—"}</Typography>
            </Grid>
            {app.reviewedAt && (
              <Detail label="Reviewed">
                {formatDate(app.reviewedAt)}
                {app.reviewedBy ? ` by ${app.reviewedBy}` : ""}
              </Detail>
            )}
            {app.status === "REJECTED" && <Detail label="Reason">{app.rejectionReason}</Detail>}
            {app.partnerId && <Detail label="Partner id">{app.partnerId}</Detail>}
            <Detail label="Application">#{app.id}</Detail>
          </Grid>
        </Collapse>
      </TableCell>
    </TableRow>
  </Fragment>
);

const ApplicationsTab = () => {
  const [status, setStatus] = useState("PENDING");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const [approving, setApproving] = useState(null);
  const [rate, setRate] = useState("");
  const [toast, setToast] = useState(null);

  const load = useCallback(async (filter) => {
    setLoading(true);
    setError(null);
    try {
      setRows((await apiData(authAxios.get(endPoints.api.ADMIN_APPLICATIONS, { params: { status: filter } }))) || []);
    } catch (e) {
      setError(apiMessage(e));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load(status);
  }, [status, load]);

  // The commission is whatever was agreed with this partner; there is no default rate.
  const rateValid = /^\d{1,3}$/.test(rate.trim()) && Number(rate) >= 1 && Number(rate) <= 100;

  const approve = async () => {
    const app = approving;
    setBusyId(app.id);
    try {
      const partner = await apiData(
        authAxios.post(`${endPoints.api.ADMIN_APPLICATIONS}/${app.id}/approve`, { commissionPercent: Number(rate) })
      );
      setToast({ severity: "success", text: `${app.companyName} is approved${partner?.code ? ` — partner code ${partner.code}` : ""}.` });
      setApproving(null);
      setRate("");
      await load(status);
    } catch (e) {
      setToast({ severity: "error", text: apiMessage(e) });
    }
    setBusyId(null);
  };

  const reject = async () => {
    const app = rejecting;
    setBusyId(app.id);
    try {
      await apiData(authAxios.post(`${endPoints.api.ADMIN_APPLICATIONS}/${app.id}/reject`, { reason: reason.trim() }));
      setToast({ severity: "success", text: `${app.companyName}'s application was rejected.` });
      setRejecting(null);
      setReason("");
      await load(status);
    } catch (e) {
      setToast({ severity: "error", text: apiMessage(e) });
    }
    setBusyId(null);
  };

  return (
    <Panel
      title="Applications"
      subtitle="Approving creates the partner account and partner code, and lets the applicant sign in."
      action={
        <ToggleButtonGroup exclusive size="small" value={status} onChange={(_, v) => v && setStatus(v)}>
          {FILTERS.map((f) => (
            <ToggleButton key={f.value} value={f.value} sx={{ textTransform: "none", fontWeight: 700, px: 1.75 }}>
              {f.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      }
    >
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress size={28} />
        </Stack>
      ) : (
        <TableContainer>
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={headSx} />
                <TableCell sx={headSx}>Company</TableCell>
                <TableCell sx={headSx}>Applicant</TableCell>
                <TableCell sx={headSx}>Country</TableCell>
                <TableCell sx={headSx}>Clients</TableCell>
                <TableCell sx={headSx}>Applied</TableCell>
                <TableCell sx={headSx}>Status</TableCell>
                <TableCell sx={headSx} />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ py: 5, textAlign: "center", color: tokens.muted }}>
                    {status === "PENDING" ? "No applications waiting for review." : "No applications here."}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((app) => (
                  <ApplicationRow
                    key={app.id}
                    app={app}
                    open={openId === app.id}
                    onToggle={() => setOpenId(openId === app.id ? null : app.id)}
                    onApprove={() => {
                      setRate("");
                      setApproving(app);
                    }}
                    onReject={() => {
                      setReason("");
                      setRejecting(app);
                    }}
                    busy={busyId === app.id}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={Boolean(approving)} onClose={() => busyId === null && setApproving(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>Approve {approving?.companyName}?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: tokens.muted, mb: 2 }}>
            Enter the commission you agreed with this partner. It applies to what their referred clients pay, and the partner sees it
            in their welcome email and dashboard.
          </Typography>
          <TextField
            label="Agreed commission (%)"
            value={rate}
            onChange={(e) => setRate(e.target.value.replace(/[^\d]/g, "").slice(0, 3))}
            error={rate !== "" && !rateValid}
            helperText={rate !== "" && !rateValid ? "Enter a whole number from 1 to 100" : " "}
            inputProps={{ inputMode: "numeric" }}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setApproving(null)} disabled={busyId !== null}>
            Cancel
          </Button>
          <Button variant="contained" onClick={approve} disabled={busyId !== null || !rateValid}>
            Approve partner
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(rejecting)} onClose={() => busyId === null && setRejecting(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>Reject {rejecting?.companyName}?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: tokens.muted, mb: 2 }}>The applicant won&apos;t be able to sign in to the partner dashboard.</Typography>
          <TextField
            label="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            inputProps={{ maxLength: 500 }}
            multiline
            minRows={3}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRejecting(null)} disabled={busyId !== null}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={reject} disabled={busyId !== null}>
            Reject application
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

export default ApplicationsTab;
