import React from "react";
import { Box } from "@mui/material";
import useReveal from "../Utility/useReveal";

/** A Box that fades up the first time it scrolls into view. See useReveal for when it animates. */
const Reveal = ({ delay = 0, sx, children, ...rest }) => {
  const [ref, shown, armed] = useReveal();
  return (
    <Box
      ref={ref}
      sx={[
        armed && {
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : "translateY(16px)",
          transition: "opacity 500ms ease-out, transform 500ms ease-out",
          transitionDelay: `${delay}ms`,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Reveal;
