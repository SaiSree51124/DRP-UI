import React from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, IconButton, InputAdornment, TextField } from "@mui/material";
import {
  GridViewOutlined, FolderOutlined, AppsOutlined,
  SettingsOutlined, LogoutOutlined,
  SearchOutlined, NotificationsNoneOutlined,
  AccountTreeOutlined, FindInPageOutlined, StorageOutlined,
} from "@mui/icons-material";

const SIDEBAR_BG  = "#0D1B2A";
const HOVER_BG    = "#1A2C3D";
const ACTIVE_BG   = "#1E293B";
const ACTIVE_TEXT = "#F1F5F9";
const MUTED       = "#94A3B8";
const TEAL        = "#0ABFBC";
const FONT        = "'Inter', sans-serif";

const primaryNav = [
  { label: "Dashboard",       icon: GridViewOutlined, path: "/dashboard",                 end: true },
  { label: "Active Projects", icon: FolderOutlined,   path: "/dashboard/active-projects"           },
  { label: "Modules",         icon: AppsOutlined,     path: "/dashboard/modules"                   },
];

const MODULE_PATHS = [
  "/dashboard/TxKG-knowledge-graph",
  "/dashboard/literature-mining",
  "/dashboard/data-curation-engine",
  "/dashboard/screening-suite",
  "/dashboard/novelty-search-agent",
];

const moduleSubNav = [
  { label:"TxKG",     icon: AccountTreeOutlined, path:"/dashboard/TxKG-knowledge-graph" },
  { label:"LitMineX", icon: FindInPageOutlined,  path:"/dashboard/literature-mining"   },
  { label:"CurateX",  icon: StorageOutlined,     path:"/dashboard/data-curation-engine" },
];

const SidebarLink = ({ to, icon: Icon, label, end = false }) => (
  <NavLink to={to} end={end} style={{ textDecoration: "none" }}>
    {({ isActive }) => (
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "12px", py: "9px", borderRadius: "8px",
        bgcolor: isActive ? ACTIVE_BG : "transparent",
        cursor: "pointer", transition: "background 0.15s",
        "&:hover": { bgcolor: isActive ? ACTIVE_BG : HOVER_BG },
      }}>
        <Icon sx={{ fontSize: 18, color: isActive ? TEAL : MUTED, flexShrink: 0 }} />
        <Typography sx={{
          fontFamily: FONT, fontSize: "14px",
          fontWeight: isActive ? 500 : 400,
          color: isActive ? ACTIVE_TEXT : MUTED,
        }}>
          {label}
        </Typography>
      </Box>
    )}
  </NavLink>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onModulePage = MODULE_PATHS.some(p => location.pathname.startsWith(p));
  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", fontFamily: FONT }}>

      {/* ── SIDEBAR: 260px fixed, #0D1B2A, space-between, 24px padding ── */}
      <Box sx={{
        width: "260px", flexShrink: 0, height: "100vh",
        bgcolor: SIDEBAR_BG, display: "flex", flexDirection: "column",
        justifyContent: "space-between", p: "24px", overflowY: "auto",
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-thumb": { bgcolor: ACTIVE_BG, borderRadius: "4px" },
      }}>
        {/* Top */}
        <Box>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "36px" }}>
            <Box sx={{ width: 36, height: 36, borderRadius: "8px", bgcolor: TEAL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Box component="img" src="/logo.png" alt="DRP" sx={{ width: 22, height: 22, objectFit: "contain" }} />
            </Box>
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "20px", fontFamily: FONT }}>DRP</Typography>
          </Box>
          {/* Nav */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {primaryNav.map(({ label, icon, path, end }) => (
              <SidebarLink key={path} to={path} icon={icon} label={label} end={end} />
            ))}
            {/* Module sub-nav */}
            {onModulePage && (
              <Box sx={{ ml: "8px", mt: "4px", display: "flex", flexDirection: "column", gap: "2px" }}>
                {moduleSubNav.map(({ label, icon: Icon, path }) => (
                  <NavLink key={path} to={path} style={{ textDecoration: "none" }}>
                    {({ isActive }) => (
                      <Box sx={{ display:"flex", alignItems:"center", gap:"10px", px:"12px", py:"8px",
                        borderRadius:"8px", cursor:"pointer",
                        bgcolor: isActive ? ACTIVE_BG : "transparent",
                        "&:hover":{ bgcolor: isActive ? ACTIVE_BG : HOVER_BG } }}>
                        <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor: isActive ? TEAL : MUTED, flexShrink:0 }} />
                        <Typography sx={{ fontFamily:FONT, fontSize:"13px",
                          fontWeight: isActive ? 500 : 400,
                          color: isActive ? "#F1F5F9" : MUTED }}>
                          {label}
                        </Typography>
                      </Box>
                    )}
                  </NavLink>
                ))}
              </Box>
            )}
          </Box>
        </Box>
        {/* Bottom */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px", px: "12px", py: "9px", borderRadius: "8px", cursor: "pointer", "&:hover": { bgcolor: HOVER_BG } }}>
            <SettingsOutlined sx={{ fontSize: 18, color: MUTED }} />
            <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: MUTED }}>Settings</Typography>
          </Box>
          <Box onClick={() => navigate("/")} sx={{ display: "flex", alignItems: "center", gap: "12px", px: "12px", py: "9px", borderRadius: "8px", cursor: "pointer", "&:hover": { bgcolor: HOVER_BG } }}>
            <LogoutOutlined sx={{ fontSize: 18, color: MUTED }} />
            <Typography sx={{ fontFamily: FONT, fontSize: "14px", color: MUTED }}>Sign Out</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── MAIN CONTENT ── */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "#F8FAFC", overflow: "hidden" }}>
        {/* Header — always visible */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: "32px", height: "72px", bgcolor: "#fff", borderBottom: "1px solid #E2E8F0", flexShrink: 0 }}>
          <TextField
            size="small"
            placeholder="Search compounds, diseases, or literature..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined sx={{ fontSize: 18, color: MUTED }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "8px", fontSize: "14px", bgcolor: "#F8FAFC", height: "40px", fontFamily: FONT },
            }}
            sx={{
              width: { xs: "220px", md: "360px", lg: "440px" },
              "& .MuiOutlinedInput-root": {
                "& fieldset":             { borderColor: "#E2E8F0" },
                "&:hover fieldset":       { borderColor: "#CBD5E1" },
                "&.Mui-focused fieldset": { borderColor: TEAL },
              },
              "& input::placeholder": { color: MUTED, opacity: 1, fontFamily: FONT, fontSize: "14px" },
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <IconButton size="small" sx={{ color: MUTED }}>
              <NotificationsNoneOutlined sx={{ fontSize: 22 }} />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: "#0F172A", lineHeight: 1.3 }}>Dr. Priya</Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: "11px", color: MUTED, lineHeight: 1.3 }}>Chief Researcher</Typography>
              </Box>
              <Box component="img" src="/authbtn.png" alt="User" sx={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #E2E8F0" }} />
            </Box>
          </Box>
        </Box>
        {/* Outlet */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;