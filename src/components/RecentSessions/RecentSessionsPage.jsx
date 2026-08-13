import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import {
  SearchOutlined, ChevronLeftOutlined, ChevronRightOutlined,
} from "@mui/icons-material";

const FONT      = "'Inter', sans-serif";
const TEAL      = "#0ABFBC";
const MUTED     = "#94A3B8";
const BORDER    = "#E2E8F0";
const TEXT_DARK = "#0F172A";
const BG        = "#F8FAFC";

const MODULE_TAGS = ["All", "TxKG", "LitMineX", "ScreenSuite", "CurateX", "NovSearch"];

const MODULE_COLORS = {
  TxKG:        { color: TEAL,      bg: "#E6FAFA" },
  LitMineX:    { color: "#7C3AED", bg: "#EDE9FE" },
  ScreenSuite: { color: "#DB2777", bg: "#FDE7F3" },
  CurateX:     { color: "#D97706", bg: "#FEF3C7" },
  NovSearch:   { color: "#16A34A", bg: "#DCFCE7" },
};

const STATUS_COLORS = {
  Completed:     "#16A34A",
  "In Progress": "#D97706",
  Saved:         "#4338CA",
  Good:          "#16A34A",
};

const SESSIONS = [
  { module: "TxKG",        status: "Completed",   title: "Type 2 Diabetes",                        subtitle: "10 targets identified",                                              time: "16 min ago"  },
  { module: "LitMineX",    status: "In Progress", title: "JAK2 \u2013 Thrombocytosis",              subtitle: "Scanning 3,300 articles...",                                         time: "2 hours ago" },
  { module: "ScreenSuite", status: "Saved",       title: "JAK2 \u2013 Imatinib Binding",            subtitle: "Virtual screening complete",                                         time: "Yesterday"   },
  { module: "CurateX",     status: "Completed",   title: "BRAF \u2013 Melanoma Resistance",         subtitle: "Curation complete \u2022 8 candidates shortlisted",                  time: "2 days ago"  },
  { module: "NovSearch",   status: "Good",        title: "HER2 \u2013 Breast Cancer Repurposing",   subtitle: "Novelty assessment complete",                                        time: "3 days ago"  },
  { module: "TxKG",        status: "Completed",   title: "PPARG \u2013 Metabolic Syndrome",         subtitle: "Knowledge graph complete \u2022 75 drug interactions mapped",        time: "4 days ago"  },
  { module: "LitMineX",    status: "Completed",   title: "CDK4/6 \u2013 Triple Negative Breast Cancer", subtitle: "Literature mining complete \u2022 842 articles analysed",      time: "5 days ago"  },
];

const RecentSessionsPage = () => {
  const [search, setSearch]             = useState("");
  const [activeModule, setActiveModule] = useState("All");
  const [page, setPage]                 = useState(1);

  const filtered = SESSIONS.filter(s =>
    (activeModule === "All" || s.module === activeModule) &&
    (!search || s.title.toLowerCase().includes(search.toLowerCase()) || s.subtitle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", px: "32px", pt: "32px", pb: 0, gap: "24px", boxSizing: "border-box", bgcolor: BG }}>

      {/* Page header */}
      <Box sx={{ flexShrink: 0 }}>
        <Typography sx={{ fontFamily: FONT, fontSize: "24px", fontWeight: 700, color: TEXT_DARK, lineHeight: 1, mb: "6px" }}>
          Recent Research Sessions
        </Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: "#475569" }}>
          Resume previous research threads or review completed analyses.
        </Typography>
      </Box>

      {/* Main card */}
      <Box sx={{
        flex: 1, minHeight: 0, mb: "32px",
        bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "16px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.0196)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>

        {/* Search + filter bar */}
        <Box sx={{ px: "24px", py: "16px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
          {/* Search */}
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", px: "12px", height: "40px", bgcolor: BG, border: `1px solid ${BORDER}`, borderRadius: "8px" }}>
            <SearchOutlined sx={{ fontSize: 16, color: MUTED, flexShrink: 0 }} />
            <TextField variant="standard" placeholder="Search sessions by target, disease, or module..." value={search} onChange={e => setSearch(e.target.value)} fullWidth
              InputProps={{ disableUnderline: true }}
              sx={{ "& input": { fontFamily: FONT, fontSize: "13px", color: TEXT_DARK, py: 0 }, "& input::placeholder": { color: MUTED, opacity: 1 } }} />
          </Box>
          {/* Module chips */}
          <Box sx={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            {MODULE_TAGS.map(tag => (
              <Box key={tag} onClick={() => setActiveModule(tag)}
                sx={{
                  px: "12px", height: "32px", borderRadius: "6px", cursor: "pointer",
                  display: "flex", alignItems: "center",
                  bgcolor: activeModule === tag ? TEAL : "#fff",
                  border: `1px solid ${activeModule === tag ? TEAL : BORDER}`,
                  "&:hover": { bgcolor: activeModule === tag ? "#089B98" : BG },
                }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: activeModule === tag ? "#fff" : "#475569", lineHeight: 1 }}>{tag}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Session rows */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {filtered.map((s, i) => {
            const mc = MODULE_COLORS[s.module] || { color: MUTED, bg: BG };
            const sc = STATUS_COLORS[s.status] || MUTED;
            const isFirst = i === 0 && page === 1 && activeModule === "All" && !search;
            return (
              <Box key={i} sx={{
                display: "flex", alignItems: "center", px: "24px", py: "18px",
                borderBottom: `1px solid ${BORDER}`, cursor: "pointer",
                borderLeft: isFirst ? `3px solid ${TEAL}` : "3px solid transparent",
                "&:hover": { bgcolor: BG },
              }}>
                {/* Module badge + status */}
                <Box sx={{ width: "160px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                  <Box sx={{ px: "8px", py: "3px", borderRadius: "4px", bgcolor: mc.bg, display: "inline-flex", width: "fit-content" }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: mc.color, letterSpacing: "0.3px" }}>{s.module}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: sc, flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 500, color: sc }}>{s.status}</Typography>
                  </Box>
                </Box>
                {/* Title + subtitle */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: TEXT_DARK, lineHeight: 1.3 }}>{s.title}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 400, color: MUTED, mt: "3px" }}>{s.subtitle}</Typography>
                </Box>
                {/* Time */}
                <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: MUTED, flexShrink: 0, pl: "16px" }}>{s.time}</Typography>
              </Box>
            );
          })}
        </Box>

        {/* Pagination */}
        <Box sx={{ px: "24px", py: "14px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <Box component="button" onClick={() => setPage(p => Math.max(1, p - 1))}
            sx={{ display: "flex", alignItems: "center", gap: "4px", px: "12px", py: "6px", border: `1px solid ${BORDER}`, borderRadius: "6px", bgcolor: "#fff", cursor: "pointer", fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: "#475569", "&:hover": { bgcolor: BG } }}>
            <ChevronLeftOutlined sx={{ fontSize: 16 }} /> Previous
          </Box>
          <Box sx={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3].map(n => (
              <Box key={n} onClick={() => setPage(n)}
                sx={{
                  width: 32, height: 32, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  bgcolor: page === n ? TEAL : "#fff",
                  border: `1px solid ${page === n ? TEAL : BORDER}`,
                  "&:hover": { bgcolor: page === n ? "#089B98" : BG },
                }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: page === n ? "#fff" : "#475569" }}>{n}</Typography>
              </Box>
            ))}
          </Box>
          <Box component="button" onClick={() => setPage(p => Math.min(3, p + 1))}
            sx={{ display: "flex", alignItems: "center", gap: "4px", px: "12px", py: "6px", border: `1px solid ${BORDER}`, borderRadius: "6px", bgcolor: "#fff", cursor: "pointer", fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: "#475569", "&:hover": { bgcolor: BG } }}>
            Next <ChevronRightOutlined sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RecentSessionsPage;