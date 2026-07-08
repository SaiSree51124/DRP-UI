import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import NewProjectModal from "../NewProjectModal";
import { useProjects } from "../../context/ProjectsContext";
import {
  CalendarTodayOutlined, AddOutlined,
  LensOutlined, ArticleOutlined, DatasetOutlined,
  ScienceOutlined, StorageOutlined, VerifiedUserOutlined, ScheduleOutlined,
} from "@mui/icons-material";

const TEAL = "#0ABFBC";
const DARK = "#0F172A";
const SUB  = "#64748B";
const FONT = "'Inter', sans-serif";

const stats = [
  { label: "ACTIVE PROJECTS",    highlight: true,  Icon: ScienceOutlined,     iconColor: TEAL      },
  { label: "TARGETS IDENTIFIED", value: "20",  highlight: false, Icon: StorageOutlined,     iconColor: "#3B82F6" },
  { label: "CANDIDATES CURATED", value: "30",  highlight: false, Icon: VerifiedUserOutlined, iconColor: TEAL      },
  { label: "PATENTS ANALYSED",   value: "100", highlight: false, Icon: ScheduleOutlined,    iconColor: TEAL      },
];

const activity = [
  { text: "TxKG completed - 5 targets identified for Thrombocytosis.", time: "5 mins ago",  Icon: ArticleOutlined },
  { text: "LitMineX scored 39 articles for JAK2.",                     time: "2 hours ago", Icon: LensOutlined    },
  { text: "CurateX curated 20 compounds.",                             time: "3 hours ago", Icon: DatasetOutlined },
];

const statusColors = {
  ACTIVE:    { bg: "#ECFDF5", color: "#10B981", border: "#A7F3D0" },
  "ON HOLD": { bg: "#F5F3FF", color: "#8B5CF6", border: "#DDD6FE" },
};

const StatusBadge = ({ status }) => {
  const c = statusColors[status] || statusColors.ACTIVE;
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", px: "8px", py: "3px",
      borderRadius: "4px", bgcolor: c.bg, border: `1px solid ${c.border}` }}>
      <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 600,
        color: c.color, letterSpacing: "0.4px" }}>
        {status}
      </Typography>
    </Box>
  );
};

const Overview = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { projects } = useProjects();

  return (
    <Box sx={{ p: "24px 32px 24px 32px", fontFamily: FONT,
      minHeight: "100%", display: "flex", flexDirection: "column",
      boxSizing: "border-box", position: "relative" }}>

      {/* Page header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        mb: "20px", flexShrink: 0 }}>
        <Box>
          <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: "24px", color: DARK, lineHeight: 1.3 }}>
            Platform Overview
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, mt: "3px" }}>
            System health and repurposing pipeline status for Q1 2026
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Button variant="outlined" startIcon={<CalendarTodayOutlined sx={{ fontSize: 15 }} />}
            sx={{ height: "36px", borderRadius: "8px", borderColor: "#E2E8F0", color: DARK,
              fontFamily: FONT, fontSize: "13px", fontWeight: 500, textTransform: "none",
              "&:hover": { borderColor: "#CBD5E1", bgcolor: "#F8FAFC" } }}>
            Last 30 Days
          </Button>
          <Button variant="contained" disableElevation startIcon={<AddOutlined sx={{ fontSize: 15 }} />}
            onClick={() => setModalOpen(true)}
            sx={{ height: "36px", borderRadius: "8px", bgcolor: TEAL, color: "#fff",
              fontFamily: FONT, fontSize: "13px", fontWeight: 500, textTransform: "none",
              "&:hover": { bgcolor: "#09ADAB" } }}>
            New Project
          </Button>
        </Box>
      </Box>

      {/* Stat cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px",
        mb: "16px", flexShrink: 0 }}>
        {stats.map(({ label, highlight, Icon, iconColor, value }) => (
          <Box key={label} sx={{ p: "16px 20px", bgcolor: "#fff",
            border: highlight ? `1.5px solid ${TEAL}` : "1px solid #E2E8F0",
            borderRadius: "12px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: "10px" }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 600,
                color: "#94A3B8", letterSpacing: "0.8px" }}>
                {label}
              </Typography>
              <Box sx={{ width: 26, height: 26, borderRadius: "7px",
                bgcolor: highlight ? "#E6FAFA" : "#F1F5F9",
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon sx={{ fontSize: 15, color: iconColor }} />
              </Box>
            </Box>
            <Typography sx={{ fontFamily: FONT, fontSize: "32px", fontWeight: 700, color: DARK, lineHeight: 1 }}>
              {label === "ACTIVE PROJECTS" ? projects.length : value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Active Repurposing Projects */}
      <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px",
        mb: "16px", overflow: "hidden", flexShrink: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center",
          px: "24px", py: "14px", borderBottom: "1px solid #F1F5F9" }}>
          <Typography sx={{ fontFamily: FONT, fontWeight: 600, fontSize: "15px", color: DARK }}>
            Active Repurposing Projects
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEAL, cursor: "pointer" }}>
            View All
          </Typography>
        </Box>

        {/* Column headers */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 160px 130px 120px",
          px: "24px", py: "8px", bgcolor: "#F8FAFC" }}>
          {[
            { label: "PROJECT NAME", align: "left"   },
            { label: "DISEASE",      align: "center" },
            { label: "MODULE",       align: "center" },
            { label: "STATUS",       align: "center" },
          ].map(({ label, align }) => (
            <Typography key={label} sx={{ fontFamily: FONT, fontSize: "11px", fontWeight: 600,
              color: "#94A3B8", letterSpacing: "0.8px", textAlign: align }}>
              {label}
            </Typography>
          ))}
        </Box>

        {/* Project rows */}
        {projects.map((p) => (
          <Box key={p.name} sx={{ display: "grid", gridTemplateColumns: "1fr 160px 130px 120px",
            px: "24px", py: "11px", borderTop: "1px solid #F1F5F9", alignItems: "center",
            "&:hover": { bgcolor: "#FAFBFC" }, cursor: "pointer" }}>
            <Box>
              <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 500, color: DARK }}>
                {p.name}
              </Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: TEAL, mt: "1px" }}>
                {p.disease}
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, textAlign: "center" }}>
              {p.disease}
            </Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, textAlign: "center" }}>
              {p.module}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <StatusBadge status={p.status} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Recent Platform Activity */}
      <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px",
        overflow: "hidden", flexShrink: 0 }}>
        <Box sx={{ px: "24px", py: "14px", borderBottom: "1px solid #F1F5F9", flexShrink: 0 }}>
          <Typography sx={{ fontFamily: FONT, fontWeight: 600, fontSize: "15px", color: DARK }}>
            Recent Platform Activity
          </Typography>
        </Box>
        <Box>
          {activity.map(({ text, time, Icon }, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: "14px",
              px: "24px", py: "12px",
              borderTop: i === 0 ? "none" : "1px solid #F8FAFC" }}>
              <Box sx={{ width: 30, height: 30, borderRadius: "8px", bgcolor: "#F1F5F9",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon sx={{ fontSize: 15, color: "#64748B" }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: DARK }}>
                  {text}
                </Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: TEAL, mt: "2px" }}>
                  {time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Genie FAB */}
      <Button variant="contained" disableElevation
        sx={{ position: "fixed", bottom: "32px", right: "32px",
          width: "104px", height: "43px",
          borderRadius: "24px", bgcolor: "#0D1B2A",
          border: "1px solid rgba(10, 191, 188, 0.5)",
          boxShadow: "0px 8px 24px rgba(124, 58, 237, 0.302)",
          color: "#0ABFBC", fontFamily: FONT, fontSize: "16px",
          fontWeight: 700, lineHeight: "19px", textTransform: "none",
          whiteSpace: "nowrap",
          px: "20px", py: "12px", minWidth: "auto", zIndex: 2,
          "&:hover": { bgcolor: "#1A2C3D" } }}>
        ✦ Genie
      </Button>

      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default Overview;
