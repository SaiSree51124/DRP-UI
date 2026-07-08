// TxKG component for Target Identification
// CHANGES:
//   - Target table shows ALL proteins with pagination (prev/next + page info)
//   - Clicking a target row expands inline metapaths below it
//   - Targets with no paths show 'no_path_reason' explanation
//   - LLM interpretation cached on first page load, not re-fetched on page change
//   - page_size selector (10 / 20 / 50)

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_CONFIG from "../../apiconfig";
import KGSubgraph from "./KGSubgraph";
import KGMetaPath from "./KGMetaPath";

import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Autocomplete,
  TextField,
  CircularProgress,
  Chip,
  Collapse,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

// ── colour maps ──────────────────────────────────────────────────────────────

const HOP_COLORS = {
  1: "#0225AA",
  2: "#1E88E5",
  3: "#00897B",
  4: "#065B52",
};

const NODE_TYPE_COLORS = {
  disease:             "#0225AA",
  "gene/protein":      "#1E88E5",
  pathway:             "#065B52",
  biological_process:  "#AA44AA",
  molecular_function:  "#CC4488",
  cellular_component:  "#7B5EA7",
  complex:             "#00897B",
  genetic_disorder:    "#E61919",
  tissue:              "#7CB87C",
  cell:                "#AED581",
  other:               "#A7A4E0",
};

const typeLabel = (t) =>
  t ? t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Unknown";

// ── MetaPath inline panel ────────────────────────────────────────────────────

const MetaPathPanel = ({ paths, noPathReason, targetName }) => {
  if (!paths || paths.length === 0) {
    return (
      <Box
        sx={{
          p: 2,
          bgcolor: "#fff8e1",
          borderLeft: "4px solid #f9a825",
          borderRadius: "0 6px 6px 0",
          mx: 2,
          mb: 1,
        }}
      >
        <Typography variant="body2" fontWeight={600} color="#f57f17" mb={0.5}>
          ⚠ No metapath found for {targetName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {noPathReason ||
            "No qualifying path was collected during the biological context graph traversal."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, pb: 1.5 }}>
      <Typography
        variant="caption"
        fontWeight={700}
        color="#0225AA"
        sx={{ display: "block", mb: 1, textTransform: "uppercase", letterSpacing: 0.8 }}
      >
        Metapaths — {paths.length} path{paths.length !== 1 ? "s" : ""}
      </Typography>

      {paths.map((path, pi) => (
        <Box
          key={pi}
          sx={{
            mb: 1.2,
            p: 1.2,
            bgcolor: "#f5f7ff",
            borderRadius: 1.5,
            border: "1px solid #e0e6ff",
          }}
        >
          {/* hop badge + score */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.8 }}>
            <Chip
              label={path.path_type || `${path.hop_count}-hop`}
              size="small"
              sx={{
                bgcolor: HOP_COLORS[path.hop_count] || "#546E7A",
                color: "white",
                fontWeight: 700,
                fontSize: 11,
                height: 20,
              }}
            />
            {path.path_score !== undefined && (
              <Typography variant="caption" color="text.secondary">
                score: <strong>{path.path_score.toFixed(3)}</strong>
              </Typography>
            )}
            {path.intermediate_type && (
              <Chip
                label={typeLabel(path.intermediate_type)}
                size="small"
                sx={{
                  bgcolor: NODE_TYPE_COLORS[path.intermediate_type] || "#A7A4E0",
                  color: "white",
                  fontSize: 10,
                  height: 18,
                  ml: "auto",
                }}
              />
            )}
          </Box>

          {/* path chain: node → edge → node → … */}
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.3 }}>
            {(path.node_names || []).map((nodeName, ni) => (
              <React.Fragment key={ni}>
                {/* node pill */}
                <Tooltip
                  title={`${nodeName} (${typeLabel((path.node_types || [])[ni])})`}
                  arrow
                >
                  <Box
                    sx={{
                      px: 1,
                      py: 0.3,
                      borderRadius: 5,
                      bgcolor:
                        (NODE_TYPE_COLORS[(path.node_types || [])[ni] || "other"] || "#A7A4E0") + "22",
                      border: `1px solid ${
                        (NODE_TYPE_COLORS[(path.node_types || [])[ni] || "other"] || "#A7A4E0") + "66"
                      }`,
                      maxWidth: 180,
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={
                        ni === 0 || ni === (path.node_names || []).length - 1 ? 700 : 400
                      }
                      color={
                        NODE_TYPE_COLORS[(path.node_types || [])[ni] || "other"] || "#546E7A"
                      }
                      sx={{
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: 11,
                      }}
                    >
                      {nodeName.length > 24 ? nodeName.slice(0, 22) + "…" : nodeName}
                    </Typography>
                  </Box>
                </Tooltip>

                {/* edge arrow + label */}
                {ni < (path.edge_labels || []).length && (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", alignItems: "center", mx: 0.2 }}
                  >
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ fontSize: 9, lineHeight: 1, mb: 0.1 }}
                    >
                      {((path.edge_labels || [])[ni] || "").length > 22
                        ? (path.edge_labels || [])[ni].slice(0, 20) + "…"
                        : (path.edge_labels || [])[ni] || ""}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: "#888", lineHeight: 1 }}>→</Typography>
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// ── Individual target row ────────────────────────────────────────────────────

const TargetRow = ({ target, index, globalIndex, isExpanded, onToggle }) => {
  const hopColor = HOP_COLORS[target.hop_distance] || "#546E7A";
  const hasPaths = target.paths && target.paths.length > 0;

  return (
    <>
      <Box
        onClick={onToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1.5,
          py: 1,
          borderBottom: isExpanded ? "none" : "1px solid #eee",
          cursor: "pointer",
          bgcolor: isExpanded ? "#eef2ff" : index % 2 === 0 ? "#fff" : "#fafafa",
          transition: "background 0.15s",
          "&:hover": { bgcolor: "#e8edff" },
          gap: 0.5,
        }}
      >
        {/* rank */}
        <Typography
          sx={{
            width: 32, textAlign: "center", fontWeight: 700, fontSize: 13, flexShrink: 0,
            color: globalIndex < 3 ? "#0225AA" : "#888",
          }}
        >
          {globalIndex + 1}
        </Typography>

        {/* uniprot id */}
        <Typography
          sx={{
            width: 90, fontSize: 12, fontFamily: "monospace", color: "#0225AA",
            flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}
        >
          {target.uniprot_id || "—"}
        </Typography>

        {/* name */}
        <Tooltip title={target.full_name || target.name || ""} arrow>
          <Typography
            sx={{ flex: 1, fontWeight: 500, fontSize: 13, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {target.name || target.gene_name || target.uniprot_id || "—"}
          </Typography>
        </Tooltip>

        {/* hop badge */}
        {target.hop_distance && (
          <Chip
            label={`${target.hop_distance}-hop`}
            size="small"
            sx={{
              bgcolor: hopColor + "22", color: hopColor,
              fontWeight: 700, fontSize: 10, height: 18, flexShrink: 0,
            }}
          />
        )}

        {/* score */}
        <Typography
          sx={{ width: 48, textAlign: "right", fontWeight: 700, fontSize: 13,
                color: "#0225AA", flexShrink: 0 }}
        >
          {(target.score || 0).toFixed(1)}
        </Typography>

        {/* path count or no-path warning */}
        <Box sx={{ width: 28, textAlign: "center", flexShrink: 0 }}>
          {hasPaths ? (
            <Chip
              label={target.path_count || target.paths?.length}
              size="small"
              sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontSize: 10, height: 18, fontWeight: 700 }}
            />
          ) : (
            <Typography sx={{ fontSize: 14, color: "#f9a825" }} title="No metapath — click for reason">
              ⚠
            </Typography>
          )}
        </Box>

        {/* expand chevron */}
        <Typography
          sx={{
            fontSize: 14, color: "#999", flexShrink: 0,
            transform: isExpanded ? "rotate(90deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          ›
        </Typography>
      </Box>

      {/* expanded metapath panel */}
      <Collapse in={isExpanded}>
        <Box sx={{ bgcolor: "#eef2ff", borderBottom: "1px solid #c5cae9", pb: 0.5 }}>
          <MetaPathPanel
            paths={target.paths || []}
            noPathReason={target.no_path_reason}
            targetName={target.name || target.uniprot_id}
          />
        </Box>
      </Collapse>
    </>
  );
};

// ── Main component ───────────────────────────────────────────────────────────

const TxKG = () => {
  const { BASE_URL, PORT1 } = API_CONFIG;
  const API_BASE_URL = `${BASE_URL}:${PORT1}/api/v1/txkg`;

  const [selectedDisease, setSelectedDisease] = useState("");
  const [diseases, setDiseases]               = useState([]);
  const [targets, setTargets]                 = useState([]);
  const [totalCount, setTotalCount]           = useState(0);
  const [totalPages, setTotalPages]           = useState(1);
  const [currentPage, setCurrentPage]         = useState(1);
  const [pageSize, setPageSize]               = useState(20);
  const [expandedRow, setExpandedRow]         = useState(null);

  const [llmInterpretation, setLlmInterpretation] = useState("");
  const [articles, setArticles]                   = useState([]);
  const [activeTab, setActiveTab]                 = useState("Sub-Graph");

  const [loadingDiseases, setLoadingDiseases] = useState(false);
  const [loadingTargets, setLoadingTargets]   = useState(false);
  const [loadingLLM, setLoadingLLM]           = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);

  // Cache LLM interpretation per disease so pagination doesn't re-trigger it
  const llmCache = useRef({});

  // ── effects ────────────────────────────────────────────────────────────────

  useEffect(() => { fetchDiseases(); }, []);

  useEffect(() => {
    if (!selectedDisease) return;
    setCurrentPage(1);
    setExpandedRow(null);
    fetchTargets(selectedDisease, 1, pageSize);
    fetchLLMInterpretation(selectedDisease);
    fetchArticles(selectedDisease);
  }, [selectedDisease]);                       // eslint-disable-line

  useEffect(() => {
    if (!selectedDisease) return;
    setExpandedRow(null);
    fetchTargets(selectedDisease, currentPage, pageSize);
  }, [currentPage, pageSize]);                 // eslint-disable-line

  // ── fetch helpers ──────────────────────────────────────────────────────────

  const fetchDiseases = async () => {
    try {
      setLoadingDiseases(true);
      const res = await axios.get(`${API_BASE_URL}/diseases`);
      setDiseases(Array.isArray(res.data.diseases) ? res.data.diseases : []);
    } catch {
      const fallback = [
        "Schizophrenia","Alzheimer Disease","Diabetes","Cancer",
        "Parkinson Disease","Chemical and drug induced liver injury",
      ].map((n, i) => ({ id: `F${i}`, name: n }));
      setDiseases(fallback);
      setSelectedDisease(fallback[0].name);
    } finally {
      setLoadingDiseases(false);
    }
  };

  const fetchTargets = async (disease, page, ps) => {
    try {
      setLoadingTargets(true);
      const res = await axios.get(`${API_BASE_URL}/predicted-targets`, {
        params: { disease, page, page_size: ps, max_hops: 4 },
      });
      setTargets(res.data.targets || []);
      setTotalCount(res.data.total_count || 0);
      setTotalPages(res.data.total_pages || 1);

      // if the backend returned the LLM text on page 1, cache + display it
      if (page === 1 && res.data.interpretation) {
        llmCache.current[disease] = res.data.interpretation;
        setLlmInterpretation(res.data.interpretation);
      }
    } catch {
      setTargets([
        { uniprot_id:"P14416", name:"D(2) dopamine receptor",               score:95, hop_distance:1, paths:[], path_count:0, no_path_reason:null },
        { uniprot_id:"P28223", name:"5-hydroxytryptamine receptor 2A",      score:89, hop_distance:1, paths:[], path_count:0, no_path_reason:null },
        { uniprot_id:"Q12879", name:"Glutamate receptor ionotropic NMDA 2A",score:84, hop_distance:2, paths:[], path_count:0, no_path_reason:null },
        { uniprot_id:"P31645", name:"Sodium-dependent serotonin transporter",score:78,hop_distance:2, paths:[], path_count:0, no_path_reason:null },
        { uniprot_id:"P21964", name:"Catechol O-methyltransferase",         score:72, hop_distance:3, paths:[], path_count:0, no_path_reason:null },
      ]);
      setTotalCount(5); setTotalPages(1);
    } finally {
      setLoadingTargets(false);
    }
  };

  const fetchLLMInterpretation = async (disease) => {
    if (llmCache.current[disease]) {
      setLlmInterpretation(llmCache.current[disease]);
      return;
    }
    try {
      setLoadingLLM(true);
      const res = await axios.get(`${API_BASE_URL}/llm-interpretation`, { params: { disease } });
      const text = res.data.interpretation || res.data.text || "";
      llmCache.current[disease] = text;
      setLlmInterpretation(text);
    } catch {
      setLlmInterpretation(`Predicted targets for ${disease} show promising therapeutic potential.`);
    } finally {
      setLoadingLLM(false);
    }
  };

  const fetchArticles = async (disease) => {
    try {
      setLoadingArticles(true);
      const res = await axios.get(`${API_BASE_URL}/articles`, { params: { disease } });
      setArticles(res.data.articles || res.data.sources || res.data || []);
    } catch {
      setArticles([
        { title:"Sample Article 1", url:"#", source:"PubMed" },
        { title:"Sample Article 2", url:"#", source:"Nature" },
      ]);
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleRowToggle = (idx) =>
    setExpandedRow((prev) => (prev === idx ? null : idx));

  const renderGraph = () =>
    activeTab === "Meta-Path"
      ? <KGMetaPath disease={selectedDisease} API_BASE_URL={API_BASE_URL} />
      : <KGSubgraph disease={selectedDisease} API_BASE_URL={API_BASE_URL} />;

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ mx: "20px" }}>

      {/* header */}
      <Box sx={{ mb: 3, p: "10px", border: "1px solid black", borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          TxKG — Therapeutic Target Prediction
        </Typography>
        <Typography mt={1} color="text.secondary" textAlign="justify">
          The TxKG module explores biological networks and disease pathways to identify promising
          protein targets for therapeutic research. By analysing relationships between diseases,
          proteins, and drugs, TxKG uncovers novel disease–target associations. Click any target
          row to expand its metapath — the biological reasoning chain connecting disease to protein.
        </Typography>
      </Box>

      {/* disease selector */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography fontWeight={600}>Disease:</Typography>
        <Autocomplete
          sx={{
            minWidth: 300,
            "& .MuiOutlinedInput-root": {
              bgcolor: "#0225AA", color: "white",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
              "& .MuiSvgIcon-root": { color: "white" },
            },
          }}
          options={diseases.map((d) => d.name)}
          value={selectedDisease || null}
          onChange={(_, v) => setSelectedDisease(v || "")}
          loading={loadingDiseases}
          clearOnEscape
          filterOptions={(opts, { inputValue }) => {
            const iv = (inputValue || "").toLowerCase();
            return iv ? opts.filter((o) => String(o).toLowerCase().includes(iv)) : opts;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search for a disease…"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                style: { color: "white" },
                endAdornment: (
                  <>
                    {loadingDiseases ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>

      {/* main grid */}
      <Grid container spacing={2}>

        {/* ── Left: target table ── */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ borderRadius: 1, overflow: "hidden" }}>

            {/* header row */}
            <Box
              sx={{
                background: "linear-gradient(180deg, #BACAFF -200%, #0225AA 281.25%)",
                px: 1.5, py: 1,
                display: "flex", alignItems: "center", gap: 0.5,
              }}
            >
              {[
                { label: "#",         width: 32,  align: "center" },
                { label: "UniProt ID",width: 90,  align: "left"   },
                { label: "Target",    flex: 1,    align: "left"   },
                { label: "Hop",       width: 52,  align: "center" },
                { label: "Score",     width: 48,  align: "right"  },
                { label: "Paths",     width: 28,  align: "center" },
              ].map(({ label, width, flex, align }) => (
                <Typography
                  key={label}
                  sx={{
                    width, flex, flexShrink: 0, textAlign: align,
                    fontWeight: 700, fontSize: 12, color: "white",
                    textTransform: "uppercase", letterSpacing: 0.5,
                  }}
                >
                  {label}
                </Typography>
              ))}
              <Box sx={{ width: 18 }} />
            </Box>

            {/* rows */}
            <Box>
              {loadingTargets ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <CircularProgress size={28} />
                  <Typography mt={1} color="text.secondary" variant="body2">Loading targets…</Typography>
                </Box>
              ) : targets.length > 0 ? (
                targets.map((target, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx;
                  return (
                    <TargetRow
                      key={`${target.uniprot_id}-${idx}`}
                      target={target}
                      index={idx}
                      globalIndex={globalIdx}
                      isExpanded={expandedRow === idx}
                      onToggle={() => handleRowToggle(idx)}
                    />
                  );
                })
              ) : (
                <Typography sx={{ p: 3, textAlign: "center", color: "#999" }}>
                  {selectedDisease ? "No targets found for this disease." : "Select a disease to begin."}
                </Typography>
              )}
            </Box>

            {/* pagination footer */}
            {totalCount > 0 && (
              <Box
                sx={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  px: 2, py: 1, borderTop: "1px solid #e0e0e0", bgcolor: "#f9f9f9",
                  flexWrap: "wrap", gap: 1,
                }}
              >
                {/* count summary */}
                <Typography variant="caption" color="text.secondary">
                  Showing <strong>{(currentPage - 1) * pageSize + 1}</strong>–
                  <strong>{Math.min(currentPage * pageSize, totalCount)}</strong>{" "}
                  of <strong>{totalCount}</strong> proteins
                </Typography>

                {/* page-size picker */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">Per page:</Typography>
                  <FormControl size="small" variant="outlined">
                    <Select
                      value={pageSize}
                      onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                      sx={{ fontSize: 12, height: 28, minWidth: 60 }}
                    >
                      {[10, 20, 50].map((n) => (
                        <MenuItem key={n} value={n} sx={{ fontSize: 12 }}>{n}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* prev / page X of Y / next */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    size="small" variant="outlined"
                    disabled={currentPage <= 1 || loadingTargets}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    sx={{
                      minWidth: 36, height: 28, fontSize: 13, px: 1,
                      borderColor: "#0225AA", color: "#0225AA",
                      "&:hover": { bgcolor: "#0225AA", color: "white" },
                      "&:disabled": { borderColor: "#ccc", color: "#ccc" },
                    }}
                  >
                    ‹
                  </Button>
                  <Typography variant="caption" sx={{ minWidth: 72, textAlign: "center" }}>
                    Page <strong>{currentPage}</strong> / {totalPages}
                  </Typography>
                  <Button
                    size="small" variant="outlined"
                    disabled={currentPage >= totalPages || loadingTargets}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    sx={{
                      minWidth: 36, height: 28, fontSize: 13, px: 1,
                      borderColor: "#0225AA", color: "#0225AA",
                      "&:hover": { bgcolor: "#0225AA", color: "white" },
                      "&:disabled": { borderColor: "#ccc", color: "#ccc" },
                    }}
                  >
                    ›
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>

          {/* legend */}
          {totalCount > 0 && (
            <Box sx={{ mt: 0.5, px: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                <span style={{ color: "#2e7d32", fontWeight: 700 }}>■</span> paths found &nbsp;
                <span style={{ color: "#f9a825", fontWeight: 700 }}>⚠</span> no metapath — click row for explanation
              </Typography>
            </Box>
          )}
        </Grid>

        {/* ── Right: LLM + Articles ── */}
        <Grid item xs={12} md={5}>
          <Grid container direction="column" spacing={2}>

            <Grid item>
              <Paper elevation={2} sx={{ border: "2px solid #0225AA", borderRadius: 2, p: 2 }}>
                <Typography variant="h6" color="#0225AA" fontWeight={600} mb={1}>
                  Interpretation:
                </Typography>
                <Box sx={{ minHeight: 150, maxHeight: 250, overflowY: "auto", lineHeight: 1.6 }}>
                  {loadingLLM ? (
                    <Typography color="#666" fontStyle="italic">Loading interpretation…</Typography>
                  ) : llmInterpretation ? (
                    <Typography>{llmInterpretation}</Typography>
                  ) : (
                    <Typography color="#666">Select a disease to see AI interpretation.</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid item>
              <Paper elevation={2} sx={{ borderRadius: 1, overflow: "hidden" }}>
                <Box
                  sx={{
                    background: "linear-gradient(180deg, #BACAFF -200%, #0225AA 281.25%)",
                    color: "white", p: 1.5,
                  }}
                >
                  <Typography fontWeight={600}>Articles / Sources</Typography>
                </Box>
                <Box sx={{ p: 2, maxHeight: 200, overflowY: "auto" }}>
                  {loadingArticles ? (
                    <Typography color="#666" fontStyle="italic">Loading articles…</Typography>
                  ) : articles.length > 0 ? (
                    articles.map((article, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          mb: 1, pb: 1,
                          borderBottom: idx < articles.length - 1 ? "1px solid #e0e0e0" : "none",
                        }}
                      >
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#0225AA", textDecoration: "none", fontSize: "14px" }}
                          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                        >
                          {article.title}
                        </a>
                        {article.source && (
                          <Typography component="span" sx={{ ml: 1, color: "#666", fontSize: 12 }}>
                            ({article.source})
                          </Typography>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography color="#999" textAlign="center">No articles available</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* graph section */}
      <Box sx={{ mt: 4, borderRadius: 1, overflow: "hidden" }}>
        {/* tabs */}
        <Box
          sx={{
            display: "flex",
            background: "linear-gradient(90deg, #0124AA 11.66%, #00809E 50.37%, #196C69 75.2%, #041634 100%)",
          }}
        >
          {["Sub-Graph", "Meta-Path"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                flex: 1, py: 1.5,
                fontWeight: activeTab === tab ? "bold" : 500,
                bgcolor: activeTab === tab ? "white" : "transparent",
                color: activeTab === tab ? "#0225AA" : "white",
                borderRadius: 0,
                "&:hover": {
                  bgcolor: activeTab === tab ? "white" : "#e0e0e0",
                  color: activeTab === tab ? "#0225AA" : "black",
                },
              }}
            >
              {tab}
            </Button>
          ))}
        </Box>

        {/* graph content */}
        <Box sx={{ minHeight: 300, bgcolor: "#fafafa" }}>
          {renderGraph()}
        </Box>
      </Box>
    </Box>
  );
};

export default TxKG;