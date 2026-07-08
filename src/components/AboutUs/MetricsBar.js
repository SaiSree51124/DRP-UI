import React from "react";
import { Box, Typography } from "@mui/material";
import { C } from "../../utils/colors";
import { metrics } from "./data/aboutUsData";
import useInView from "./hooks/useInView";

function MetricsBar() {
  const [ref, visible] = useInView();
  return (
    <Box ref={ref} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: "12px", mb: 4 }}>
      {metrics.map(({ value, label, Icon }, i) => (
        <Box key={i} sx={{
          background: C.card, borderRadius: "14px", p: "18px 20px",
          border: `1px solid ${C.border}`, boxShadow: "0 2px 10px rgba(10,46,82,0.06)",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: `opacity .5s ${i * 0.1}s, transform .5s ${i * 0.1}s`,
        }}>
          <Icon sx={{ fontSize: 20, color: C.teal, mb: 0.8 }} />
          <Typography sx={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: { xs: "20px", md: "26px" }, color: C.navy, lineHeight: 1 }}>
            {value}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: C.muted, mt: 0.5, lineHeight: 1.5 }}>{label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

export default MetricsBar;
