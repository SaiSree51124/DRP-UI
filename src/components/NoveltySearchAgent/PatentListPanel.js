import React from "react";
import {
  Box, Paper, Typography, List, ListItem, ListItemButton,
  Avatar, Link, Chip, Tooltip, IconButton,
} from "@mui/material";
import { OpenInNew, Refresh } from "@mui/icons-material";
import { C, GRAD_H } from "../../utils/colors";

const PatentListPanel = ({ patents, selectedPatent, onSelectPatent, onReset }) => (
  <Paper elevation={3} sx={{ height: 680, overflow: "hidden", borderRadius: 3 }}>
    <Box sx={{
      p: 2.5, borderBottom: 1, borderColor: "divider",
      background: C.sky,
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <Box>
        <Typography variant="h6" fontWeight={600} sx={{ color: C.navy }}>
          Patents Analysed ({patents.length})
        </Typography>
        <Typography variant="caption" sx={{ color: C.muted, display: "block" }}>
          Click to focus · or query all below
        </Typography>
      </Box>
      <Tooltip title="Reset session">
        <IconButton size="small" onClick={onReset} sx={{ color: C.navy }}>
          <Refresh />
        </IconButton>
      </Tooltip>
    </Box>

    <List sx={{ overflow: "auto", height: "calc(100% - 82px)" }}>
      {patents.length === 0 && (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: C.muted }}>
            Patents will appear here after the agent runs
          </Typography>
        </Box>
      )}
      {patents.map((patent, idx) => (
        <ListItem key={idx} disablePadding>
          <ListItemButton
            selected={selectedPatent?.PatentID === patent.PatentID}
            onClick={() => onSelectPatent(patent)}
            sx={{
              borderLeft: selectedPatent?.PatentID === patent.PatentID ? 4 : 0,
              borderColor: C.teal,
              transition: "all 0.2s",
              "&.Mui-selected": {
                bgcolor: C.sky,
                "&:hover": { bgcolor: "rgba(0,128,158,0.12)" },
              },
              "&:hover": { bgcolor: "rgba(0,128,158,0.04)" },
            }}
          >
            <Box sx={{ width: "100%", py: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar sx={{
                  width: 30, height: 30, mr: 1.5,
                  background: selectedPatent?.PatentID === patent.PatentID
                    ? GRAD_H
                    : "linear-gradient(135deg,#E2E8F0,#CBD5E0)",
                  color: selectedPatent?.PatentID === patent.PatentID ? "white" : "#4A5568",
                  fontSize: 12, fontWeight: 700,
                }}>
                  {idx + 1}
                </Avatar>
                {patent.relevance_score && (
                  <Chip size="small"
                    label={`${Math.round(patent.relevance_score * 10)}%`}
                    sx={{ height: 18, fontSize: 10, fontWeight: 600, bgcolor: C.sky, color: C.teal }} />
                )}
              </Box>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, mb: 0.5, color: C.navy, lineHeight: 1.4 }}>
                {patent.Title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <Link href={patent.Link} target="_blank" rel="noopener noreferrer"
                  sx={{ fontSize: 11, color: C.teal, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  {patent.PatentID}
                </Link>
                <OpenInNew sx={{ fontSize: 10, color: C.teal }} />
              </Box>
              <Typography variant="caption" sx={{
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden",
                fontSize: 11, color: C.muted, lineHeight: 1.4,
              }}>
                {patent.Snippet}
              </Typography>
            </Box>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default PatentListPanel;
