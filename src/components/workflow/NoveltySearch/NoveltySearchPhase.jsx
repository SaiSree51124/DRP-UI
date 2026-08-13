import React from 'react';
import { Box, Typography } from '@mui/material';
import { FONT, TEAL, GRAY_BG } from '../workflowConstants';

const NoveltySearchPhase = ({ workflowPhase }) => (
  <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: GRAY_BG, p: "40px" }}>
    <Box sx={{ textAlign: "center" }}>
      <Typography sx={{ fontFamily: FONT, fontSize: "24px", fontWeight: 700, color: TEAL, mb: "8px" }}>
        Novelty Search Agent
      </Typography>
      <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: "#64748B" }}>
        Phase: {workflowPhase}
      </Typography>
      <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: "#94A3B8", mt: "8px" }}>
        Patent and novelty analysis results will appear here.
      </Typography>
    </Box>
  </Box>
);

export default NoveltySearchPhase;
