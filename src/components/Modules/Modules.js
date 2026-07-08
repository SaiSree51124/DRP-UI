import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import NewProjectModal from "../NewProjectModal";
import { AddOutlined,
  AccountTreeOutlined, FindInPageOutlined, StorageOutlined,
  BiotechOutlined, TrackChangesOutlined,
  ArticleOutlined, DatasetOutlined, LensOutlined,
} from "@mui/icons-material";

const TEAL = "#0ABFBC";
const DARK = "#0F172A";
const SUB  = "#64748B";
const FONT = "'Inter', sans-serif";

const modules = [
  {
    id: "TxKG-knowledge-graph", icon: AccountTreeOutlined, color: "#0ABFBC", bgColor: "#E6FAFA",
    name: "TxKG", tag: "Knowledge Graph",
    description: "Map disease-protein-pathway relationships to identify promising protein targets with context-aware graph intelligence and AI-driven confidence scores.",
    stats: [{ label: "NODES", value: "267K" }, { label: "EDGES", value: "2M+" }],
    lastUsed: "2h ago",
  },
  {
    id: "literature-mining", icon: FindInPageOutlined, color: "#7C3AED", bgColor: "#F3EFFE",
    name: "LitMineX", tag: "Literature Mining",
    description: "Mine evidence from scientifically relevant articles using MeSH-powered semantic search and GenAI-driven contextual understanding.",
    stats: [{ label: "RESEARCH ARTICLES", value: "36M+" }],
    lastUsed: "just now",
  },
  {
    id: "data-curation-engine", icon: StorageOutlined, color: "#059669", bgColor: "#ECFDF5",
    name: "CurateX", tag: "Drug Curation",
    description: "Surface validated drug compounds using AI-driven semantic search, with confidence-ranked profiles backed by trusted medical sources and PubMed evidence.",
    stats: [{ label: "COMPOUNDS CURATED", value: "34" }],
    lastUsed: "1d ago",
  },
  {
    id: "screening-suite", icon: BiotechOutlined, color: "#D97706", bgColor: "#FFFBEB",
    name: "ScreenSuite", tag: "Interaction Analysis",
    description: "Validate target-drug interactions with an end-to-end automated docking engine, profiling key interactions to prioritize top candidates.",
    stats: [{ label: "CANDIDATES SCORED", value: "14" }],
    lastUsed: "3d ago",
  },
  {
    id: "novelty-search-agent", icon: TrackChangesOutlined, color: "#8B5CF6", bgColor: "#F5F3FF",
    name: "NovSearch", tag: "Patent Intelligence",
    description: "Assess the novelty of the repurposing candidate-target combination as relevant prior art is retrieved and reasoned across using GenAI.",
    stats: [{ label: "BIOMARKERS FOUND", value: "89" }],
    lastUsed: "1w ago",
  },
];

const activity = [
  { text: "TxKG completed disease-gene mapping for 'Huntington's Disease'",        time: "45 MINS AGO",  Icon: AccountTreeOutlined },
  { text: "LitMineX generated a summary report for 12,000 oncology journals",     time: "3 HOURS AGO",  Icon: FindInPageOutlined  },
  { text: "CurateX manual review completed for Compound AF-203",                  time: "YESTERDAY",    Icon: StorageOutlined     },
  { text: "Screen Suite updated toxicity thresholds for Q1 clinical requirements",time: "2 DAYS AGO",   Icon: BiotechOutlined     },
];

const Modules = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Box sx={{ p: "32px", fontFamily: FONT, position: "relative", minHeight: "100%" }}>

      {/* Page header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: "20px" }}>
        <Box>
          <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: "24px", color: DARK }}>Research Modules</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, mt: "4px" }}>
            Run focused analyses with dedicated modules.
          </Typography>
        </Box>
        <Button variant="contained" disableElevation startIcon={<AddOutlined sx={{ fontSize: 15 }} />}
          onClick={() => setModalOpen(true)}
          sx={{ height: "36px", borderRadius: "8px", bgcolor: TEAL, color: "#fff", fontFamily: FONT, fontSize: "13px", fontWeight: 500, textTransform: "none", "&:hover": { bgcolor: "#09ADAB" } }}>
          New Project
        </Button>
      </Box>

      {/* Module cards grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", mb: "20px" }}>
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Box key={mod.id} sx={{ bgcolor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", p: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Icon + name */}
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: mod.bgColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon sx={{ fontSize: 20, color: mod.color }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: "15px", color: DARK }}>{mod.name}</Typography>
                    <Box sx={{ px: "6px", py: "2px", borderRadius: "4px", bgcolor: mod.bgColor, display: "inline-block", mt: "2px" }}>
                      <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 600, color: mod.color }}>{mod.tag}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Description */}
              <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, lineHeight: 1.65, flex: 1 }}>
                {mod.description}
              </Typography>

              {/* Stats */}
              <Box sx={{ display: "flex", gap: "20px" }}>
                {mod.stats.map(({ label, value }) => (
                  <Box key={label}>
                    <Typography sx={{ fontFamily: FONT, fontSize: "18px", fontWeight: 700, color: DARK }}>{value}</Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.8px" }}>{label}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Last used + Launch */}
              <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", pt: "12px", borderTop: "1px solid #F1F5F9" }}>
                <Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.8px" }}>LAST USED</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, mt: "2px" }}>{mod.lastUsed}</Typography>
                </Box>
                <Button variant="contained" disableElevation size="small"
                  onClick={() => navigate(`/dashboard/${mod.id}`)}
                  sx={{ borderRadius: "8px", bgcolor: TEAL, color: "#fff", fontFamily: FONT, fontSize: "12px", fontWeight: 500, textTransform: "none", px: "16px", py: "6px", "&:hover": { bgcolor: "#09ADAB" } }}>
                  Launch Module
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Recent Module Activity */}
      <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden" }}>
        <Box sx={{ px: "24px", py: "14px", borderBottom: "1px solid #F1F5F9" }}>
          <Typography sx={{ fontFamily: FONT, fontWeight: 600, fontSize: "16px", color: DARK }}>Recent Module Activity</Typography>
        </Box>
        <Box>
          {activity.map(({ text, time, Icon }, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: "14px", px: "24px", py: "12px", borderTop: i === 0 ? "none" : "1px solid #F8FAFC" }}>
              <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon sx={{ fontSize: 16, color: "#64748B" }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: DARK }}>{text}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: TEAL, mt: "3px", letterSpacing: "0.4px" }}>{time}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Genie FAB */}
      <Button
        variant="contained"
        disableElevation
        sx={{
          position: "fixed", bottom: "32px", right: "32px",
          width: "104px", height: "43px",
          borderRadius: "24px", bgcolor: "#0D1B2A",
          border: "1px solid rgba(10, 191, 188, 0.5)",
          boxShadow: "0px 8px 24px rgba(124, 58, 237, 0.302)",
          color: "#0ABFBC", fontFamily: FONT, fontSize: "16px",
          fontWeight: 700, lineHeight: "19px", textTransform: "none",
          whiteSpace: "nowrap",
          px: "20px", py: "12px", minWidth: "auto", zIndex: 2,
          "&:hover": { bgcolor: "#1A2C3D" },
        }}
      >
        ✦ Genie
      </Button>
    </Box>
  );
};

export default Modules;
