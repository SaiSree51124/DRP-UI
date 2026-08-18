import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import {
  ChevronLeftOutlined,
  ChevronRightOutlined,
  PushPinOutlined,
} from "@mui/icons-material";

const FONT = "'Inter', sans-serif";

/* ── App-wide accent, confirmed 00BCD4 across badge text / status dot / pin ── */
const TEAL = "#00BCD4";

/* ── Tokens pulled from this round's Figma dev-mode crops ────────────────
   top-nav          height 63, padding 16/32/16/32, bg #FFFFFF, border-bottom #EAECF0
   breadcrumb text  Inter 500/13px, #3D4451
   card             padding 36/40/32/40, gap 24, radius 12, border #E2E8F0,
                     shadow 0px 2px 8px rgba(0,0,0,0.039)
   page title       Inter 700/24px, #111827
   page subtitle    Inter 400/14px, #6B7280
   search-box       height 34 (Hug), radius 8, border #E0E5EB, padding 9/14/9/14, gap 8
   search icon      13x13, #9CA3AF
   placeholder      Inter 400/13px, #9CA3AF
   filter-chip      height 30 (Hug), radius 6, padding 7/14/7/14
   chip active      bg #00BCD4, text #FFFFFF (Inter 500/13px)
   chip inactive    bg #FFFFFF, border #E5E8ED, text #4B5563 (Inter 400/13px)

   sessions-list    Fill(1120) x Hug(665), radius 10, border #E5E7EB, bg #FFFFFF
   session-card     Fill(1120) x Hug(95), border-bottom 1px #F0F2F5,
                     padding 16/20/16/20, gap 5 (vertical stack)
   top-row          Fill(1080) x Hug(19), horizontal, gap 8
   module badge     Hug(45) x Hug(19), radius 4, padding 3/8/3/8, bg per-module
   badge text       Inter 600/11px, color per-module
   status frame     Hug x Hug(13), horizontal, gap 5 (dot + label)
   status dot       6x6 ellipse, color per-status
   status text      Inter 400/11px, #6B7280 (uniform across statuses)
   pin-icon         14x14, vector 8.17x8.75 stroke 1.33px #00BCD4
   timestamp text   Inter 400/11px, #9CA3AF
   title text       Inter 600/15px, #111827
   subtitle text    Inter 400/13px, #6B7280

   pagination       Fill(1120) x Hug(40), padding-top 8, gap 8
   btn-prev/next    Fixed 32x32, radius 4, bg #F1F5F9
   page (inactive)  Fixed 32x32, radius 4, bg #F1F5F9, label Inter 500/12px #6B7280 centered
   page (active)    Fixed 32x32, radius 4, border 1.5px #00BCD4, transparent bg
   "showing" text   Inter 400/12px, #6B7280

   search icon      confirmed as the literal "🔍" glyph (not a vector), boxed at 13x13,
                     Inter 400/13px, color #9CA3AF
   ------------------------------------------------------------------------ */
const TOPNAV_BORDER = "#EAECF0";
const BREADCRUMB_COLOR = "#3D4451";
const CARD_BORDER = "#E2E8F0";
const PAGE_TITLE_COLOR = "#111827";
const SUBTITLE_COLOR = "#6B7280";
const SEARCH_BORDER = "#E0E5EB";
const SEARCH_ICON_COLOR = "#9CA3AF";
const CHIP_ACTIVE_BG = "#00BCD4";
const CHIP_BORDER = "#E5E8ED";
const CHIP_TEXT_INACTIVE = "#4B5563";
const LIST_BORDER = "#E5E7EB";

const ROW_BORDER = "#F0F2F5";
const TITLE_COLOR = "#111827";
const TEXT_MUTED = "#6B7280"; // subtitle / status label
const TEXT_MUTED_LIGHT = "#9CA3AF"; // timestamp / placeholder / search icon
const BG = "#F8FAFC";

const MODULE_TAGS = ["All", "TxKG", "LitMineX", "ScreenSuite", "CurateX", "NovSearch"];

/* Text colors confirmed directly from Figma dev-mode ("Colors" panel per badge).
   Background tints are estimated as a light wash of the text color where the
   exact bg hex wasn't captured (only TxKG's #E6F7F6 was inspected directly). */
const MODULE_COLORS = {
  TxKG: { color: TEAL, bg: "#E6F7F6" },
  LitMineX: { color: "#5966C7", bg: "#EEF0FC" },
  ScreenSuite: { color: "#A64D94", bg: "#FBEEF6" },
  CurateX: { color: "#00BCD4", bg: "#E6F7F6" },
  // NovSearch bg/text not present in this round's crops — kept as prior best guess
  NovSearch: { color: "#4338CA", bg: "#E0E7FF" },
};

/* Status dot colors confirmed per-status from Figma; label color is uniform #6B7280 */
const STATUS_DOT_COLORS = {
  Completed: "#00BCD4",
  "In Progress": "#F59E0B",
  Saved: "#94A3B8",
};

const SESSIONS = [
  {
    module: "TxKG",
    status: "Completed",
    title: "Type 2 Diabetes",
    subtitle: "10 targets identified",
    time: "15 min ago",
    pinned: true,
  },
  {
    module: "LitMineX",
    status: "In Progress",
    title: "JAK2 \u2013 Thrombocytosis",
    subtitle: "Scanning 3,200 articles...",
    time: "2 hours ago",
  },
  {
    module: "ScreenSuite",
    status: "Saved",
    title: "JAK2 \u2013 Imatinib Binding",
    subtitle: "Virtual screening complete",
    time: "Yesterday",
  },
  {
    module: "CurateX",
    status: "Completed",
    title: "BRAF \u2013 Melanoma Resistance",
    subtitle: "Curation complete \u2022 8 candidates shortlisted",
    time: "2 days ago",
  },
  {
    module: "NovSearch",
    status: "Saved",
    title: "HER2 \u2013 Breast Cancer Repurposing",
    subtitle: "Novelty assessment complete",
    time: "3 days ago",
  },
  {
    module: "TxKG",
    status: "Completed",
    title: "PPARG \u2013 Metabolic Syndrome",
    subtitle: "Knowledge graph complete \u2022 15 drug interactions mapped",
    time: "4 days ago",
  },
  {
    module: "LitMineX",
    status: "Completed",
    title: "CDK4/6 \u2013 Triple Negative Breast Cancer",
    subtitle: "Literature mining complete \u2022 892 articles analyzed",
    time: "5 days ago",
  },
];

const TOTAL_ITEMS = 47;
const TOTAL_PAGES = 12;
const PAGE_SIZE = 10;

/* Figma's "search icon" is literally the 🔍 glyph as a text node — Width 13,
   Height 13, Inter 400/13px, color #9CA3AF — not a custom vector. Rendering
   it as the same character keeps it pixel-identical to the design. */
function SearchIcon() {
  return (
    <Box
      component="span"
      sx={{
        width: "13px",
        height: "13px",
        fontSize: "13px",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: SEARCH_ICON_COLOR,
      }}
    >
      🔍
    </Box>
  );
}

const PAGE_BTN_BG = "#F1F5F9"; // btn-prev / btn-next / inactive page numbers
const PAGE_BTN_LABEL = "#6B7280"; // inactive page-number label color

/* PageButton — Fixed 32x32, radius 4. Inactive (incl. prev/next chevrons):
   bg #F1F5F9. Active: transparent bg, 1.5px #00BCD4 border. Numeric labels
   are Inter 500/12px, centered — #6B7280 inactive, teal when active. */
function PageButton({ children, active, onClick, disabled, "aria-label": ariaLabel }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        padding: 0,
        borderRadius: "4px",
        border: active ? `1.5px solid ${TEAL}` : "1.5px solid transparent",
        background: active ? "transparent" : PAGE_BTN_BG,
        color: disabled ? "#CBD5E1" : active ? TEAL : PAGE_BTN_LABEL,
        cursor: disabled ? "default" : "pointer",
        fontFamily: FONT,
        fontSize: "12px",
        fontWeight: 500,
        lineHeight: 1,
        boxSizing: "border-box",
        transition: "background 0.15s, border-color 0.15s",
        "&:hover": disabled ? {} : { background: active ? "transparent" : "#E7ECF3" },
      }}
    >
      {children}
    </Box>
  );
}

const RecentSessionsPage = () => {
  const [search, setSearch] = useState("");
  const [activeModule, setActiveModule] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = SESSIONS.filter(
    (s) =>
      (activeModule === "All" || s.module === activeModule) &&
      (!search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.subtitle.toLowerCase().includes(search.toLowerCase()))
  );

  const rangeStart = (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, TOTAL_ITEMS);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: BG,
        boxSizing: "border-box",
      }}
    >
      {/* top-nav — Fill × Hug(63), padding 16/32/16/32, border-bottom #EAECF0 */}
      <Box
        sx={{
          flexShrink: 0,
          height: "63px",
          bgcolor: "#FFFFFF",
          borderBottom: `1px solid ${TOPNAV_BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          boxSizing: "border-box",
        }}
      >
        <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: BREADCRUMB_COLOR, lineHeight: 1 }}>
          Recent Sessions
        </Typography>
      </Box>

      {/* content area — the card fills the remaining space, flush (no outer margin) */}
      <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: "36px 40px 32px",
            bgcolor: "#fff",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: "12px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.039)",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* page-header — gap 6 */}
          <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "24px", fontWeight: 700, color: PAGE_TITLE_COLOR, lineHeight: 1 }}>
              Recent Research Sessions
            </Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: SUBTITLE_COLOR, lineHeight: 1 }}>
              Resume previous research threads or review completed analyses.
            </Typography>
          </Box>

          {/* filter-bar — gap 10 */}
          <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* search-box — Fill × Hug(34), radius 8, border #E0E5EB, padding 9/14, gap 8 */}
            <Box
              sx={{
                flex: "1 1 260px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: "34px",
                padding: "9px 14px",
                bgcolor: "#fff",
                border: `1px solid ${SEARCH_BORDER}`,
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            >
              <SearchIcon />
              <TextField
                variant="standard"
                placeholder="Search sessions by target, disease, or module..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                InputProps={{ disableUnderline: true }}
                sx={{
                  "& input": { fontFamily: FONT, fontSize: "13px", color: TITLE_COLOR, py: 0 },
                  "& input::placeholder": { color: TEXT_MUTED_LIGHT, opacity: 1 },
                }}
              />
            </Box>

            {/* filter chips — height 30, radius 6, padding 7/14/7/14 */}
            <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", flexShrink: 0 }}>
              {MODULE_TAGS.map((tag) => {
                const active = activeModule === tag;
                return (
                  <Box
                    key={tag}
                    onClick={() => setActiveModule(tag)}
                    sx={{
                      height: "30px",
                      padding: "7px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      boxSizing: "border-box",
                      bgcolor: active ? CHIP_ACTIVE_BG : "#fff",
                      border: `1px solid ${active ? CHIP_ACTIVE_BG : CHIP_BORDER}`,
                      "&:hover": { bgcolor: active ? "#00A8BD" : BG },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT,
                        fontSize: "13px",
                        fontWeight: active ? 500 : 400,
                        color: active ? "#FFFFFF" : CHIP_TEXT_INACTIVE,
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tag}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* sessions-list — Fill(1120) × Hug(665), radius 10, border #E5E7EB */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              bgcolor: "#FFFFFF",
              border: `1px solid ${LIST_BORDER}`,
              borderRadius: "10px",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
              {filtered.map((s, i) => {
                const mc = MODULE_COLORS[s.module] || { color: TEXT_MUTED_LIGHT, bg: BG };
                const dotColor = STATUS_DOT_COLORS[s.status] || TEXT_MUTED_LIGHT;

                return (
                  <Box
                    key={i}
                    sx={{
                      /* session-card — Fill(1120) x Hug(95), padding 16/20/16/20, gap 5 (vertical) */
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      padding: "16px 20px",
                      borderBottom: i === filtered.length - 1 ? "none" : `1px solid ${ROW_BORDER}`,
                      cursor: "pointer",
                      boxSizing: "border-box",
                      "&:hover": { bgcolor: BG },
                    }}
                  >
                    {/* top-row — Fill(1080) x Hug(19), horizontal, gap 8 */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                        width: "100%",
                      }}
                    >
                      {/* left cluster: module badge + status */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {/* module badge — Hug(45) x Hug(19), radius 4, padding 3/8/3/8 */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            bgcolor: mc.bg,
                            width: "fit-content",
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: FONT,
                              fontSize: "11px",
                              fontWeight: 600,
                              color: mc.color,
                              lineHeight: 1,
                            }}
                          >
                            {s.module}
                          </Typography>
                        </Box>

                        {/* status frame — Hug x Hug(13), horizontal, gap 5 */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: dotColor, flexShrink: 0 }} />
                          <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 400, color: TEXT_MUTED, lineHeight: 1 }}>
                            {s.status}
                          </Typography>
                        </Box>
                      </Box>

                      {/* right cluster: pin-icon (14x14) + timestamp */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                        {s.pinned && (
                          <PushPinOutlined
                            sx={{ fontSize: 14, width: 14, height: 14, color: TEAL, transform: "rotate(45deg)" }}
                          />
                        )}
                        <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 400, color: TEXT_MUTED_LIGHT, lineHeight: 1, whiteSpace: "nowrap" }}>
                          {s.time}
                        </Typography>
                      </Box>
                    </Box>

                    {/* title — Inter 600/15px, #111827 */}
                    <Typography sx={{ fontFamily: FONT, fontSize: "15px", fontWeight: 600, color: TITLE_COLOR, lineHeight: 1 }}>
                      {s.title}
                    </Typography>

                    {/* subtitle — Inter 400/13px, #6B7280 */}
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 400, color: TEXT_MUTED, lineHeight: 1 }}>
                      {s.subtitle}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* pagination — separate sibling frame below sessions-list (not nested
              inside its border). Fill(1104 within the card's padded content) x
              Hug(40), padding-top 8, gap 8. All controls sit together as one
              centered group, not split edge-to-edge. */}
          <Box
            sx={{
              flexShrink: 0,
              width: "100%",
              pt: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "8px",
              boxSizing: "border-box",
            }}
          >
            <PageButton
              aria-label="Previous page"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeftOutlined sx={{ fontSize: 16 }} />
            </PageButton>

            {[1, 2, 3].map((n) => (
              <PageButton key={n} active={page === n} onClick={() => setPage(n)}>
                {n}
              </PageButton>
            ))}

            <Box sx={{ px: "4px", color: PAGE_BTN_LABEL, fontFamily: FONT, fontSize: "12px" }}>&hellip;</Box>

            <PageButton active={page === TOTAL_PAGES} onClick={() => setPage(TOTAL_PAGES)}>
              {TOTAL_PAGES}
            </PageButton>

            <PageButton
              aria-label="Next page"
              disabled={page === TOTAL_PAGES}
              onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            >
              <ChevronRightOutlined sx={{ fontSize: 16 }} />
            </PageButton>

            <Typography sx={{ fontFamily: FONT, fontSize: "12px", fontWeight: 400, color: TEXT_MUTED, whiteSpace: "nowrap", ml: "8px" }}>
              Showing {rangeStart}-{rangeEnd} of {TOTAL_ITEMS} articles
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RecentSessionsPage;