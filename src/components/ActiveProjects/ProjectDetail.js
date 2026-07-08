import React, { useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { Box, Button, Typography, LinearProgress, Chip } from "@mui/material";
import { AddOutlined, EditOutlined, CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";

const TEAL = "#0ABFBC";
const DARK = "#0F172A";
const SUB  = "#64748B";
const FONT = "'Inter', sans-serif";

const projectData = {
  "metformin-for-oncology": {
    name: "Metformin for Oncology", sub: "AMPK pathway modulation",
    status: "ACTIVE", phase: "Phase II", score: 94,
    leadResearcher: "Dr. Aria Aris", disease: "Pancreatic Cancer",
    stage: "Phase II", startDate: "Jan 12, 2025", targetCompletion: "Oct 24, 2025",
    priority: "HIGH PRIORITY",
    summary: "Metformin, traditionally a first-line medication for type 2 diabetes, is being investigated as a repurposed agent for pancreatic cancer. The primary mechanism of action involves the activation of the AMPK pathway, which suppresses the mTOR signaling cascade. This redirection of metabolic pathways has shown significant promise in inhibiting the rapid proliferation of KRAS-driven tumors, particularly in late-stage adenocarcinoma models.",
    hypothesis: "Activation of the liver kinase B1 (LKB1)/AMP-activated protein kinase (AMPK) axis serves as a metabolic checkpoint. By systemically lowering insulin levels and directly inhibiting mitochondrial complex I in tumor cells, Metformin creates an energy-deprived state that selectively triggers apoptosis in glycolytic-dependent pancreatic cancer cells.",
    hypothesisScore: 95.2,
    pipeline: [
      { label: "Knowledge\nGraph", done: true },
      { label: "Literature\nMining", done: true },
      { label: "Drug\nCuration", done: true },
      { label: "Screen\nScores", done: true },
      { label: "Biomarkers", done: false },
    ],
    metrics: { confidence: 94, papers: 440, compounds: 14, fda: "Strong" },
    activity: [
      { text: "Genie extracted 142 new target-compound associations", time: "2 hours ago" },
      { text: "Dr. Aris updated the Phase II protocol documentation", time: "6 hours ago" },
      { text: "Automated screening of KRAS variants completed", time: "Yesterday" },
      { text: "Project Metformin for Oncology: milestone hit", time: "2 days ago" },
    ],
  },
};

const defaultProject = {
  name: "Project Detail", sub: "Drug repurposing research", status: "ACTIVE", phase: "Phase II", score: 85,
  leadResearcher: "Dr. Priya", disease: "Oncology", stage: "Phase II",
  startDate: "Jan 2025", targetCompletion: "Oct 2025", priority: "HIGH PRIORITY",
  summary: "This drug repurposing project investigates the potential of existing compounds for new therapeutic indications using AI-driven analysis.",
  hypothesis: "Computational analysis suggests strong mechanistic alignment between the compound's known molecular targets and the disease pathway.",
  hypothesisScore: 88.0,
  pipeline: [
    { label: "Knowledge\nGraph", done: true },
    { label: "Literature\nMining", done: true },
    { label: "Drug\nCuration", done: false },
    { label: "Screen\nScores", done: false },
    { label: "Biomarkers", done: false },
  ],
  metrics: { confidence: 85, papers: 220, compounds: 8, fda: "Moderate" },
  activity: [
    { text: "Analysis pipeline completed.", time: "1 hour ago" },
    { text: "New literature sources indexed.", time: "3 hours ago" },
  ],
};

const tabs = ["Overview", "Literature", "Compounds", "Screen Scores", "Biomarkers"];

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const p = projectData[projectId] || defaultProject;

  const statusColors = {
    ACTIVE:   { bg: "#ECFDF5", color: "#10B981" },
    "ON HOLD":{ bg: "#F5F3FF", color: "#8B5CF6" },
    REVIEW:   { bg: "#FFF7ED", color: "#F59E0B" },
  };
  const sc = statusColors[p.status] || statusColors.ACTIVE;

  return (
    <Box sx={{ p: "28px 32px", fontFamily: FONT, minHeight: "100%" }}>

      {/* Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "16px" }}>
        <Typography
          onClick={() => navigate("/dashboard/active-projects")}
          sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, cursor: "pointer", "&:hover": { color: TEAL } }}>
          Active Projects
        </Typography>
        <Typography sx={{ color: "#CBD5E1", fontSize: "13px" }}>›</Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: DARK, fontWeight: 500 }}>{p.name}</Typography>
      </Box>

      {/* Page header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: "8px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: "24px", color: DARK }}>{p.name}</Typography>
          <Box sx={{ px: "8px", py: "3px", borderRadius: "4px", bgcolor: sc.bg }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 600, color: sc.color }}>{p.status}</Typography>
          </Box>
          <Box sx={{ px: "8px", py: "3px", borderRadius: "4px", bgcolor: "#F1F5F9" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 600, color: SUB }}>{p.phase}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button variant="outlined" startIcon={<EditOutlined sx={{ fontSize: 15 }} />}
            sx={{ height: "34px", borderRadius: "8px", borderColor: "#E2E8F0", color: DARK, fontFamily: FONT, fontSize: "13px", fontWeight: 500, textTransform: "none", "&:hover": { borderColor: "#CBD5E1", bgcolor: "#F8FAFC" } }}>
            Edit Project
          </Button>
          <Button variant="contained" disableElevation startIcon={<AddOutlined sx={{ fontSize: 15 }} />}
            sx={{ height: "34px", borderRadius: "8px", bgcolor: TEAL, color: "#fff", fontFamily: FONT, fontSize: "13px", fontWeight: 500, textTransform: "none", "&:hover": { bgcolor: "#09ADAB" } }}>
            New Project
          </Button>
        </Box>
      </Box>

      {/* Score bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "16px", mb: "24px" }}>
        <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB }}>Project Score</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Box sx={{ width: "180px", height: "6px", borderRadius: "3px", bgcolor: "#E2E8F0" }}>
            <Box sx={{ width: `${p.score}%`, height: "100%", borderRadius: "3px", bgcolor: TEAL }} />
          </Box>
          <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEAL }}>{p.score}%</Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ display: "flex", gap: "0px", borderBottom: "2px solid #E2E8F0", mb: "28px" }}>
        {tabs.map(tab => (
          <Box key={tab} onClick={() => setActiveTab(tab)}
            sx={{ px: "16px", py: "10px", cursor: "pointer", borderBottom: activeTab === tab ? `2px solid ${TEAL}` : "2px solid transparent", mb: "-2px" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? TEAL : SUB }}>
              {tab}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Content */}
      {activeTab === "Overview" && (
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>
          {/* Left */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Project Summary */}
            <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", p: "24px" }}>
              <Typography sx={{ fontFamily: FONT, fontWeight: 600, fontSize: "16px", color: DARK, mb: "12px" }}>Project Summary</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: SUB, lineHeight: 1.7 }}>{p.summary}</Typography>
            </Box>
            {/* Hypothesis */}
            <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", p: "24px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "12px" }}>
                <Typography sx={{ fontFamily: FONT, fontWeight: 600, fontSize: "16px", color: DARK }}>Repurposing Hypothesis</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: SUB }}>Confidence Score</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: TEAL }}>{p.hypothesisScore}%</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: SUB, lineHeight: 1.7 }}>{p.hypothesis}</Typography>
            </Box>
            {/* Pipeline */}
            <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", p: "24px" }}>
              <Typography sx={{ fontFamily: FONT, fontWeight: 600, fontSize: "16px", color: DARK, mb: "20px" }}>Pipeline Modules Completed</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "0px" }}>
                {p.pipeline.map((step, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", minWidth: "80px" }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: step.done ? TEAL : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {step.done
                          ? <CheckCircle sx={{ fontSize: 20, color: "#fff" }} />
                          : <RadioButtonUnchecked sx={{ fontSize: 20, color: "#94A3B8" }} />}
                      </Box>
                      <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: step.done ? DARK : "#94A3B8", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.3 }}>
                        {step.label}
                      </Typography>
                    </Box>
                    {i < p.pipeline.length - 1 && (
                      <Box sx={{ flex: 1, height: "2px", bgcolor: step.done ? TEAL : "#E2E8F0", mx: "4px", mb: "20px" }} />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right sidebar */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Project Details */}
            <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", p: "20px" }}>
              <Typography sx={{ fontFamily: FONT, fontWeight: 600, fontSize: "15px", color: DARK, mb: "16px" }}>Project Details</Typography>
              {[
                { label: "LEAD RESEARCHER",   value: p.leadResearcher, isAvatar: true },
                { label: "TARGET DISEASE",    value: p.disease },
                { label: "RESEARCH STAGE",    value: p.stage },
                { label: "START DATE",        value: p.startDate },
                { label: "TARGET COMPLETION", value: p.targetCompletion },
                { label: "PRIORITY",          value: p.priority, isPriority: true },
              ].map(({ label, value, isAvatar, isPriority }) => (
                <Box key={label} sx={{ mb: "12px" }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.8px", mb: "4px" }}>{label}</Typography>
                  {isAvatar ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Box component="img" src="/authbtn.png" alt={value} sx={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} />
                      <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: DARK }}>{value}</Typography>
                    </Box>
                  ) : isPriority ? (
                    <Box sx={{ display: "inline-flex", px: "8px", py: "3px", borderRadius: "4px", bgcolor: "#FFF7ED", border: "1px solid #FDE68A" }}>
                      <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 600, color: "#F59E0B" }}>{value}</Typography>
                    </Box>
                  ) : (
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: DARK }}>{value}</Typography>
                  )}
                </Box>
              ))}
            </Box>
            {/* Key Metrics */}
            <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", p: "20px" }}>
              <Typography sx={{ fontFamily: FONT, fontWeight: 600, fontSize: "15px", color: DARK, mb: "16px" }}>Key Metrics</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { label: "CONFIDENCE SCORE",  value: `${p.metrics.confidence}%`, color: TEAL },
                  { label: "PAPERS REVIEWED",   value: String(p.metrics.papers), color: DARK },
                  { label: "CANDIDATE COMPOUNDS",value: String(p.metrics.compounds), color: DARK },
                  { label: "FDA EVIDENCE",       value: p.metrics.fda, color: TEAL },
                ].map(({ label, value, color }) => (
                  <Box key={label} sx={{ p: "12px", bgcolor: "#F8FAFC", borderRadius: "8px" }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.8px", mb: "4px" }}>{label}</Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: "18px", fontWeight: 700, color }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            {/* Recent Activity */}
            <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", p: "20px" }}>
              <Typography sx={{ fontFamily: FONT, fontWeight: 600, fontSize: "15px", color: DARK, mb: "12px" }}>Recent Activity</Typography>
              {p.activity.map(({ text, time }, i) => (
                <Box key={i} sx={{ display: "flex", gap: "10px", mb: "12px" }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: "6px", bgcolor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "2px", bgcolor: "#94A3B8" }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: DARK, lineHeight: 1.5 }}>{text}</Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: "#94A3B8", mt: "2px" }}>{time}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Placeholder tabs */}
      {activeTab !== "Overview" && (
        <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", p: "48px", textAlign: "center" }}>
          <Typography sx={{ fontFamily: FONT, fontSize: "15px", color: "#94A3B8" }}>{activeTab} data will appear here.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProjectDetail;
