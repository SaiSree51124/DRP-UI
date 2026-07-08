import React, { useState } from "react";
import { Box, Typography, Collapse } from "@mui/material";
import { AccountTree, ExpandMore, ExpandLess } from "@mui/icons-material";

const PipelineTraceAccordion = ({ steps }) => {
  const [open, setOpen] = useState(false);
  if (!steps?.length) return null;
  return (
    <Box sx={{ mt: 2, borderTop: "1px solid #EDF2F7", pt: 1 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", "&:hover": { opacity: 0.75 } }}
        onClick={() => setOpen((o) => !o)}
      >
        <AccountTree sx={{ fontSize: 14, color: "#718096" }} />
        <Typography variant="caption" sx={{ color: "#718096", fontWeight: 500 }}>
          Pipeline trace ({steps.length} steps)
        </Typography>
        {open
          ? <ExpandLess sx={{ fontSize: 14, color: "#718096" }} />
          : <ExpandMore sx={{ fontSize: 14, color: "#718096" }} />}
      </Box>
      <Collapse in={open}>
        <Box sx={{ mt: 1, pl: 1.5, borderLeft: "2px solid #E2E8F0" }}>
          {steps.map((s, i) => (
            <Box key={i} sx={{ mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: "#718096", display: "block", fontSize: 11, lineHeight: 1.5 }}>
                {i + 1}. {s}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default PipelineTraceAccordion;
