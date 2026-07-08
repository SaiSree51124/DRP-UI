import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, Typography, TextField, InputAdornment,
  Select, MenuItem, FormControl,
} from "@mui/material";
import { AddOutlined, SearchOutlined } from "@mui/icons-material";
import NewProjectModal from "../NewProjectModal";

const TEAL = "#0ABFBC";
const DARK = "#0F172A";
const SUB  = "#64748B";
const FONT = "'Inter', sans-serif";
const BORDER = "#E2E8F0";

const projects = [
  { id: "metformin-for-oncology",   name: "Metformin for Oncology",   sub: "AMPK pathway modulation",        phase: "Phase II",  status: "ACTIVE",   score: 94, module: "TxKG",      researcher: "Dr. Aris",   avatar: "/authbtn.png",  disease: "Pancreatic Cancer",      updated: "2h ago"  },
  { id: "rapamycin-for-neuro",      name: "Rapamycin for Neuro",      sub: "mTOR inhibition study",          phase: "Phase Ib",  status: "ACTIVE",   score: 88, module: "LitMineX",  researcher: "Dr. Sarah",  avatar: "/authbtn1.png", disease: "Alzheimer's Disease",    updated: "5h ago"  },
  { id: "sildenafil-for-cv",        name: "Sildenafil for CV",         sub: "PDE5 inhibitor efficacy",        phase: "Phase III", status: "ON HOLD",  score: 91, module: "CurateX",   researcher: "Dr. Chen",   avatar: "/authbtn.png",  disease: "Pulmonary Hypertension", updated: "1d ago"  },
  { id: "anastrozole-for-lung",     name: "Anastrozole for Lung",      sub: "Aromatase inhibitor test",       phase: "Discovery", status: "ACTIVE",   score: 76, module: "TxKG",      researcher: "Dr. Elena",  avatar: "/authbtn1.png", disease: "NSCLC",                  updated: "2d ago"  },
  { id: "propranolol-for-hema",     name: "Propranolol for Hema",      sub: "Beta-blocker trial",             phase: "Phase II",  status: "ACTIVE",   score: 82, module: "LitMineX",  researcher: "Dr. James",  avatar: "/authbtn.png",  disease: "Hemangioma",             updated: "3d ago"  },
  { id: "imatinib-for-nsclc",       name: "Imatinib for NSCLC",        sub: "Tyrosine kinase study",          phase: "Discovery", status: "REVIEW",   score: 85, module: "CurateX",   researcher: "Dr. Mateo",  avatar: "/authbtn1.png", disease: "Lung Cancer",            updated: "4d ago"  },
  { id: "losartan-for-fibrosis",    name: "Losartan for Fibrosis",     sub: "Angiotensin receptor test",      phase: "Phase I",   status: "ACTIVE",   score: 72, module: "TxKG",      researcher: "Dr. Kim",    avatar: "/authbtn.png",  disease: "Hepatic Fibrosis",       updated: "1w ago"  },
  { id: "thalidomide-for-myeloma",  name: "Thalidomide for Myeloma",   sub: "Immunomodulatory trial",         phase: "Phase IIb", status: "REVIEW",   score: 89, module: "LitMineX",  researcher: "Dr. Wilson", avatar: "/authbtn1.png", disease: "Multiple Myeloma",       updated: "1w ago"  },
];

const statusColors = {
  ACTIVE:   { bg: "#ECFDF5", color: "#10B981", border: "#A7F3D0" },
  "ON HOLD":{ bg: "#F5F3FF", color: "#8B5CF6", border: "#DDD6FE" },
  REVIEW:   { bg: "#FFF7ED", color: "#F59E0B", border: "#FDE68A" },
};

const StatusBadge = ({ status }) => {
  const c = statusColors[status] || statusColors.ACTIVE;
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", px: "8px", py: "3px", borderRadius: "4px", bgcolor: c.bg, border: `1px solid ${c.border}` }}>
      <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 600, color: c.color, letterSpacing: "0.4px" }}>
        {status}
      </Typography>
    </Box>
  );
};

const ScoreBar = ({ score }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: DARK, minWidth: "32px" }}>{score}%</Typography>
    <Box sx={{ width: "72px", height: "4px", borderRadius: "2px", bgcolor: "#E2E8F0" }}>
      <Box sx={{ width: `${score}%`, height: "100%", borderRadius: "2px", bgcolor: TEAL }} />
    </Box>
  </Box>
);

const InlineSelect = ({ label, value, onChange, options }) => (
  <FormControl size="small">
    <Select
      value={value} onChange={e => onChange(e.target.value)}
      displayEmpty
      renderValue={(val) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, whiteSpace: "nowrap" }}>{label}:</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: DARK, fontWeight: 500 }}>{val}</Typography>
        </Box>
      )}
      sx={{
        height: "36px", borderRadius: "8px", fontFamily: FONT, color: DARK,
        "& .MuiOutlinedInput-notchedOutline": { borderColor: BORDER },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E1" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: BORDER },
        "& .MuiSelect-select": { pr: "32px !important", pl: "12px" },
      }}
    >
      {options.map(o => <MenuItem key={o} value={o} sx={{ fontFamily: FONT, fontSize: "13px" }}>{o}</MenuItem>)}
    </Select>
  </FormControl>
);

const COLS = "1fr 160px 130px 120px";

const ActiveProjects = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [module, setModule] = useState("All Modules");
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState("Latest Activity");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchModule = module === "All Modules" || p.module === module;
    const matchStatus = status === "All Status"  || p.status === status;
    return matchSearch && matchModule && matchStatus;
  });

  return (
    <Box sx={{ p: "24px 32px", fontFamily: FONT, position: "relative",
      height: "100%", display: "flex", flexDirection: "column",
      boxSizing: "border-box", overflow: "hidden" }}>

      {/* Page header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: "20px", flexShrink: 0 }}>
        <Box>
          <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: "24px", color: DARK }}>Active Projects</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, mt: "4px" }}>
            Manage and track your drug repurposing research
          </Typography>
        </Box>
        <Button variant="contained" disableElevation startIcon={<AddOutlined sx={{ fontSize: 15 }} />}
          onClick={() => setModalOpen(true)}
          sx={{ height: "36px", borderRadius: "8px", bgcolor: TEAL, color: "#fff", fontFamily: FONT, fontSize: "13px", fontWeight: 500, textTransform: "none", "&:hover": { bgcolor: "#09ADAB" } }}>
          New Project
        </Button>
      </Box>

      {/* Filters row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "16px", width: "100%", flexShrink: 0 }}>
        {/* Left group — stretches to fill, Sort by stays far right */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
          <TextField
            size="small" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ fontSize: 16, color: "#94A3B8" }} /></InputAdornment>,
              sx: { borderRadius: "8px", fontSize: "13px", fontFamily: FONT, height: "36px", bgcolor: "#fff" },
            }}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: BORDER },
                "&:hover fieldset": { borderColor: "#CBD5E1" },
                "&.Mui-focused fieldset": { borderColor: TEAL },
              },
              "& input::placeholder": { color: "#94A3B8", opacity: 1, fontSize: "13px" },
            }}
          />
          <InlineSelect label="Module"  value={module} onChange={setModule}
            options={["All Modules", "TxKG", "LitMineX", "CurateX", "ScreenSuite", "NovSearch"]} />
          <InlineSelect label="Status"  value={status} onChange={setStatus}
            options={["All Status", "ACTIVE", "ON HOLD", "REVIEW"]} />
        </Box>
        {/* Sort by — far right */}
        <InlineSelect label="Sort by" value={sort} onChange={setSort}
          options={["Latest Activity", "AI Score", "Phase", "Name"]} />
      </Box>

      {/* Table */}
      <Box sx={{ bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden",
        flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        {/* Section sub-header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "24px", py: "12px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <Typography sx={{ fontFamily: FONT, fontWeight: 600, fontSize: "15px", color: DARK }}>Active Repurposing Projects</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEAL, cursor: "pointer" }}>View All</Typography>
        </Box>
        {/* Table header */}
        <Box sx={{ display: "grid", gridTemplateColumns: COLS, px: "24px", py: "8px", bgcolor: "#F8FAFC", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          {["PROJECT NAME", "DISEASE", "MODULE", "STATUS"].map((col, i) => (
            <Typography key={col} sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.8px", textAlign: i === 0 ? "left" : "center" }}>
              {col}
            </Typography>
          ))}
        </Box>

        {/* Rows - scrollable */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
        {filtered.map((p, i) => (
          <Box key={p.id}
            onClick={() => navigate(`/dashboard/active-projects/${p.id}`)}
            sx={{
              display: "grid", gridTemplateColumns: COLS,
              px: "24px", py: "14px", alignItems: "center",
              borderTop: i === 0 ? "none" : `1px solid #F1F5F9`,
              cursor: "pointer",
              bgcolor: "#fff",
              "&:hover": { bgcolor: "#F8FAFC" },
            }}>
            <Box>
              <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 500, color: DARK }}>{p.name}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: TEAL, mt: "2px" }}>{p.disease}</Typography>
            </Box>
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, textAlign: "center" }}>{p.disease}</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, textAlign: "center" }}>{p.module}</Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}><StatusBadge status={p.status} /></Box>
          </Box>
        ))}
        </Box>
      </Box>

      {/* Pagination */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "14px", flexShrink: 0 }}>
        <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB }}>
          Showing {filtered.length} of 42 projects
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {/* Prev arrow */}
          <Box onClick={() => setPage(p => Math.max(1, p - 1))}
            sx={{ width: 32, height: 32, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `1px solid ${BORDER}`, "&:hover": { bgcolor: "#F8FAFC" } }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: SUB }}>‹</Typography>
          </Box>
          {[1,2,3,4,5].map(n => (
            <Box key={n} onClick={() => setPage(n)}
              sx={{ width: 32, height: 32, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                bgcolor: page === n ? TEAL : "transparent", border: `1px solid ${page === n ? TEAL : BORDER}`,
                "&:hover": { bgcolor: page === n ? TEAL : "#F8FAFC" },
              }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: page === n ? 600 : 400, color: page === n ? "#fff" : SUB }}>{n}</Typography>
            </Box>
          ))}
          {/* Next arrow */}
          <Box onClick={() => setPage(p => Math.min(5, p + 1))}
            sx={{ width: 32, height: 32, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `1px solid ${BORDER}`, "&:hover": { bgcolor: "#F8FAFC" } }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: SUB }}>›</Typography>
          </Box>
        </Box>
      </Box>

      {/* Curate FAB */}
      <Button
        variant="contained"
        disableElevation
        startIcon={<AddOutlined sx={{ fontSize: 15 }} />}
        sx={{
          position: "fixed", bottom: "32px", right: "32px",
          borderRadius: "20px", bgcolor: DARK, color: "#fff",
          fontFamily: FONT, fontSize: "13px", fontWeight: 500,
          textTransform: "none", px: "20px", py: "8px",
          "&:hover": { bgcolor: "#1E293B" },
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}
      >
        Genie
      </Button>

      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default ActiveProjects;
