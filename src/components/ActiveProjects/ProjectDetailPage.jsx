import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField } from "@mui/material";
import {
  CheckCircle, RadioButtonUnchecked, EditOutlined,
  AutoAwesomeOutlined, CheckCircleOutline, AccessTimeOutlined,
  SearchOutlined, KeyboardArrowDownOutlined,
} from "@mui/icons-material";

const FONT      = "'Inter', sans-serif";
const TEAL      = "#0ABFBC";
const MUTED     = "#94A3B8";
const BORDER    = "#E2E8F0";
const TEXT_DARK = "#0F172A";
const BG        = "#F8FAFC";

const Card = ({ children, sx = {} }) => (
  <Box sx={{ bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "16px", overflow: "hidden", ...sx }}>
    {children}
  </Box>
);

const CardHeader = ({ title, right, subtitle }) => (
  <Box sx={{ px: "24px", pt: "24px", pb: subtitle ? "8px" : "24px", borderBottom: subtitle ? "none" : `1px solid ${BORDER}`, minHeight: "67px", boxSizing: "border-box" }}>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Typography sx={{ fontFamily: FONT, fontSize: "16px", fontWeight: 600, color: TEXT_DARK }}>{title}</Typography>
      {right}
    </Box>
    {subtitle && (
      <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 400, color: MUTED, mt: "4px", pb: "20px", borderBottom: `1px solid ${BORDER}` }}>{subtitle}</Typography>
    )}
  </Box>
);

const PipelineStep = ({ label, done, first, last }) => (
  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: "8px" }}>
      <Box sx={{ flex: 1, height: "2px", bgcolor: done ? TEAL : BORDER, visibility: first ? "hidden" : "visible" }} />
      {done ? <CheckCircle sx={{ fontSize: 22, color: TEAL, flexShrink: 0 }} /> : <RadioButtonUnchecked sx={{ fontSize: 22, color: BORDER, flexShrink: 0 }} />}
      <Box sx={{ flex: 1, height: "2px", bgcolor: BORDER, visibility: last ? "hidden" : "visible" }} />
    </Box>
    <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 500, color: done ? TEXT_DARK : MUTED, textAlign: "center", lineHeight: 1.4 }}>{label}</Typography>
  </Box>
);

const DetailField = ({ label, children }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</Typography>
    {children}
  </Box>
);

const ActivityItem = ({ IconComp, text, time }) => (
  <Box sx={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
    <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#E6FAFA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <IconComp sx={{ fontSize: 15, color: TEAL }} />
    </Box>
    <Box>
      <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: TEXT_DARK, lineHeight: 1.4 }}>{text}</Typography>
      <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: MUTED, mt: "2px" }}>{time}</Typography>
    </Box>
  </Box>
);

const FilterChip = ({ label, value }) => (
  <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", height: "44px", bgcolor: BG, border: `1px solid ${BORDER}`, borderRadius: "12px", px: "12px", cursor: "pointer" }}>
    <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: "#475569", lineHeight: 1 }}>{label}</Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px", px: "10px", py: "6px", bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "999px" }}>
      <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 400, color: TEXT_DARK, lineHeight: 1 }}>{value}</Typography>
      <KeyboardArrowDownOutlined sx={{ fontSize: 14, color: MUTED, flexShrink: 0 }} />
    </Box>
  </Box>
);

const RelevanceBadge = ({ level }) => {
  const meta = level === "HIGH" ? { color: "#16A34A", bg: "#DCFCE7" } : { color: "#B45309", bg: "#FEF3C7" };
  return (
    <Box sx={{ px: "8px", py: "3px", borderRadius: "4px", bgcolor: meta.bg, flexShrink: 0 }}>
      <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: meta.color, letterSpacing: "0.4px" }}>{level}</Typography>
    </Box>
  );
};

/* ── Compound status chip ─────────────────────────────────────────────────── */
const CompoundStatus = ({ status }) => {
  const meta =
    status === "PROMISING"    ? { color: "#16A34A", bg: "#DCFCE7" } :
    status === "APPROVED"     ? { color: "#16A34A", bg: "#DCFCE7" } :
    status === "REJECTED"     ? { color: "#DC2626", bg: "#FEE2E2" } :
    status === "IN REVIEW"    ? { color: "#92400E", bg: "#FEF9C3" } :
    status === "UNDER REVIEW" ? { color: "#B45309", bg: "#FEF3C7" } :
                                { color: MUTED,      bg: "#F1F5F9" };
  return (
    <Box sx={{ px: "8px", py: "3px", borderRadius: "4px", bgcolor: meta.bg, display: "inline-flex" }}>
      <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: meta.color, letterSpacing: "0.4px" }}>{status}</Typography>
    </Box>
  );
};

/* ── Strength color ───────────────────────────────────────────────────────── */
const strengthColor = (s) => s === "Strong" ? TEXT_DARK : s === "Moderate" ? "#475569" : MUTED;

/* ── Novelty status badge ─────────────────────────────────────────────────── */
const NoveltyStatus = ({ status }) => {
  const meta =
    status === "High"    ? { color: "#16A34A", bg: "#DCFCE7" } :
    status === "Extreme" ? { color: "#DC2626", bg: "#FEE2E2" } :
    status === "-"       ? { color: MUTED,      bg: "#F1F5F9" } :
                           { color: "#B45309", bg: "#FEF3C7" };
  return (
    <Box sx={{ px: "8px", py: "3px", borderRadius: "4px", bgcolor: meta.bg, display: "inline-flex" }}>
      <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: meta.color }}>{status}</Typography>
    </Box>
  );
};

/* ─────────────────────────  PROJECTS DATA  ──────────────────────────────── */
const PROJECTS = {
  "type-2-diabetes": {
    name: "Type 2 Diabetes Drug Repurposing", sub: "Insulin signaling pathway modulation", status: "ACTIVE",
    leadResearcher: "Dr. Priya", leadRole: "Chief Researcher", disease: "Type 2 Diabetes",
    startDate: "Feb 18, 2026", targetCompletion: "Aug 30, 2026", priority: "HIGH PRIORITY",
    pipeline: [
      { label: "TxKG", done: true }, { label: "LitMineX", done: true },
      { label: "CurateX", done: true }, { label: "ScreenSuite", done: true }, { label: "NovSearch", done: true },
    ],
    summary: "This repurposing project investigates PPAR and DPP4 as therapeutic targets for Type 2 Diabetes, leveraging knowledge graph analysis and literature mining to identify novel drug candidates. The project explores insulin signaling pathway modulation through multiple molecular targets.",
    hypothesis: "The hypothesis proposes that modulating PPARG/DPP4 signaling will improve insulin sensitivity and glucose metabolism, offering new treatment pathways for Type 2 Diabetes management.",
    hypothesisScore: 82.2,
    aiInsight: "The predicted therapeutic targets for Type 2 Diabetes suggest modulation of insulin signaling pathways, particularly those regulated by PPARG and DPP4, with strong evidence from knowledge graph analysis.",
    targets: [
      { name: "PPARG receptor", score: 89.00 },
      { name: "DPP4",           score: 84.00 },
      { name: "JAK2",           score: 29.00 },
    ],
    sourcesCount: 13,
    publications: [
      { title: "PPARG agonists and DPP4 inhibitors in insulin resistance pathway glucose control", relevance: "HIGH", source: "Diabetes Care", year: 2024, authors: "Zhou et al.", abstract: "This study links PPARG to enhanced DPP4 inhibitory pathway and improved insulin sensitivity and glucose management." },
      { title: "DPP4 inhibitors as therapeutic targets in Type 2 Diabetes management", relevance: "HIGH", source: "NEJM", year: 2023, authors: "Singh et al.", abstract: "Targeting the DPP4 pathway may offer a more selective approach to managing glucose levels in T2D patients." },
      { title: "AMPK regulation of megakaryopoiesis and insulin production", relevance: "HIGH", source: "Cell Reports", year: 2024, authors: "Kim et al.", abstract: "AMPK activation modulates energy metabolism in pancreatic beta cells, influencing insulin output and glucose regulation." },
      { title: "Novel small molecule inhibitors of PPARG receptor signaling", relevance: "HIGH", source: "Nature Medicine", year: 2023, authors: "Patel et al.", abstract: "Small molecule inhibitors targeting PPARG receptor show promise in preclinical Type 2 Diabetes models." },
      { title: "Platelet count reduction through JAK2 pathway modulation: a systematic review", relevance: "HIGH", source: "Lancet", year: 2024, authors: "Lee et al.", abstract: "Systematic review of JAK2 pathway modulation strategies for metabolic disease treatment options." },
      { title: "PPARG receptor signaling in adipocyte differentiation and metabolism", relevance: "HIGH", source: "Blood", year: 2024, authors: "Wang et al.", abstract: "PPARG receptor signaling drives adipocyte maturation and glucose regulation in Type 2 Diabetes." },
    ],
    litSummary: { papersReviewed: 328, highlyRelevant: 43, directlyCited: 13 },
    compounds: [
      { name: "Sitagliptin",   moa: "DPP-4 inhibitor",               status: "IN REVIEW",    score: 92, source: "Approve"    },
      { name: "Rosiglitazone", moa: "PPAR gamma agonist",            status: "APPROVED",     score: 70, source: "Approve"    },
      { name: "Fasitimab",     moa: "PPAR alpha/delta agonist",      status: "UNDER REVIEW", score: 90, source: "Approve"    },
      { name: "Etomirsitatib", moa: "AMPK activator",                status: "UNDER REVIEW", score: 91, source: "Approve"    },
      { name: "Acamprosate",   moa: "Glutamate modulator",           status: "UNDER REVIEW", score: 80, source: "Disapprove" },
      { name: "Mormetinib",    moa: "JAK1/JAK2 inhibitor",           status: "UNDER REVIEW", score: 91, source: "Approve"    },
      { name: "Cefadroxil",    moa: "Cell wall synthesis inhibitor", status: "REJECTED",     score: 79, source: "Continue"   },
      { name: "Lenvatinib",    moa: "AntiAngio inhibitor",           status: "REJECTED",     score: 0,  source: "Continue"   },
    ],
    curateXAnalysis: { totalScreened: 142, awaitingReviewPct: "71%", approvalEfficiency: "-" },
    screenScores: {
      overallScore: 87.4, label: "STRONG",
      description: "Composite score across selectivity, docking, ADMET, and safety profiles.",
      interactions: [
        { title: "JAK2 \u2013 Imatinib Binding Interactions", rows: [
          { type: "Hydrogen Bond", residue: "LYS631", distance: "2.3", strength: "Strong"   },
          { type: "Hydrogen Bond", residue: "ASP810", distance: "3.1", strength: "Moderate" },
          { type: "Hydrogen Bond", residue: "GLU864", distance: "2.7", strength: "Moderate" },
          { type: "Hydrophobic",   residue: "MET769", distance: "3.4", strength: "Moderate" },
          { type: "\u03c0-Stacking", residue: "PHE895", distance: "4.2", strength: "Moderate" },
        ]},
        { title: "PPARG \u2013 Metformin Binding Interactions", rows: [
          { type: "Hydrogen Bond", residue: "MCY750", distance: "2.9", strength: "Strong"   },
          { type: "Hydrogen Bond", residue: "TH8034", distance: "3.4", strength: "Moderate" },
          { type: "Hydrophobic",   residue: "LEU718", distance: "3.5", strength: "Strong"   },
          { type: "Salt Bridge",   residue: "ASP655", distance: "3.8", strength: "Moderate" },
          { type: "\u03c0-Stacking", residue: "PHE723", distance: "4.0", strength: "Weak"     },
        ]},
      ],
      topCompounds: [
        { name: "Rosiglitazone", score: 92.4 },
        { name: "Fasitimab",     score: 86.3 },
        { name: "Sitagliptin",   score: 83.7 },
      ],
    },
    novSearch: {
      subtitle: "NovSearch-generated novelty analysis for identified drug candidates.",
      details: [
        { criterion: "Structural Novelty",       score: "82/100", status: "High",    notes: "Novel scaffold not in existing drugs"    },
        { criterion: "Target Selectivity",       score: "15/50",  status: "Extreme", notes: "Good JAK2 selectivity over JAK1"          },
        { criterion: "Mechanism Novelty",        score: "80/100", status: "High",    notes: "Unique allosteric binding mode"            },
        { criterion: "Patent Landscape",         score: "11/50",  status: "-",       notes: "Freedom to operate is limited"             },
        { criterion: "Literature Prevalence",    score: "90/100", status: "-",       notes: "Extensive prior art identified"            },
        { criterion: "Clinical Differentiation", score: "99/100", status: "High",    notes: "Novel combination portfolio"               },
      ],
      overall: { novelty: "70/90", biomarkerCombinations: 4, patientsAnalyzed: 160 },
    },
    activity: [
      { text: "AI insights saved from TxKG analysis.",                    time: "2 hours ago", Icon: AutoAwesomeOutlined },
      { text: "Target prediction completed for Type 2 Diabetes.",         time: "5 hours ago", Icon: CheckCircleOutline  },
      { text: "Insulin signaling pathway analysis initiated.",            time: "Yesterday",   Icon: AccessTimeOutlined  },
      { text: "Project 'Type 2 Diabetes Drug Repurposing' initialized.", time: "3 days ago",  Icon: AutoAwesomeOutlined },
    ],
  },
  "thrombopoietin-receptor-study": {
    name: "Thrombopoietin Receptor Study", sub: "JAK2/TPO pathway modulation", status: "ACTIVE",
    leadResearcher: "Dr. Priya", leadRole: "Chief Researcher", disease: "Thrombocytosis",
    startDate: "Feb 18, 2025", targetCompletion: "Aug 30, 2026", priority: "HIGH PRIORITY",
    pipeline: [
      { label: "TxKG", done: true }, { label: "LitMineX", done: false },
      { label: "CurateX", done: false }, { label: "ScreenSuite", done: false }, { label: "NovSearch", done: false },
    ],
    summary: "This repurposing project investigates thrombopoietin receptor as a therapeutic target for Thrombocytosis. By modulating the JAK2 pathway downstream of thrombopoietin signaling, the goal is to reduce elevated platelet production. Preliminary evidence suggests a connection between AMPK pathway regulation and the energy state of platelet-producing megakaryocytes, offering a secondary axis for investigation.",
    hypothesis: "The hypothesis proposes that targeting thrombopoietin receptor signaling will mitigate thrombocytosis by dampening the downstream JAK2/STAT cascade. This modulation is predicted to decrease platelet production without broadly suppressing hematopoiesis, providing a more targeted therapeutic window for patients with elevated platelet counts.",
    hypothesisScore: 89.2,
    aiInsight: "The predicted therapeutic targets for Thrombocytosis suggest a potential mechanism of action involving the modulation of thrombopoietin signaling pathways, particularly those involving the thrombopoietin and its receptor. The involvement of JAK2 suggests that inhibiting this pathway may help reduce elevated platelet production.",
    targets: [
      { name: "Thrombopoietin receptor", score: 89.00 },
      { name: "Tyrosine protein kinase JAK2", score: 84.00 },
      { name: "Thrombospondin", score: 38.00 },
    ],
    sourcesCount: 12,
    publications: [
      { title: "JAK2 V617F mutation and thrombopoietin receptor signaling in myeloproliferative neoplasms", relevance: "HIGH", source: "Blood", year: 2024, authors: "Smith et al.", abstract: "This study links JAK2 V617F to enhanced thrombopoietin receptor signaling and increased platelet production." },
      { title: "Thrombopoietin pathway as therapeutic target in essential thrombocythemia", relevance: "HIGH", source: "NEJM", year: 2023, authors: "Patel et al.", abstract: "Targeting the thrombopoietin pathway may offer a more selective approach to reducing platelet counts." },
      { title: "AMPK regulation of megakaryopoiesis and platelet production", relevance: "MEDIUM", source: "Cell Reports", year: 2024, authors: "Chen et al.", abstract: "AMPK activation modulates energy metabolism in megakaryocytes, influencing platelet output." },
      { title: "Novel small molecule inhibitors of TPO receptor signaling", relevance: "HIGH", source: "Nature Medicine", year: 2023, authors: "Kim et al.", abstract: "Small molecule inhibitors targeting TPO receptor signaling show promise in preclinical models." },
      { title: "Platelet count reduction through JAK2 pathway modulation: a systematic review", relevance: "MEDIUM", source: "Lancet Haematology", year: 2024, authors: "Lee et al.", abstract: "Systematic review of JAK2 pathway modulation strategies for reducing platelet counts in thrombocytosis." },
      { title: "Thrombopoietin receptor signaling in megakaryocyte development and thrombocytosis", relevance: "HIGH", source: "Blood", year: 2023, authors: "Wang et al.", abstract: "Thrombopoietin receptor signaling drives megakaryocyte maturation and platelet production." },
    ],
    litSummary: { papersReviewed: 320, highlyRelevant: 48, directlyCited: 12 },
    compounds: [
      { name: "Ruxolitinib",  moa: "JAK1/JAK2 inhibitor",          status: "PROMISING",    score: 92, source: "PubMed"   },
      { name: "Fedratinib",   moa: "JAK2 selective inhibitor",      status: "PROMISING",    score: 87, source: "Medline"  },
      { name: "Pacritinib",   moa: "JAK2/FLT3 inhibitor",          status: "UNDER REVIEW", score: 84, source: "DrugBank" },
      { name: "Eltrombopag",  moa: "TPO receptor agonist",          status: "UNDER REVIEW", score: 78, source: "PubMed"   },
      { name: "Anagrelide",   moa: "PDE3 inhibitor",                status: "UNDER REVIEW", score: 76, source: "Drug.com" },
      { name: "Momelotinib",  moa: "JAK1/JAK2/ACVR1 inhibitor",    status: "UNDER REVIEW", score: 73, source: "Medline"  },
      { name: "Gandotinib",   moa: "JAK2 inhibitor",                status: "UNDER REVIEW", score: 71, source: "PubMed"   },
      { name: "Lestaurtinib", moa: "Multi-kinase inhibitor",        status: "REJECTED",     score: 68, source: "DrugBank" },
    ],
    curateXAnalysis: { totalScreened: 142, passedFilters: 8, avgBinding: 78.8 },
    screenScores: {
      overallScore: 87.4, label: "STRONG",
      description: "Composite score across selectivity, binding, ADMET, and safety profiles.",
      interactions: [
        { title: "JAK2 – Imatinib Binding Interactions", rows: [
          { type: "Hydrogen Bond", residue: "GLU930", distance: "2.8", strength: "Strong"   },
          { type: "Hydrogen Bond", residue: "ASP904", distance: "3.1", strength: "Moderate" },
          { type: "Hydrophobic",   residue: "LEU935", distance: "3.6", strength: "Strong"   },
          { type: "Hydrophobic",   residue: "VAL963", distance: "3.9", strength: "Moderate" },
          { type: "\u03c0-Stacking", residue: "PHE995", distance: "4.2", strength: "Moderate" },
        ]},
        { title: "Thrombopoietin – Gefitinib Binding Interactions", rows: [
          { type: "Hydrogen Bond", residue: "MET793", distance: "2.9", strength: "Strong"   },
          { type: "Hydrogen Bond", residue: "THR854", distance: "3.2", strength: "Moderate" },
          { type: "Hydrophobic",   residue: "LEU718", distance: "3.5", strength: "Strong"   },
          { type: "Salt Bridge",   residue: "ASP655", distance: "3.8", strength: "Moderate" },
          { type: "\u03c0-Stacking", residue: "PHE723", distance: "4.0", strength: "Weak"     },
        ]},
      ],
      topCompounds: [
        { name: "Ruxolitinib", score: 92.4 },
        { name: "Fedratinib",  score: 88.1 },
        { name: "Pacritinib",  score: 85.7 },
      ],
    },
    novSearch: {
      subtitle: "NovSearch-generated novelty analysis for identified drug candidates.",
      details: [
        { criterion: "Structural Novelty",       score: "92/100", status: "High",     notes: "Novel scaffold not in existing drugs"    },
        { criterion: "Target Selectivity",       score: "78/100", status: "Moderate", notes: "Good JAK2 selectivity over JAK1"          },
        { criterion: "Mechanism Novelty",        score: "25/100", status: "High",     notes: "Unique allosteric binding mode"            },
        { criterion: "Patent Landscape",         score: "73/100", status: "Moderate", notes: "Freedom to operate confirmed"              },
        { criterion: "Literature Precedent",     score: "68/100", status: "Moderate", notes: "Limited prior art identified"              },
        { criterion: "Clinical Differentiation", score: "88/100", status: "High",     notes: "Novel combination potential"               },
      ],
      overall: { novelty: "79/100", biomarkerCombinations: 4, patientsAnalyzed: 156 },
    },
    activity: [
      { text: "AI insights saved from TxKG analysis.",                time: "2 hours ago", Icon: AutoAwesomeOutlined  },
      { text: "Target prediction completed for Thrombocytosis.",      time: "5 hours ago", Icon: CheckCircleOutline   },
      { text: "JAK2 pathway analysis initiated.",                     time: "Yesterday",   Icon: AccessTimeOutlined   },
      { text: "Project 'Thrombopoietin Receptor Study' initialized.", time: "3 days ago",  Icon: AutoAwesomeOutlined  },
    ],
  },
  "metformin-for-oncology": {
    name: "Metformin for Oncology", sub: "AMPK pathway modulation", status: "ACTIVE",
    leadResearcher: "Dr. Priya", leadRole: "Chief Researcher", disease: "Pancreatic Cancer",
    startDate: "Jan 12, 2025", targetCompletion: "Oct 24, 2025", priority: "HIGH PRIORITY",
    pipeline: [
      { label: "TxKG", done: true }, { label: "LitMineX", done: true },
      { label: "CurateX", done: true }, { label: "ScreenSuite", done: true }, { label: "NovSearch", done: false },
    ],
    summary: "Metformin, traditionally a first-line medication for type 2 diabetes, is being investigated as a repurposed agent for pancreatic cancer. The primary mechanism of action involves activation of the AMPK pathway, which suppresses the mTOR signaling cascade.",
    hypothesis: "Activation of the LKB1/AMPK axis serves as a metabolic checkpoint. By systemically lowering insulin levels and directly inhibiting mitochondrial complex I, Metformin creates an energy-deprived state that selectively triggers apoptosis in glycolytic-dependent pancreatic cancer cells.",
    hypothesisScore: 95.2,
    aiInsight: "The predicted therapeutic targets suggest Metformin acts through multiple complementary pathways affecting tumor cell metabolism and proliferation in pancreatic adenocarcinoma.",
    targets: [
      { name: "AMP-activated protein kinase",  score: 95.00 },
      { name: "mTOR complex 1",               score: 88.00 },
      { name: "Insulin receptor substrate 1", score: 72.00 },
    ],
    sourcesCount: 18,
    publications: [
      { title: "Metformin and AMPK activation in pancreatic cancer cells", relevance: "HIGH", source: "Cancer Cell", year: 2024, authors: "Zhang et al.", abstract: "AMPK activation by Metformin suppresses mTOR-driven tumor proliferation in pancreatic cancer models." },
      { title: "LKB1-AMPK axis as a metabolic checkpoint in PDAC", relevance: "HIGH", source: "Cell Metabolism", year: 2023, authors: "Park et al.", abstract: "The LKB1/AMPK pathway provides a targetable metabolic vulnerability in KRAS-driven pancreatic cancer." },
    ],
    litSummary: { papersReviewed: 440, highlyRelevant: 62, directlyCited: 18 },
    compounds: [
      { name: "Metformin",      moa: "AMPK activator",              status: "PROMISING",    score: 95, source: "PubMed"   },
      { name: "Phenformin",     moa: "Complex I inhibitor",         status: "PROMISING",    score: 88, source: "Medline"  },
      { name: "Rapamycin",      moa: "mTOR inhibitor",              status: "UNDER REVIEW", score: 82, source: "DrugBank" },
      { name: "Everolimus",     moa: "mTORC1 inhibitor",            status: "UNDER REVIEW", score: 79, source: "PubMed"   },
      { name: "IACS-010759",    moa: "Complex I inhibitor",         status: "UNDER REVIEW", score: 74, source: "Drug.com" },
    ],
    curateXAnalysis: { totalScreened: 198, passedFilters: 5, avgBinding: 82.1 },
    screenScores: {
      overallScore: 94.2, label: "STRONG",
      description: "Composite score across selectivity, binding, ADMET, and safety profiles.",
      interactions: [
        { title: "AMPK – Metformin Binding Interactions", rows: [
          { type: "Hydrogen Bond", residue: "LYS45",  distance: "2.7", strength: "Strong"   },
          { type: "Hydrogen Bond", residue: "ASP141", distance: "3.0", strength: "Strong"   },
          { type: "Hydrophobic",   residue: "LEU198", distance: "3.5", strength: "Moderate" },
          { type: "Salt Bridge",   residue: "GLU144", distance: "3.7", strength: "Strong"   },
          { type: "\u03c0-Stacking", residue: "PHE201", distance: "4.1", strength: "Moderate" },
        ]},
      ],
      topCompounds: [
        { name: "Metformin",  score: 95.0 },
        { name: "Phenformin", score: 88.3 },
        { name: "Rapamycin",  score: 82.1 },
      ],
    },
    novSearch: {
      subtitle: "NovSearch-generated novelty analysis for identified drug candidates.",
      details: [
        { criterion: "Structural Novelty",       score: "88/100", status: "High",     notes: "Novel biguanide scaffold applications" },
        { criterion: "Target Selectivity",       score: "82/100", status: "High",     notes: "High AMPK vs off-target selectivity"   },
        { criterion: "Mechanism Novelty",        score: "79/100", status: "Moderate", notes: "Known mechanism, novel tumor context"  },
        { criterion: "Patent Landscape",         score: "71/100", status: "Moderate", notes: "Mixed freedom to operate"              },
        { criterion: "Literature Precedent",     score: "95/100", status: "High",     notes: "Strong preclinical evidence base"      },
        { criterion: "Clinical Differentiation", score: "84/100", status: "High",     notes: "Strong combination potential"          },
      ],
      overall: { novelty: "83/100", biomarkerCombinations: 6, patientsAnalyzed: 214 },
    },
    activity: [
      { text: "Genie extracted 142 new target-compound associations.", time: "2 hours ago", Icon: AutoAwesomeOutlined },
      { text: "Dr. Priya updated the Phase II protocol documentation.", time: "6 hours ago", Icon: CheckCircleOutline  },
      { text: "Automated screening of KRAS variants completed.",       time: "Yesterday",   Icon: AccessTimeOutlined  },
      { text: "Project Metformin for Oncology: milestone hit.",        time: "2 days ago",  Icon: AutoAwesomeOutlined },
    ],
  },
};

const TABS = ["Overview", "Literature", "Compounds", "Screen Scores", "NovSearch"];

/* ── Shared interaction table ──────────────────────────────────────────── */
const InteractionTable = ({ title, rows }) => (
  <Box sx={{ bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden" }}>
    <Box sx={{ px: "16px", py: "12px", borderBottom: `1px solid ${BORDER}`, bgcolor: BG }}>
      <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK }}>{title}</Typography>
    </Box>
    <Box sx={{ display: "flex", px: "16px", py: "8px", borderBottom: `1px solid ${BORDER}`, bgcolor: BG }}>
      {["Interaction Type", "Residue", "Distance (\u00c5)", "Strength"].map((h, i) => (
        <Typography key={h} sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase",
          flex: i === 0 ? 2 : 1, textAlign: i > 0 ? "center" : "left" }}>
          {h}
        </Typography>
      ))}
    </Box>
    {rows.map((r, i) => (
      <Box key={i} sx={{ display: "flex", alignItems: "center", px: "16px", py: "10px", borderBottom: i < rows.length - 1 ? `1px solid ${BORDER}` : "none" }}>
        <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: TEXT_DARK, flex: 2 }}>{r.type}</Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: "#475569", flex: 1, textAlign: "center" }}>{r.residue}</Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: "#475569", flex: 1, textAlign: "center" }}>{r.distance}</Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: strengthColor(r.strength), flex: 1, textAlign: "center" }}>{r.strength}</Typography>
      </Box>
    ))}
  </Box>
);

/* ── Right col (shared) ──────────────────────────────────────────────────── */
const RightCol = ({ proj }) => (
  <Box sx={{ width: "380px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "32px" }}>
    <Card>
      <CardHeader title="Project Details" />
      <Box sx={{ p: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <DetailField label="Lead Researcher">
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mt: "2px" }}>
            <Box component="img" src="/authbtn.png" alt={proj.leadResearcher} sx={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            <Box>
              <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK, lineHeight: 1.3 }}>{proj.leadResearcher}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: MUTED, lineHeight: 1.3 }}>{proj.leadRole}</Typography>
            </Box>
          </Box>
        </DetailField>
        <DetailField label="Target Disease">
          <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 500, color: TEXT_DARK }}>{proj.disease}</Typography>
        </DetailField>
        <DetailField label="Start Date">
          <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 500, color: TEXT_DARK }}>{proj.startDate}</Typography>
        </DetailField>
        <DetailField label="Last Updated">
          <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 500, color: TEXT_DARK }}>{proj.targetCompletion}</Typography>
        </DetailField>
        <DetailField label="Priority">
          <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" }}>
            <Box sx={{ display: "inline-flex", px: "8px", py: "4px", borderRadius: "4px", bgcolor: "#FEF3C7" }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: "#B45309", letterSpacing: "0.4px" }}>{proj.priority}</Typography>
            </Box>
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEAL, cursor: "pointer", "&:hover": { opacity: 0.8 } }}>View Project</Typography>
          </Box>
        </DetailField>
      </Box>
    </Card>
    <Card>
      <CardHeader title="Recent Activity" />
      <Box sx={{ p: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {proj.activity.map((act, i) => (
          <ActivityItem key={i} IconComp={act.Icon} text={act.text} time={act.time} />
        ))}
      </Box>
    </Card>
  </Box>
);

/* ══════════════════  MAIN COMPONENT  ══════════════════════════════════════ */
const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate      = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [litSearch, setLitSearch] = useState("");

  const proj = PROJECTS[projectId] || Object.values(PROJECTS)[0];
  const pubs = (proj.publications || []).filter(p =>
    !litSearch || p.title.toLowerCase().includes(litSearch.toLowerCase()) || p.authors.toLowerCase().includes(litSearch.toLowerCase())
  );

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", px: "32px", pt: "32px", pb: 0, gap: "32px", boxSizing: "border-box", bgcolor: BG }}>

      {/* Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <Typography onClick={() => navigate("/dashboard/active-projects")} sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: MUTED, cursor: "pointer", "&:hover": { color: TEXT_DARK } }}>Projects</Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: MUTED }}>›</Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: "#475569" }}>{proj.name}</Typography>
      </Box>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "24px", fontWeight: 700, color: TEXT_DARK, lineHeight: 1 }}>{proj.name}</Typography>
            <Box sx={{ px: "8px", py: "3px", borderRadius: "4px", bgcolor: "#DCFCE7" }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: "#16A34A", letterSpacing: "0.4px" }}>{proj.status}</Typography>
            </Box>
          </Box>
          <Typography sx={{ fontFamily: FONT, fontSize: "16px", fontWeight: 400, color: "#475569", lineHeight: 1 }}>{proj.sub}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <Box component="button" sx={{ display: "flex", alignItems: "center", gap: "8px", px: "14px", py: "10px", borderRadius: "8px", bgcolor: "#fff", border: `1px solid ${BORDER}`, cursor: "pointer", flexShrink: 0, fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: TEXT_DARK, "&:hover": { bgcolor: BG } }}>
            ↓ Export Project Data
          </Box>
          <Box component="button" sx={{ display: "flex", alignItems: "center", gap: "8px", px: "14px", py: "10px", borderRadius: "8px", bgcolor: "#fff", border: `1px solid ${BORDER}`, cursor: "pointer", flexShrink: 0, fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: TEXT_DARK, "&:hover": { bgcolor: BG } }}>
            <EditOutlined sx={{ fontSize: 15, color: MUTED }} />
            Edit Project
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "32px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        {TABS.map((tab, i) => (
          <Box key={tab} onClick={() => setActiveTab(i)} sx={{ pb: "8px", cursor: "pointer", mb: "-1px", borderBottom: activeTab === i ? `2px solid ${TEAL}` : "2px solid transparent" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: activeTab === i ? 600 : 500, color: activeTab === i ? TEAL : MUTED, lineHeight: 1 }}>{tab}</Typography>
          </Box>
        ))}
      </Box>

      {/* Body columns */}
      <Box sx={{ display: "flex", gap: "32px", alignItems: "flex-start", flex: 1, minHeight: 0, overflowY: "auto", pb: "32px" }}>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "32px", minWidth: 0 }}>

          {/* Pipeline card (always visible) */}
          <Card>
            <CardHeader title="Pipeline Modules Completed" />
            <Box sx={{ px: "24px", py: "24px" }}>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                {proj.pipeline.map((step, i) => (
                  <PipelineStep key={step.label} label={step.label} done={step.done} first={i === 0} last={i === proj.pipeline.length - 1} />
                ))}
              </Box>
            </Box>
          </Card>

          {/* ── OVERVIEW ────────────────────────────────────────── */}
          {activeTab === 0 && (
            <>
              <Card>
                <CardHeader title="Project Summary" />
                <Box sx={{ px: "24px", py: "24px" }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: "15px", fontWeight: 400, color: "#475569", lineHeight: "160%" }}>{proj.summary}</Typography>
                </Box>
              </Card>
              <Card>
                <CardHeader title="Repurposing Hypothesis" right={<Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEAL }}>Confidence Score: {proj.hypothesisScore}%</Typography>} />
                <Box sx={{ px: "24px", py: "24px" }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: "15px", fontWeight: 400, color: "#475569", lineHeight: "160%" }}>{proj.hypothesis}</Typography>
                </Box>
              </Card>
              <Card>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: "24px", py: "24px", borderBottom: `1px solid ${BORDER}`, minHeight: "68px", boxSizing: "border-box" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <AutoAwesomeOutlined sx={{ fontSize: 20, color: TEAL, flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: FONT, fontSize: "16px", fontWeight: 700, color: TEXT_DARK, lineHeight: 1 }}>AI Insights</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 400, color: MUTED, lineHeight: 1 }}>Generated by AI · 2 hours ago</Typography>
                </Box>
                <Box sx={{ px: "24px", py: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <Box sx={{ bgcolor: BG, border: `1px solid ${BORDER}`, borderRadius: "12px", p: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <AutoAwesomeOutlined sx={{ fontSize: 13, color: TEAL, flexShrink: 0 }} />
                      <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK, lineHeight: 1 }}>Saved Interpretation</Typography>
                    </Box>
                    <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: "#475569", lineHeight: "160%" }}>{proj.aiInsight}</Typography>
                  </Box>
                  <Box sx={{ bgcolor: BG, border: `1px solid ${BORDER}`, borderRadius: "12px", p: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <AutoAwesomeOutlined sx={{ fontSize: 13, color: TEAL, flexShrink: 0 }} />
                      <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK, lineHeight: 1 }}>Top Target Recommendations</Typography>
                    </Box>
                    <Box sx={{ bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden" }}>
                      <Box sx={{ display: "flex", alignItems: "center", bgcolor: BG, pt: "10px", pr: "12px", pb: "10px", pl: "12px", borderBottom: `1px solid ${BORDER}` }}>
                        <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", flex: 1 }}>Target</Typography>
                        <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "60px", textAlign: "right" }}>Score</Typography>
                      </Box>
                      {proj.targets.map((t, i) => (
                        <Box key={t.name} sx={{ display: "flex", alignItems: "center", px: "12px", py: "10px", borderBottom: i < proj.targets.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                          <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: TEXT_DARK, flex: 1 }}>{t.name}</Typography>
                          <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK, width: "60px", textAlign: "right" }}>{t.score.toFixed(2)}</Typography>
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <AutoAwesomeOutlined sx={{ fontSize: 13, color: MUTED }} />
                      <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: MUTED }}>Sources · {proj.sourcesCount} articles referenced</Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </>
          )}

          {/* ── LITERATURE ──────────────────────────────────────── */}
          {activeTab === 1 && (
            <>
              <Card sx={{ borderRadius: "16px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "12px", pt: "24px", pr: "24px", pl: "24px", pb: "0" }}>
                  <Box sx={{ flex: 1, height: "44px", display: "flex", alignItems: "center", gap: "10px", bgcolor: BG, border: `1px solid ${BORDER}`, borderRadius: "12px", px: "12px" }}>
                    <SearchOutlined sx={{ fontSize: 20, color: MUTED, flexShrink: 0 }} />
                    <TextField variant="standard" placeholder="Search papers, authors, journals..." value={litSearch} onChange={(e) => setLitSearch(e.target.value)} fullWidth InputProps={{ disableUnderline: true }}
                      sx={{ "& input": { fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: TEXT_DARK, py: 0 }, "& input::placeholder": { color: MUTED, opacity: 1 } }} />
                  </Box>
                  <Box component="button" sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "80px", height: "44px", flexShrink: 0, bgcolor: TEAL, borderRadius: "12px", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: "#fff", "&:hover": { bgcolor: "#089B98" } }}>Search</Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "12px", pr: "24px", pb: "24px", pl: "24px", pt: "12px" }}>
                  <FilterChip label="Source" value="All" />
                  <FilterChip label="Year" value="2020-2026" />
                  <FilterChip label="Relevance" value="Any" />
                </Box>
              </Card>
              <Card>
                <CardHeader title="Key Publications" right={<Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEAL }}>{pubs.length} papers</Typography>} />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {pubs.map((pub, i) => (
                    <Box key={i} sx={{ px: "24px", py: "16px", borderBottom: i < pubs.length - 1 ? `1px solid ${BORDER}` : "none", cursor: "pointer", "&:hover": { bgcolor: BG } }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", mb: "6px" }}>
                        <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: TEXT_DARK, lineHeight: 1.4, flex: 1 }}>{pub.title}</Typography>
                        <RelevanceBadge level={pub.relevance} />
                      </Box>
                      <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 400, color: MUTED, mb: "6px" }}>{pub.source} · {pub.year} · {pub.authors}</Typography>
                      <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 400, color: "#475569", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{pub.abstract}</Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
              <Card>
                <CardHeader title="LitMineX Summary" right={<Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 400, color: MUTED }}>Generated by AI</Typography>} />
                <Box sx={{ px: "24px", py: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { label: "Papers reviewed",              value: proj.litSummary?.papersReviewed ?? 320 },
                    { label: "Highly relevant",              value: proj.litSummary?.highlyRelevant  ?? 48  },
                    { label: "Directly cited in AI Insights", value: proj.litSummary?.directlyCited   ?? 12  },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: "#475569" }}>{label}</Typography>
                      <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 700, color: TEXT_DARK }}>{value}</Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            </>
          )}

          {/* ── COMPOUNDS ───────────────────────────────────────── */}
          {activeTab === 2 && proj.compounds && (
            <>
              <Card>
                <CardHeader title="Candidate Compounds" subtitle={`${proj.compounds.length} compounds identified through CurateX screening`} />
                {/* Table header */}
                <Box sx={{ display: "flex", alignItems: "center", px: "20px", py: "10px", bgcolor: BG, borderBottom: `1px solid ${BORDER}` }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "160px" }}>Compound</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", flex: 1 }}>Recommended Action</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "120px" }}>Status</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "130px" }}>Confidence Score</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "80px" }}>Source</Typography>
                </Box>
                {/* Data rows */}
                {proj.compounds.map((c, i) => (
                  <Box key={c.name} sx={{ display: "flex", alignItems: "center", px: "20px", py: "14px", borderBottom: i < proj.compounds.length - 1 ? `1px solid ${BORDER}` : "none", "&:hover": { bgcolor: BG } }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: TEXT_DARK, width: "160px" }}>{c.name}</Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: "#475569", flex: 1 }}>{c.moa}</Typography>
                    <Box sx={{ width: "120px" }}><CompoundStatus status={c.status} /></Box>
                    <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: TEXT_DARK, width: "130px" }}>{c.score}%</Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: TEAL, width: "80px", cursor: "pointer" }}>{c.source}</Typography>
                  </Box>
                ))}
                {/* Footer note */}
                <Box sx={{ px: "20px", py: "12px", borderTop: `1px solid ${BORDER}` }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: MUTED, cursor: "pointer", "&:hover": { color: TEAL } }}>Compound criteria given</Typography>
                </Box>
              </Card>

              {proj.curateXAnalysis && (
                <Card>
                  <CardHeader title="Curated Analysis" right={<Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 400, color: MUTED }}>Computationally identified through CurateX</Typography>} />
                  <Box sx={{ px: "24px", py: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    {[
                      { label: "Total screened",       value: proj.curateXAnalysis.totalScreened,                                      color: TEXT_DARK },
                      { label: "Awaiting review",      value: proj.curateXAnalysis.awaitingReviewPct ?? proj.curateXAnalysis.passedFilters, color: TEXT_DARK },
                      { label: "Approval efficiency",  value: proj.curateXAnalysis.approvalEfficiency ?? proj.curateXAnalysis.avgBinding,  color: TEAL     },
                    ].map(({ label, value, color }) => (
                      <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: "#475569" }}>{label}</Typography>
                        <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 700, color }}>{value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>
              )}
            </>
          )}

          {/* ── SCREEN SCORES ────────────────────────────────────── */}
          {activeTab === 3 && proj.screenScores && (
            <Card>
              <CardHeader title="End to End Virtual Screening" subtitle="Interaction analysis for top combinations" />
              <Box sx={{ px: "24px", pt: "24px", pb: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* Overall Score row */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  {/* Donut-style score circle */}
                  <Box sx={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke={BORDER} strokeWidth="8" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke={TEAL} strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 40 * proj.screenScores.overallScore / 100} ${2 * Math.PI * 40 * (1 - proj.screenScores.overallScore / 100)}`}
                        strokeLinecap="round" transform="rotate(-90 50 50)" />
                    </svg>
                    <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                      <Typography sx={{ fontFamily: FONT, fontSize: "18px", fontWeight: 700, color: TEAL, lineHeight: 1 }}>{proj.screenScores.overallScore}</Typography>
                    </Box>
                  </Box>
                  {/* Score text */}
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "8px" }}>
                      <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.6px" }}>Overall Score</Typography>
                      <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 700, color: TEAL }}>{proj.screenScores.overallScore} / 100</Typography>
                    </Box>
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: "#475569", lineHeight: 1.5, mb: "8px" }}>{proj.screenScores.description}</Typography>
                    <Box sx={{ px: "8px", py: "3px", borderRadius: "4px", bgcolor: "#DCFCE7", display: "inline-flex" }}>
                      <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: "#16A34A" }}>{proj.screenScores.label}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Binding Interaction tables */}
                {proj.screenScores.interactions.map((intx) => (
                  <InteractionTable key={intx.title} title={intx.title} rows={intx.rows} />
                ))}

                {/* Top Performing Compounds */}
                <Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.6px", mb: "12px" }}>Top Performing Compounds</Typography>
                  <Box sx={{ bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden" }}>
                    <Box sx={{ display: "flex", px: "16px", py: "8px", borderBottom: `1px solid ${BORDER}`, bgcolor: BG }}>
                      <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", flex: 1 }}>Compound</Typography>
                      <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "80px", textAlign: "right" }}>Score</Typography>
                    </Box>
                    {proj.screenScores.topCompounds.map((c, i) => (
                      <Box key={c.name} sx={{ display: "flex", alignItems: "center", px: "16px", py: "12px", borderBottom: i < proj.screenScores.topCompounds.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                        <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: TEXT_DARK, flex: 1 }}>{c.name}</Typography>
                        <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 700, color: TEAL, width: "80px", textAlign: "right" }}>{c.score}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Card>
          )}

          {/* ── NOVSEARCH ───────────────────────────────────────── */}
          {activeTab === 4 && proj.novSearch && (
            <Card>
              <CardHeader title="Novelty Assessment Report" subtitle={proj.novSearch.subtitle} />
              <Box sx={{ px: "24px", pt: "24px", pb: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* Novelty Assessment Details table */}
                <Box sx={{ bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden" }}>
                  <Box sx={{ px: "16px", py: "10px", borderBottom: `1px solid ${BORDER}`, bgcolor: BG }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK }}>Novelty Assessment Details</Typography>
                  </Box>
                  {/* Col header */}
                  <Box sx={{ display: "flex", px: "16px", py: "8px", borderBottom: `1px solid ${BORDER}`, bgcolor: BG }}>
                    {["Criterion", "Score", "Status", "Notes"].map((h, i) => (
                      <Typography key={h} sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", flex: i === 0 ? 2 : i === 3 ? 3 : 1 }}>{h}</Typography>
                    ))}
                  </Box>
                  {/* Rows */}
                  {proj.novSearch.details.map((d, i) => (
                    <Box key={d.criterion} sx={{ display: "flex", alignItems: "center", px: "16px", py: "12px", borderBottom: i < proj.novSearch.details.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                      <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: TEXT_DARK, flex: 2 }}>{d.criterion}</Typography>
                      <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK, flex: 1 }}>{d.score}</Typography>
                      <Box sx={{ flex: 1 }}><NoveltyStatus status={d.status} /></Box>
                      <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: "#475569", flex: 3 }}>{d.notes}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Overall Novelty Score */}
                <Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.6px", mb: "12px" }}>Overall Novelty Score</Typography>
                  <Box sx={{ bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden" }}>
                    {[
                      { label: "Overall novelty",              value: proj.novSearch.overall.novelty,              color: TEXT_DARK },
                      { label: "Novel biomarker combinations found", value: proj.novSearch.overall.biomarkerCombinations, color: TEXT_DARK },
                      { label: "Patients analyzed",            value: proj.novSearch.overall.patientsAnalyzed,     color: TEXT_DARK },
                    ].map(({ label, value, color }, i, arr) => (
                      <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "16px", py: "12px", borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                        <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: "#475569" }}>{label}</Typography>
                        <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 700, color }}>{value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Card>
          )}
        </Box>

        {/* Right col */}
        <RightCol proj={proj} />
      </Box>
    </Box>
  );
};

export default ProjectDetailPage;