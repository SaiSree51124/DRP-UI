import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";

const formatResponse = (text) => {
  if (!text) return null;
  const lines = text.split("\n").filter((l) => l.trim());
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();

        if (
          /^[A-Z][A-Z\s\-]{4,}:?$/.test(trimmed) ||
          (/^\d+\.\s+[A-Z]/.test(trimmed) === false && trimmed.endsWith(":"))
        ) {
          return (
            <Typography key={i} variant="body2" sx={{ fontWeight: 700, color: "#1A202C", mt: i > 0 ? 1 : 0, fontSize: 13 }}>
              {trimmed}
            </Typography>
          );
        }

        const numbered = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (numbered) {
          return (
            <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Chip label={numbered[1]} size="small" sx={{ background: "linear-gradient(135deg,#0124AA,#00809E)", color: "white", fontWeight: "bold", minWidth: 26, height: 26, fontSize: 11, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ flex: 1, fontSize: 13.5, lineHeight: 1.7, color: "#2D3748" }}>
                {numbered[2]}
              </Typography>
            </Box>
          );
        }

        if (/^[-•]\s+/.test(trimmed)) {
          return (
            <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "flex-start", pl: 0.5 }}>
              <FiberManualRecord sx={{ fontSize: 7, color: "#00809E", mt: "7px", flexShrink: 0 }} />
              <Typography variant="body2" sx={{ flex: 1, fontSize: 13.5, lineHeight: 1.7, color: "#2D3748" }}>
                {trimmed.replace(/^[-•]\s+/, "")}
              </Typography>
            </Box>
          );
        }

        return (
          <Typography key={i} variant="body2" sx={{ fontSize: 13.5, lineHeight: 1.7, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? "#1A202C" : "#2D3748" }}>
            {trimmed}
          </Typography>
        );
      })}
    </Box>
  );
};

export default formatResponse;
