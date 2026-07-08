import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { BiotechOutlined } from "@mui/icons-material";
import { Fade } from "@mui/material";
import { C } from "../../utils/colors";

const AgentHeader = () => (
  <Fade in timeout={800}>
    <Paper elevation={0} sx={{ p: 1, mb: 1, background: C.bg, borderRadius: 2, border: `1px solid ${C.teal}` }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <BiotechOutlined sx={{ color: C.navy, fontSize: 40 }} />
        <Box>
          <Typography color={C.navy} variant="h6" fontWeight={600}>
            Novelty Search Agent
          </Typography>
          <Typography variant="body2" sx={{ color: C.muted, mt: 0.5, fontSize: 13 }}>
            The Novelty Search Agent checks whether a research combination or compound is truly
            new by autonomously searching patents, building a smart knowledge base, and reasoning
            across all relevant patents to uncover prior art, analyse claims, and assess how
            original a discovery really is — ensuring every candidate that moves forward is
            genuinely innovative and worth pursuing.
          </Typography>
        </Box>
      </Box>
    </Paper>
  </Fade>
);

export default AgentHeader;
