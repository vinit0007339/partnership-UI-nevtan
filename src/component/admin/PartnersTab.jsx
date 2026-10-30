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
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { DataTable, Panel, StatusChip } from "../ConsoleParts";
import { endPoints } from "../../constant/Environment";
import { apiData, apiMessage, authAxios } from "../../Utility/axiosInstances";
import { formatDate } from "../../Utility/format";
import { tokens } from "../../theme";

const PartnersTab = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows((await apiData(authAxios.get(endPoints.api.ADMIN_PARTNERS))) || []);
    } catch (e) {
      setError(apiMessage(e));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (partner, status) => {
    setBusyId(partner.id);
    try {
      await apiData(authAxios.patch(`${endPoints.api.ADMIN_PARTNERS}/${partner.id}`, { status }));
      setToast({
        severity: "success",
        text: status === "SUSPENDED" ? `${partner.companyName} is suspended.` : `${partner.companyName} is active again.`,
      });
      setConfirming(null);
      await load();
    } catch (e) {
      setToast({ severity: "error", text: apiMessage(e) });
    }
    setBusyId(null);
  };

  const columns = [
    {
      key: "code",
      label: "Code",
      render: (p) => <Typography sx={{ fontWeight: 800, letterSpacing: 0.5, color: tokens.brandDark, fontSize: 14 }}>{p.code}</Typography>,
    },
    { key: "companyName", label: "Company", render: (p) => <Typography sx={{ fontWeight: 700, color: tokens.ink, fontSize: 14 }}>{p.companyName}</Typography> },
    {
      key: "owner",
      label: "Owner",
      render: (p) => (
        <Box>
          <Typography sx={{ color: tokens.ink, fontSize: 14 }}>{p.ownerName}</Typography>
          <Typography sx={{ color: tokens.muted, fontSize: 13 }}>{p.ownerEmail}</Typography>
        </Box>
      ),
    },
    { key: "country", label: "Country" },
    { key: "commissionPercent", label: "Commission", align: "right", render: (p) => `${p.commissionPercent}%` },
    { key: "status", label: "Status", render: (p) => <StatusChip status={p.status} /> },
    { key: "createdAt", label: "Since", render: (p) => formatDate(p.createdAt) },
    {
      key: "action",
      label: "",
      align: "right",
      render: (p) =>
        p.status === "SUSPENDED" ? (
          <Button size="small" onClick={() => setStatus(p, "ACTIVE")} disabled={busyId === p.id}>
            Reactivate
          </Button>
        ) : (
          <Button size="small" color="error" onClick={() => setConfirming(p)} disabled={busyId === p.id}>
            Suspend
          </Button>
        ),
    },
  ];

  return (
    <Panel title="Partners" subtitle="Approved partners. A suspended partner can't sign in to the dashboard.">
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
        <DataTable columns={columns} rows={rows} rowKey={(p) => p.id} empty="No partners yet. Approve an application to add one." minWidth={900} />
      )}

      <Dialog open={Boolean(confirming)} onClose={() => busyId === null && setConfirming(null)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>Suspend {confirming?.companyName}?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: tokens.muted }}>
            They won&apos;t be able to sign in to the partner dashboard until you reactivate them. Their clients and earnings stay recorded.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirming(null)} disabled={busyId !== null}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={() => setStatus(confirming, "SUSPENDED")} disabled={busyId !== null}>
            Suspend
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

export default PartnersTab;
