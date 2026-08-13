import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, TextField, IconButton,
  Select, MenuItem, Popover, Button,
} from "@mui/material";
import { BG_IMAGE } from "../WelcomeScreen";
import {
  ArrowUpwardOutlined, AddOutlined, SearchOutlined, MicNoneOutlined,
  UploadFileOutlined, FolderOpenOutlined, ChevronRightOutlined,
  AutoAwesomeOutlined, KeyboardArrowUpOutlined, KeyboardArrowDownOutlined,
  CloseOutlined, GridViewOutlined, ShowChartOutlined, PersonOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import NewProjectModal from "../NewProjectModal";

const FONT      = "'Inter', sans-serif";
const TEAL      = "#0ABFBC";
const MUTED     = "#94A3B8";
const BORDER    = "#E2E8F0";
const TEXT_DARK = "#0F172A";
const BG        = "#F8FAFC";

const MOCK_PROJECTS = [
  { name: "End to End Virtual Screening", dot: "#F97316" },
  { name: "JAK2 \u2013 Thrombocytosis",  dot: TEAL      },
  { name: "BRAF Melanoma Research",       dot: "#16A34A" },
  { name: "HER2 Breast Cancer Study",     dot: "#D97706" },
  { name: "Type 2 Diabetes \u2013 PPARG",dot: TEAL      },
];

/* ── Shared sub-components ─────────────────────────────────────────────── */
const UserMsg = ({ text }) => (
  <Box sx={{ maxWidth: "680px", width: "100%", mx: "auto", bgcolor: "#F0FDFC", border: "1px solid rgba(226,232,240,0.3)", borderRadius: "12px", p: "16px", display: "flex", flexDirection: "column", gap: "12px", boxSizing: "border-box" }}>
    <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.5px" }}>Dr. Priya (You)</Typography>
    <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: TEXT_DARK, lineHeight: 1.55 }}>{text}</Typography>
  </Box>
);

const AgentCard = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: "16px", overflow: "hidden", bgcolor: "#fff", boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.03)" }}>
      <Box onClick={() => setOpen(o => !o)}
        sx={{ display: "flex", alignItems: "center", gap: "10px", px: "16px", py: "12px", cursor: "pointer", bgcolor: "#fff", borderBottom: open ? `1px solid ${BORDER}` : "none",
          "&:hover": { bgcolor: BG } }}>
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

/* ══════════════════  NEW RESEARCH PAGE  ════════════════════════════════════ */
const NewResearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [addAnchorEl, setAddAnchorEl] = useState(null);
  const [showProjectSub, setShowProjectSub] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleSubmit = () => {
    if (!query.trim()) return;
    navigate('/dashboard/new-research/workflow', { state: { query: query.trim() } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { 
      e.preventDefault(); 
      handleSubmit(); 
    }
  };

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

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 40px",
        overflow: "hidden",
        background: "#F8FAFC",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "20px",
          width: "680px",
          minHeight: "350px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", width: "680px" }}>
          <Typography
            sx={{
              width: "169px",
              height: "13px",
              fontFamily: FONT,
              fontStyle: "normal",
              fontWeight: 600,
              fontSize: "11px",
              lineHeight: "13px",
              letterSpacing: "1.5px",
              color: "#00BCD4",
              textTransform: "uppercase",
            }}
          >
            AI RESEARCH COWORKER
          </Typography>

          <Typography
            sx={{
              width: "632px",
              height: "96px",
              fontFamily: FONT,
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: "40px",
              lineHeight: "48px",
              color: TEXT_DARK,
              letterSpacing: "-0.03em",
            }}
          >
            What new drug you are going to <Box component="span" sx={{ color: "#00CC8C" }}>Rediscover today?</Box>
          </Typography>

          <Typography
            sx={{
              width: "500px",
              minHeight: "52px",
              fontFamily: FONT,
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "26px",
              color: "#667080",
            }}
          >
            Start with a disease name. iNovaPath recommends ranked protein targets — you confirm before anything advances.
          </Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "16px",
            gap: "14px",
            isolation: "isolate",
            width: "680px",
            minHeight: "129px",
            background: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.0392157), 0px 4px 16px rgba(0, 0, 0, 0.0392157)",
            borderRadius: "16px",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "4px",
              left: 0,
              top: 0,
              background: "linear-gradient(90deg, #00A699 0%, #00CC8C 100%)",
              borderRadius: "2px",
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "648px",
              minHeight: "22px",
              gap: "12px",
              zIndex: 1,
              mt: "8px",
            }}
          >
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
              <IconButton
                size="small"
                onClick={(e) => setAddAnchorEl(e.currentTarget)}
                sx={{
                  width: 26,
                  height: 26,
                  padding: "6px",
                  borderRadius: "8px",
                  background: "#F1F5F9",
                  color: "#475569",
                  border: "none",
                  flexShrink: 0,
                  "&:hover": { background: "#F1F5F9" },
                }}
              >
                <AddOutlined sx={{ fontSize: 14 }} />
              </IconButton>

              {selectedProject && (
                <Box
                  sx={{
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: "6px 10px",
                    gap: "5px",
                    minWidth: "185px",
                    height: "29px",
                    background: "#F0FDFB",
                    border: "1px solid #CCFAF5",
                    borderRadius: "8px",
                  }}
                >
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: selectedProject.dot }} />
                  <Typography sx={{ fontFamily: "Geist, Inter, sans-serif", fontSize: "13px", fontWeight: 500, color: "#00BCD4" }}>
                    {selectedProject.name}
                  </Typography>
                  <Box onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }} sx={{ cursor: "pointer", color: "#94A3B8", fontSize: "13px" }}>
                    ×
                  </Box>
                </Box>
              )}
            </Box>

            <Button
              onClick={handleSubmit}
              disabled={!query.trim()}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "8px 16px",
                gap: "6px",
                width: "141px",
                height: "32px",
                background: "#1F2938",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontFamily: FONT,
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "13px",
                lineHeight: "16px",
                textTransform: "none",
                minWidth: "141px",
                opacity: 1,
                "&:hover": { background: "#1F2938" },
                "&:disabled": { background: "#1F2938", color: "#FFFFFF", opacity: 1 },
              }}
            >
              Begin research <span aria-hidden="true">→</span>
            </Button>
          </Box>

          <TextField
            fullWidth
            multiline
            maxRows={3}
            variant="standard"
            placeholder="Find protein targets for..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{ disableUnderline: true }}
            sx={{
              width: "648px",
              zIndex: 1,
              "& textarea": {
                fontFamily: "Geist, Inter, sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "15px",
                lineHeight: "22px",
                color: "#99A3AD",
                resize: "none",
                padding: 0,
                minHeight: "22px",
              },
              "& textarea::placeholder": {
                color: "#99A3AD",
                opacity: 1,
              },
            }}
          />

          <Typography
            sx={{
              width: "212px",
              height: "15px",
              fontFamily: FONT,
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "15px",
              color: "#8C99A6",
              zIndex: 3,
            }}
          >
            Describe a disease or research intent
          </Typography>
        </Box>
      </Box>

      {renderAddPopover()}
      <NewProjectModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </Box>
  );
};

export default NewResearchPage;