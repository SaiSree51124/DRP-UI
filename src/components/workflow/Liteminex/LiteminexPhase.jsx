import React from 'react';
import {
  Box, Typography, Button, Checkbox, IconButton,
} from '@mui/material';
import { VisibilityOutlined, CloseOutlined } from '@mui/icons-material';
import {
  FONT, TEAL, USER_MSG_BG, GRAY_BG, BORDER, TEXT_DARK, TEXT_MUTED,
} from '../workflowConstants';
import AgentHeader from '../AgentHeader';

const confidenceColor = (conf) => {
  const n = parseInt(conf);
  if (n >= 95) return { bg: "#D1FAE5", text: "#059669" };
  if (n >= 85) return { bg: "#FEF3C7", text: "#92400E" };
  if (n >= 75) return { bg: "#FEF3C7", text: "#B45309" };
  return { bg: "#FEE2E2", text: "#B91C1C" };
};

const LiteminexPhase = ({
  workflowPhase,
  chatMessages,
  litMinexResults,
  setSelectedArticle,
  setShowArticleDetail,
}) => {
  // ─── Loading ────────────────────────────────────────────────────────────
  if (workflowPhase === 'litminex-loading') {
    return (
      <Box sx={{ p: "24px 16px 16px 16px", bgcolor: GRAY_BG }}>
        {/* User message */}
        <Box sx={{
          bgcolor: USER_MSG_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: "12px",
          p: "16px",
          mb: "8px",
          maxWidth: "680px",
          width: "100%",
          marginLeft: "auto",
        }}>
          <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.5px", mb: "12px" }}>
            DR. PRIYA (YOU)
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: "15px", fontWeight: 400, color: TEXT_DARK, lineHeight: "22px" }}>
            Mine literature for Type 2 Diabetes drug targets with confidence scoring
          </Typography>
        </Box>

        {/* Agent loading card */}
        <Box sx={{ bgcolor: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "12px", p: "16px", width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <Box sx={{ width: 30, height: 30, borderRadius: "8px", bgcolor: "#F0FDF9", border: "1px solid #00BCD4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" fill="#00BCD4"/>
              </svg>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: TEXT_DARK, mb: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                INOVAPATH LITMINEX AGENT
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Box sx={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <Box key={i} sx={{
                      width: 8, height: 8, borderRadius: "50%", bgcolor: TEAL,
                      animation: `dot-pulse 1.4s ease-in-out ${delay}s infinite`,
                      "@keyframes dot-pulse": { "0%, 80%, 100%": { opacity: 0.3 }, "40%": { opacity: 1 } },
                    }} />
                  ))}
                </Box>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: TEXT_DARK }}>
                  Scanning PubMed and clinical databases for target literature...
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // ─── Results ─────────────────────────────────────────────────────────────
  if (workflowPhase === 'litminex-results') {
    const conversation = [
      { role: "user", text: "Mine literature for Type 2 Diabetes drug targets with confidence scoring" },
      ...chatMessages,
    ];

    return (
      <Box sx={{ p: "24px 24px 24px 24px", bgcolor: GRAY_BG, overflowY: "auto" }}>
        {/* Conversation history */}
        {conversation.map((msg, i) =>
          msg.role === "user" ? (
            <Box key={`${msg.role}-${i}`} sx={{ display: "flex", justifyContent: "flex-end", pb: "12px" }}>
              <Box sx={{ bgcolor: USER_MSG_BG, border: `1px solid ${BORDER}`, borderRadius: "12px", p: "14px 18px", maxWidth: "600px" }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.06em", mb: "6px" }}>DR. PRIYA (YOU)</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: TEXT_DARK, lineHeight: "20px" }}>{msg.text}</Typography>
              </Box>
            </Box>
          ) : (
            <Box key={`${msg.role}-${i}`} sx={{ pb: "12px" }}>
              <Box sx={{ bgcolor: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "12px", p: "20px" }}>
                <AgentHeader label="INOVAPATH LITMINEX AGENT" />
                {msg.articleCard && (
                  <Box sx={{ display: "flex", alignItems: "center", bgcolor: GRAY_BG, border: `1px solid ${BORDER}`, borderRadius: "8px", p: "10px 14px", mb: "10px", gap: "10px" }}>
                    <Typography sx={{ fontSize: "18px", lineHeight: 1 }}>📄</Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 600, color: TEXT_DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.articleCard.title}</Typography>
                      <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: TEXT_MUTED }}>{msg.articleCard.author}&nbsp;&nbsp;{msg.articleCard.year}</Typography>
                    </Box>
                    <IconButton size="small" sx={{ p: "2px" }}><CloseOutlined sx={{ fontSize: 14, color: TEXT_MUTED }} /></IconButton>
                  </Box>
                )}
                <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: TEXT_DARK, lineHeight: "22px" }}>{msg.text}</Typography>
              </Box>
            </Box>
          )
        )}

        {/* Main results agent card */}
        <Box sx={{ bgcolor: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "12px", p: "20px" }}>
          <AgentHeader label="INOVAPATH LITMINEX AGENT" />
          <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: TEXT_DARK, lineHeight: "20px", mb: "16px" }}>
            Literature mining complete. Found 124 articles across PubMed and clinical databases. Results ranked by confidence score with keyword extraction.
          </Typography>

          {/* Table + Insights side by side */}
          <Box sx={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>

            {/* Results table — fluid, fills available space */}
            <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <Box sx={{ borderLeft: `3px solid ${TEAL}`, pl: "10px", mb: "6px" }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 700, color: TEXT_DARK }}>Results - 124 articles found</Typography>
              </Box>

              {/* Table */}
              <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: "8px", overflow: "hidden" }}>
                {/* Header row */}
                <Box sx={{ display: "grid", gridTemplateColumns: "32px 32px 1fr 52px 112px 130px 36px", gap: "8px", px: "10px", py: "8px", bgcolor: GRAY_BG, borderBottom: `1px solid ${BORDER}` }}>
                  {[null, "#", "TITLE", "YEAR", "CONFIDENCE SCORE", "FOUND KEYWORDS", "PREVIEW"].map((h, i) => (
                    h === null
                      ? <Box key={i} />
                      : <Typography key={i} sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</Typography>
                  ))}
                </Box>

                {/* Data rows */}
                {litMinexResults.map((article, idx) => {
                  const cc = confidenceColor(article.confidence);
                  return (
                    <Box key={article.id} sx={{ display: "grid", gridTemplateColumns: "32px 32px 1fr 52px 112px 130px 36px", gap: "8px", px: "10px", py: "10px", borderBottom: idx < litMinexResults.length - 1 ? `1px solid ${BORDER}` : "none", bgcolor: idx === 0 ? "#F0FDFC" : "#FFFFFF", alignItems: "center" }}>
                      <Checkbox size="small" checked={idx === 0} readOnly sx={{ p: 0, color: BORDER, "&.Mui-checked": { color: TEAL } }} />
                      <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: TEXT_MUTED }}>{idx + 1}</Typography>
                      <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: TEXT_DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{article.title}</Typography>
                      <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: TEXT_MUTED }}>{article.year}</Typography>
                      <Box sx={{ bgcolor: cc.bg, borderRadius: "6px", px: "8px", py: "3px", textAlign: "center" }}>
                        <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: cc.text }}>{article.confidence}</Typography>
                      </Box>
                      <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: TEXT_MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{article.keywords}</Typography>
                      <IconButton size="small" onClick={() => { setSelectedArticle(article); setShowArticleDetail(true); }}>
                        <VisibilityOutlined sx={{ fontSize: 16, color: TEAL }} />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>

              {/* Pagination */}
              <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {["‹", "1", "2", "3", "...", "12", "›"].map((p, i) => (
                  <Box key={i} sx={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", bgcolor: p === "1" ? TEAL : "transparent", border: p === "1" ? "none" : `1px solid ${BORDER}`, cursor: "pointer" }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: p === "1" ? "#FFFFFF" : TEXT_MUTED }}>{p}</Typography>
                  </Box>
                ))}
                <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: TEXT_MUTED, ml: "8px" }}>Showing 1-10 of 47 articles</Typography>
              </Box>

              {/* Action buttons */}
              <Box sx={{ display: "flex", gap: "10px", pt: "4px" }}>
                {["Branch", "Rerun", "Export"].map(label => (
                  <Button key={label} sx={{ textTransform: "none", fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: TEXT_DARK, bgcolor: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "8px", px: "16px", py: "7px" }}>{label}</Button>
                ))}
              </Box>
            </Box>

            {/* Insights panel */}
            <Box sx={{ width: "220px", flexShrink: 0, border: `1px solid ${BORDER}`, borderRadius: "8px", p: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: TEXT_DARK }}>Insights</Typography>
              {litMinexResults[0] && (
                <Box sx={{ bgcolor: "#F9FAFB", border: "1px solid rgba(0,188,212,0.3)", borderRadius: "8px", p: "12px" }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 600, color: TEAL, mb: "6px" }}>Article Relevance</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: "#6B7280", lineHeight: 1.5 }}>
                    This article demonstrates strong evidence for Metformin-JAK2 interaction with direct insulin signaling pathway involvement and therapeutic potential.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return null;
};

export default LiteminexPhase;
