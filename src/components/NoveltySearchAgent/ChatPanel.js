import React from "react";
import {
  Box, Paper, Typography, Grid, TextField, Button,
  CircularProgress, Tooltip, Fade,
} from "@mui/material";
import { Psychology, Send, Lightbulb, FiberManualRecord } from "@mui/icons-material";
import { C } from "../../utils/colors";
import formatResponse from "./formatResponse";
import PipelineTraceAccordion from "./PipelineTraceAccordion";

const ChatPanel = ({
  chatHistory, answerLoading, currentQuery, setCurrentQuery,
  handleAskSingle, handleAskAll, selectedPatent, agentDone, chatEndRef,
}) => (
  <Paper elevation={3} sx={{ height: 680, display: "flex", flexDirection: "column", borderRadius: 3 }}>

    {/* Chat header */}
    <Box sx={{ p: 2.5, borderBottom: 1, borderColor: "divider", background: "linear-gradient(to right,#F7FAFC,#EDF2F7)" }}>
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
        <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <Psychology sx={{ fontSize: 72, color: "#CBD5E0", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#4A5568", fontWeight: 500 }}>Ready to Analyse</Typography>
          <Typography variant="caption" sx={{ color: "#718096", mt: 1, textAlign: "center", maxWidth: 380 }}>
            Enter a drug-protein-disease combination or a patent title, set the number of patents, and click Run Agent.
            The agent will autonomously search, read, and assess novelty with a single AI synthesis call.
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
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13.5 }}>
                        {msg.content}
                      </Typography>
                    </Paper>
                  </Box>
                ) : (
                  <Box>
                    <Paper elevation={1} sx={{
                      p: 2.5, bgcolor: "white",
                      borderLeft: 4,
                      borderColor: msg.mode === "agent_run" ? C.teal : msg.mode === "multi_patent" ? C.sage : C.slate,
                      borderRadius: "4px 16px 16px 16px",
                    }}>
                      {msg.mode === "agent_run" && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.5 }}>
                          <Lightbulb sx={{ fontSize: 16, color: C.teal }} />
                          <Typography variant="caption" sx={{ color: C.teal, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Agent Analysis
                          </Typography>
                        </Box>
                      )}
                      {msg.mode === "multi_patent" && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.5 }}>
                          <Psychology sx={{ fontSize: 14, color: C.navy }} />
                          <Typography variant="caption" sx={{ color: C.navy, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Synthesised across {msg.patents_analyzed?.length || 0} patents
                          </Typography>
                        </Box>
                      )}
                      {formatResponse(msg.content)}
                      {msg.recommendations && (
                        <Box sx={{ mt: 2, p: 1.5, bgcolor: "#F0FFF4", borderRadius: 2, border: "1px solid" + C.sage }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: C.sage, textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Recommendations &amp; Next Steps
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>{formatResponse(msg.recommendations)}</Box>
                        </Box>
                      )}
                      {msg.pipeline_steps && <PipelineTraceAccordion steps={msg.pipeline_steps} />}
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
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAskSingle(); }
            }}
            variant="outlined"
            size="small"
            disabled={!agentDone || answerLoading}
            multiline
            maxRows={3}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, "&:hover fieldset": { borderColor: "#00809E" }, "&.Mui-focused fieldset": { borderColor: "#0124AA" } } }}
          />
        </Grid>
        <Grid item xs={4} sm={3}>
          <Tooltip title={selectedPatent ? `Ask about ${selectedPatent.PatentID}` : "Select a patent from the list first"}>
            <span style={{ display: "block" }}>
              <Button
                variant="contained" fullWidth size="small"
                onClick={handleAskSingle}
                disabled={!agentDone || answerLoading || !currentQuery.trim() || !selectedPatent}
                startIcon={<Send sx={{ fontSize: 14 }} />}
                sx={{ background: "linear-gradient(90deg,#00809E,#196C69)", height: 40, fontWeight: 600, textTransform: "none", borderRadius: 2, "&:hover": { background: "linear-gradient(90deg,#006d85,#145a56)" } }}
              >
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
            sx={{ height: 40, fontWeight: 600, textTransform: "none", borderRadius: 2, borderColor: "#0124AA", color: "#0124AA", "&:hover": { borderColor: "#011d88", bgcolor: "rgba(1,36,170,0.04)" } }}
          >
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
            <Typography variant="caption" sx={{ color: "#718096", fontSize: 10.5 }}>{item.text}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  </Paper>
);

export default ChatPanel;
