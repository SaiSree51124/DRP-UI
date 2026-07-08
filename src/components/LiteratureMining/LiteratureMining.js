import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import API_CONFIG from "../../apiconfig";
import {
  Box, Button, Typography, TextField, InputAdornment,
  IconButton, CircularProgress, Link,
} from "@mui/material";
import {
  SearchOutlined, MenuBookOutlined, VisibilityOutlined,
  CloseOutlined, AddOutlined, OpenInNewOutlined,
  BookmarkBorderOutlined,
} from "@mui/icons-material";

const TEAL   = "#0ABFBC";
const DARK   = "#0F172A";
const SUB    = "#64748B";
const FONT   = "'Inter', sans-serif";
const BORDER = "#E2E8F0";

/* ── helpers ───────────────────────────────────────── */
const pct = (score) => {
  if (score === undefined || score === null) return "—";
  const v = score > 1 ? score : score * 100;
  return `${Math.round(v)}%`;
};

const scoreColor = (score) => {
  const v = score > 1 ? score : score * 100;
  if (v >= 90) return "#10B981";
  if (v >= 80) return "#F59E0B";
  return "#EF4444";
};

/* ── main component ────────────────────────────────── */
const LiteratureMining = () => {
  const { BASE_URL, PORT1 } = API_CONFIG;

  const [activeTab,       setActiveTab]       = useState("search");
  const [loading,         setLoading]         = useState(false);
  const [results,         setResults]         = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [page,            setPage]            = useState(1);
  const PER_PAGE = 8;

  const formik = useFormik({
    initialValues: { proteinName: "", dataSource: "" },
    validationSchema: Yup.object({
      proteinName: Yup.string().required("Primary term is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setResults([]);
      setSelectedArticle(null);
      setPage(1);
      try {
        const ep = encodeURIComponent;
        const primary  = ep(values.proteinName.split(",").map(s => s.trim()).join(", "));
        const keywords = ep(values.dataSource.split(",").map(s => s.trim()).join(", "));
        const url = `${BASE_URL}:${PORT1}/api/v1/search-keywords/?article_keywords=${primary}&search_keywords=${keywords}`;
        const res = await axios.get(url);
        setResults(res.data.results || []);
      } catch (e) {
        console.error("Search Error:", e);
      } finally {
        setLoading(false);
      }
    },
  });

  const sorted      = [...results].sort((a, b) => b.score - a.score);
  const totalPages  = Math.ceil(sorted.length / PER_PAGE);
  const paginated   = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      height: "38px", borderRadius: "8px", fontFamily: FONT, fontSize: "13px",
      bgcolor: "#fff",
      "& fieldset":             { borderColor: BORDER },
      "&:hover fieldset":       { borderColor: "#CBD5E1" },
      "&.Mui-focused fieldset": { borderColor: TEAL },
    },
    "& input::placeholder": { color: "#94A3B8", opacity: 1, fontFamily: FONT, fontSize: "13px" },
  };

  return (
    <Box sx={{ p: "28px", fontFamily: FONT, height: "100%",
      display: "flex", flexDirection: "column", boxSizing: "border-box", overflow: "hidden" }}>

      {/* ── Title ── */}
      <Box sx={{ flexShrink: 0, mb: "4px" }}>
        <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: "22px", color: DARK }}>
          LiteMinex — Literature Mining
        </Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, mt: "4px" }}>
          Retrieves scientifically relevant articles using semantic search powered by MeSH terminology and contextual understanding.
        </Typography>
      </Box>

      {/* ── Tabs ── */}
      <Box sx={{ display: "flex", mt: "14px", borderBottom: `1px solid ${BORDER}`, mb: "16px", flexShrink: 0 }}>
        {[{ key: "search", label: "Literature Mining" }, { key: "saved", label: "Saved Articles" }].map(t => (
          <Box key={t.key} onClick={() => setActiveTab(t.key)}
            sx={{ px: "16px", pb: "10px", cursor: "pointer", mr: "4px",
              borderBottom: activeTab === t.key ? `2px solid ${TEAL}` : "2px solid transparent", mb: "-1px" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "14px",
              fontWeight: activeTab === t.key ? 600 : 400,
              color: activeTab === t.key ? TEAL : SUB }}>
              {t.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── Search card ── */}
      <Box sx={{ bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px",
        p: "16px 20px", flexShrink: 0, mb: "16px" }}>
        <Box component="form" onSubmit={formik.handleSubmit}
          sx={{ display: "flex", alignItems: "flex-end", gap: "16px" }}>

          {/* Primary Search */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 600,
              color: DARK, mb: "6px" }}>Primary Search</Typography>
            <TextField fullWidth id="proteinName" name="proteinName"
              placeholder="e.g. Alzheimer's disease"
              value={formik.values.proteinName}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.proteinName && Boolean(formik.errors.proteinName)}
              sx={inputSx} />
          </Box>

          {/* Divider */}
          <Box sx={{ width: "1px", height: "38px", bgcolor: BORDER, flexShrink: 0, mb: "0px" }} />

          {/* Keyword Search */}
          <Box sx={{ flex: 2 }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 600,
              color: DARK, mb: "6px" }}>Keyword Search</Typography>
            <TextField fullWidth id="dataSource" name="dataSource"
              placeholder="e.g. amyloid, tau, neuroinflammation"
              value={formik.values.dataSource}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              sx={inputSx} />
          </Box>

          {/* Search button */}
          <Button type="submit" variant="contained" disableElevation
            sx={{ height: "38px", borderRadius: "8px", bgcolor: TEAL, color: "#fff",
              fontFamily: FONT, fontSize: "13px", fontWeight: 600, textTransform: "none",
              px: "24px", flexShrink: 0, "&:hover": { bgcolor: "#09ADAB" } }}>
            SEARCH
          </Button>
        </Box>
      </Box>

      {/* ── Content area ── */}
      <Box sx={{ flex: 1, minHeight: 0, display: "flex", gap: "16px", overflow: "hidden" }}>

        {/* Results / empty pane */}
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {loading && (
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress size={48} thickness={4} sx={{ color: TEAL }} />
            </Box>
          )}

          {!loading && results.length === 0 && (
            <Box sx={{ flex: 1, bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <MenuBookOutlined sx={{ fontSize: 40, color: "#CBD5E1" }} />
              <Typography sx={{ fontFamily: FONT, fontSize: "15px", fontWeight: 600, color: DARK }}>
                No results yet
              </Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, textAlign: "center", maxWidth: "280px" }}>
                Enter a primary search term and optional keywords to explore literature.
              </Typography>
            </Box>
          )}

          {!loading && results.length > 0 && (
            <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column",
              bgcolor: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden" }}>

              {/* Dark results header */}
              <Box sx={{ bgcolor: DARK, px: "20px", py: "13px", flexShrink: 0 }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: "#fff" }}>
                  Results — {results.length} articles found
                </Typography>
              </Box>

              {/* Table header */}
              <Box sx={{ display: "grid",
                gridTemplateColumns: "40px 1fr 60px 110px 160px 52px",
                px: "16px", py: "8px", bgcolor: "#F8FAFC",
                borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
                {["#", "PRIMARY TITLE", "YEAR", "CONFIDENCE SCORE", "FOUND KEYWORDS", "PREVIEW"].map((col, i) => (
                  <Typography key={col} sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 600,
                    color: "#94A3B8", letterSpacing: "0.7px",
                    textAlign: i === 0 || i === 2 || i === 5 ? "center" : "left" }}>
                    {col}
                  </Typography>
                ))}
              </Box>

              {/* Rows */}
              <Box sx={{ flex: 1, overflowY: "auto" }}>
                {paginated.map((item, i) => (
                  <Box key={i}
                    onClick={() => setSelectedArticle(item)}
                    sx={{ display: "grid",
                      gridTemplateColumns: "40px 1fr 60px 110px 160px 52px",
                      px: "16px", py: "10px", alignItems: "center",
                      borderTop: `1px solid #F1F5F9`, cursor: "pointer",
                      bgcolor: selectedArticle === item ? "#F0FDFC" : "#fff",
                      "&:hover": { bgcolor: selectedArticle === item ? "#F0FDFC" : "#F8FAFC" } }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, textAlign: "center" }}>
                      {(page - 1) * PER_PAGE + i + 1}
                    </Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: DARK, fontWeight: 500,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", pr: "12px" }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, textAlign: "center" }}>
                      {item.year || "—"}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Box sx={{ px: "8px", py: "2px", borderRadius: "5px",
                        bgcolor: `${scoreColor(item.score)}18` }}>
                        <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 700,
                          color: scoreColor(item.score) }}>
                          {pct(item.score)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: SUB,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {(item.found_keywords || []).join(", ")}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); setSelectedArticle(item); }}
                        sx={{ color: TEAL, "&:hover": { bgcolor: "#E6FAFA" } }}>
                        <VisibilityOutlined sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "4px", py: "12px", borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
                  {[...Array(Math.min(totalPages, 12))].map((_, i) => (
                    <Box key={i} onClick={() => setPage(i + 1)}
                      sx={{ width: 28, height: 28, borderRadius: "6px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        bgcolor: page === i + 1 ? TEAL : "transparent",
                        border: `1px solid ${page === i + 1 ? TEAL : BORDER}`,
                        "&:hover": { bgcolor: page === i + 1 ? TEAL : "#F8FAFC" } }}>
                      <Typography sx={{ fontFamily: FONT, fontSize: "12px",
                        fontWeight: page === i + 1 ? 700 : 400,
                        color: page === i + 1 ? "#fff" : SUB }}>
                        {i + 1}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* ── Article Detail panel ── */}
        {selectedArticle && (
          <Box sx={{ width: "340px", flexShrink: 0, bgcolor: "#fff",
            border: `1px solid ${BORDER}`, borderRadius: "12px",
            display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Teal header */}
            <Box sx={{ bgcolor: TEAL, px: "20px", py: "14px",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                Article Detail
              </Typography>
              <IconButton size="small" onClick={() => setSelectedArticle(null)}
                sx={{ color: "rgba(255,255,255,0.8)", p: "2px", "&:hover": { color: "#fff" } }}>
                <CloseOutlined sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            {/* Scrollable body */}
            <Box sx={{ flex: 1, overflowY: "auto", p: "20px",
              display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Article title */}
              <Box>
                <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700,
                  color: "#94A3B8", letterSpacing: "0.8px", mb: "6px" }}>ARTICLE TITLE</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 700,
                  color: DARK, lineHeight: 1.5 }}>
                  {selectedArticle.title}
                </Typography>
              </Box>

              {/* Authors + Year */}
              <Box sx={{ display: "flex", gap: "32px" }}>
                <Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700,
                    color: "#94A3B8", letterSpacing: "0.8px", mb: "4px" }}>AUTHORS</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: DARK }}>
                    {selectedArticle.authors || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700,
                    color: "#94A3B8", letterSpacing: "0.8px", mb: "4px" }}>YEAR</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: DARK }}>
                    {selectedArticle.year || "—"}
                  </Typography>
                </Box>
              </Box>

              {/* Abstract */}
              {selectedArticle.abstract && (
                <Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700,
                    color: "#94A3B8", letterSpacing: "0.8px", mb: "6px" }}>ABSTRACT</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: SUB, lineHeight: 1.65 }}>
                    {selectedArticle.abstract}
                  </Typography>
                </Box>
              )}

              {/* Keywords */}
              {(selectedArticle.found_keywords || []).length > 0 && (
                <Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700,
                    color: "#94A3B8", letterSpacing: "0.8px", mb: "8px" }}>KEYWORDS</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {(selectedArticle.found_keywords || []).map(kw => (
                      <Box key={kw} sx={{ px: "10px", py: "3px", borderRadius: "20px", bgcolor: "#E6FAFA" }}>
                        <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 600, color: TEAL }}>
                          {kw}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* PMC Link */}
              {selectedArticle.pdf_file_path && (
                <Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700,
                    color: "#94A3B8", letterSpacing: "0.8px", mb: "6px" }}>PMC LINK</Typography>
                  <Link href={selectedArticle.pdf_file_path} target="_blank" rel="noreferrer"
                    underline="none"
                    sx={{ display: "flex", alignItems: "center", gap: "6px",
                      fontFamily: FONT, fontSize: "13px", color: TEAL, fontWeight: 500,
                      "&:hover": { textDecoration: "underline" } }}>
                    <OpenInNewOutlined sx={{ fontSize: 15 }} />
                    View on PubMed Central
                  </Link>
                </Box>
              )}
            </Box>

            {/* Save Article button */}
            <Box sx={{ p: "16px", borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
              <Button fullWidth variant="contained" disableElevation
                startIcon={<BookmarkBorderOutlined sx={{ fontSize: 16 }} />}
                sx={{ height: "40px", borderRadius: "8px", bgcolor: TEAL, color: "#fff",
                  fontFamily: FONT, fontSize: "13px", fontWeight: 600,
                  textTransform: "none", "&:hover": { bgcolor: "#09ADAB" } }}>
                Save Article
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Genie FAB */}
      <Button variant="contained" disableElevation startIcon={<AddOutlined sx={{ fontSize: 15 }} />}
        sx={{ position: "fixed", bottom: "32px", right: "32px",
          borderRadius: "20px", bgcolor: DARK, color: "#fff",
          fontFamily: FONT, fontSize: "13px", fontWeight: 600,
          textTransform: "none", px: "18px", py: "8px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.18)", "&:hover": { bgcolor: "#1E293B" } }}>
        Genie
      </Button>
    </Box>
  );
};

export default LiteratureMining;
