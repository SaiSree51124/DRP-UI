import React from "react";
import { Box, Typography } from "@mui/material";
import { C } from "../../utils/colors";

const TxKGHeader = () => (
  <Box sx={{ mb: 3, p: "10px", border: "1px solid " + C.teal, borderRadius: 2 }}>
    <Typography variant="h6" fontWeight={600} sx={{ color: C.navy }}>
      TxKG - Therapeutic Target Prediction
    </Typography>
    <Typography mt={1} color={C.muted} textAlign="justify">
      The TxKG module explores biological networks and disease pathways to identify promising protein targets
      for therapeutic research. By analyzing the relationships between diseases, proteins and drugs TxKG
      helps researchers uncover novel disease-target associations that might otherwise go unnoticed.
      This AI-assisted system accelerates the early stages of drug discovery by providing data-driven predictions
      along with confidence scores, helping scientists focus on the most promising directions for further study.
    </Typography>
  </Box>
);

export default TxKGHeader;
