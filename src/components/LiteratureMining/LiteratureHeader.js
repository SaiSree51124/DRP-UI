import React from "react";
import { Box, Typography } from "@mui/material";
import { C } from "../../utils/colors";

const LiteratureHeader = () => (
  <Box
    sx={{
      mb: 3,
      p: "10px",
      border: `1px solid ${C.teal}`,
      borderRadius: 2,
      height: "auto",
      minHeight: "50px",
    }}
  >
    <Typography variant="h6" fontWeight={600} sx={{ color: C.navy }}>
      Literature Mining
    </Typography>
    <Typography mt={1} color="textSecondary" textAlign="justify">
      Retrieves scientifically relevant PubMed articles using semantic search powered by MeSH
      terminology and contextual understanding. Filters studies based on user-defined keywords
      and related biomedical concepts to deliver precise, high-quality evidence for drug
      repurposing.
    </Typography>
  </Box>
);

export default LiteratureHeader;
