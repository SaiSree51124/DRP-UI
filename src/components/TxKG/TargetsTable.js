import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { C, GRAD_H } from "../../utils/colors";

const TargetsTable = ({ targets, loadingTargets }) => (
  <Box sx={{ mb: 3 }}>
    <Paper elevation={2} sx={{ border: "0px solid #0225AA", borderRadius: 1, overflow: "hidden" }}>
      <Box
        sx={{
          background: GRAD_H,
          color: C.card,
          p: 1.5,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography fontWeight={600} sx={{ width: "33%" }}>Uniprot ID</Typography>
        <Typography fontWeight={600} sx={{ width: "33%", textAlign: "center" }}>Target</Typography>
        <Typography fontWeight={600} sx={{ width: "33%", textAlign: "right" }}>Score</Typography>
      </Box>

      <Box sx={{ p: 1.5 }}>
        {loadingTargets ? (
          <Typography sx={{ p: 2, textAlign: "center", color: C.muted }}>
            Loading targets...
          </Typography>
        ) : targets.length > 0 ? (
          targets.map((target, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 1.5,
                borderBottom: "1px solid " + C.border,
                background: C.card,
                cursor: "pointer",
                "&:hover": { bgcolor: C.sky },
              }}
            >
              <Typography sx={{ width: "15%" }}>{target.uniprot_id || "-"}</Typography>
              <Typography sx={{ width: "60%", textAlign: "center" }} fontWeight={500} color="black">
                {target.name || target.gene || target.protein || "-"}
              </Typography>
              <Typography sx={{ width: "15%", textAlign: "right" }} fontWeight={500} color="black">
                {(target.score || 0).toFixed(2)}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography sx={{ p: 2, textAlign: "center", color: C.muted }}>
            No targets predicted
          </Typography>
        )}
      </Box>
    </Paper>
  </Box>
);

export default TargetsTable;
