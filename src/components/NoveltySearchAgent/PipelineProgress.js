import React from "react";
import { Box, Typography, CircularProgress, LinearProgress } from "@mui/material";
import { CheckCircle, FiberManualRecord } from "@mui/icons-material";

const PIPELINE_STEPS = [
  "Searching Google Patents",
  "Fetching patent documents",
  "Parsing sections & claims",
  "Generating embeddings",
  "Retrieving relevant evidence",
  "Synthesising agent analysis",
];

const PipelineProgress = ({ active, currentStep }) => {
  if (!active) return null;
  return (
    <Box sx={{ mt: 1 }}>
      {PIPELINE_STEPS.map((step, i) => (
        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          {i < currentStep ? (
            <CheckCircle sx={{ fontSize: 14, color: "#196C69" }} />
          ) : i === currentStep ? (
            <CircularProgress size={12} sx={{ color: "#00809E" }} />
          ) : (
            <FiberManualRecord sx={{ fontSize: 10, color: "#CBD5E0" }} />
          )}
          <Typography variant="caption" sx={{
            color: i <= currentStep ? "#2D3748" : "#A0AEC0",
            fontWeight: i === currentStep ? 600 : 400,
          }}>
            {step}
          </Typography>
        </Box>
      ))}
      <LinearProgress
        variant="determinate"
        value={((currentStep + 1) / PIPELINE_STEPS.length) * 100}
        sx={{
          mt: 1.5, borderRadius: 1, bgcolor: "#EBF8FF",
          "& .MuiLinearProgress-bar": {
            background: "linear-gradient(90deg,#0124AA,#00809E)",
          },
        }}
      />
    </Box>
  );
};

export { PIPELINE_STEPS };
export default PipelineProgress;
