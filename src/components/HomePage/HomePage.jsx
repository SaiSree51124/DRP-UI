import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, IconButton,
  Select, MenuItem, Popover, LinearProgress,
} from "@mui/material";
import {
  FolderOutlined, TrackChangesOutlined, BiotechOutlined, PeopleAltOutlined,
  ArrowUpwardOutlined, AddOutlined, SearchOutlined, MicNoneOutlined,
  UploadFileOutlined, FolderOpenOutlined, ChevronRightOutlined,
  AutoAwesomeOutlined, KeyboardArrowUpOutlined, KeyboardArrowDownOutlined,
  CloseOutlined, GridViewOutlined, ShowChartOutlined, PersonOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useProjects } from "../../context/ProjectsContext";
import NewProjectModal from "../NewProjectModal";

const FONT      = "'Inter', sans-serif";
const TEAL      = "#0ABFBC";
const MUTED     = "#94A3B8";
const BORDER    = "#E2E8F0";
const TEXT_DARK = "#0F172A";
const BG        = "#F8FAFC";

const QUICK_STARTS = [
  { Icon: SearchOutlined,    label: "Search patents for JAK inhibitors"  },
  { Icon: GridViewOutlined,  label: "Mine literature for PPARG targets"  },
  { Icon: PersonOutlined,    label: "Curate compounds for Aspirin"       },
  { Icon: ShowChartOutlined, label: "Explore knowledge graph for T2D"   },
];

const pipelineItems = [
  { name: "PPARG", subtitle: "Repurposing Screening", progress: 85, color: "#16A34A" },
  { name: "JAK2",  subtitle: "Repurposing Screening", progress: 42, color: "#D97706" },
  { name: "EGFR",  subtitle: "Repurposing Screening", progress: 12, color: TEAL     },
];

const homeSessions = [
  { tag: "TxKG",        tagColor: TEAL,      tagBg: "#E6FAFA", dotColor: "#16A34A", status: "Completed",   title: "PPARG - Type 2 Diabetes",  subtitle: "847 nodes mapped \u2022 12 articles found", time: "15 min ago"  },
  { tag: "LitMineX",    tagColor: "#7C3AED", tagBg: "#EDE9FE", dotColor: "#D97706", status: "In Progress", title: "JAK2 - Pancreatic Cancer",  subtitle: "Scanning 3,200 articles...",             time: "2 hours ago" },
  { tag: "ScreenSuite", tagColor: "#DB2777", tagBg: "#FDE7F3", dotColor: "#4338CA", status: "Saved",       title: "EGFR - NSCLC Binding",      subtitle: "Virtual screening complete \u2022 5 hits", time: "Yesterday"   },
];

const AGENT_TARGETS = [
  { uniprotId: "P37231", target: "PPARG receptor",                                            score: "89.00" },
  { uniprotId: "P27487", target: "DPP4",                                                      score: "84.00" },
  { uniprotId: "P43220", target: "Thrombospondin",                                            score: "39.00" },
  { uniprotId: "Q8TDF5", target: "Interleukin-5 receptor",                                    score: "33.00" },
  { uniprotId: "P06213", target: "Cytokine receptor common subunit beta",                     score: "23.00" },
  { uniprotId: "Q13131", target: "Granulocyte colony-stimulating factor receptor",            score: "22.00" },
  { uniprotId: "Q86V97", target: "Macrophage colony-stimulating factor 1 receptor",           score: "23.00" },
  { uniprotId: "P78552", target: "Interleukin-9 receptor",                                    score: "21.00" },
  { uniprotId: "P42345", target: "Phosphatidylinositol 3,4,5-trisphosphate 5-phosphatase 2", score: "21.00" },
  { uniprotId: "P42336", target: "Cathrin-associated mediating protein 22",                   score: "21.00" },
];

const DISCOVERY_TARGETS = [
  { gene: "PPARG", name: "Peroxisome proliferator-activated receptor gamma", score: 92,
    paths: ["T2D \u2192 PPARG", "T2D \u2192 Insulin resistance \u2192 PPARG", "T2D \u2192 Thiazolidinediones \u2192 PPARG"] },
  { gene: "DPP4",  name: "Dipeptidyl peptidase-4",                           score: 87, paths: ["T2D \u2192 GLP-1 \u2192 DPP4"] },
  { gene: "GLP1R", name: "Glucagon-like peptide-1 receptor",                 score: 79, paths: ["T2D \u2192 Incretin \u2192 GLP1R"] },
  { gene: "SGLT2", name: "Sodium-glucose co-transporter 2",                  score: 71, paths: ["T2D \u2192 Glucose \u2192 SGLT2"] },
  { gene: "INSR",  name: "Insulin receptor",                                 score: 65, paths: ["T2D \u2192 Insulin sig. \u2192 INSR"] },
];

const MOCK_PROJECTS = [
  { name: "End to End Virtual Screening", dot: "#F97316" },
  { name: "JAK2 \u2013 Thrombocytosis",  dot: TEAL      },
  { name: "BRAF Melanoma Research",       dot: "#16A34A" },
  { name: "HER2 Breast Cancer Study",     dot: "#D97706" },
  { name: "Type 2 Diabetes \u2013 PPARG",dot: TEAL      },
];

const INSIGHT_TABS = ["Interpretation", "Recommendations", "Sources"];

const LITMINEX_ARTICLES = [
  { id: 1, title: "Metformin repurposing for JAK2-me...",              year: 2024, score: 100, scoreColor: "#0ABFBC", keywords: "metformin, JAK2, insulin"    },
  { id: 2, title: "SGLT2 inhibitor mechanisms in pancr...",           year: 2023, score: 97,  scoreColor: "#0ABFBC", keywords: "SGLT2, beta-cell"             },
  { id: 3, title: "GLP-1 receptor agonist effects on he...",          year: 2024, score: 94,  scoreColor: "#0ABFBC", keywords: "GLP-1, hepatic glucose"       },
  { id: 4, title: "PI3K/Akt pathway modulation in Typ...",            year: 2022, score: 91,  scoreColor: "#0ABFBC", keywords: "PI3K, Akt, diabetes"          },
  { id: 5, title: "AMPK activation and glucose transp...",            year: 2023, score: 88,  scoreColor: "#D97706", keywords: "AMPK, glucose transporter"  },
  { id: 6, title: "PPAR-gamma agonists for improving...",             year: 2024, score: 85,  scoreColor: "#D97706", keywords: "PPAR-gamma, insulin"          },
  { id: 7, title: "Genome-wide association studies fo...",            year: 2022, score: 82,  scoreColor: "#F97316", keywords: "GWAS, T2D loci"               },
  { id: 8, title: "DPP-4 inhibitor efficacy in glycemic...",          year: 2023, score: 79,  scoreColor: "#DC2626", keywords: "DPP-4, glycemic control"    },
];

/* ── StatCard ──────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, iconBg, iconColor }) => (
  <Box sx={{ flex: 1, bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", p: "20px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.03)" }}>
    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.6px", lineHeight: 1.4 }}>{label}</Typography>
      <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon sx={{ fontSize: 17, color: iconColor }} />
      </Box>
    </Box>
    <Typography sx={{ fontFamily: FONT, fontSize: "30px", fontWeight: 700, color: TEXT_DARK, lineHeight: 1 }}>{value}</Typography>
  </Box>
);

/* ── KnowledgeGraph SVG ────────────────────────────────────────────────── */
const KnowledgeGraph = () => {
  const nodes = [
    { id: "type2d",    label: "Type 2 Diabetes", x: 270, y: 148, r: 20, color: "#F97316" },
    { id: "jak2",      label: "JAK2",            x: 145, y: 72,  r: 13, color: "#F97316" },
    { id: "dpp4",      label: "DPP4",            x: 360, y: 52,  r: 13, color: "#F97316" },
    { id: "glp1r",     label: "GLP1R",           x: 430, y: 90,  r: 13, color: "#F97316" },
    { id: "sglt2",     label: "SGLT2",           x: 110, y: 150, r: 13, color: "#F97316" },
    { id: "insr",      label: "INSR",            x: 240, y: 52,  r: 13, color: "#F97316" },
    { id: "obesity",   label: "Obesity",         x: 470, y: 148, r: 13, color: "#EC4899" },
    { id: "jak_stat",  label: "JAK-STAT",        x: 415, y: 222, r: 13, color: "#0ABFBC" },
    { id: "insulin",   label: "Insulin Sig.",    x: 168, y: 248, r: 13, color: "#0ABFBC" },
    { id: "imatinib",  label: "Imatinib",        x: 100, y: 212, r: 13, color: "#A855F7" },
    { id: "metformin", label: "Metformin",       x: 78,  y: 148, r: 13, color: "#A855F7" },
    { id: "ruxoliti",  label: "Ruxolitinib",     x: 88,  y: 100, r: 12, color: "#A855F7" },
    { id: "t2d2",      label: "Type 2 Diabetes", x: 380, y: 270, r: 13, color: "#EC4899" },
  ];
  const edges = [
    ["type2d","jak2"],["type2d","dpp4"],["type2d","glp1r"],["type2d","sglt2"],["type2d","insr"],
    ["type2d","jak_stat"],["type2d","insulin"],["type2d","obesity"],
    ["jak2","ruxoliti"],["jak2","sglt2"],["metformin","type2d"],["imatinib","jak2"],
    ["jak_stat","glp1r"],["insulin","t2d2"],["obesity","glp1r"],
  ];
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const legend  = [
    { color: "#F97316", label: "Disease Hub"  },
    { color: "#F97316", label: "Protein"      },
    { color: "#0ABFBC", label: "Pathway"      },
    { color: "#A855F7", label: "Compound"     },
    { color: "#EC4899", label: "Comorbidity"  },
  ];
  return (
    <Box sx={{ bgcolor: "#0A1628", borderRadius: "12px", overflow: "hidden" }}>
      <svg width="100%" viewBox="0 0 550 290" style={{ display: "block" }}>
        {edges.map(([f, t], i) => {
          const a = nodeMap[f]; const b = nodeMap[t];
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />;
        })}
        {nodes.map(n => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} fillOpacity="0.9" />
            <text x={n.x} y={n.y + n.r + 9} textAnchor="middle" fill="rgba(255,255,255,0.82)" fontSize="8.5" fontFamily="Inter,sans-serif">{n.label}</text>
          </g>
        ))}
      </svg>
      <Box sx={{ display: "flex", gap: "14px", px: "16px", pb: "12px", borderTop: "1px solid rgba(255,255,255,0.08)", pt: "10px", flexWrap: "wrap" }}>
        {legend.map((l, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: l.color, flexShrink: 0 }} />
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", color: "rgba(255,255,255,0.55)" }}>{l.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

/* ── UserMsg ───────────────────────────────────────────────────────────── */
const UserMsg = ({ text }) => (
  <Box sx={{ maxWidth: "680px", width: "100%", mx: "auto", bgcolor: "#F0FDFC", border: "1px solid rgba(226,232,240,0.3)", borderRadius: "12px", p: "16px", display: "flex", flexDirection: "column", gap: "12px", boxSizing: "border-box" }}>
    <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.5px" }}>Dr. Priya (You)</Typography>
    <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: TEXT_DARK, lineHeight: 1.55 }}>{text}</Typography>
  </Box>
);

/* ── AgentCard ─────────────────────────────────────────────────────────── */
const AgentCard = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: "16px", overflow: "hidden", bgcolor: "#fff", boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.03)" }}>
      <Box onClick={() => setOpen(o => !o)}
        sx={{ display: "flex", alignItems: "center", gap: "10px", px: "16px", py: "12px", cursor: "pointer", bgcolor: "#fff", borderBottom: open ? `1px solid ${BORDER}` : "none", "&:hover": { bgcolor: BG } }}>
        <Box sx={{ width: 28, height: 28, borderRadius: "6px", bgcolor: TEAL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <AutoAwesomeOutlined sx={{ fontSize: 13, color: "#fff" }} />
        </Box>
        <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 700, color: TEXT_DARK, textTransform: "uppercase", letterSpacing: "0.6px", flex: 1 }}>{title}</Typography>
        {open
          ? <KeyboardArrowUpOutlined sx={{ fontSize: 18, color: MUTED }} />
          : <KeyboardArrowDownOutlined sx={{ fontSize: 18, color: MUTED }} />}
      </Box>
      {open && <Box sx={{ p: "16px" }}>{children}</Box>}
    </Box>
  );
};

/* ══════════════════  MAIN COMPONENT  ════════════════════════════════════════ */
const HomePage = ({ userName = "Priya" }) => {
  const [phase, setPhase]               = useState("idle");
  const [query, setQuery]               = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [mod, setMod]                   = useState("TxKG");
  const [insightTab, setInsightTab]     = useState(0);
  const [addAnchorEl, setAddAnchorEl]   = useState(null);
  const [showProjectSub, setShowProjectSub] = useState(false);
  const [projectSearch, setProjectSearch]   = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [litminexTargets, setLitminexTargets] = useState(["PPARG receptor", "DPP4", "JAK2"]);
  const [customTarget, setCustomTarget]         = useState("");
  const { projects } = useProjects();

  /* auto-advance phases */
  useEffect(() => {
    if (phase === "searching") {
      const t = setTimeout(() => setPhase("results"), 2000);
      return () => clearTimeout(t);
    }
    if (phase === "results") {
      const t = setTimeout(() => setPhase("subgraph"), 2500);
      return () => clearTimeout(t);
    }
    if (phase === "subgraph") {
      const t = setTimeout(() => setPhase("metapath"), 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const statCards = [
    { label: "Active Projects",    value: projects.length, icon: FolderOutlined,      iconBg: "#DCFCE7", iconColor: "#16A34A" },
    { label: "Targets Identified", value: 20,              icon: TrackChangesOutlined, iconBg: "#DBEAFE", iconColor: "#2563EB" },
    { label: "Compounds Curated",  value: 30,              icon: BiotechOutlined,      iconBg: "#FEF3C7", iconColor: "#D97706" },
    { label: "Patients Analysed",  value: 100,             icon: PeopleAltOutlined,    iconBg: "#EDE9FE", iconColor: "#7C3AED" },
  ];

  const handleSubmit = () => {
    if (!query.trim()) return;
    setSubmittedQuery(query);
    setQuery("");
    setPhase("searching");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleReset = () => {
    setPhase("idle"); setQuery(""); setSubmittedQuery(""); setInsightTab(0); setSelectedProject(null); setLitminexTargets(["PPARG receptor", "DPP4", "JAK2"]); setCustomTarget("");
  };

  const isLoading = phase === "searching";

  /* ── "+" popover ──────────────────────────────────────────────────────── */
  const renderAddPopover = () => {
    const fp = MOCK_PROJECTS.filter(p =>
      !projectSearch || p.name.toLowerCase().includes(projectSearch.toLowerCase())
    );
    return (
      <Popover
        open={Boolean(addAnchorEl)} anchorEl={addAnchorEl}
        onClose={() => { setAddAnchorEl(null); setShowProjectSub(false); setProjectSearch(""); }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        elevation={0}
        PaperProps={{ sx: { border: `1px solid ${BORDER}`, borderRadius: "10px", boxShadow: "0px 8px 24px rgba(0,0,0,0.1)", mt: "8px" } }}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "220px", py: "6px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", px: "14px", py: "10px", cursor: "pointer", "&:hover": { bgcolor: BG } }}>
              <UploadFileOutlined sx={{ fontSize: 16, color: MUTED, flexShrink: 0 }} />
              <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: TEXT_DARK }}>Upload files or data</Typography>
            </Box>
            <Box onClick={() => setShowProjectSub(s => !s)}
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", px: "14px", py: "10px", cursor: "pointer", bgcolor: showProjectSub ? BG : "transparent", "&:hover": { bgcolor: BG } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FolderOpenOutlined sx={{ fontSize: 16, color: MUTED, flexShrink: 0 }} />
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: TEXT_DARK }}>Add to project</Typography>
              </Box>
              <ChevronRightOutlined sx={{ fontSize: 15, color: MUTED }} />
            </Box>
          </Box>
          {showProjectSub && (
            <Box sx={{ width: "220px", borderLeft: `1px solid ${BORDER}`, py: "12px", display: "flex", flexDirection: "column" }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", px: "14px", mb: "8px" }}>Select Project</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mx: "10px", mb: "6px", px: "8px", height: "32px", border: `1px solid ${BORDER}`, borderRadius: "6px", bgcolor: BG }}>
                <SearchOutlined sx={{ fontSize: 13, color: MUTED, flexShrink: 0 }} />
                <TextField variant="standard" placeholder="Search projects..." value={projectSearch} onChange={e => setProjectSearch(e.target.value)} fullWidth
                  InputProps={{ disableUnderline: true }}
                  sx={{ "& input": { fontFamily: FONT, fontSize: "12px", color: TEXT_DARK, py: 0 }, "& input::placeholder": { color: MUTED, opacity: 1 } }} />
              </Box>
              <Box sx={{ flex: 1, overflowY: "auto" }}>
                {fp.map(p => (
                  <Box key={p.name}
                    onClick={() => { setSelectedProject(p); setAddAnchorEl(null); setShowProjectSub(false); setProjectSearch(""); }}
                    sx={{ display: "flex", alignItems: "center", gap: "8px", px: "14px", py: "8px", cursor: "pointer",
                      bgcolor: selectedProject?.name === p.name ? "#E6FAFA" : "transparent",
                      "&:hover": { bgcolor: "#E6FAFA" } }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: p.dot, flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: FONT, fontSize: "12.5px", color: TEXT_DARK }}>{p.name}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", px: "14px", py: "8px", mt: "2px", borderTop: `1px solid ${BORDER}`, cursor: "pointer", "&:hover": { bgcolor: BG } }}
                onClick={() => { setAddAnchorEl(null); setShowProjectSub(false); setCreateModalOpen(true); }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "12.5px", fontWeight: 600, color: TEAL }}>+ Create new project</Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Popover>
    );
  };

  /* ── Toolbar ──────────────────────────────────────────────────────────── */
  const renderToolbar = () => (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        <IconButton size="small" onClick={(e) => setAddAnchorEl(e.currentTarget)} sx={{ color: MUTED, p: "4px" }}>
          <AddOutlined sx={{ fontSize: 17 }} />
        </IconButton>
        <Box sx={{ width: "1px", height: "16px", bgcolor: BORDER }} />
        <Select value={mod} onChange={(e) => setMod(e.target.value)} size="small" variant="standard" disableUnderline
          sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: TEXT_DARK, "& .MuiSelect-select": { py: 0, pr: "20px !important" }, "& .MuiSelect-icon": { right: 0 } }}>
          <MenuItem value="TxKG">TxKG</MenuItem>
          <MenuItem value="LitMineX">LitMineX</MenuItem>
          <MenuItem value="ScreenSuite">ScreenSuite</MenuItem>
        </Select>
        {selectedProject && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "5px", px: "8px", py: "3px", border: `1px solid ${BORDER}`, borderRadius: "20px", bgcolor: "#fff" }}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: selectedProject.dot, flexShrink: 0 }} />
            <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 500, color: TEXT_DARK }}>{selectedProject.name}</Typography>
            <Box onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }} sx={{ cursor: "pointer", display: "flex", alignItems: "center", ml: "2px" }}>
              <CloseOutlined sx={{ fontSize: 12, color: MUTED }} />
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <IconButton size="small" sx={{ color: MUTED, p: "4px" }}>
          <MicNoneOutlined sx={{ fontSize: 17 }} />
        </IconButton>
        {isLoading ? (
          <IconButton size="small" onClick={handleReset}
            sx={{ bgcolor: TEXT_DARK, color: "#fff", p: "6px", borderRadius: "50%", flexShrink: 0, "&:hover": { bgcolor: "#334155" } }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "1px", bgcolor: "#fff" }} />
          </IconButton>
        ) : (
          <IconButton size="small" onClick={handleSubmit}
            sx={{ bgcolor: TEAL, color: "#fff", p: "6px", borderRadius: "50%", flexShrink: 0, "&:hover": { bgcolor: "#089B98" } }}>
            <ArrowUpwardOutlined sx={{ fontSize: 15 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );

  /* ── ActionButtons ────────────────────────────────────────────────────── */
  const ActionButtons = () => (
    <Box sx={{ display: "flex", gap: "10px", mt: "16px" }}>
      <Box component="button" type="button" sx={{ px: "16px", py: "7px", borderRadius: "8px", border: `1px solid ${BORDER}`, bgcolor: "#fff", cursor: "pointer", fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK, "&:hover": { bgcolor: BG } }}>Save to Project</Box>
      <Box component="button" type="button" sx={{ px: "16px", py: "7px", borderRadius: "8px", border: `1px solid ${BORDER}`, bgcolor: "#fff", cursor: "pointer", fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK, "&:hover": { bgcolor: BG } }}>Export</Box>
    </Box>
  );

  /* ── TxKG content ─────────────────────────────────────────────────────── */
  const TxKGContent = () => (
    <>
      <Typography sx={{ fontFamily: FONT, fontSize: "15px", color: "#0F172A", lineHeight: 1.47, mb: "12px" }}>
        I found 10 protein targets strongly associated with Type 2 Diabetes pathways. Here are the top candidates ranked by therapeutic relevance:
      </Typography>
      <Box sx={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <Box sx={{ width: "577px", flexShrink: 0, minWidth: 0, border: `1px solid ${BORDER}`, borderRadius: "10px", overflow: "hidden", bgcolor: "#fff" }}>
          {/* Results Header */}
          <Box sx={{ px: "16px", py: "10px", borderBottom: `1px solid ${BORDER}`, bgcolor: "#fff" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK }}>
              Results - 10 protein targets found
            </Typography>
          </Box>
          {/* Table Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px", px: "16px", py: "9px", bgcolor: BG, borderBottom: `1px solid ${BORDER}` }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "32px" }}>#</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "80px" }}>Uniprot ID</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: MUTED, textTransform: "uppercase", flex: 1 }}>Target</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "120px", textAlign: "center" }}>Relevance Score</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "60px", textAlign: "center" }}>Preview</Typography>
          </Box>
          {/* Table Rows */}
          {AGENT_TARGETS.slice(0, 7).map((row, i) => {
            const scoreNum = parseFloat(row.score);
            const scoreBg = scoreNum >= 80 ? "#0ABFBC" : scoreNum >= 40 ? "#F97316" : "#94A3B8";
            return (
              <Box key={row.uniprotId}
                sx={{ display: "flex", alignItems: "center", gap: "12px", px: "16px", py: "10px", borderBottom: i < 6 ? `1px solid ${BORDER}` : "none",
                  bgcolor: i === 0 ? "#E6FAFA" : "#fff", cursor: "pointer", "&:hover": { bgcolor: i === 0 ? "#D4F4F4" : BG } }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "12.5px", fontWeight: 500, color: MUTED, width: "32px" }}>{i + 1}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: "12.5px", fontWeight: 600, color: "#2563EB", width: "80px" }}>{row.uniprotId}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: "12.5px", color: TEXT_DARK, flex: 1 }}>{row.target}</Typography>
                <Box sx={{ width: "120px", display: "flex", justifyContent: "center" }}>
                  <Box sx={{ px: "12px", py: "4px", borderRadius: "6px", bgcolor: scoreBg }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 600, color: "#fff" }}>{scoreNum}%</Typography>
                  </Box>
                </Box>
                <Box sx={{ width: "60px", display: "flex", justifyContent: "center" }}>
                  <IconButton size="small" sx={{ color: MUTED, p: "4px" }}>
                    <VisibilityOutlined sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
          {/* Pagination */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: "16px", py: "12px", borderTop: `1px solid ${BORDER}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Box sx={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", bgcolor: TEAL, cursor: "pointer" }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 600, color: "#fff" }}>1</Typography>
              </Box>
              <Box sx={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", cursor: "pointer", "&:hover": { bgcolor: BG } }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 500, color: TEXT_DARK }}>2</Typography>
              </Box>
              <Box sx={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", cursor: "pointer", "&:hover": { bgcolor: BG } }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 500, color: TEXT_DARK }}>3</Typography>
              </Box>
              <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: MUTED, px: "4px" }}>...</Typography>
            </Box>
            <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: MUTED }}>Showing 1-7 of 10 targets</Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: "200px", border: `1px solid ${BORDER}`, borderRadius: "8px", overflow: "hidden", bgcolor: "#fff", display: "flex", flexDirection: "column" }}>
          <Box sx={{ px: "16px", pt: "12px", pb: "8px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: TEXT_DARK, mb: "2px" }}>Insights</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", color: MUTED }}>AI-powered target recommendations and Q&A</Typography>
          </Box>
          <Box sx={{ display: "flex", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            {INSIGHT_TABS.map((tab, i) => (
              <Box key={tab} onClick={() => setInsightTab(i)}
                sx={{ flex: 1, py: "7px", textAlign: "center", cursor: "pointer", borderBottom: insightTab === i ? `2px solid ${TEAL}` : "2px solid transparent", mb: "-1px" }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: insightTab === i ? 700 : 500, color: insightTab === i ? TEAL : MUTED }}>{tab}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ px: "16px", py: "12px", flex: 1, overflowY: "auto" }}>
            {insightTab === 0 && (
              <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: "#475569", lineHeight: 1.6 }}>
                The predicted therapeutic targets for Type 2 Diabetes suggest a potential mechanism of action involving the modulation of insulin signaling pathways, particularly those regulated by JAK2 and DPP4. The identification of GLP1R and SGLT2 also hints at roles for incretin-related pathways.
              </Typography>
            )}
            {insightTab === 1 && (
              <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: "#475569", lineHeight: 1.6 }}>
                Recommended: PPARG (score 89), DPP4 (score 84), GLP1R. Consider Thiazolidinediones and DPP-4 inhibitors as first-line candidates.
              </Typography>
            )}
            {insightTab === 2 && (
              <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: "#475569", lineHeight: 1.6 }}>
                Sources: NCBI PubMed, UniProt KB, TxKG v3.2, DisGeNET T2D annotations.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      {ActionButtons()}
    </>
  );

  /* ── SubGraph content ─────────────────────────────────────────────────── */
  const SubGraphContent = () => (
    <>
      <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: "#475569", lineHeight: 1.6, mb: "14px" }}>
        Here is the generated knowledge graph for Type 2 Diabetes. This map illustrates the validated and predicted relationships between JAK2, drug molecules, associated pathways, and overlapping diseases based on TxKG relations:
      </Typography>
      <KnowledgeGraph />
      <Box sx={{ display: "flex", gap: "32px", mt: "16px", mb: "4px" }}>
        {[
          { label: "RELATIONSHIPS FOUND", value: "52 relations"   },
          { label: "DRUG CANDIDATES",     value: "15 candidates"  },
          { label: "PATHWAY CONNECTIONS", value: "10 connections" },
        ].map(({ label, value }) => (
          <Box key={label}>
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.5px", mb: "3px" }}>{label}</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "18px", fontWeight: 700, color: TEXT_DARK }}>{value}</Typography>
          </Box>
        ))}
      </Box>
      {ActionButtons()}
    </>
  );

  /* ── MetaPath content ─────────────────────────────────────────────────── */
  const MetaPathContent = () => (
    <>
      <Typography sx={{ fontFamily: FONT, fontSize: "15px", fontWeight: 700, color: TEXT_DARK, mb: "12px" }}>TxKG \u2014 Meta-Path Analysis</Typography>
      <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap", mb: "16px" }}>
        {[
          { n: "12",  l: "Paths"     },
          { n: "8",   l: "Targets"   },
          { n: "5",   l: "Pathways"  },
          { n: "1.5", l: "Avg/Target"},
          { n: "24",  l: "Nodes"     },
          { n: "38",  l: "Edges"     },
          { n: "4",   l: "Clusters"  },
        ].map(({ n, l }) => (
          <Box key={l} sx={{ display: "flex", alignItems: "baseline", gap: "4px", px: "10px", py: "5px", border: `1px solid ${BORDER}`, borderRadius: "6px", bgcolor: BG }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: TEXT_DARK }}>{n}</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: MUTED }}>{l}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: "16px" }}>
        <Box sx={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: "10px", overflow: "hidden" }}>
          <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.5px", px: "14px", py: "10px", borderBottom: `1px solid ${BORDER}`, bgcolor: BG }}>Target Prediction Scores</Typography>
          {DISCOVERY_TARGETS.map(t => (
            <Box key={t.gene} sx={{ display: "flex", alignItems: "center", gap: "10px", px: "14px", py: "10px", borderBottom: `1px solid ${BORDER}` }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: TEXT_DARK }}>{t.gene}</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: MUTED, mt: "1px" }}>{t.name}</Typography>
              </Box>
              <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: TEAL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: "#fff" }}>{t.score}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: "10px", overflow: "hidden" }}>
          <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.5px", px: "14px", py: "10px", borderBottom: `1px solid ${BORDER}`, bgcolor: BG }}>Meta-Path Traversals</Typography>
          {DISCOVERY_TARGETS.map(t => (
            <Box key={t.gene} sx={{ display: "flex", alignItems: "flex-start", gap: "10px", px: "14px", py: "10px", borderBottom: `1px solid ${BORDER}` }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: TEXT_DARK, mb: "3px" }}>{t.gene}</Typography>
                {t.paths.map((p, pi) => (
                  <Typography key={pi} sx={{ fontFamily: FONT, fontSize: "11px", color: MUTED, lineHeight: 1.55 }}>&bull; {p}</Typography>
                ))}
              </Box>
              <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: TEAL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: "#fff" }}>{t.score}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {ActionButtons()}
      <Box sx={{ mt: "20px", pt: "20px", borderTop: `1px solid ${BORDER}` }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "10px" }}>
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#16A34A", flexShrink: 0 }} />
          <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: "#16A34A", textTransform: "uppercase", letterSpacing: "0.5px" }}>Ready for Literature Mining</Typography>
        </Box>
        <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: "#475569", lineHeight: 1.6, mb: "14px" }}>
          TxKG analysis is complete. Would you like to proceed to LitMinex with the recommended targets, or select specific targets from the identified list?
        </Typography>
        <Box sx={{ display: "flex", gap: "12px" }}>
          <Box sx={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: "10px", p: "16px" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 700, color: TEXT_DARK, mb: "6px" }}>Proceed with Recommended Targets</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: MUTED, mb: "14px" }}>Run LitMinex on all 10 identified targets ranked by therapeutic relevance</Typography>
            <Box component="button" onClick={() => setPhase("litminex")} sx={{ width: "100%", py: "9px", border: "none", borderRadius: "8px", bgcolor: TEAL, cursor: "pointer", fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: "#fff", "&:hover": { bgcolor: "#089B98" } }}>
              Use recommended targets
            </Box>
          </Box>
          <Box sx={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: "10px", p: "16px" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 700, color: TEXT_DARK, mb: "6px" }}>Select Custom Targets</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: MUTED, mb: "14px" }}>Choose specific targets from the list or enter your own for literature mining</Typography>
            <Box component="button" onClick={() => setPhase("selectTargets")} sx={{ width: "100%", py: "9px", border: `1.5px solid ${BORDER}`, borderRadius: "8px", bgcolor: "#fff", cursor: "pointer", fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK, "&:hover": { bgcolor: BG } }}>
              Select Targets
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );

  /* ── SelectTargetsPanel ──────────────────────────────────────────────── */
  const SelectTargetsPanel = () => (
    <Box sx={{ bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "16px", p: "20px", boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.03)", flexShrink: 0 }}>
      <Typography sx={{ fontFamily: FONT, fontSize: "16px", fontWeight: 700, color: TEXT_DARK, mb: "4px" }}>Select Targets for LitMinex</Typography>
      <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: MUTED, mb: "12px" }}>Choose from the identified targets or add your own</Typography>
      {AGENT_TARGETS.map(t => {
        const checked = litminexTargets.includes(t.target);
        return (
          <Box key={t.target} onClick={() => setLitminexTargets(prev => checked ? prev.filter(n => n !== t.target) : [...prev, t.target])}
            sx={{ display: "flex", alignItems: "center", py: "9px", borderBottom: `1px solid ${BORDER}`, cursor: "pointer", "&:hover": { bgcolor: BG } }}>
            <Box sx={{ width: 18, height: 18, borderRadius: "3px", border: `2px solid ${checked ? TEAL : BORDER}`, bgcolor: checked ? TEAL : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mr: "12px" }}>
              {checked && <Typography sx={{ color: "#fff", fontSize: "10px", lineHeight: 1, fontWeight: 700 }}>✓</Typography>}
            </Box>
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: TEXT_DARK, flex: 1 }}>{t.target}</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: checked ? 700 : 400, color: checked ? TEAL : MUTED }}>{t.score}</Typography>
          </Box>
        );
      })}
      <Box sx={{ mt: "14px", mb: "14px" }}>
        <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 600, color: MUTED, mb: "8px" }}>Add custom target</Typography>
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Box sx={{ flex: 1, height: "36px", border: `1px solid ${BORDER}`, borderRadius: "8px", display: "flex", alignItems: "center", px: "12px" }}>
            <TextField variant="standard" fullWidth placeholder="Add custom target (e.g. EGFR, VEGFR2...)"
              value={customTarget} onChange={e => setCustomTarget(e.target.value)}
              InputProps={{ disableUnderline: true }}
              sx={{ "& input": { fontFamily: FONT, fontSize: "13px", py: 0, color: TEXT_DARK }, "& input::placeholder": { color: MUTED, opacity: 1 } }} />
          </Box>
          <Box onClick={() => { if (customTarget.trim()) { setLitminexTargets(p => [...p, customTarget.trim()]); setCustomTarget(""); }}}
            sx={{ width: 36, height: 36, borderRadius: "8px", bgcolor: TEAL, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, "&:hover": { bgcolor: "#089B98" } }}>
            <AddOutlined sx={{ fontSize: 18, color: "#fff" }} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: MUTED }}>{litminexTargets.length} targets selected</Typography>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Box component="button" onClick={() => setPhase("metapath")} sx={{ px: "16px", py: "8px", borderRadius: "8px", border: `1px solid ${BORDER}`, bgcolor: "#fff", cursor: "pointer", fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: TEXT_DARK, "&:hover": { bgcolor: BG } }}>Cancel</Box>
          <Box component="button" onClick={() => setPhase("litminex")} sx={{ px: "20px", py: "8px", borderRadius: "8px", border: "none", bgcolor: TEAL, cursor: "pointer", fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: "#fff", "&:hover": { bgcolor: "#089B98" } }}>Proceed to LitMinex</Box>
        </Box>
      </Box>
    </Box>
  );

  /* ── LitMinexCard ─────────────────────────────────────────────────────── */
  const LitMinexCard = () => (
    <>
      <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: "#475569", lineHeight: 1.6, mb: "16px" }}>
        Literature mining complete. Found 124 articles across PubMed and clinical databases. Results ranked by confidence score with keyword extraction.
      </Typography>
      <Box sx={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <Box sx={{ flex: 1, minWidth: 0, border: `1px solid ${BORDER}`, borderRadius: "10px", overflow: "hidden" }}>
          <Box sx={{ px: "14px", py: "10px", borderLeft: `3px solid ${TEAL}`, borderBottom: `1px solid ${BORDER}`, bgcolor: BG }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: TEXT_DARK }}>Results - 124 articles found</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", px: "14px", py: "8px", borderBottom: `1px solid ${BORDER}`, bgcolor: BG }}>
            <Box sx={{ width: 26, flexShrink: 0 }} />
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "26px" }}>#</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: MUTED, textTransform: "uppercase", flex: 1 }}>Title</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "42px" }}>Year</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "88px" }}>Confidence Score</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "130px" }}>Found Keywords</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "48px", textAlign: "center" }}>Preview</Typography>
          </Box>
          {LITMINEX_ARTICLES.map((a, i) => (
            <Box key={a.id} sx={{ display: "flex", alignItems: "center", px: "14px", py: "9px", borderBottom: i < LITMINEX_ARTICLES.length - 1 ? `1px solid ${BORDER}` : "none",
              bgcolor: i === 0 ? "#E6FAFA" : "#fff", "&:hover": { bgcolor: i === 0 ? "#D4F4F4" : BG } }}>
              <Box sx={{ width: 18, height: 18, borderRadius: "3px", border: `2px solid ${i === 0 ? TEAL : BORDER}`, bgcolor: i === 0 ? TEAL : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mr: "8px" }}>
                {i === 0 && <Typography sx={{ color: "#fff", fontSize: "10px", lineHeight: 1, fontWeight: 700 }}>✓</Typography>}
              </Box>
              <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: MUTED, width: "26px" }}>{a.id}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: "12.5px", color: TEXT_DARK, flex: 1, pr: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: MUTED, width: "42px" }}>{a.year}</Typography>
              <Box sx={{ width: "88px" }}>
                <Box sx={{ display: "inline-flex", px: "8px", py: "2px", borderRadius: "20px", bgcolor: `${a.scoreColor}22` }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: a.scoreColor }}>{a.score}%</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: MUTED, width: "130px", lineHeight: 1.4 }}>{a.keywords}</Typography>
              <Box sx={{ width: "48px", display: "flex", justifyContent: "center" }}>
                <VisibilityOutlined sx={{ fontSize: 16, color: TEAL, cursor: "pointer" }} />
              </Box>
            </Box>
          ))}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: "14px", py: "10px", borderTop: `1px solid ${BORDER}`, bgcolor: BG }}>
            <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
              {["<", "1", "2", "3", "...", "12", ">"].map((p, i) => (
                <Box key={i} sx={{ width: 28, height: 28, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  bgcolor: p === "1" ? TEAL : "transparent", border: p === "1" ? "none" : `1px solid ${BORDER}`, "&:hover": { bgcolor: p === "1" ? TEAL : BG } }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: p === "1" ? 700 : 400, color: p === "1" ? "#fff" : TEXT_DARK }}>{p}</Typography>
                </Box>
              ))}
            </Box>
            <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: MUTED }}>Showing 1-10 of 47 articles</Typography>
          </Box>
        </Box>
        <Box sx={{ width: "196px", flexShrink: 0 }}>
          <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 700, color: TEXT_DARK, mb: "10px" }}>Insights</Typography>
          <Box sx={{ border: `1.5px solid ${TEAL}`, borderRadius: "10px", p: "12px", bgcolor: "#F0FDFC" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: TEAL, mb: "6px" }}>Article Relevance</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: "#475569", lineHeight: 1.6 }}>
              This article demonstrates strong evidence for Metformin-JAK2 interaction with direct insulin signaling pathway involvement and therapeutic potential.
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: "10px", mt: "16px" }}>
        <Box component="button" type="button" sx={{ px: "16px", py: "7px", borderRadius: "8px", border: `1px solid ${BORDER}`, bgcolor: "#fff", cursor: "pointer", fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK, "&:hover": { bgcolor: BG } }}>Save to Project</Box>
        <Box component="button" type="button" sx={{ px: "16px", py: "7px", borderRadius: "8px", border: `1px solid ${BORDER}`, bgcolor: "#fff", cursor: "pointer", fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK, "&:hover": { bgcolor: BG } }}>Export to PDF</Box>
      </Box>
    </>
  );
  /* ── Render messages ──────────────────────────────────────────────────── */
  const renderMessages = () => {
    if (phase === "searching") {
      return (
        <>
          <UserMsg text={submittedQuery} />
          <AgentCard title="DRP TxKG Agent" defaultOpen>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {[0, 1, 2].map(i => (
                <Box key={i} sx={{
                  width: 7, height: 7, borderRadius: "50%", bgcolor: TEAL,
                  animation: "hpDot 1.4s infinite both", animationDelay: `${i * 0.2}s`,
                  "@keyframes hpDot": { "0%, 80%, 100%": { opacity: 0.25, transform: "scale(0.8)" }, "40%": { opacity: 1, transform: "scale(1)" } },
                }} />
              ))}
              <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: MUTED }}>
                Searching biomedical databases (NCBI, UniProt, TxKG relations)...
              </Typography>
            </Box>
          </AgentCard>
        </>
      );
    }
    if (phase === "results") {
      return (
        <>
          <UserMsg text={submittedQuery} />
          <AgentCard title="TxKG">{TxKGContent()}</AgentCard>
          <AgentCard key={phase+"sg"} title="Sub Graph" defaultOpen={false}>{SubGraphContent()}</AgentCard>
        </>
      );
    }
    if (phase === "subgraph") {
      return (
        <>
          <UserMsg text={submittedQuery} />
          <AgentCard title="TxKG">{TxKGContent()}</AgentCard>
          <AgentCard title="Sub Graph">{SubGraphContent()}</AgentCard>
          <AgentCard key={phase+"dda"} title="DRP Discover Agent" defaultOpen={false}>{MetaPathContent()}</AgentCard>
        </>
      );
    }
    if (phase === "metapath") {
      return (
        <>
          <UserMsg text={submittedQuery} />
          <AgentCard title="TxKG">{TxKGContent()}</AgentCard>
          <AgentCard title="Sub Graph">{SubGraphContent()}</AgentCard>
          <AgentCard title="DRP Discover Agent">{MetaPathContent()}</AgentCard>
        </>
      );
    }
    if (phase === "selectTargets") {
      return (
        <>
          <UserMsg text={submittedQuery} />
          <AgentCard key={phase+"txkg"} title="TxKG" defaultOpen={false}>{TxKGContent()}</AgentCard>
          <AgentCard key={phase+"sg"} title="Sub Graph" defaultOpen={false}>{SubGraphContent()}</AgentCard>
          <AgentCard key={phase+"dda"} title="DRP Discover Agent" defaultOpen={false}>{MetaPathContent()}</AgentCard>
          {SelectTargetsPanel()}
        </>
      );
    }
    if (phase === "litminex") {
      return (
        <>
          <UserMsg text={submittedQuery} />
          <AgentCard key={phase+"txkg"} title="TxKG" defaultOpen={false}>{TxKGContent()}</AgentCard>
          <AgentCard key={phase+"sg"} title="Sub Graph" defaultOpen={false}>{SubGraphContent()}</AgentCard>
          <AgentCard key={phase+"dda"} title="DRP Discover Agent" defaultOpen={false}>{MetaPathContent()}</AgentCard>
          <UserMsg text="Mine literature for Type 2 Diabetes drug targets with confidence scoring" />
          <AgentCard title="DRP LitMinex Agent">{LitMinexCard()}</AgentCard>
        </>
      );
    }
    return null;
  };

  /* ── IDLE ─────────────────────────────────────────────────────────────── */
  if (phase === "idle") {
    return (
      <Box sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        bgcolor: "#FFFFFF",
        p: "80px 40px",
        boxSizing: "border-box",
        overflowY: "auto"
      }}>
        <Box sx={{ maxWidth: "1200px", width: "100%", mx: "auto", display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>

        {/* Hero */}
        <Box sx={{ maxWidth: "680px", width: "100%", mx: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "36px", fontWeight: 700, color: TEXT_DARK, letterSpacing: "-0.02em", lineHeight: 1, mb: "8px" }}>
              Good morning {userName}!
            </Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "16px", color: "#475569" }}>
              How can I help with your drug repurposing research today?
            </Typography>
          </Box>
          <Box sx={{ bgcolor: "#fff", border: `1.5px solid ${BORDER}`, borderRadius: "16px", p: "16px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0px 4px 16px 0px rgba(15,23,42,0.04)" }}>
            <TextField 
              fullWidth 
              variant="standard" 
              placeholder="Type @ for modules or ask a research question..."
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              InputProps={{ disableUnderline: true }}
              sx={{ "& input": { fontFamily: FONT, fontSize: "14px", py: 0, color: TEXT_DARK }, "& input::placeholder": { color: MUTED, opacity: 1 } }} 
            />
            {renderToolbar()}
          </Box>
        </Box>

        {/* Quick start */}
        <Box sx={{ width: "100%", mx: "auto" }}>
          <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 700, color: MUTED, mb: "8px" }}>Quick start</Typography>
          <Box sx={{ display: "flex", gap: "12px" }}>
            {QUICK_STARTS.map(({ Icon, label }) => (
              <Box key={label} onClick={() => setQuery(label)}
                sx={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", px: "12px", py: "10px", height: "38px", cursor: "pointer", bgcolor: "#F1F5F9", border: `1px solid ${BORDER}`, borderRadius: "12px", boxSizing: "border-box", "&:hover": { bgcolor: "#E2E8F0" } }}>
                <Icon sx={{ fontSize: 14, color: TEAL, flexShrink: 0 }} />
                <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: TEXT_DARK, lineHeight: 1.3 }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* KPI cards */}
        <Box sx={{ display: "flex", gap: "20px", flexShrink: 0 }}>
          {statCards.map((card) => <StatCard key={card.label} {...card} />)}
        </Box>

        {/* Widgets */}
        <Box sx={{ display: "flex", gap: "24px", flex: 1, minHeight: 0 }}>
          <Box sx={{ flex: 1, bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "16px", p: "24px", boxShadow: "0px 2px 8px 0px rgba(15,23,42,0.02)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "20px", flexShrink: 0 }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "15px", fontWeight: 600, color: TEXT_DARK }}>Pipeline Overview</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: TEAL, cursor: "pointer" }}>View All</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, overflowY: "auto" }}>
              {pipelineItems.map((item) => (
                <Box key={item.name}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "6px" }}>
                    <Box>
                      <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK, lineHeight: 1 }}>{item.name}</Typography>
                      <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: MUTED, lineHeight: 1, mt: "2px" }}>{item.subtitle}</Typography>
                    </Box>
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: item.color }}>{item.progress}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={item.progress}
                    sx={{ height: 6, borderRadius: 3, bgcolor: "#EFF3F9", "& .MuiLinearProgress-bar": { bgcolor: item.color, borderRadius: 3 } }} />
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ flex: 1, bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "16px", display: "flex", flexDirection: "column", boxShadow: "0px 2px 8px 0px rgba(15,23,42,0.02)", overflow: "hidden" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "24px", py: "20px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "15px", fontWeight: 600, color: TEXT_DARK }}>Recent Research Sessions</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: TEAL, cursor: "pointer" }}>View All</Typography>
            </Box>
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {homeSessions.map((s) => (
                <Box key={s.title} sx={{ display: "flex", alignItems: "center", gap: "12px", px: "20px", py: "14px", borderBottom: `1px solid ${BORDER}`, cursor: "pointer", "&:hover": { bgcolor: BG } }}>
                  <Box sx={{ px: "8px", py: "3px", borderRadius: "4px", bgcolor: s.tagBg, flexShrink: 0 }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: s.tagColor }}>{s.tag}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_DARK, lineHeight: 1.3 }}>{s.title}</Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: MUTED, mt: "2px" }}>{s.subtitle}</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: MUTED, flexShrink: 0 }}>{s.time}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {renderAddPopover()}
        <NewProjectModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
        </Box>
      </Box>
    );
  }

  /* ── CHAT MODE ────────────────────────────────────────────────────────── */
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box", bgcolor: "#FFFFFF" }}>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", pt: "80px", pb: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <Box sx={{ maxWidth: "1200px", width: "100%", mx: "auto", display: "flex", flexDirection: "column", gap: "8px", px: "40px" }}>
          {renderMessages()}
        </Box>
      </Box>
      <Box sx={{ flexShrink: 0, bgcolor: "#FFFFFF" }}>
        <Box sx={{ maxWidth: "1200px", mx: "auto", px: "40px", py: "16px" }}>
          <Box sx={{ bgcolor: "#fff", border: `1.5px solid ${BORDER}`, borderRadius: "16px", p: "16px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.03)" }}>
            <TextField fullWidth variant="standard"
              placeholder="Type @ for modules or ask a research question..."
              value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
              InputProps={{ disableUnderline: true }}
              sx={{ "& input": { fontFamily: FONT, fontSize: "14px", py: 0, color: TEXT_DARK }, "& input::placeholder": { color: MUTED, opacity: 1 } }} />
            {renderToolbar()}
          </Box>
        </Box>
      </Box>
      {renderAddPopover()}
      <NewProjectModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </Box>
  );
};

export default HomePage;