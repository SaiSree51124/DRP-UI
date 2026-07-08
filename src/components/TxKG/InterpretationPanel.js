import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { C } from "../../utils/colors";

const InterpretationPanel = ({ llmInterpretation, loadingLLM }) => (
  <Paper
    elevation={2}
    sx={{ border: "2px solid" + C.teal, borderRadius: 2, p: 2, background: C.card }}
  >
    <Typography variant="h6" color={C.navy} fontWeight={600} mb={1}>
      Interpretation:
    </Typography>
    <Box sx={{ minHeight: 150, maxHeight: 250, overflowY: "auto", lineHeight: 1.6 }}>
      {loadingLLM ? (
        <Typography color={C.muted} fontStyle="italic">Loading interpretation...</Typography>
      ) : llmInterpretation ? (
        <Typography>{llmInterpretation}</Typography>
      ) : (
        <Typography color={C.muted}>
          Select a disease to see AI interpretation of the predictions.
        </Typography>
      )}
    </Box>
  </Paper>
);

export default InterpretationPanel;
