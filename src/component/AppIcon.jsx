import React from "react";
import { Box } from "@mui/material";

/** An app's icon on its own soft brand colour, like the NevTan Workspace app launcher. */
const AppIcon = ({ app, size = 40 }) => (
  <Box
    sx={{
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: `${Math.round(size / 4)}px`,
      bgcolor: app.soft,
      display: "grid",
      placeItems: "center",
    }}
  >
    <Box
      component="img"
      src={app.icon}
      alt=""
      sx={{ width: Math.round(size * 0.6), height: Math.round(size * 0.6), objectFit: "contain" }}
    />
  </Box>
);

export default AppIcon;
