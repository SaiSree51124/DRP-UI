import React from "react";
import { Paper, Typography, IconButton } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { C } from "../../utils/colors";

const ModuleHeader = ({ title, onHelpClick }) => (
  <Paper
    elevation={2}
    sx={{
      m: 1,
      p: "10px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 2,
    }}
  >
    <Typography variant="subtitle1" fontWeight={700} sx={{ color: C.navy }}>
      {title}
    </Typography>
    <IconButton
      onClick={onHelpClick}
      size="small"
      sx={{
        bgcolor: C.teal,
        color: "#fff",
        width: 32,
        height: 32,
        "&:hover": { bgcolor: C.navy },
      }}
    >
      <HelpOutlineIcon sx={{ fontSize: 18 }} />
    </IconButton>
  </Paper>
);

export default ModuleHeader;
