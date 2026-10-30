import React, { useState } from "react";
import { Box, CircularProgress, Container, Stack, Tab, Tabs, Typography } from "@mui/material";
import Layout from "../component/Layout";
import ApplicationsTab from "../component/admin/ApplicationsTab";
import PartnersTab from "../component/admin/PartnersTab";
import PayoutsTab from "../component/admin/PayoutsTab";
import useRequireAuth from "../Utility/useRequireAuth";
import { tokens } from "../theme";

const TABS = [
  { key: "applications", label: "Applications", Panel: ApplicationsTab },
  { key: "partners", label: "Partners", Panel: PartnersTab },
  { key: "payouts", label: "Payouts", Panel: PayoutsTab },
];

/** The NevTan team's side of the program: review applications, manage partners, record payouts. */
const Admin = () => {
  const { ready } = useRequireAuth({ admin: true });
  const [tab, setTab] = useState(TABS[0].key);
  const Current = TABS.find((t) => t.key === tab).Panel;

  return (
    <Layout title="Partner admin" path="/admin" description="NevTan partner program admin." noindex>
      <Box sx={{ bgcolor: tokens.tint, minHeight: "70vh" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          {!ready ? (
            <Stack alignItems="center" sx={{ py: 12 }} role="status">
              <CircularProgress />
            </Stack>
          ) : (
            <Stack spacing={3}>
              <Box>
                <Typography sx={{ color: tokens.brand, fontWeight: 800, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
                  NevTan team
                </Typography>
                <Typography component="h1" sx={{ fontWeight: 850, fontSize: { xs: 28, md: 36 }, color: tokens.ink, lineHeight: 1.15, mt: 0.5 }}>
                  Partner program admin
                </Typography>
              </Box>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" allowScrollButtonsMobile sx={{ borderBottom: `1px solid ${tokens.border}` }}>
                {TABS.map((t) => (
                  <Tab key={t.key} value={t.key} label={t.label} sx={{ textTransform: "none", fontWeight: 700, fontSize: 15 }} />
                ))}
              </Tabs>
              <Current />
            </Stack>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default Admin;
