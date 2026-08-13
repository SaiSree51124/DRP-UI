import React from 'react';
import {
  Box, Typography, Button, TextField, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { AddOutlined, DeleteOutlineOutlined, CloseOutlined } from '@mui/icons-material';
import {
  FONT, TEAL, USER_MSG_BG, GRAY_BG, BORDER, TEXT_DARK, TEXT_MUTED,
} from '../workflowConstants';
import AgentHeader from '../AgentHeader';

const CuratexPhase = ({
  workflowPhase,
  setWorkflowPhase,
  chatMessages,
  profileData,
  setProfileData,
  profileEditMode,
  setProfileEditMode,
  curateXResults,
  setSelectedCompound,
  setShowCompoundDetail,
  setActiveStep,
}) => {
  // ─── Loading ────────────────────────────────────────────────────────────
  if (workflowPhase === 'curatex-loading') {
    const curatexQuery = chatMessages.length > 0
      ? chatMessages.filter(m => m.role === 'user').slice(-1)[0]?.text
      : 'Generate a target candidate profile for JAK2.';
    return (
      <Box sx={{ p: "24px 40px 40px 40px", bgcolor: GRAY_BG }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: "8px 0" }}>
          <Box sx={{ bgcolor: USER_MSG_BG, border: `1px solid ${BORDER}`, borderRadius: "12px", p: "16px", maxWidth: "680px" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: TEAL, textTransform: "uppercase", mb: "8px" }}>DR. PRIYA (YOU)</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "15px", color: TEXT_DARK, lineHeight: "22px" }}>{curatexQuery}</Typography>
          </Box>
        </Box>
        <Box sx={{ p: "8px 0" }}>
          <Box sx={{ bgcolor: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "12px", p: "24px" }}>
            <AgentHeader label="INOVAPATH CURATEX AGENT" />
            <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: TEXT_DARK, mb: "20px" }}>
              Searching for candidate compounds matching your JAK2 Target Profile...
            </Typography>
            {/* Progress bar */}
            <Box sx={{ bgcolor: "#F1F5F9", borderRadius: "4px", height: "8px", mb: "20px", overflow: "hidden" }}>
              <Box sx={{ bgcolor: TEAL, height: "100%", width: "40%", borderRadius: "4px",
                animation: "progress-fill 2s ease-in-out forwards",
                "@keyframes progress-fill": { from: { width: "10%" }, to: { width: "65%" } },
              }} />
            </Box>
            {/* Step indicators */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Analyzing target profile parameters...", done: true },
                { label: "Scanning compound databases...", done: true },
                { label: "Matching candidates against criteria...", done: false },
              ].map((step, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {step.done ? (
                    <Typography sx={{ fontSize: "14px", color: TEAL, lineHeight: 1 }}>&#10003;</Typography>
                  ) : (
                    <Box sx={{ width: 14, height: 14, border: `2px solid ${TEAL}`, borderTopColor: "transparent", borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      "@keyframes spin": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
                    }} />
                  )}
                  <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: step.done ? TEAL : TEXT_DARK }}>{step.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // ─── Profile ─────────────────────────────────────────────────────────────
  if (workflowPhase === 'curatex-profile') {
    return (
      <Box sx={{ p: "24px 40px 40px 40px", bgcolor: GRAY_BG }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: "8px 0" }}>
          <Box sx={{ bgcolor: USER_MSG_BG, border: `1px solid ${BORDER}`, borderRadius: "12px", p: "16px", maxWidth: "680px" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.5px", mb: "8px" }}>DR. PRIYA (YOU)</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "15px", color: TEXT_DARK, lineHeight: "22px" }}>
              {profileEditMode ? "Please generate a Target Candidate Profile for JAK2." : "Generate a target candidate profile for JAK2."}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ p: "8px 0" }}>
          <Box sx={{ bgcolor: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "12px", p: "24px" }}>
            <AgentHeader label="INOVAPATH CURATEX AGENT" />
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: TEXT_DARK, mb: "16px" }}>
              I've generated a Target Product Profile for JAK2. Review and adjust the parameters below, then submit to find matching candidates.
            </Typography>
            <Box sx={{ bgcolor: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "8px", p: "20px" }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "15px", fontWeight: 700, color: TEXT_DARK, mb: "4px" }}>Target Product Profile - JAK2</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: TEXT_MUTED, mb: "20px" }}>
                {profileEditMode ? "Editing mode — modify values below, then save changes" : "Pre-filled parameters for repurposing candidate search"}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: "16px" }}>
                {["Property", "Target Criterion", "Weight"].map(h => (
                  <Typography key={h} sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase" }}>{h}</Typography>
                ))}
                {Object.entries(profileData).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: TEXT_DARK, textTransform: "capitalize" }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    {profileEditMode ? (
                      <TextField value={value} onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })} size="small" fullWidth
                        sx={{ "& .MuiOutlinedInput-root": { fontFamily: FONT, fontSize: "13px", bgcolor: "#FFFFFF" } }} />
                    ) : (
                      <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: TEXT_DARK }}>{value}</Typography>
                    )}
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: TEXT_MUTED }}>{profileEditMode ? "15%" : ""}</Typography>
                    {profileEditMode && (
                      <IconButton size="small" sx={{ gridColumn: "4 / 5" }}>
                        <DeleteOutlineOutlined sx={{ fontSize: 18, color: TEXT_MUTED }} />
                      </IconButton>
                    )}
                  </React.Fragment>
                ))}
              </Box>
              {profileEditMode && (
                <Button startIcon={<AddOutlined />} sx={{ textTransform: "none", fontFamily: FONT, fontSize: "12px", color: TEAL, mt: "12px" }}>
                  Add Parameter
                </Button>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: "12px", mt: "20px" }}>
              {profileEditMode ? (
                <>
                  <Button variant="contained" onClick={() => setProfileEditMode(false)} sx={{ bgcolor: TEAL, color: "#FFFFFF", textTransform: "none", fontFamily: FONT, fontSize: "13px", fontWeight: 600, "&:hover": { bgcolor: "#089B98" } }}>Save Changes</Button>
                  <Button variant="outlined" onClick={() => setProfileEditMode(false)} sx={{ textTransform: "none", fontFamily: FONT, fontSize: "13px", color: TEXT_DARK, borderColor: BORDER }}>Cancel</Button>
                </>
              ) : (
                <>
                  <Button variant="contained" onClick={() => setWorkflowPhase("curatex-submitted")}
                    sx={{ bgcolor: TEAL, color: "#FFFFFF", textTransform: "none", fontFamily: FONT, fontSize: "13px", fontWeight: 600, "&:hover": { bgcolor: "#089B98" } }}>
                    Submit Profile
                  </Button>
                  <Button variant="outlined" onClick={() => setProfileEditMode(true)}
                    sx={{ textTransform: "none", fontFamily: FONT, fontSize: "12px", color: TEAL, borderColor: BORDER }}>
                    Edit Values
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // ─── Results ─────────────────────────────────────────────────────────────
  if (workflowPhase === 'curatex-results') {
    return (
      <Box sx={{ p: "24px 40px 40px 40px", bgcolor: GRAY_BG }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: "8px 0" }}>
          <Box sx={{ bgcolor: USER_MSG_BG, border: `1px solid ${BORDER}`, borderRadius: "12px", p: "16px", maxWidth: "680px" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.5px", mb: "8px" }}>DR. PRIYA (YOU)</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "15px", color: TEXT_DARK, lineHeight: "22px" }}>Submit Profile</Typography>
          </Box>
        </Box>
        <Box sx={{ p: "8px 0" }}>
          <Box sx={{ bgcolor: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "12px", p: "24px" }}>
            <AgentHeader label="INOVAPATH CURATEX AGENT" />
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: TEXT_DARK, mb: "20px" }}>
              Profile submitted. Scoring 124 compounds against your JAK2 target product profile. Here are the top candidates:
            </Typography>
            {/* Results table */}
            <Box sx={{ bgcolor: "#FFFFFF", borderRadius: "8px", overflow: "hidden", border: `1px solid ${BORDER}` }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "60px 1fr 2fr 1fr", gap: "16px", px: "16px", py: "12px", bgcolor: GRAY_BG, borderBottom: `1px solid ${BORDER}` }}>
                {["RANK", "COMPOUND", "MATCHED PROPERTIES", "MISMATCHED"].map(h => (
                  <Typography key={h} sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase" }}>{h}</Typography>
                ))}
              </Box>
              {curateXResults.map((compound, index) => (
                <Box key={compound.rank} sx={{ display: "grid", gridTemplateColumns: "60px 1fr 2fr 1fr", gap: "16px", px: "16px", py: "14px", borderBottom: index < curateXResults.length - 1 ? `1px solid ${BORDER}` : "none", bgcolor: index === 0 ? "#F0FDFC" : "#FFFFFF", "&:hover": { bgcolor: "#F8FAFC", cursor: "pointer" }, alignItems: "center" }}
                  onClick={() => { setSelectedCompound(compound); setShowCompoundDetail(true); }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 700, color: TEXT_DARK }}>{compound.rank}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: TEAL }}>{compound.name}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: TEXT_DARK }}>{compound.matchedProps}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: "#EF4444" }}>{compound.mismatchedProps}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: "16px" }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: TEXT_MUTED }}>Showing 1-6 of 124 compounds</Typography>
            </Box>
            {/* Recommendation */}
            <Box sx={{ mt: "20px", p: "16px", bgcolor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FCD34D" }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: "#78350F", mb: "4px" }}>Recommendation</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: "#92400E" }}>
                Metformin and Pioglitazone are the strongest candidates. Both match on molecular weight, route of administration, and half-life. Metformin scores highest due to superior bioavailability alignment. Recommend carrying both forward to screening.
              </Typography>
            </Box>
            {/* Actions */}
            <Box sx={{ display: "flex", gap: "12px", mt: "20px" }}>
              <Button variant="outlined" sx={{ textTransform: "none", fontFamily: FONT, fontSize: "13px", color: TEXT_DARK, borderColor: BORDER }}>Branch</Button>
              <Button variant="outlined" sx={{ textTransform: "none", fontFamily: FONT, fontSize: "13px", color: TEXT_DARK, borderColor: BORDER }}>Rerun</Button>
              <Button variant="contained"
                onClick={() => { setActiveStep(3); setWorkflowPhase("screensuite-loading"); }}
                sx={{ bgcolor: TEAL, color: "#FFFFFF", textTransform: "none", fontFamily: FONT, fontSize: "13px", fontWeight: 600, ml: "auto", "&:hover": { bgcolor: "#089B98" } }}>
                Select for Screening
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return null;
};

export default CuratexPhase;
