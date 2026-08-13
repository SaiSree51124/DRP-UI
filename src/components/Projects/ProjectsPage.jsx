import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, TextField, Select, MenuItem, InputAdornment, IconButton,
} from "@mui/material";
import {
  SearchOutlined, AddOutlined,
  ChevronLeftOutlined, ChevronRightOutlined,
} from "@mui/icons-material";

const FONT      = "'Inter', sans-serif";
const TEAL      = "#0ABFBC";
const MUTED     = "#94A3B8";
const BORDER    = "#E2E8F0";
const TEXT_DARK = "#0F172A";
const BG        = "#F8FAFC";

const ALL_PROJECTS = [
  { id: "type-2-diabetes",              name: "Type 2 Diabetes",             disease: "Type 2 Diabetes",        module: "TxKG",      status: "ACTIVE"    },
  { id: "metformin-for-oncology",          name: "Metformin for Oncology",      disease: "Pancreatic Cancer",       module: "TxKG",      status: "ACTIVE"    },
  { id: "rapamycin-for-neuro",              name: "Rapamycin for Neuro",          disease: "Alzheimer's Disease",    module: "LitMineX",  status: "ACTIVE"    },
  { id: "sildenafil-for-cv",               name: "Sildenafil for CV",            disease: "Pulmonary Hypertension",  module: "CurateX",   status: "ON HOLD"   },
  { id: "anastrozole-for-lung",            name: "Anastrozole for Lung",         disease: "NSCLC",                   module: "TxKG",      status: "ACTIVE"    },
  { id: "propranolol-for-hema",            name: "Propranolol for Hema",         disease: "Hemangioma",              module: "LitMineX",  status: "ACTIVE"    },
  { id: "imatinib-for-nsclc",             name: "Imatinib for NSCLC",           disease: "Lung Cancer",             module: "CurateX",   status: "IN REVIEW" },
  { id: "losartan-for-fibrosis",           name: "Losartan for Fibrosis",        disease: "Hepatic Fibrosis",        module: "TxKG",      status: "ACTIVE"    },
  { id: "thalidomide-for-myeloma",         name: "Thalidomide for Myeloma",      disease: "Multiple Myeloma",        module: "LitMineX",  status: "IN REVIEW" },
  { id: "celecoxib-for-glioblastoma",      name: "Celecoxib for Glioblastoma",   disease: "Glioblastoma",            module: "TxKG",      status: "ACTIVE"    },
  { id: "metformin-for-breast-cancer",     name: "Metformin for Breast Cancer",  disease: "Breast Cancer",           module: "LitMineX",  status: "ACTIVE"    },
];

const STATUS_META = {
  "ACTIVE":    { color: "#16A34A", bg: "#DCFCE7" },
  "ON HOLD":   { color: "#B45309", bg: "#FEF3C7" },
  "IN REVIEW": { color: "#92400E", bg: "#FEF9C3" },
};

const StatusChip = ({ status }) => {
  const { color, bg } = STATUS_META[status] || { color: MUTED, bg: "#F1F5F9" };
  return (
    <Box sx={{
      display: "inline-flex", alignItems: "center",
      px: "8px", py: "3px", borderRadius: "4px", bgcolor: bg,
    }}>
      <Typography sx={{
        fontFamily: FONT, fontSize: "11px", fontWeight: 700,
        color, letterSpacing: "0.4px",
      }}>
        {status}
      </Typography>
    </Box>
  );
};

/* Figma dropdown: height 38px, radius 8px, border 1px #E2E8F0, padding T10 R10 B10 L14, gap 8px */
const FilterSelect = ({ value, onChange, options, label }) => (
  <Select
    value={value}
    onChange={onChange}
    size="small"
    displayEmpty
    renderValue={(v) => (
      <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: TEXT_DARK }}>
        {label}: <span style={{ fontWeight: 400 }}>{v || `All ${label}s`}</span>
      </Typography>
    )}
    sx={{
      height: "38px", bgcolor: "#fff",
      borderRadius: "8px",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: BORDER, borderWidth: "1px",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E1" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: TEAL, borderWidth: "1px" },
      "& .MuiSelect-select": { pl: "14px", pr: "10px !important", py: "10px" },
      "& .MuiSelect-icon": { right: "8px" },
    }}
  >
    <MenuItem value=""><em>All {label}s</em></MenuItem>
    {options.map((o) => (
      <MenuItem key={o} value={o} sx={{ fontFamily: FONT, fontSize: "13px" }}>{o}</MenuItem>
    ))}
  </Select>
);

const ROWS_PER_PAGE = 10;

const ProjectsPage = () => {
  const navigate      = useNavigate();
  const [search,      setSearch]      = useState("");
  const [moduleFilter,setModuleFilter] = useState("");
  const [statusFilter,setStatusFilter] = useState("");
  const [sortBy,      setSortBy]       = useState("Latest Activity");
  const [page,        setPage]         = useState(1);

  const filtered = ALL_PROJECTS.filter((p) => {
    const q = search.toLowerCase();
    return (
      (!q || p.name.toLowerCase().includes(q) || p.disease.toLowerCase().includes(q)) &&
      (!moduleFilter || p.module === moduleFilter) &&
      (!statusFilter || p.status === statusFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(43 / ROWS_PER_PAGE));
  const visiblePages = [1, 2, 3, 4, 5].filter((n) => n <= totalPages);

  return (
    <Box sx={{
      height: "100%", display: "flex", flexDirection: "column",
      px: "32px", pt: "32px", pb: "32px", gap: "24px",
      boxSizing: "border-box",
      bgcolor: BG,
    }}>

      {/* ── Page header ─────────────────────────────────────────────── */}
      {/* Figma: header-row, horizontal, Fill 1136px, Hug 51px, space-between */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          {/* "Projects": Inter 700 24px lh 120% #0F172A */}
          <Typography sx={{
            fontFamily: FONT, fontSize: "24px", fontWeight: 700,
            color: TEXT_DARK, lineHeight: "1.2",
          }}>
            Projects
          </Typography>
          {/* subtitle: Inter 400 14px lh 100% #475569 */}
          <Typography sx={{
            fontFamily: FONT, fontSize: "14px", fontWeight: 400,
            color: "#475569", lineHeight: "1", mt: "6px",
          }}>
            Manage and track your drug repurposing research
          </Typography>
        </Box>

        {/* "+ New Project" button: bg #0ABFBC, radius 8px, T10 R16 B10 L16, gap 10px */}
        <Box
          component="button"
          onClick={() => {}}
          sx={{
            display: "flex", alignItems: "center", gap: "10px",
            px: "16px", py: "10px", borderRadius: "8px",
            bgcolor: TEAL, color: "#fff", border: "none", cursor: "pointer",
            fontFamily: FONT, fontSize: "14px", fontWeight: 500,
            flexShrink: 0,
            "&:hover": { bgcolor: "#089B98" },
          }}
        >
          <AddOutlined sx={{ fontSize: 16 }} />
          New Project
        </Box>
      </Box>

      {/* ── Filter bar ──────────────────────────────────────────────── */}
      {/* Figma: horizontal, Fill 1136px, Hug 44px, gap 16px */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>

        {/* Search: Fill 527px, height 44px, radius 8px, border 1px, px 16, gap 12 */}
        <TextField
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: "4px" }}>
                <SearchOutlined sx={{ fontSize: 18, color: MUTED }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              height: "44px", borderRadius: "8px", bgcolor: "#fff",
              gap: "12px",
              "& fieldset": { borderColor: BORDER },
              "&:hover fieldset": { borderColor: "#CBD5E1" },
              "&.Mui-focused fieldset": { borderColor: TEAL, borderWidth: "1px" },
              pl: "16px",
            },
            "& input": {
              fontFamily: FONT, fontSize: "13px", color: TEXT_DARK, p: 0,
            },
            "& input::placeholder": { color: MUTED, opacity: 1 },
          }}
        />

        {/* Module: Hug 187px × 38px */}
        <FilterSelect
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          options={["TxKG", "LitMineX", "CurateX"]}
          label="Module"
        />

        {/* Status: Hug 169px × 38px */}
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={["ACTIVE", "ON HOLD", "REVIEW"]}
          label="Status"
        />

        {/* Sort by: Hug 205px × 38px */}
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          size="small"
          sx={{
            height: "38px", bgcolor: "#fff",
            borderRadius: "8px",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: BORDER },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E1" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: TEAL, borderWidth: "1px" },
            "& .MuiSelect-select": { pl: "14px", py: "10px", fontFamily: FONT, fontSize: "13px", color: TEXT_DARK },
          }}
        >
          {["Latest Activity", "Name", "Status"].map((o) => (
            <MenuItem key={o} value={o} sx={{ fontFamily: FONT, fontSize: "13px" }}>Sort by: {o}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* ── Table card ─────────────────────────────────────────────── */}
      {/* Figma: Fill 1136px, Hug 682px, Radius 16px, Border 1px #E2E8F0, Shadow X0 Y4 Blur12 #000 1.96% */}
      <Box sx={{
        bgcolor: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: "16px",
        boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.0196)",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        flex: 1, minHeight: 0,
      }}>

        {/* Section header: Fill 1136px, Hug 59px, space-between, padding 20px */}
        <Box sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          px: "20px", py: "20px",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}>
          <Typography sx={{
            fontFamily: FONT, fontSize: "16px", fontWeight: 600, color: TEXT_DARK,
          }}>
            Active Repurposing Projects
          </Typography>
          {/* "View All": Inter 600 13px #0ABFBC */}
          <Typography sx={{
            fontFamily: FONT, fontSize: "13px", fontWeight: 600,
            color: TEAL, cursor: "pointer",
            "&:hover": { opacity: 0.8 },
          }}>
            View All
          </Typography>
        </Box>

        {/* Column header: Fill 1136px, Hug 37px, bg #F8FAFC, padding T12 R20 B12 L20 */}
        {/* Headers: PROJECT NAME 11px/700/#94A3B8, DISEASE, MODULE, STATUS */}
        <Box sx={{
          display: "flex", alignItems: "center",
          bgcolor: BG, px: "20px", py: "12px",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}>
          <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", flex: 1 }}>
            Project Name
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "160px" }}>
            Disease
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "120px" }}>
            Module
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", width: "120px" }}>
            Status
          </Typography>
        </Box>

        {/* Data rows: overflow */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {filtered.map((p, i) => (
            <Box
              key={p.name}
              onClick={() => navigate(`/dashboard/active-projects/${p.id}`)}
            sx={{
                display: "flex", alignItems: "center",
                px: "20px", py: "16px", gap: "16px",
                borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : "none",
                cursor: "pointer",
                "&:hover": { bgcolor: BG },
              }}
            >
              <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 500, color: TEXT_DARK, flex: 1, minWidth: 0 }}>
                {p.name}
              </Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: "#475569", width: "160px", flexShrink: 0 }}>
                {p.disease}
              </Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: "#475569", width: "120px", flexShrink: 0 }}>
                {p.module}
              </Typography>
              <Box sx={{ width: "120px", flexShrink: 0 }}>
                <StatusChip status={p.status} />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Footer: Figma Fill 1136px, Hug 56px, border-top 1px, space-between, T12 R20 B12 L20, bg #F8FAFC */}
        <Box sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          px: "20px", py: "12px",
          borderTop: `1px solid ${BORDER}`,
          bgcolor: BG,
          flexShrink: 0,
        }}>
          {/* "Showing 10 of 43 projects": Inter 400 13px #475569 */}
          <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 400, color: "#475569" }}>
            Showing {Math.min(filtered.length, ROWS_PER_PAGE)} of 43 projects
          </Typography>

          {/* page-controls: Hug 272px × 32px, Horizontal, Gap 8px */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IconButton
              size="small"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              sx={{ color: MUTED, width: 32, height: 32, p: 0 }}
            >
              <ChevronLeftOutlined sx={{ fontSize: 18 }} />
            </IconButton>
            {visiblePages.map((n) => (
              <Box
                key={n}
                onClick={() => setPage(n)}
                sx={{
                  /* page-1: Fixed 32×32, Radius 8px, Color #0ABFBC when active */
                  width: 32, height: 32, borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  bgcolor: n === page ? TEAL : "transparent",
                  cursor: "pointer",
                  "&:hover": { bgcolor: n === page ? TEAL : BORDER },
                }}
              >
                <Typography sx={{
                  fontFamily: FONT, fontSize: "13px",
                  fontWeight: n === page ? 600 : 400,
                  color: n === page ? "#fff" : TEXT_DARK,
                }}>
                  {n}
                </Typography>
              </Box>
            ))}
            <IconButton
              size="small"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              sx={{ color: MUTED, width: 32, height: 32, p: 0 }}
            >
              <ChevronRightOutlined sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectsPage;