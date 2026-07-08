import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import HubIcon from "@mui/icons-material/Hub";
import ArticleIcon from "@mui/icons-material/Article";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import ScienceIcon from "@mui/icons-material/Science";
import BiotechIcon from "@mui/icons-material/Biotech";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import TimelineIcon from "@mui/icons-material/Timeline";
import { C, GRAD, GRAD_H } from "../../utils/colors";
// ─── THEME: Industry standard pharma/biotech (Schrödinger, BenevolentAI, Insilico palette) ───
const theme = createTheme({
  palette: { mode: "light", primary: { main: "#0A2E52" } },
  typography: { fontFamily: "'Sora', sans-serif" },
});

// ─── COLOR TOKENS ───
// const C = {
//   navy:    "#0A2E52",   // deep pharma navy (primary)
//   teal:    "#007B82",   // scientific teal (secondary)
//   sage:    "#2D6A4F",   // biotech green
//   slate:   "#1E3A5F",   // mid navy
//   sky:     "#E8F4FD",   // light blue bg
//   bg:      "#F4F7FA",   // page background
//   card:    "#FFFFFF",
//   muted:   "#64748B",
//   border:  "rgba(10,46,82,0.10)",
// };

// const GRAD = `linear-gradient(135deg, ${C.navy} 0%, ${C.teal} 55%, ${C.sage} 100%)`;
// const GRAD_H = `linear-gradient(90deg, ${C.navy} 0%, ${C.teal} 100%)`;

// ─── MODULE DATA ─────────────────────────────────────────────────────────────
const modules = [
  {
    id: "txkg",
    tag: "Knowledge Graph",
    Icon: AccountTreeIcon,
    title: "TxKG — Target Identification",
    subtitle: "Disease-Protein-Drug Network Analysis",
    from: C.navy, to: C.slate,
    badge: "KG",
    stats: ["Context-aware graph", "2M+ relationships", "AI confidence scoring"],
    body: "Explores biological networks and disease pathways to identify promising protein targets. Analyzes disease–protein–drug relationships with AI-driven confidence scores, accelerating early-stage discovery.",
    // 
    // imagePlaceholder:"/kg.png",
    // imagePlaceholder: "KG_NETWORK_IMAGE", // <-- replace with <img src="your-kg-network.png" ... />
    diagram: "network",
  },
  {
    id: "litmine",
    tag: "Literature Mining",
    Icon: ArticleIcon,
    title: "LitMineX — Evidence Extraction",
    subtitle: "Semantic PubMed Retrieval & MeSH-Enhanced Search",
    from: C.teal, to: "#005F66",
    badge: "LLM",
    stats: ["MeSH-enhanced semantic search", "LLM-driven contextual retrieval", "Article scoring & ranking"],
    body: "Retrieves scientifically relevant PubMed articles using semantic search powered by MeSH terminology and contextual understanding.\
    Filters studies based on user-defined keywords and related biomedical concepts to deliver precise, high-quality evidence for drug repurposing.\
    The component also streamlines literature ranking, relevance scoring, and full-text PDF access for faster scientific exploration.",
    // IMAGE SUGGESTION: A text/document cluster visualization or word cloud of pharma terms
    // Recommended: D3 word cloud export, NLP pipeline diagram PNG, or PubMed article grid mockup
    imagePlaceholder: "LIT_MINING_IMAGE", // <-- replace with <img src="your-litmine-diagram.png" ... />
    diagram: "flow",
  },
  {
    id: "curatex",
    tag: "Data Curation Engine",
    Icon: HubIcon,
    title: "CurateX — Compound Curation",
    subtitle: "AI-Powered Compound Retrieval & Validation",
    from: C.sage, to: C.teal,
    badge: "AI",
    stats: ["Semantic compound matching", "Confidence-based ranking", "Validated evidence sources"],
    body: "Retrieves and validates drug compounds using AI-driven semantic analysis of user-defined criteria.\
    Integrates trusted medical sources and PubMed evidence to generate confidence-ranked, verified compound profiles for downstream screening.",
    // IMAGE SUGGESTION: Molecular structure grid / compound library visualization
    // Recommended: RDKit-generated molecule grid PNG, ChEMBL compound card mockup, or SMILES structure wall
    imagePlaceholder: "COMPOUND_CURATION_IMAGE", // <-- replace with <img src="your-compound-grid.png" ... />
    diagram: "grid",
  },
  {
    id: "screen",
    tag: "Virtual Screening",
    Icon: SettingsSuggestRoundedIcon,
    title: "ScreenSuite — Interaction Analysis",
    subtitle: "AutoDock Vina + PLIP Profiling",
    from: C.teal, to: C.navy,
    badge: "Docking",
    stats: ["AutoDock Vina engine", "PLIP interaction profiling", "H-bonds, π-stacking"],
    body: "Automates retrieval, preparation, and high-throughput docking. Post-docking, the PLIP module profiles hydrogen bonds, hydrophobic contacts, salt bridges, and π-stacking to prioritize effective candidates.",
    // IMAGE SUGGESTION: 3D molecular docking pose / protein-ligand binding site render
    // Recommended: PyMOL / UCSF Chimera protein-ligand render PNG, or docking score scatter plot
    imagePlaceholder: "DOCKING_POSE_IMAGE", // <-- replace with <img src="your-docking-render.png" ... />
    diagram: "scatter",
  },
  {
    id: "novsearch",
    tag: "Novelty Search",
    Icon: TravelExploreIcon,
    title: "NovSearch — Patent Intelligence",
    subtitle: "Literature & Patent Landscape Analysis",
    from: C.navy, to: C.sage,
    badge: "GenAI",
    stats: ["Patent landscape analysis", "Prior art identification", "Novelty & FTO assessment"],
    body: "Analyzes scientific concepts, drug candidates, and therapeutic strategies against existing patent literature to identify prior art, \
    assess novelty, evaluate freedom-to-operate risks, and generate evidence-backed patent intelligence insights.",
    // IMAGE SUGGESTION: Patent landscape bubble chart or IP heatmap
    // Recommended: Tableau/matplotlib bubble chart export, or a patent citation network diagram
    imagePlaceholder: "PATENT_LANDSCAPE_IMAGE", // <-- replace with <img src="your-patent-chart.png" ... />
    diagram: "bubble",
  },
];

const flowSteps = [
  { label: "Target Identification",    MuiIcon: AccountTreeIcon,          badge: "KG",     from: C.navy, to: C.slate, desc: "Identify disease-linked protein targets" },
  { label: "Literature Mining",        MuiIcon: ArticleIcon,              badge: "LLM",    from: C.slate, to: C.teal, desc: "Semantic scientific evidence extraction" },
  { label: "Data Curation",            MuiIcon: HubIcon,                  badge: "LLM",    from: C.teal, to: "#00696F", desc: "LLM-validated compound collection" },
  { label: "Virtual Screening",        MuiIcon: SettingsSuggestRoundedIcon, badge: "Dock", from: "#00696F", to: C.sage, desc: "Docking & interaction profiling" },
  { label: "Novelty Search",           MuiIcon: TravelExploreIcon,        badge: "GenAI",  from: C.sage, to: C.navy,  desc: "Patent analysis and novelty assessment" },
];

const metrics = [
  { value: "Scientist-Led", label: "Interactive validation and decision-making across every analysis stage", Icon: PsychologyIcon },
  { value: "Context-Aware", label: "Connected biological and therapeutic reasoning across workflows", Icon: HubIcon },
  { value: "Export-Ready", label: "Structured outputs and downloadable research artifacts", Icon: DownloadDoneIcon },
  { value: "End-to-End", label: "Automated pipeline from target to novelty check", Icon: TimelineIcon },
];

// ─── ANIMATED CANVAS ─────────────────────────────────────────────────────────
function ParticleCanvas({ dark = true }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frame;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const nodes = Array.from({ length: 22 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
      p: Math.random() * Math.PI * 2,
    }));
    const alpha = dark ? 0.18 : 0.09;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.p += 0.012;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${(1 - d / 130) * alpha})`; ctx.lineWidth = 0.7; ctx.stroke();
          }
        }
      nodes.forEach(n => {
        const g = (Math.sin(n.p) + 1) / 2;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + g * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.25 + g * 0.2})`; ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, [dark]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ─── ANIMATED DIAGRAM COMPONENTS (inline SVG) ─────────────────────────────────
function NetworkDiagram() {
  return (
    <svg viewBox="0 0 340 220" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="ng1" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#007B82" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0A2E52" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* background field */}
      <ellipse cx="170" cy="110" rx="160" ry="100" fill="url(#ng1)" />

      {/* edges */}
      {[
        [170,110,70,40],
        [170,110,270,40],
        [170,110,50,110],
        [170,110,290,110],
        [170,110,90,180],
        [170,110,250,180],

        [70,40,50,110],
        [270,40,290,110],
        [50,110,90,180],
        [290,110,250,180],

        [70,40,170,60],
        [270,40,170,60],
        [90,180,170,160],
        [250,180,170,160],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(0,123,130,0.35)"
          strokeWidth="1.4"
        />
      ))}

      {/* center node */}
      <circle cx="170" cy="110" r="26" fill="#007B82" />

      <text
        x="170"
        y="114"
        textAnchor="middle"
        fontSize="8.5"
        fill="#fff"
        fontWeight="700"
      >
        Disease
      </text>

      {/* biological nodes */}
      {[
        [70, 40, "Protein A"],
        [270, 40, "Protein B"],
        [50, 110, ["Gene", "Mutation"]],
        [290, 110, ["Genetic", "Disorder"]],
        [90, 180, "Pathway X"],
        [250, 180, "Pathway Y"],
      ].map(([cx, cy, lbl], i) => (
        <g key={i}>
          <circle
            cx={cx}
            cy={cy}
            r="20"
            fill={i % 2 === 0 ? "#1E3A5F" : "#2D6A4F"}
          />

          <text textAnchor="middle" fontSize="6.2" fill="#fff">
            {Array.isArray(lbl) ? (
              <>
                <tspan x={cx} y={cy - 2}>{lbl[0]}</tspan>
                <tspan x={cx} y={cy + 7}>{lbl[1]}</tspan>
              </>
            ) : (
              <tspan x={cx} y={cy + 3}>{lbl}</tspan>
            )}
          </text>
        </g>
      ))}

      {/* context nodes */}
      {[
        [170, 55, "Targets"],
        [170, 165, "Interactions"],
      ].map(([cx, cy, lbl], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="18" fill="#0F4C5C" />

          <text
            x={cx}
            y={cy + 3}
            textAnchor="middle"
            fontSize="6.5"
            fill="#fff"
          >
            {lbl}
          </text>
        </g>
      ))}
    </svg>
  );
}

function FlowDiagram() {
  return (
    <svg viewBox="0 0 520 420" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0A2E52" />
          <stop offset="100%" stopColor="#007B82" />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* connection lines */}
      {[
        [260, 95, 260, 150],
        [260, 235, 260, 290],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="url(#flowGrad)"
          strokeWidth="5"
          strokeDasharray="10 8"
          opacity="0.85"
        >
          <animate attributeName="stroke-dashoffset" values="0;-60" dur="3s" repeatCount="indefinite" />
        </line>
      ))}

      {[
        {
          title: "PubMed Retrieval",
          sub: "Semantic search + MeSH mapping",
          x: 90,
          y: 30,
          color: "#0A2E52",
          icon: "📄",
        },
        {
          title: "Context Filtering",
          sub: "Keyword & concept refinement",
          x: 90,
          y: 170,
          color: "#007B82",
          icon: "🧠",
        },
        {
          title: "Evidence Ranking",
          sub: "Scoring + PDF prioritization",
          x: 90,
          y: 310,
          color: "#2D6A4F",
          icon: "📊",
        },
      ].map((item, i) => (
        <g key={i}>

          {/* glow */}
          <rect x={item.x - 12} y={item.y - 12} width="360" height="90" rx="28" fill={item.color} opacity="0.12" filter="url(#glow)">
            <animate attributeName="opacity" values="0.08;0.2;0.08" dur={`${2 + i}s`} repeatCount="indefinite" />
          </rect>

          {/* main card */}
          <rect x={item.x} y={item.y} width="340" height="70" rx="24" fill={item.color} />

          {/* icon bubble */}
          <circle cx={item.x + 45} cy={item.y + 35} r="22" fill="rgba(255,255,255,0.14)" />
          <text x={item.x + 45} y={item.y + 42} textAnchor="middle" fontSize="20">
            {item.icon}
          </text>

          {/* title */}
          <text x={item.x + 95} y={item.y + 30} fontSize="18" fill="#fff" fontWeight="700">
            {item.title}
          </text>

          {/* subtitle */}
          <text x={item.x + 95} y={item.y + 52} fontSize="12" fill="rgba(255,255,255,0.82)">
            {item.sub}
          </text>
        </g>
      ))}

      {/* moving particles */}
      {[140, 280].map((y, i) => (
        <circle key={i} cx="260" cy={y} r="7" fill="#5EEAD4">
          <animate attributeName="cy" values={`${y};${y + 28};${y}`} dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* footer */}
      <text x="260" y="405" textAnchor="middle" fontSize="15" fill="#007B82" fontWeight="700">
        Intelligent literature retrieval and evidence prioritization
      </text>
    </svg>
  );
}
function GridDiagram() {
  const compounds = [
    { name: "Imatinib", score: "92%", tag: "High Match", color: "#007B82" },
    { name: "Metformin", score: "88%", tag: "Validated", color: "#2D6A4F" },
    { name: "Dasatinib", score: "81%", tag: "Evidence Linked", color: "#0A2E52" },
  ];

  return (
    <svg viewBox="0 0 1200 900" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#007B82" />
          <stop offset="100%" stopColor="#0A2E52" />
        </linearGradient>

        <filter id="softGlow">
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* vertical pipeline */}
      <path d="M600 120 L600 690" fill="none" stroke="url(#flowLine)" strokeWidth="10" strokeDasharray="24 14" opacity="0.8">
        <animate attributeName="stroke-dashoffset" values="0;-120" dur="3s" repeatCount="indefinite" />
      </path>

      {/* moving signals */}
      {[220, 380, 540].map((y, i) => (
        <circle key={i} cx="600" cy={y} r="16" fill="#5EEAD4">
          <animate attributeName="cy" values={`${y};${y + 45};${y}`} dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.6 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {compounds.map((c, i) => {
        const left = i % 2 === 0;
        const x = left ? 80 : 700;
        const y = 120 + i * 190;

        return (
          <g key={i}>

            {/* connector */}
            <line
              x1={left ? x + 420 : 600}
              y1={y + 95}
              x2={left ? 600 : x}
              y2={y + 95}
              stroke={c.color}
              strokeWidth="5"
              opacity="0.45"
              strokeDasharray="12 8"
            />

            {/* outer glow */}
            <rect x={x - 14} y={y - 14} width="450" height="190" rx="40" fill={c.color} opacity="0.12" filter="url(#softGlow)">
              <animate attributeName="opacity" values="0.08;0.18;0.08" dur={`${2 + i}s`} repeatCount="indefinite" />
            </rect>

            {/* main card */}
            <rect x={x} y={y} width="420" height="160" rx="34" fill="#FFFFFF" stroke={c.color} strokeWidth="5" />

            {/* molecule icon */}
            <circle cx={x + 80} cy={y + 80} r="46" fill={c.color} opacity="0.14" />
            <text x={x + 80} y={y + 96} textAnchor="middle" fontSize="42">
              ⚗
            </text>

            {/* compound title */}
            <text x={x + 155} y={y + 58} fontSize="34" fill="#0A2E52" fontWeight="700">
              {c.name}
            </text>

            {/* confidence */}
            <text x={x + 155} y={y + 102} fontSize="24" fill="#64748B">
              Confidence Score
            </text>

            <text x={x + 155} y={y + 136} fontSize="30" fill={c.color} fontWeight="700">
              {c.score}
            </text>

            {/* validation badge */}
            <rect x={x + 275} y={y + 118} width="115" height="34" rx="18" fill={c.color} opacity="0.14" />

            <text x={x + 332} y={y + 141} textAnchor="middle" fontSize="16" fill={c.color} fontWeight="700">
              {c.tag}
            </text>
          </g>
        );
      })}

      {/* evidence sources */}
      {[
        [220, 790, "PubMed"],
        [600, 790, "Medical Sources"],
        [980, 790, "URL Validation"],
      ].map(([cx, cy, label], i) => (
        <g key={i}>

          <circle cx={cx} cy={cy} r="70" fill="#E6F7F8" stroke="#007B82" strokeWidth="5">
            <animate attributeName="r" values="70;78;70" dur={`${2 + i}s`} repeatCount="indefinite" />
          </circle>

          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="22" fill="#007B82" fontWeight="700">
            {label}
          </text>
        </g>
      ))}

      {/* footer */}
      <text x="600" y="885" textAnchor="middle" fontSize="28" fill="#007B82" fontWeight="700">
        Compound retrieval, evidence validation, and confidence-based prioritization
      </text>
    </svg>
  );
}
function ScatterDiagram() {
  return (
    <svg viewBox="0 0 420 280" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="proteinGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#007B82" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0A2E52" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="dockLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5EEAD4" />
          <stop offset="100%" stopColor="#007B82" />
        </linearGradient>
      </defs>

      {/* background glow */}
      <ellipse cx="210" cy="140" rx="180" ry="115" fill="url(#proteinGlow)" />

      {/* protein structure blob */}
      <path
        d="M90 120 C70 70,130 40,190 70 C240 20,320 50,315 120 C360 150,330 220,250 215 C210 255,120 240,95 190 C55 175,55 135,90 120 Z"
        fill="#0A2E52"
        opacity="0.92"
      />

      {/* binding pocket */}
      <ellipse cx="215" cy="138" rx="42" ry="28" fill="#0F766E" opacity="0.85" />

      {/* ligand */}
      <g>
        <circle cx="210" cy="138" r="10" fill="#5EEAD4" />
        <circle cx="232" cy="124" r="8" fill="#5EEAD4" />
        <circle cx="248" cy="144" r="8" fill="#5EEAD4" />
        <circle cx="226" cy="158" r="8" fill="#5EEAD4" />

        <line x1="210" y1="138" x2="232" y2="124" stroke="url(#dockLine)" strokeWidth="3" />
        <line x1="232" y1="124" x2="248" y2="144" stroke="url(#dockLine)" strokeWidth="3" />
        <line x1="248" y1="144" x2="226" y2="158" stroke="url(#dockLine)" strokeWidth="3" />
        <line x1="226" y1="158" x2="210" y2="138" stroke="url(#dockLine)" strokeWidth="3" />
      </g>

      {/* interaction lines */}
      {[
        [170,110,210,138],
        [185,165,226,158],
        [255,105,232,124],
        [270,170,248,144],
      ].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FACC15" strokeWidth="2" strokeDasharray="5 4" opacity="0.9" />
      ))}

      {/* labels */}
      <text x="110" y="55" textAnchor="middle" fontSize="12" fill="#E2E8F0" fontWeight="700">
        Protein Target
      </text>

      <text x="285" y="105" textAnchor="middle" fontSize="11" fill="#5EEAD4" fontWeight="700">
        Ligand
      </text>

      {/* workflow indicators */}
      {[
        ["Protein Prep", 70],
        ["Docking", 180],
        ["PLIP Analysis", 300],
      ].map(([txt, x], i) => (
        <g key={i}>
          <rect x={x} y="250" width="90" height="28" rx="10" fill={i === 1 ? "#007B82" : "#16324F"} />
          <text x={x + 45} y="267" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">
            {txt}
          </text>
        </g>
      ))}

      {/* connector arrows */}
      <line x1="160" y1="266" x2="180" y2="266" stroke="#94A3B8" strokeWidth="2" />
      <line x1="270" y1="266" x2="300" y2="266" stroke="#94A3B8" strokeWidth="2" />

      {/* footer */}
      <text x="210" y="24" textAnchor="middle" fontSize="13" fill="#007B82" fontWeight="700">
        Protein–Ligand Docking & Interaction Profiling
      </text>
    </svg>
  );
}
function BubbleDiagram() {
  return (
    <svg viewBox="0 0 420 300" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="patGlow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#007B82" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0A2E52" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="docGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0A2E52" />
          <stop offset="100%" stopColor="#007B82" />
        </linearGradient>

        <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D6A4F" />
          <stop offset="100%" stopColor="#007B82" />
        </linearGradient>
      </defs>

      {/* background glow */}
      <ellipse cx="210" cy="150" rx="180" ry="120" fill="url(#patGlow)" />

      {/* patent documents */}
      {[65, 95, 125].map((y, i) => (
        <g key={i}>
          <rect x="45" y={y} width="95" height="55" rx="10" fill="url(#docGrad)" opacity={0.95 - i * 0.12} />
          <line x1="60" y1={y + 15} x2="120" y2={y + 15} stroke="#D1FAE5" strokeWidth="2" />
          <line x1="60" y1={y + 27} x2="112" y2={y + 27} stroke="#D1FAE5" strokeWidth="2" opacity="0.7" />
          <line x1="60" y1={y + 39} x2="100" y2={y + 39} stroke="#D1FAE5" strokeWidth="2" opacity="0.5" />
        </g>
      ))}

      {/* search beam */}
      <path d="M150 145 C190 120, 215 120, 250 145" fill="none" stroke="#5EEAD4" strokeWidth="4" strokeDasharray="7 5" opacity="0.9" />

      {/* AI reasoning core */}
      <g>
        <circle cx="280" cy="145" r="48" fill="url(#brainGrad)" opacity="0.95" />
        <circle cx="280" cy="145" r="34" fill="#0A2E52" opacity="0.45" />

        {/* neural nodes */}
        {[
          [265,130],[295,130],[280,145],[265,160],[295,160]
        ].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r="5" fill="#5EEAD4" />
        ))}

        {[
          [265,130,280,145],
          [295,130,280,145],
          [265,160,280,145],
          [295,160,280,145],
        ].map(([x1,y1,x2,y2],i)=>(
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D1FAE5" strokeWidth="1.8" />
        ))}

        <text x="280" y="198" textAnchor="middle" fontSize="10" fill="#007B82" fontWeight="700">
          Patent Reasoning
        </text>
      </g>

      {/* output analysis cards */}
      {[
        [320,70,"Novelty"],
        [330,135,"Claims"],
        [320,200,"FTO Risk"],
      ].map(([x,y,label],i)=>(
        <g key={i}>
          <rect x={x} y={y} width="70" height="38" rx="10" fill="#16324F" />
          <circle cx={x + 14} cy={y + 19} r="6" fill="#5EEAD4" />
          <text x={x + 42} y={y + 23} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">
            {label}
          </text>
        </g>
      ))}

      {/* connecting analysis lines */}
      {[
        [315,120,330,90],
        [328,145,330,154],
        [315,170,330,220],
      ].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FACC15" strokeWidth="2" strokeDasharray="5 4" opacity="0.9" />
      ))}

      {/* footer */}
      <text x="210" y="28" textAnchor="middle" fontSize="15" fill="#007B82" fontWeight="700">
        Patent Intelligence & Novelty Assessment
      </text>

      <text x="210" y="278" textAnchor="middle" fontSize="10" fill="#64748B">
        Structured patent analysis for novelty and freedom-to-operate evaluation
      </text>
    </svg>
  );
}

const DiagramMap = { network: NetworkDiagram, flow: FlowDiagram, grid: GridDiagram, scatter: ScatterDiagram, bubble: BubbleDiagram };

// ─── INTERSECTION HOOK ────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroBanner() {
  return (
    <Box sx={{ position: "relative", borderRadius: "20px", overflow: "hidden", mb: 4, background: GRAD, minHeight: { xs: 260, md: 300 } }}>
      <ParticleCanvas dark />
      {/* subtle grid */}
      <Box sx={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

      <Box sx={{ position: "relative", zIndex: 1, p: { xs: "28px 22px", md: "44px 52px" }, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Logo image + Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="logo"
            sx={{
              height: 44,
              width: 44,
              objectFit: "contain",
              transition: "transform 0.25s ease",
              "&:hover": {
                transform: "scale(1.05) rotate(2deg)",
              },
            }}
          />

          <Typography
            sx={{
              fontFamily: "'Sora',sans-serif",
              fontWeight: 700,
              fontSize: { xs: "25px", md: "30px" },
              color: "#fff",
              letterSpacing: "0.3px",
            }}
          >
            Drug Repurposing Platform
          </Typography>
        </Box>

        
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 1.5, py: 0.45, borderRadius: "20px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", width: "fit-content" }}>
          <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#5EEAD4", animation: "blink 1.8s ease-in-out infinite" }} />
          <Typography sx={{ fontSize: "10.5px", fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "1.2px", textTransform: "uppercase" }}>
            Powered by GenAI
          </Typography>
        </Box>

        <Typography sx={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: { xs: "15px", md: "25px" }, color: "#fff", lineHeight: 1.22, maxWidth: "100%" }}>
          From Target to Repurposing Hit —<br />Automated & Intelligent
        </Typography>
        <Typography sx={{ fontSize: "13.5px", color: "rgba(255,255,255,0.78)", lineHeight: 1.8, maxWidth: "100%" }}>
          An end-to-end pipeline that combines knowledge graphs, scientific evidence  <br/> 
          extraction, compound curation, molecular interaction analysis, and  <br/>
          patent intelligence to accelerate repurposing decisions.
        </Typography>
      </Box>
      {/* RIGHT SIDE FLOATING MOLECULES */}
    <Box
      sx={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "45%",
        pointerEvents: "none",
        overflow: "hidden",
        display: { xs: "none", md: "block" }
      }}
    >
      {[...Array(12)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: 10 + (i % 3) * 4,
            height: 10 + (i % 3) * 4,
            borderRadius: "50%",
            background:
              i % 2 === 0
                ? "rgba(94,234,212,0.7)"
                : "rgba(255,255,255,0.25)",
            filter: "blur(0.2px)",
            animation: `floatAnim ${4 + (i % 4)}s ease-in-out infinite`,
            top: `${10 + i * 7}%`,
            left: `${20 + (i % 5) * 15}%`,
          }}
        />
      ))}
    </Box>
    </Box>
  );
}

// ─── METRICS BAR ─────────────────────────────────────────────────────────────
function MetricsBar() {
  const [ref, visible] = useInView();
  return (
    <Box ref={ref} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: "12px", mb: 4 }}>
      {metrics.map(({ value, label, Icon }, i) => (
        <Box key={i} sx={{
          background: C.card, borderRadius: "14px", p: "18px 20px",
          border: `1px solid ${C.border}`, boxShadow: "0 2px 10px rgba(10,46,82,0.06)",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: `opacity .5s ${i * 0.1}s, transform .5s ${i * 0.1}s`,
        }}>
          <Icon sx={{ fontSize: 20, color: C.teal, mb: 0.8 }} />
          <Typography sx={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: { xs: "20px", md: "26px" }, color: C.navy, lineHeight: 1 }}>
            {value}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: C.muted, mt: 0.5, lineHeight: 1.5 }}>{label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

// ─── PROCESS FLOW ────────────────────────────────────────────────────────────
function ProcessFlow() {
  const [ref, visible] = useInView(0.1);
  return (
    <Box ref={ref} sx={{ mb: 4 }}>
      <Box sx={{
        background: C.card, borderRadius: "18px", p: { xs: "20px 14px", md: "30px 32px 26px" },
        border: `1px solid ${C.border}`, boxShadow: "0 4px 20px rgba(10,46,82,0.07)",
        position: "relative", overflow: "hidden",
      }}>
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: GRAD }} />

        <Typography sx={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: { xs: "16px", md: "19px" }, color: C.navy, mb: 0.5, textAlign: "center" }}>
          Repurposing Pipeline
        </Typography>
        <Typography sx={{ fontSize: "12.5px", color: C.muted, textAlign: "center", mb: 3.5 }}>
          Five integrated modules · Fully automated · AI-native throughout
        </Typography>

        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
          {flowSteps.map((step, i) => {
            const IconComp = step.MuiIcon;
            const prog = visible ? Math.max(0, Math.min(1, 1 - (flowSteps.length - 1 - i) * 0.12)) : 0;
            return (
              <React.Fragment key={step.label}>
                <Box sx={{
                  flex: 1, minWidth: 0,
                  opacity: prog, transform: `translateY(${(1 - prog) * 12}px)`,
                  transition: `opacity .45s ${i * 0.1}s, transform .45s ${i * 0.1}s`,
                }}>
                  <Box sx={{
                    borderRadius: "12px", overflow: "hidden", border: `1.5px solid ${C.border}`,
                    background: C.card, boxShadow: "0 2px 8px rgba(10,46,82,0.06)",
                    "&:hover": { boxShadow: "0 8px 28px rgba(10,46,82,0.14)", transform: "translateY(-3px)", transition: "all .25s" },
                    transition: "all .25s",
                  }}>
                    <Box sx={{ background: `linear-gradient(135deg,${step.from},${step.to})`, p: "10px 8px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(255,255,255,0.35)" }}>
                        <IconComp sx={{ fontSize: 16, color: "#fff" }} />
                      </Box>
                      {step.badge && (
                        <Box sx={{ px: 0.9, py: 0.15, borderRadius: "8px", background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.3)" }}>
                          <Typography sx={{ fontSize: "8.5px", fontWeight: 700, color: "#fff", letterSpacing: ".3px" }}>{step.badge}</Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ p: "8px 8px 10px", background: C.card }}>
                      <Typography sx={{ fontSize: "10.5px", fontWeight: 700, color: C.navy, textAlign: "center", lineHeight: 1.3, mb: 0.4 }}>{step.label}</Typography>
                      <Typography sx={{ fontSize: "9px", color: C.muted, textAlign: "center", lineHeight: 1.5 }}>{step.desc}</Typography>
                    </Box>
                  </Box>
                </Box>
                {i < flowSteps.length - 1 && (
                  <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0, width: { xs: "14px", md: "22px" }, mt: "42px", opacity: visible ? 1 : 0, transition: `opacity .4s ${(i + 1) * 0.1}s` }}>
                    <Box sx={{ flex: 1, height: "1.5px", background: GRAD_H }} />
                    <Box sx={{ width: 0, height: 0, borderTop: "4px solid transparent", borderBottom: "4px solid transparent", borderLeft: "6px solid " + C.teal }} />
                  </Box>
                )}
              </React.Fragment>
            );
          })}
        </Box>

        {/* Outcome */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2.5, opacity: visible ? 1 : 0, transition: "opacity .6s .7s" }}>
          <Box sx={{ width: "2px", height: "22px", background: GRAD }} />
          <Box sx={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: `12px solid ${C.teal}` }} />
          <Box sx={{
            mt: 1, px: 4, py: 1.2, borderRadius: "30px",
            background: "linear-gradient(#fff,#fff) padding-box, linear-gradient(90deg,#0A2E52,#007B82,#2D6A4F) border-box",
            border: "2px solid transparent",
          }}>
            <Typography sx={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "14px", background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Repurposing Hit Identification
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─── MODULE CARDS ─────────────────────────────────────────────────────────────
function ModuleCard({ mod, index }) {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useInView(0.12);
  const DiagramComp = DiagramMap[mod.diagram];

  return (
    <Box ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      sx={{
        borderRadius: "16px", overflow: "hidden",
        border: `1.5px solid ${hovered ? C.teal + "55" : C.border}`,
        background: C.card,
        boxShadow: hovered ? `0 12px 40px rgba(10,46,82,0.13)` : "0 2px 10px rgba(10,46,82,0.06)",
        transition: "all .3s cubic-bezier(.4,0,.2,1)",
        transform: hovered ? "translateY(-4px)" : visible ? "translateY(0)" : "translateY(20px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 0.08}s`,
        display: "flex", flexDirection: { xs: "column", md: index % 2 === 0 ? "row" : "row-reverse" },
      }}>

      {/* Left: Info panel */}
      <Box sx={{ flex: 1, p: { xs: "22px", md: "28px 30px" }, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flexWrap: "wrap" }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: "10px", flexShrink: 0,
            background: `linear-gradient(135deg,${mod.from},${mod.to})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <mod.Icon sx={{ fontSize: 18, color: "#fff" }} />
          </Box>
          <Chip label={mod.tag} size="small" sx={{ height: 22, fontSize: "10px", fontWeight: 700, background: mod.from + "15", color: mod.from, border: `1px solid ${mod.from}30`, borderRadius: "6px" }} />
          <Chip label={mod.badge} size="small" sx={{ height: 22, fontSize: "10px", fontWeight: 700, background: `linear-gradient(90deg,${mod.from},${mod.to})`, color: "#fff", borderRadius: "6px" }} />
        </Box>

        <Box>
          <Typography sx={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: { xs: "15px", md: "17px" }, color: C.navy, mb: 0.3 }}>
            {mod.title}
          </Typography>
          <Typography sx={{ fontSize: "11.5px", color: C.teal, fontWeight: 600 }}>{mod.subtitle}</Typography>
        </Box>

        <Typography sx={{ fontSize: "12.5px", color: C.muted, lineHeight: 1.78 }}>{mod.body}</Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6 }}>
          {mod.stats.map((s, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 13, color: C.teal, flexShrink: 0 }} />
              <Typography sx={{ fontSize: "11.5px", color: "#374151" }}>{s}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right: Diagram panel */}
      <Box sx={{
        width: { xs: "100%", md: "260px" }, flexShrink: 0,
        background: `linear-gradient(135deg,${mod.from}0A,${mod.to}18)`,
        borderLeft: { md: index % 2 === 0 ? `1px solid ${C.border}` : "none" },
        borderRight: { md: index % 2 !== 0 ? `1px solid ${C.border}` : "none" },
        borderTop: { xs: `1px solid ${C.border}`, md: "none" },
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        p: "16px", minHeight: { xs: 160, md: "auto" },
        position: "relative",
      }}>
        {/*
          IMAGE PLACEHOLDER: Replace the SVG diagram below with an actual image for each module.
          Example:
            <img
              src={`/assets/${mod.imagePlaceholder}.png`}
              alt={mod.title}
              style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px" }}
            />
          See imagePlaceholder field in each module object for suggested filename.
          Recommended image sizes: 520×320px, PNG with transparent or white background.
        */}
        <DiagramComp />
        {/* <img
          src={mod.imagePlaceholder}
          alt={mod.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: "10px",
          }}
        /> */}
      </Box>
    </Box>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const AboutUs = () => (
  <ThemeProvider theme={theme}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
      @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.25} }
      * { box-sizing: border-box; }
    `}</style>
    <Box sx={{ minHeight: "100vh", width: "100%", background: C.bg, p: { xs: "14px", md: "24px 28px" } }}>
      <Box sx={{ maxWidth: 1080, mx: "auto" }}>

        <HeroBanner />
        <MetricsBar />
        <ProcessFlow />

        {/* Modules section header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
          <Typography sx={{ fontSize: "10px", fontWeight: 700, color: C.muted, letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Platform Components
          </Typography>
          <Box sx={{ flex: 1, height: "1px", background: `linear-gradient(90deg,${C.navy}40,transparent)` }} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {modules.map((mod, i) => <ModuleCard key={mod.id} mod={mod} index={i} />)}
        </Box>

        <Typography sx={{ mt: 4, mb: 1, textAlign: "center", fontSize: "11px", color: "#9CA3AF" }}>
          Copyright © 2026 | Drug Repurposing Platform · Powered by GenAI 
        </Typography>
      </Box>
    </Box>
  </ThemeProvider>
);

export default AboutUs;