import React, { useState } from "react";
import {
  Box, Typography, Autocomplete, TextField, Paper, Collapse,
} from "@mui/material";
import {
  AccountTreeOutlined, ExpandMoreOutlined, ExpandLessOutlined,
  HubOutlined, GridOnOutlined, BiotechOutlined, TrackChangesOutlined,
} from "@mui/icons-material";

const TEAL   = "#0ABFBC";
const DARK   = "#0F172A";
const SUB    = "#64748B";
const FONT   = "'Inter', sans-serif";
const BORDER = "#E2E8F0";

const DISEASES = ["Thrombocytosis","Alzheimer Disease","Schizophrenia","Diabetes","Cancer","Parkinson Disease"];

const TARGETS_DATA = {
  Thrombocytosis: [
    { uniprot:"P05106", target:"Thrombopoietin receptor",                                   score:89 },
    { uniprot:"P06239", target:"Tyrosine protein kinase JAK2",                              score:84 },
    { uniprot:"P40225", target:"Thrombopoietin",                                            score:39 },
    { uniprot:"Q5VWK5", target:"Interleukin-5 receptor",                                   score:23 },
    { uniprot:"P28223", target:"Cytokine receptor common subunit beta",                     score:23 },
    { uniprot:"P08919", target:"Granulocyte colony-stimulating factor receptor 1",          score:23 },
    { uniprot:"P09603", target:"Macrophage colony-stimulating factor 1 receptor",           score:23 },
    { uniprot:"P40190", target:"Interleukin-9 receptor",                                   score:21 },
    { uniprot:"Q15146", target:"Phosphatidylinositol 3,4,5-trisphosphate 5-phosphatase 2", score:21 },
    { uniprot:"P09651", target:"Clathrin-associated mediating protein 22",                  score:21 },
  ],
};

const INTERPRETATION = {
  Thrombocytosis: [
    "The predicted therapeutic targets for Thrombocytosis suggest a potential mechanism of action involving the modulation of thrombopoietin signaling pathways, particularly those regulated by thrombopoietin and its receptor.",
    "The involvement of JAK2, which is a key downstream effector of thrombopoietin receptor signaling, implies that inhibiting this pathway may help mitigate excessive platelet production. The identification of Interleukin-2/5 receptor and cytokine receptor common subunit beta as potential targets also hints at a role for immune-related pathways in the pathogenesis of Thrombocytosis.",
    "These findings have notable research implications, as they may inform the development of targeted therapies aimed at normalizing platelet counts and reducing the risk of thrombotic complications.",
  ],
};

const ARTICLES = {
  Thrombocytosis: [
    { title:"The MPL mutation...", source:"PubMed" },
    { title:"Essential Thrombocythemia: 2024 update on diagnosis, risk stratification and management...", source:"pubmed" },
    { title:"Dynamics and Transcriptomics of Thrombopoietin Combination...", source:"pubmed" },
  ],
};

const SG_COLORS = { disease:"#0ABFBC", protein:"#F59E0B", pathway:"#8B5CF6", compound:"#10B981" };

const SG_NODES = [
  { id:"jak2",   label:"JAK2",        type:"protein",  x:250, y:185, r:28, selected:true },
  { id:"thromb", label:"Thromb.",     type:"disease",  x:155, y:125, r:22 },
  { id:"tpo",    label:"TPO",         type:"protein",  x:248, y:65,  r:18 },
  { id:"calr",   label:"CALR",        type:"protein",  x:348, y:105, r:20 },
  { id:"mpn",    label:"MPN",         type:"disease",  x:418, y:112, r:18 },
  { id:"mpl",    label:"MPL",         type:"protein",  x:155, y:205, r:18 },
  { id:"pi3k",   label:"PI3K",        type:"compound", x:100, y:152, r:18 },
  { id:"il6",    label:"IL-6",        type:"protein",  x:162, y:282, r:18 },
  { id:"ruxo",   label:"Ruxolitinib", type:"compound", x:242, y:300, r:18 },
  { id:"stat5",  label:"STAT5",       type:"protein",  x:342, y:225, r:18 },
  { id:"mak",    label:"MAK",         type:"protein",  x:400, y:172, r:16 },
  { id:"rc402",  label:"RC-402",      type:"compound", x:395, y:262, r:15 },
  { id:"eft03",  label:"efT03",       type:"compound", x:328, y:295, r:15 },
];

const SG_EDGES = [
  ["jak2","thromb"],["jak2","tpo"],["jak2","calr"],["jak2","mpn"],
  ["jak2","mpl"],["jak2","pi3k"],["jak2","il6"],["jak2","ruxo"],
  ["jak2","stat5"],["jak2","mak"],["jak2","rc402"],["jak2","eft03"],
];

const MP_TARGETS = [
  { name:"Thrombopoietin receptor",           score:89,
    paths:["Thrombocytosis > Thrombopoietin receptor","Thrombocytosis > Thrombopoietin > Thrombopoietin receptor","Thrombocytosis > JAK2 > Thrombopoietin receptor"] },
  { name:"Tyrosine protein kinase JAK2",       score:66, paths:[] },
  { name:"Thrombopoietin",                     score:44, paths:[] },
  { name:"Interleukin-2 receptor alpha chain", score:31, paths:[] },
  { name:"Cytokine receptor common subunit beta", score:22, paths:[] },
];

const TxKG = () => {
  const [activeTab,      setActiveTab]      = useState("target");
  const [disease,        setDisease]        = useState(null);
  const [expandedTarget, setExpandedTarget] = useState("Thrombopoietin receptor");

  const targets        = disease ? (TARGETS_DATA[disease] || []) : [];
  const interpretation = disease ?  INTERPRETATION[disease] || null : null;
  const articles       = disease ?  ARTICLES[disease] || null : null;

  const TABS = [
    { key:"target",   label:"Target Prediction" },
    { key:"subgraph", label:"Sub Graph"          },
    { key:"metapath", label:"Meta-Path"          },
  ];

  const TITLE = {
    target:   "TxKG \u2014 Therapeutic Target Prediction",
    subgraph: "TxKG \u2014 Knowledge Graph",
    metapath: "TxKG \u2014 Meta-Path Analysis",
  };

  return (
    /* Root: full-height flex column so nothing scrolls outside */
    <Box sx={{ px:"28px", pt:"24px", pb:"16px", fontFamily:FONT,
      height:"100%", display:"flex", flexDirection:"column",
      boxSizing:"border-box", overflow:"hidden" }}>

      {/* Title row - fixed */}
      <Box sx={{ flexShrink:0 }}>
        <Typography sx={{ fontFamily:FONT, fontWeight:700, fontSize:"22px", color:DARK }}>
          {TITLE[activeTab]}
        </Typography>
        {activeTab === "target" && (
          <Typography sx={{ fontFamily:FONT, fontSize:"13px", color:SUB, mt:"4px" }}>
            {disease
              ? "Explore biological networks and disease pathways to identify promising protein targets."
              : "Map disease-protein-pathway relationships by context aware knowledge graph."}
          </Typography>
        )}
      </Box>

      {/* Tab bar - fixed */}
      <Box sx={{ display:"flex", mt:"14px", borderBottom:`1px solid ${BORDER}`, mb:"16px", flexShrink:0 }}>
        {TABS.map(t => (
          <Box key={t.key} onClick={() => setActiveTab(t.key)}
            sx={{ px:"16px", pb:"10px", cursor:"pointer", mr:"4px",
              borderBottom: activeTab === t.key ? `2px solid ${TEAL}` : "2px solid transparent",
              mb:"-1px" }}>
            <Typography sx={{ fontFamily:FONT, fontSize:"14px",
              fontWeight: activeTab === t.key ? 600 : 400,
              color: activeTab === t.key ? TEAL : SUB }}>
              {t.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Tab content - takes all remaining height */}
      <Box sx={{ flex:1, minHeight:0, overflow:"hidden" }}>

        {/* ── Tab 1: Target Prediction ── */}
        {activeTab === "target" && (
          <Box sx={{ display:"flex", gap:"20px", height:"100%", overflow:"hidden" }}>

            {/* Left: disease + table */}
            <Box sx={{ flex:1, bgcolor:"#fff", border:`1px solid ${BORDER}`, borderRadius:"12px",
              display:"flex", flexDirection:"column", overflow:"hidden" }}>
              <Box sx={{ p:"14px 20px", borderBottom:`1px solid ${BORDER}`, flexShrink:0 }}>
                <Typography sx={{ fontFamily:FONT, fontSize:"13px", fontWeight:600, color:DARK, mb:"10px" }}>Disease</Typography>
                <Autocomplete options={DISEASES} value={disease} onChange={(_, v) => setDisease(v)} size="small"
                  renderInput={params => (
                    <TextField {...params} placeholder="Search for a disease..."
                      sx={{ "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:FONT, fontSize:"13px",
                        "& fieldset":{ borderColor:BORDER },
                        "&:hover fieldset":{ borderColor:"#CBD5E1" },
                        "&.Mui-focused fieldset":{ borderColor:TEAL } } }} />
                  )}
                  PaperComponent={props => (
                    <Paper {...props} sx={{ fontFamily:FONT, fontSize:"13px", borderRadius:"8px",
                      border:`1px solid ${BORDER}`, boxShadow:"0 4px 16px rgba(0,0,0,0.08)" }} />
                  )}
                />
              </Box>

              {/* Table header */}
              <Box sx={{ display:"grid", gridTemplateColumns:"150px 1fr 80px",
                px:"20px", py:"9px", bgcolor:"#F8FAFC", borderBottom:`1px solid ${BORDER}`, flexShrink:0 }}>
                {["UNIPROT ID","TARGET","SCORE"].map((col,i) => (
                  <Typography key={col} sx={{ fontFamily:FONT, fontSize:"11px", fontWeight:600,
                    color:"#94A3B8", letterSpacing:"0.7px", textAlign: i===2 ? "right" : "left" }}>
                    {col}
                  </Typography>
                ))}
              </Box>

              {/* Rows or empty - scrollable */}
              <Box sx={{ flex:1, overflowY:"auto" }}>
                {targets.length === 0 ? (
                  <Box sx={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"12px" }}>
                    <AccountTreeOutlined sx={{ fontSize:38, color:"#CBD5E1" }} />
                    <Typography sx={{ fontFamily:FONT, fontSize:"13px", color:"#94A3B8" }}>
                      Select a disease to see targets predicted.
                    </Typography>
                  </Box>
                ) : (
                  targets.map((t) => (
                    <Box key={t.uniprot} sx={{ display:"grid", gridTemplateColumns:"150px 1fr 80px",
                      px:"20px", py:"8px", alignItems:"center",
                      borderTop:`1px solid #F1F5F9`, "&:hover":{ bgcolor:"#F8FAFC" } }}>
                      <Typography component="a"
                        href={`https://www.uniprot.org/uniprotkb/${t.uniprot}`}
                        target="_blank" rel="noreferrer"
                        sx={{ fontFamily:FONT, fontSize:"13px", color:TEAL, textDecoration:"none",
                          fontWeight:500, "&:hover":{ textDecoration:"underline" } }}>
                        {t.uniprot}
                      </Typography>
                      <Typography sx={{ fontFamily:FONT, fontSize:"13px", color:DARK }}>{t.target}</Typography>
                      <Typography sx={{ fontFamily:FONT, fontSize:"13px", color:DARK, textAlign:"right", fontWeight:500 }}>
                        {t.score}.00
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Box>

            {/* Right: Interpretation (flex-fill) + Articles (pinned bottom) */}
            <Box sx={{ width:"380px", flexShrink:0, display:"flex", flexDirection:"column", height:"100%", gap:"12px" }}>
              <Box sx={{ flex:1, minHeight:0, bgcolor:"#fff", border:`1px solid ${BORDER}`, borderRadius:"12px",
                p:"20px", display:"flex", flexDirection:"column", overflow:"hidden" }}>
                <Typography sx={{ fontFamily:FONT, fontWeight:600, fontSize:"15px", color:DARK, mb:"12px", flexShrink:0 }}>
                  Interpretation
                </Typography>
                <Box sx={{ flex:1, minHeight:0, overflowY:"auto" }}>
                {interpretation ? (
                  interpretation.map((para, i) => (
                    <Typography key={i} sx={{ fontFamily:FONT, fontSize:"13px", color:SUB, lineHeight:1.7, mb: i < interpretation.length-1 ? "12px" : 0 }}>
                      {para}
                    </Typography>
                  ))
                ) : (
                  <Typography sx={{ fontFamily:FONT, fontSize:"13px", color:"#94A3B8" }}>
                    Select a disease to see AI interpretation of the predictions.
                  </Typography>
                )}
                </Box>
              </Box>

              <Box sx={{ flexShrink:0, bgcolor:"#fff", border:`1px solid ${BORDER}`, borderRadius:"12px", overflow:"hidden" }}>
                <Box sx={{ bgcolor:TEAL, px:"20px", py:"12px" }}>
                  <Typography sx={{ fontFamily:FONT, fontWeight:600, fontSize:"14px", color:"#fff" }}>
                    Articles/Sources
                  </Typography>
                </Box>
                <Box sx={{ p:"16px" }}>
                  {articles ? (
                    articles.map((a,i) => (
                      <Typography key={i} component="a" href="#"
                        sx={{ display:"block", fontFamily:FONT, fontSize:"13px", color:TEAL,
                          textDecoration:"none", mb:"10px", lineHeight:1.55,
                          "&:hover":{ textDecoration:"underline" } }}>
                        {a.title} ({a.source})
                      </Typography>
                    ))
                  ) : (
                    <Typography sx={{ fontFamily:FONT, fontSize:"13px", color:"#94A3B8" }}>No articles available.</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* ── Tab 2: Sub Graph ── */}
        {activeTab === "subgraph" && (
          <Box sx={{ display:"flex", flexDirection:"column", height:"100%", gap:"14px" }}>

            {/* Stat cards - fixed */}
            <Box sx={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", flexShrink:0 }}>
              {[
                { label:"NODES",             value:"100", Icon:HubOutlined           },
                { label:"EDGES",             value:"99",  Icon:GridOnOutlined        },
                { label:"PROTEINS",          value:"12",  Icon:BiotechOutlined       },
                { label:"PREDICTED TARGETS", value:"3",   Icon:TrackChangesOutlined  },
              ].map(({ label, value, Icon }) => (
                <Box key={label} sx={{ bgcolor:"#fff", border:`1px solid ${BORDER}`, borderRadius:"12px", p:"16px 20px" }}>
                  <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", mb:"8px" }}>
                    <Typography sx={{ fontFamily:FONT, fontSize:"11px", fontWeight:600, color:"#94A3B8", letterSpacing:"0.8px" }}>{label}</Typography>
                    <Icon sx={{ fontSize:16, color:"#CBD5E1" }} />
                  </Box>
                  <Typography sx={{ fontFamily:FONT, fontSize:"28px", fontWeight:700, color:DARK }}>{value}</Typography>
                </Box>
              ))}
            </Box>

            {/* Graph + right panel - fills remaining space */}
            <Box sx={{ display:"flex", gap:"16px", flex:1, minHeight:0 }}>

              {/* Graph card */}
              <Box sx={{ flex:1, bgcolor:"#fff", border:`1px solid ${BORDER}`, borderRadius:"12px",
                p:"16px", display:"flex", flexDirection:"column", minHeight:0 }}>
                <Typography sx={{ fontFamily:FONT, fontSize:"13px", fontWeight:600, color:DARK, mb:"12px", flexShrink:0 }}>
                  Knowledge Graph: Thrombocytosis — Interactive Biological Context Network
                </Typography>
                {/* SVG fills all remaining space */}
                <Box sx={{ flex:1, minHeight:0, bgcolor:"#F8FAFC", borderRadius:"8px", overflow:"hidden" }}>
                  <svg viewBox="0 0 500 360" style={{ width:"100%", height:"100%", display:"block" }}>
                    {SG_EDGES.map(([a,b],i) => {
                      const na = SG_NODES.find(n => n.id===a);
                      const nb = SG_NODES.find(n => n.id===b);
                      if (!na||!nb) return null;
                      return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="#CBD5E1" strokeWidth="1.2"/>;
                    })}
                    {SG_NODES.map(node => (
                      <g key={node.id}>
                        <circle cx={node.x} cy={node.y} r={node.r}
                          fill={node.selected ? DARK : SG_COLORS[node.type]}
                          stroke={node.selected ? TEAL : "none"} strokeWidth={node.selected ? "2.5" : "0"} />
                        <text x={node.x} y={node.y+node.r+12} textAnchor="middle"
                          fontSize="10" fontFamily="Inter,sans-serif" fill={DARK} fontWeight="500">
                          {node.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </Box>

                {/* Top Predicted Targets - pinned at bottom of graph card */}
                <Box sx={{ flexShrink:0, mt:"12px" }}>
                  <Typography sx={{ fontFamily:FONT, fontWeight:600, fontSize:"13px", color:DARK, mb:"10px" }}>Top Predicted Targets</Typography>
                  <Box sx={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
                    {["Target Protein 1","Target Protein 2","Target Protein 3"].map((t,i) => (
                      <Box key={i} sx={{ display:"flex", alignItems:"center", gap:"10px", p:"10px 14px",
                        border:`1px solid ${BORDER}`, borderRadius:"8px" }}>
                        <Box sx={{ width:22, height:22, borderRadius:"5px", bgcolor:"#E6FAFA",
                          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <Typography sx={{ fontFamily:FONT, fontSize:"11px", fontWeight:700, color:TEAL }}>{i+1}</Typography>
                        </Box>
                        <Typography sx={{ fontFamily:FONT, fontSize:"13px", color:DARK }}>{t}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Controls + Stats + Legend - right column, scrollable if needed */}
              <Box sx={{ width:"200px", flexShrink:0, display:"flex", flexDirection:"column", gap:"12px", overflowY:"auto" }}>
                <Box sx={{ bgcolor:"#fff", border:`1px solid ${BORDER}`, borderRadius:"12px", p:"14px" }}>
                  <Typography sx={{ fontFamily:FONT, fontSize:"10px", fontWeight:700, color:"#94A3B8", letterSpacing:"0.8px", mb:"8px" }}>CONTROLS</Typography>
                  {["Fit to Screen","Reset Layout","Toggle Physics"].map(label => (
                    <Box key={label} sx={{ py:"7px", px:"12px", borderRadius:"6px", border:`1px solid ${BORDER}`, mb:"6px", cursor:"pointer", textAlign:"center", "&:hover":{ bgcolor:"#F8FAFC" } }}>
                      <Typography sx={{ fontFamily:FONT, fontSize:"13px", color:DARK }}>{label}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ bgcolor:"#fff", border:`1px solid ${BORDER}`, borderRadius:"12px", p:"14px" }}>
                  <Typography sx={{ fontFamily:FONT, fontSize:"10px", fontWeight:700, color:"#94A3B8", letterSpacing:"0.8px", mb:"8px" }}>GRAPH STATISTICS</Typography>
                  {[["Nodes","350"],["Edges","487"],["Proteins","12"],["Pathway Targets","1"]].map(([lbl,val]) => (
                    <Box key={lbl} sx={{ display:"flex", justifyContent:"space-between", py:"4px" }}>
                      <Typography sx={{ fontFamily:FONT, fontSize:"13px", color:SUB }}>{lbl}</Typography>
                      <Typography sx={{ fontFamily:FONT, fontSize:"13px", color:DARK, fontWeight:500 }}>{val}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ bgcolor:"#fff", border:`1px solid ${BORDER}`, borderRadius:"12px", p:"14px" }}>
                  <Typography sx={{ fontFamily:FONT, fontSize:"10px", fontWeight:700, color:"#94A3B8", letterSpacing:"0.8px", mb:"8px" }}>LEGEND</Typography>
                  {[["Disease",SG_COLORS.disease],["Protein",SG_COLORS.protein],["Pathway",SG_COLORS.pathway],["Compound",SG_COLORS.compound]].map(([lbl,color]) => (
                    <Box key={lbl} sx={{ display:"flex", alignItems:"center", gap:"8px", mb:"6px" }}>
                      <Box sx={{ width:10, height:10, borderRadius:"50%", bgcolor:color }} />
                      <Typography sx={{ fontFamily:FONT, fontSize:"13px", color:DARK }}>{lbl}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* ── Tab 3: Meta-Path ── */}
        {activeTab === "metapath" && (
          <Box sx={{ display:"flex", flexDirection:"column", height:"100%", gap:"14px" }}>

            {/* Stat cards - fixed */}
            <Box sx={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", flexShrink:0 }}>
              {[
                { label:"TOTAL PATHS",          value:"10",  Icon:HubOutlined          },
                { label:"TARGETS",              value:"10",  Icon:TrackChangesOutlined  },
                { label:"PATHWAYS",             value:"3",   Icon:GridOnOutlined        },
                { label:"AVG PATH PER TARGET",  value:"1.0", Icon:AccountTreeOutlined   },
              ].map(({ label, value, Icon }) => (
                <Box key={label} sx={{ bgcolor:"#fff", border:`1px solid ${BORDER}`, borderRadius:"12px", p:"16px 20px" }}>
                  <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", mb:"8px" }}>
                    <Typography sx={{ fontFamily:FONT, fontSize:"11px", fontWeight:600, color:"#94A3B8", letterSpacing:"0.8px" }}>{label}</Typography>
                    <Icon sx={{ fontSize:16, color:"#CBD5E1" }} />
                  </Box>
                  <Typography sx={{ fontFamily:FONT, fontSize:"28px", fontWeight:700, color:DARK }}>{value}</Typography>
                </Box>
              ))}
            </Box>

            {/* Accordion - takes remaining height, scrollable */}
            <Box sx={{ flex:1, minHeight:0, overflowY:"auto", display:"flex", flexDirection:"column", gap:"8px" }}>
              {MP_TARGETS.map(item => {
                const isOpen = expandedTarget === item.name;
                return (
                  <Box key={item.name} sx={{ bgcolor:"#fff", border:`1px solid ${BORDER}`, borderRadius:"10px", overflow:"hidden", flexShrink:0 }}>
                    <Box onClick={() => setExpandedTarget(isOpen ? null : item.name)}
                      sx={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                        px:"20px", py:"14px", cursor:"pointer", "&:hover":{ bgcolor:"#F8FAFC" } }}>
                      <Box sx={{ display:"flex", alignItems:"center", gap:"12px" }}>
                        <Typography sx={{ fontFamily:FONT, fontSize:"14px", fontWeight:500, color:DARK }}>{item.name}</Typography>
                        <Box sx={{ px:"8px", py:"2px", borderRadius:"5px", bgcolor:"#E6FAFA" }}>
                          <Typography sx={{ fontFamily:FONT, fontSize:"11px", fontWeight:700, color:TEAL }}>{item.score}</Typography>
                        </Box>
                      </Box>
                      {isOpen
                        ? <ExpandLessOutlined sx={{ fontSize:20, color:SUB }} />
                        : <ExpandMoreOutlined sx={{ fontSize:20, color:SUB }} />}
                    </Box>
                    <Collapse in={isOpen}>
                      <Box sx={{ borderTop:`1px solid ${BORDER}` }}>
                        {item.paths.length === 0 ? (
                          <Box sx={{ px:"20px", py:"12px" }}>
                            <Typography sx={{ fontFamily:FONT, fontSize:"13px", color:"#94A3B8" }}>No paths available.</Typography>
                          </Box>
                        ) : item.paths.map((path,i) => (
                          <Box key={i} sx={{ px:"20px", py:"11px", borderTop: i>0 ? `1px solid #F1F5F9` : "none", display:"flex", alignItems:"center", gap:"12px" }}>
                            <Typography sx={{ fontFamily:FONT, fontSize:"12px", fontWeight:600, color:"#94A3B8", minWidth:"38px" }}>Path</Typography>
                            <Typography sx={{ fontFamily:FONT, fontSize:"13px", color:DARK }}>{path}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Collapse>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

      </Box>
    </Box>
  );
};

export default TxKG;
