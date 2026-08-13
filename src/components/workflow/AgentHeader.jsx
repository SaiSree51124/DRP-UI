import React from 'react';
import { Box, Typography } from '@mui/material';

const AgentHeader = ({ label }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "16px" }}>
    <Box sx={{ width: 30, height: 30, borderRadius: "8px", bgcolor: "#F0FDF9", border: "1px solid #00BCD4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" fill="#00BCD4"/>
      </svg>
    </Box>
    <Typography sx={{ fontFamily: "'Geist', sans-serif", fontSize: "11px", fontWeight: 700, color: "#1E293B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {label}
    </Typography>
  </Box>
);

export default AgentHeader;
