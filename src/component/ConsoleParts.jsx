import React from "react";
import { Box, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { formatMoney, humanize } from "../Utility/format";
import { tokens } from "../theme";

// Building blocks shared by the partner dashboard and the NevTan admin.

const STATUS_COLORS = {
  ACTIVE: { bgcolor: "#dcfce7", color: "#166534" },
  APPROVED: { bgcolor: "#dcfce7", color: "#166534" },
  TRIALING: { bgcolor: tokens.brandSoft, color: tokens.brandDark },
  PENDING: { bgcolor: "#fef3c7", color: "#92400e" },
  PAST_DUE: { bgcolor: "#fef3c7", color: "#92400e" },
  SUSPENDED: { bgcolor: "#fee2e2", color: "#991b1b" },
  REJECTED: { bgcolor: "#fee2e2", color: "#991b1b" },
};

export const StatusChip = ({ status }) => (
  <Chip
    label={humanize(status) || "—"}
    size="small"
    sx={{ fontWeight: 700, ...(STATUS_COLORS[status] || { bgcolor: tokens.tint, color: tokens.muted, border: `1px solid ${tokens.border}` }) }}
  />
);

/** A titled white panel. */
export const Panel = ({ title, subtitle, action, children, sx }) => (
  <Paper elevation={0} sx={{ borderRadius: 4, border: `1px solid ${tokens.border}`, overflow: "hidden", ...sx }}>
    {(title || action) && (
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ px: { xs: 2.5, md: 3 }, py: 2.25, borderBottom: `1px solid ${tokens.border}` }}
      >
        <Box>
          {title && (
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: 18, color: tokens.ink }}>
              {title}
            </Typography>
          )}
          {subtitle && <Typography sx={{ color: tokens.muted, fontSize: 14 }}>{subtitle}</Typography>}
        </Box>
        {action}
      </Stack>
    )}
    {children}
  </Paper>
);

/**
 * A plain table: `columns` are { key, label, align, render(row) }. Shows `empty` when there are no
 * rows. Scrolls sideways on small screens instead of squeezing.
 */
export const DataTable = ({ columns, rows, rowKey, empty = "Nothing here yet.", minWidth = 640 }) => (
  <TableContainer>
    <Table size="small" sx={{ minWidth }}>
      <TableHead>
        <TableRow>
          {columns.map((c) => (
            <TableCell key={c.key} align={c.align} sx={{ fontWeight: 700, color: tokens.muted, fontSize: 13, bgcolor: tokens.tint, whiteSpace: "nowrap" }}>
              {c.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} sx={{ py: 4, textAlign: "center", color: tokens.muted }}>
              {empty}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row, i) => (
            <TableRow key={rowKey ? rowKey(row) : i} hover>
              {columns.map((c) => (
                <TableCell key={c.key} align={c.align} sx={{ fontSize: 14, color: tokens.body }}>
                  {c.render ? c.render(row) : row[c.key]}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

/** One amount per currency, one per line: [{ currency, [field]: number }]. */
export const MoneyLines = ({ items, field }) =>
  items && items.length ? (
    <Stack spacing={0.25}>
      {items.map((item) => (
        <span key={item.currency}>{formatMoney(item[field], item.currency)}</span>
      ))}
    </Stack>
  ) : (
    "—"
  );
