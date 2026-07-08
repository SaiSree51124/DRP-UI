import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_CONFIG from "../../apiconfig";
import {
  Box, Typography, Grid, TextField, Button, Paper,
  CircularProgress, Link, Chip, List, ListItem,
  ListItemButton, Avatar, Alert, LinearProgress,
  Fade, Slide, IconButton, Tooltip, Collapse,
} from "@mui/material";
import {
  CheckCircle, Psychology, Send, AutoAwesome,
  BiotechOutlined, EmojiObjects, ExpandMore, ExpandLess,
  AccountTree, Lightbulb, FiberManualRecord, Refresh,
  OpenInNew,
} from "@mui/icons-material";
import { C, GRAD, GRAD_H } from "../../utils/colors";

// ─────────────────────────── constants ───────────────────────────────────────

const PIPELINE_STEPS = [
  "Searching Google Patents",
  "Fetching patent documents",
  "Parsing sections & claims",
  "Generating embeddings",
  "Retrieving relevant evidence",
  "Synthesising agent analysis",
];

// ─────────────────────────── PipelineProgress ────────────────────────────────

const PipelineProgress = ({ active, currentStep }) => {
  if (!active) return null;
  return (
    <Box sx={{ mt: 1 }}>
      {PIPELINE_STEPS.map((step, i) => (
        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          {i < currentStep ? (
            <CheckCircle sx={{ fontSize: 14, color: "#196C69" }} />
          ) : i === currentStep ? (
            <CircularProgress size={12} sx={{ color: "#00809E" }} />
          ) : (
            <FiberManualRecord sx={{ fontSize: 10, color: "#CBD5E0" }} />
          )}
          <Typography variant="caption" sx={{
            color: i <= currentStep ? "#2D3748" : "#A0AEC0",
            fontWeight: i === currentStep ? 600 : 400,
          }}>
            {step}
          </Typography>
        </Box>
      ))}
      <LinearProgress
        variant="determinate"
        value={((currentStep + 1) / PIPELINE_STEPS.length) * 100}
        sx={{
          mt: 1.5, borderRadius: 1, bgcolor: "#EBF8FF",
          "& .MuiLinearProgress-bar": {
            background: "linear-gradient(90deg,#0124AA,#00809E)",
          },
        }}
      />
    </Box>
  );
};

// ─────────────────────────── ToolTraceAccordion ───────────────────────────────

const PipelineTraceAccordion = ({ steps }) => {
  const [open, setOpen] = useState(false);
  if (!steps?.length) return null;
  return (
    <Box sx={{ mt: 2, borderTop: "1px solid #EDF2F7", pt: 1 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 0.5,
              cursor: "pointer", "&:hover": { opacity: 0.75 } }}
        onClick={() => setOpen((o) => !o)}
      >
        <AccountTree sx={{ fontSize: 14, color: "#718096" }} />
        <Typography variant="caption" sx={{ color: "#718096", fontWeight: 500 }}>
          Pipeline trace ({steps.length} steps)
        </Typography>
        {open
          ? <ExpandLess sx={{ fontSize: 14, color: "#718096" }} />
          : <ExpandMore sx={{ fontSize: 14, color: "#718096" }} />}
      </Box>
      <Collapse in={open}>
        <Box sx={{ mt: 1, pl: 1.5, borderLeft: "2px solid #E2E8F0" }}>
          {steps.map((s, i) => (
            <Box key={i} sx={{ mb: 0.5 }}>
              <Typography variant="caption"
                sx={{ color: "#718096", display: "block", fontSize: 11, lineHeight: 1.5 }}>
                {i + 1}. {s}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

// ─────────────────────────── formatResponse ──────────────────────────────────

const formatResponse = (text) => {
  if (!text) return null;
  const lines = text.split("\n").filter((l) => l.trim());
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();

        if (
          /^[A-Z][A-Z\s\-]{4,}:?$/.test(trimmed) ||
          (/^\d+\.\s+[A-Z]/.test(trimmed) === false && trimmed.endsWith(":"))
        ) {
          return (
            <Typography key={i} variant="body2"
              sx={{ fontWeight: 700, color: "#1A202C", mt: i > 0 ? 1 : 0, fontSize: 13 }}>
              {trimmed}
            </Typography>
          );
        }

        const numbered = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (numbered) {
          return (
            <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Chip label={numbered[1]} size="small"
                sx={{
                  background: "linear-gradient(135deg,#0124AA,#00809E)",
                  color: "white", fontWeight: "bold",
                  minWidth: 26, height: 26, fontSize: 11, flexShrink: 0,
                }} />
              <Typography variant="body2"
                sx={{ flex: 1, fontSize: 13.5, lineHeight: 1.7, color: "#2D3748" }}>
                {numbered[2]}
              </Typography>
            </Box>
          );
        }

        if (/^[-•]\s+/.test(trimmed)) {
          return (
            <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "flex-start", pl: 0.5 }}>
              <FiberManualRecord sx={{ fontSize: 7, color: "#00809E", mt: "7px", flexShrink: 0 }} />
              <Typography variant="body2"
                sx={{ flex: 1, fontSize: 13.5, lineHeight: 1.7, color: "#2D3748" }}>
                {trimmed.replace(/^[-•]\s+/, "")}
              </Typography>
            </Box>
          );
        }

        return (
          <Typography key={i} variant="body2"
            sx={{
              fontSize: 13.5, lineHeight: 1.7,
              fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? "#1A202C" : "#2D3748",
            }}>
            {trimmed}
          </Typography>
        );
      })}
    </Box>
  );
};

// ─────────────────────────── main component ──────────────────────────────────

const NoveltySearchAgent = () => {
  const { BASE_URL, PORT1 } = API_CONFIG;

  const [agentRunning,   setAgentRunning]   = useState(false);
  const [pipelineStep,   setPipelineStep]   = useState(0);
  const [patents,        setPatents]        = useState([]);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [chatHistory,    setChatHistory]    = useState([]);
  const [currentQuery,   setCurrentQuery]   = useState("");
  const [answerLoading,  setAnswerLoading]  = useState(false);
  const [agentDone,      setAgentDone]      = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, answerLoading, agentRunning]);

  // Pipeline step ticker — advances every 5s while agent runs
  useEffect(() => {
    if (!agentRunning) { setPipelineStep(0); return; }
    const id = setInterval(() => {
      setPipelineStep((s) => (s < PIPELINE_STEPS.length - 1 ? s + 1 : s));
    }, 5000);
    return () => clearInterval(id);
  }, [agentRunning]);

  const formik = useFormik({
    initialValues: { searchQuery: "", numResults: "" },
    validationSchema: Yup.object({
      searchQuery: Yup.string().required("Required"),
      numResults:  Yup.number().min(1).max(20).required("Required"),
    }),
    onSubmit: (values) => handleRunAgent(values),
  });

  // ── Run Agent ─────────────────────────────────────────────────────────────

  const handleRunAgent = async (values) => {
    setAgentRunning(true);
    setPipelineStep(0);
    setPatents([]);
    setSelectedPatent(null);
    setChatHistory([]);
    setAgentDone(false);

    setChatHistory([{
      role:      "user",
      content:   values.searchQuery,
      timestamp: new Date().toISOString(),
    }]);

    try {
      const { data } = await axios.post(
        `${BASE_URL}:${PORT1}/api/v1/agent/run`,
        null,
        { params: { user_query: values.searchQuery, num_results: values.numResults } }
      );

      const patentsUsed = data.patents_used || [];
      setPatents(patentsUsed);
      if (patentsUsed.length > 0) setSelectedPatent(patentsUsed[0]);
      setAgentDone(true);

      setChatHistory((prev) => [...prev, {
        role:            "assistant",
        content:         data.agent_answer,
        recommendations: data.recommendations,
        pipeline_steps:  data.pipeline_steps,
        mode:            "agent_run",
        timestamp:       new Date().toISOString(),
      }]);

      toast.success(
        `Analysis complete — ${patentsUsed.length} patent${patentsUsed.length !== 1 ? "s" : ""} analysed`,
        { autoClose: 4000 }
      );
    } catch (err) {
      console.error("Agent run error:", err);
      const detail = err.response?.data?.detail || "Agent run failed. Please try again.";
      toast.error(detail);
      setChatHistory((prev) => [...prev, {
        role:      "assistant",
        content:   `The agent encountered an error: ${detail}`,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setAgentRunning(false);
    }
  };

  // ── Ask single patent ─────────────────────────────────────────────────────

  const handleAskSingle = async () => {
    if (!currentQuery.trim()) { toast.warning("Please enter a question"); return; }
    if (!selectedPatent?.PatentID) { toast.warning("Select a patent from the list first"); return; }
    if (!agentDone) { toast.warning("Run the agent first"); return; }

    setAnswerLoading(true);
    setChatHistory((prev) => [...prev, {
      role:      "user",
      content:   `[${selectedPatent.PatentID}] ${currentQuery}`,
      timestamp: new Date().toISOString(),
    }]);

    try {
      const { data } = await axios.get(
        `${BASE_URL}:${PORT1}/api/v1/agent/ask`,
        { params: { query: currentQuery, patent_id: selectedPatent.PatentID } }
      );
      setChatHistory((prev) => [...prev, {
        role:      "assistant",
        content:   data.answer,
        mode:      "single_patent",
        timestamp: new Date().toISOString(),
      }]);
      setCurrentQuery("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to get answer.");
    } finally {
      setAnswerLoading(false);
    }
  };

  // ── Ask all patents ───────────────────────────────────────────────────────

  const handleAskAll = async () => {
    if (!currentQuery.trim()) { toast.warning("Please enter a question"); return; }
    if (!agentDone) { toast.warning("Run the agent first"); return; }

    setAnswerLoading(true);
    setChatHistory((prev) => [...prev, {
      role:      "user",
      content:   `[All Patents] ${currentQuery}`,
      timestamp: new Date().toISOString(),
    }]);

    try {
      const { data } = await axios.get(
        `${BASE_URL}:${PORT1}/api/v1/agent/ask_all`,
        { params: { query: currentQuery } }
      );
      setChatHistory((prev) => [...prev, {
        role:             "assistant",
        content:          data.answer,
        patents_analyzed: data.patents_analyzed,
        mode:             "multi_patent",
        timestamp:        new Date().toISOString(),
      }]);
      setCurrentQuery("");
      toast.info(
        `Synthesised across ${data.patents_analyzed?.length || 0} patents`,
        { autoClose: 3000 }
      );
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to get answer.");
    } finally {
      setAnswerLoading(false);
    }
  };

  // ── Reset ─────────────────────────────────────────────────────────────────

  const handleReset = () => {
    setAgentRunning(false);
    setPatents([]);
    setSelectedPatent(null);
    setChatHistory([]);
    setAgentDone(false);
    setPipelineStep(0);
    setCurrentQuery("");
    formik.resetForm();
    toast.success("Session reset");
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <Box sx={{
      p: 2,
      background: C.bg,
      minHeight: "100vh",
    }}>

      {/* Header */}
      <Fade in timeout={800}>
        <Paper elevation={0} sx={{ p: 1, mb: 1, background: C.bg, borderRadius: 2, border: `1px solid ${C.teal}` }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <BiotechOutlined sx={{ color: C.navy, fontSize: 40 }} />
            <Box>
              <Typography color={C.navy} variant="h6" fontWeight={600}>
                Novelty Search Agent
              </Typography>
              <Typography variant="body2" sx={{ color: C.muted, mt: 0.5,fontSize: 13 }}>
                The Novelty Search Agent checks whether a research combination or compound is truly
                new by autonomously searching patents, building a smart knowledge base, and reasoning
                across all relevant patents to uncover prior art, analyse claims, and assess how
                original a discovery really is — ensuring every candidate that moves forward is
                genuinely innovative and worth pursuing.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Search Form */}
      <Slide direction="up" in timeout={600}>
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, background: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <EmojiObjects sx={{ color: C.navy }} />
            <Typography variant="h6" fontWeight={600} sx={{ color: C.navy }}>
              Run Novelty Search
            </Typography>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Drug · Protein · Disease Combination or Patent Title"
                  name="searchQuery"
                  placeholder='e.g., "metformin AMPK Alzheimer" or "System and method for predicting protein binding"'
                  value={formik.values.searchQuery}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined" size="small"
                  error={formik.touched.searchQuery && Boolean(formik.errors.searchQuery)}
                  helperText={formik.touched.searchQuery && formik.errors.searchQuery}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset":       { borderColor: C.teal },
                      "&.Mui-focused fieldset": { borderColor: C.sage },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth label="No. of Patents" name="numResults" type="number"
                  value={formik.values.numResults}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined" size="small"
                  inputProps={{ min: 1, max: 20 }}
                  error={formik.touched.numResults && Boolean(formik.errors.numResults)}
                  helperText={formik.touched.numResults && formik.errors.numResults}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset":       { borderColor: C.teal },
                      "&.Mui-focused fieldset": { borderColor: C.sage },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <Button
                  type="submit" variant="contained" fullWidth disabled={agentRunning}
                  startIcon={agentRunning
                    ? <CircularProgress size={18} color="inherit" />
                    : <AutoAwesome />}
                  sx={{
                    background: GRAD_H,
                    height: 40, fontWeight: 600, textTransform: "none",
                    "&:hover": {
                      background:   GRAD,
                    },
                  }}>
                  {agentRunning ? "Running…" : "Run Agent"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Slide>

      {/* Pipeline progress alert */}
      {agentRunning && (
        <Fade in>
          <Alert severity="info"
            sx={{ mb: 3, borderRadius: 2, borderLeft: "4px solid" + C.teal }}>
            <Typography variant="body2" fontWeight={600}>
              Agent is autonomously analysing patents…
            </Typography>
            <PipelineProgress active={agentRunning} currentStep={pipelineStep} />
          </Alert>
        </Fade>
      )}

      {agentDone && !agentRunning && (
        <Fade in>
          <Alert severity="success" icon={<CheckCircle />}
            sx={{ mb: 3, borderRadius: 2, borderLeft: "4px solid" + C.sage }}>
            <Typography variant="body2" fontWeight={600}>
              Analysis complete — {patents.length} patent{patents.length !== 1 ? "s" : ""} analysed.
              Ask follow-up questions below.
            </Typography>
          </Alert>
        </Fade>
      )}

      {/* Main layout */}
      {(patents.length > 0 || chatHistory.length > 0) && (
        <Grid container spacing={3}>

          {/* LEFT — Patent list */}
          <Grid item xs={12} md={4}>
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
                  <IconButton size="small" onClick={handleReset} sx={{ color: C.navy }}>
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
                      onClick={() => setSelectedPatent(patent)}
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
                              sx={{ height: 18, fontSize: 10, fontWeight: 600,
                                    bgcolor: C.sky, color: C.teal }} />
                          )}
                        </Box>
                        <Typography variant="body2" fontWeight={600}
                          sx={{ fontSize: 13, mb: 0.5, color: C.navy, lineHeight: 1.4 }}>
                          {patent.Title}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                          <Link href={patent.Link} target="_blank" rel="noopener noreferrer"
                            sx={{ fontSize: 11, color: C.teal, textDecoration: "none",
                                  "&:hover": { textDecoration: "underline" } }}>
                            {patent.PatentID}
                          </Link>
                          <OpenInNew sx={{ fontSize: 10, color: C.teal }} />
                        </Box>
                        <Typography variant="caption"
                          sx={{
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
          </Grid>

          {/* RIGHT — Chat */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3}
              sx={{ height: 680, display: "flex", flexDirection: "column", borderRadius: 3 }}>

              {/* Chat header */}
              <Box sx={{
                p: 2.5, borderBottom: 1, borderColor: "divider",
                background: "linear-gradient(to right,#F7FAFC,#EDF2F7)",
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                  <Psychology sx={{ color: C.navy, fontSize: 26 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ color: C.navy }}>
                    AI Agent Q&amp;A
                  </Typography>
                </Box>
                {selectedPatent ? (
                  <Typography variant="caption" sx={{ color: C.muted, display: "block" }}>
                    Focused on: <strong>{selectedPatent.PatentID}</strong>&nbsp;—&nbsp;
                    {selectedPatent.Title?.substring(0, 55)}…
                    &nbsp;(or click <em>All Patents</em> for cross-patent analysis)
                  </Typography>
                ) : (
                  <Typography variant="caption" sx={{ color: "#718096" }}>
                    Run the agent above, then ask follow-up questions here
                  </Typography>
                )}
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: "auto", p: 2.5, bgcolor: "#FAFAFA" }}>
                {chatHistory.length === 0 ? (
                  <Box sx={{
                    height: "100%", display: "flex",
                    alignItems: "center", justifyContent: "center", flexDirection: "column",
                  }}>
                    <Psychology sx={{ fontSize: 72, color: "#CBD5E0", mb: 2 }} />
                    <Typography variant="h6" sx={{ color: "#4A5568", fontWeight: 500 }}>
                      Ready to Analyse
                    </Typography>
                    <Typography variant="caption"
                      sx={{ color: "#718096", mt: 1, textAlign: "center", maxWidth: 380 }}>
                      Enter a drug-protein-disease combination or a patent title,
                      set the number of patents, and click Run Agent.
                      The agent will autonomously search, read, and assess novelty
                      with a single AI synthesis call.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    {chatHistory.map((msg, idx) => (
                      <Fade in key={idx}>
                        <Box>
                          {msg.role === "user" ? (
                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                              <Paper elevation={2} sx={{
                                p: 2, maxWidth: "78%",
                                background: "linear-gradient(135deg,#0124AA 0%,#00809E 100%)",
                                color: "white", borderRadius: "16px 16px 4px 16px",
                              }}>
                                <Typography variant="body2"
                                  sx={{ fontWeight: 500, fontSize: 13.5 }}>
                                  {msg.content}
                                </Typography>
                              </Paper>
                            </Box>
                          ) : (
                            <Box>
                              <Paper elevation={1} sx={{
                                p: 2.5, bgcolor: "white",
                                borderLeft: 4,
                                borderColor: msg.mode === "agent_run"    ? C.teal
                                           : msg.mode === "multi_patent" ? C.sage
                                           : C.slate,
                                borderRadius: "4px 16px 16px 16px",
                              }}>
                                {/* Agent run badge */}
                                {msg.mode === "agent_run" && (
                                  <Box sx={{ display: "flex", alignItems: "center",
                                             gap: 0.8, mb: 1.5 }}>
                                    <Lightbulb sx={{ fontSize: 16, color: C.teal }} />
                                    <Typography variant="caption"
                                      sx={{ color: C.teal, fontWeight: 700, fontSize: 11,
                                            textTransform: "uppercase", letterSpacing: 0.5 }}>
                                      Agent Analysis
                                    </Typography>
                                  </Box>
                                )}

                                {/* Multi-patent badge */}
                                {msg.mode === "multi_patent" && (
                                  <Box sx={{ display: "flex", alignItems: "center",
                                             gap: 0.8, mb: 1.5 }}>
                                    <Psychology sx={{ fontSize: 14, color: C.navy}} />
                                    <Typography variant="caption"
                                      sx={{ color: C.navy, fontWeight: 700, fontSize: 11,
                                            textTransform: "uppercase", letterSpacing: 0.5 }}>
                                      Synthesised across {msg.patents_analyzed?.length || 0} patents
                                    </Typography>
                                  </Box>
                                )}

                                {formatResponse(msg.content)}

                                {/* Recommendations panel */}
                                {msg.recommendations && (
                                  <Box sx={{ mt: 2, p: 1.5, bgcolor: "#F0FFF4",
                                             borderRadius: 2, border: "1px solid" + C.sage }}>
                                    <Typography variant="caption"
                                      sx={{ fontWeight: 700, color: C.sage,
                                            textTransform: "uppercase", letterSpacing: 0.5 }}>
                                      Recommendations &amp; Next Steps
                                    </Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                      {formatResponse(msg.recommendations)}
                                    </Box>
                                  </Box>
                                )}

                                {/* Pipeline trace */}
                                {msg.pipeline_steps && (
                                  <PipelineTraceAccordion steps={msg.pipeline_steps} />
                                )}
                              </Paper>
                            </Box>
                          )}
                        </Box>
                      </Fade>
                    ))}

                    {answerLoading && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pl: 0.5 }}>
                        <CircularProgress size={20} sx={{ color: "#00809E" }} />
                        <Typography variant="body2" sx={{ color: "#718096", fontSize: 13 }}>
                          Analysing patents, please wait…
                        </Typography>
                      </Box>
                    )}

                    <div ref={chatEndRef} />
                  </Box>
                )}
              </Box>

              {/* Input row */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", bgcolor: "#FAFAFA" }}>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      placeholder="Ask a follow-up question about the patents…"
                      value={currentQuery}
                      onChange={(e) => setCurrentQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAskSingle();
                        }
                      }}
                      variant="outlined" size="small"
                      disabled={!agentDone || answerLoading}
                      multiline maxRows={3}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset":       { borderColor: "#00809E" },
                          "&.Mui-focused fieldset": { borderColor: "#0124AA" },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={4} sm={3}>
                    <Tooltip title={selectedPatent
                      ? `Ask about ${selectedPatent.PatentID}`
                      : "Select a patent from the list first"}>
                      <span style={{ display: "block" }}>
                        <Button
                          variant="contained" fullWidth size="small"
                          onClick={handleAskSingle}
                          disabled={!agentDone || answerLoading
                                    || !currentQuery.trim() || !selectedPatent}
                          startIcon={<Send sx={{ fontSize: 14 }} />}
                          sx={{
                            background: "linear-gradient(90deg,#00809E,#196C69)",
                            height: 40, fontWeight: 600, textTransform: "none", borderRadius: 2,
                            "&:hover": { background: "linear-gradient(90deg,#006d85,#145a56)" },
                          }}>
                          Ask
                        </Button>
                      </span>
                    </Tooltip>
                  </Grid>

                  <Grid item xs={4} sm={3}>
                    <Button
                      variant="outlined" fullWidth size="small"
                      onClick={handleAskAll}
                      disabled={!agentDone || answerLoading || !currentQuery.trim()}
                      sx={{
                        height: 40, fontWeight: 600, textTransform: "none", borderRadius: 2,
                        borderColor: "#0124AA", color: "#0124AA",
                        "&:hover": { borderColor: "#011d88", bgcolor: "rgba(1,36,170,0.04)" },
                      }}>
                      All Patents
                    </Button>
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
                  {[
                    { color: "#00809E", text: "Ask — question about the selected patent" },
                    { color: "#0124AA", text: "All Patents — synthesise across all analysed patents" },
                  ].map((item) => (
                    <Box key={item.text} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <FiberManualRecord sx={{ fontSize: 8, color: item.color }} />
                      <Typography variant="caption" sx={{ color: "#718096", fontSize: 10.5 }}>
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

            </Paper>
          </Grid>

        </Grid>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default NoveltySearchAgent;