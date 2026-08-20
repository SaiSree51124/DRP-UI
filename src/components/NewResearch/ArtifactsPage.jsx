import React from "react";
import { Box, Typography, Button } from "@mui/material";
import "./ArtifactsPage.css";

const ArtifactsPage = () => {
  const topTargets = [
    { gene: "TP53", id: "P04637", score: 79, note: "Broad disease association signal" },
    { gene: "EGFR", id: "P00533", score: 74, note: "Pathway enrichment" },
    { gene: "TNF", id: "P01375", score: 71, note: "Database network relevance" },
  ];

  return (
    <Box className="artifacts-root">
      <Box className="artifact-card">
        <Typography className="artifact-title">TARGET IDENTIFICATION</Typography>
        <Typography className="artifact-subtitle">Target shortlist · TP53, EGFR</Typography>

        <Box className="artifact-list">
          {topTargets.map((t, i) => (
            <Box key={i} className="artifact-row">
              <Box>
                <Typography className="artifact-gene">{t.gene}<span className="artifact-id">({t.id})</span></Typography>
                <Typography className="artifact-note">{t.note}</Typography>
              </Box>
              <Typography className="artifact-score">{t.score}</Typography>
            </Box>
          ))}
        </Box>

        <Box className="artifact-recommendation">
          <Typography className="artifact-rec-title">Recommendation</Typography>
          <Typography className="artifact-rec-body">I recommend continuing with the top two proteins for the next evidence step.</Typography>
        </Box>
      </Box>

      <Box className="artifact-card">
        <Typography className="artifact-title">RESEARCH DOCUMENTATION</Typography>
        <Typography className="artifact-subtitle">Path documentation for this branch</Typography>

        <Box className="artifact-doc-input">
          <input placeholder="Complete novelty and open Documentation in chat to generate a path review, or compose a draft from target shortlists." />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#00BCD4',
              color: '#FFFFFF',
              textTransform: 'none',
              '&:hover': { bgcolor: '#089B98' },
            }}
          >
            Generate report
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ArtifactsPage;
