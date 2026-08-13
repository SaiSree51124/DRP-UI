import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, IconButton } from "@mui/material";
import {
  AddOutlined,
  HomeOutlined,
  HistoryOutlined,
  FolderOutlined,
  MenuOpenOutlined,
} from "@mui/icons-material";

// ── Design tokens (kept consistent with the rest of the app) ───────────────
const SIDEBAR_BG   = "#0F1923";
const HOVER_BG      = "#1E2936";
const ACTIVE_BG     = "#1A2534";
const BORDER        = "#2A3547";
const MUTED         = "#64748B";
const TEXT          = "#F1F5F9";
const TEAL          = "#0ABFBC";
const FONT          = "'Inter', sans-serif";
const SIDEBAR_W_FULL = 220;
const SIDEBAR_W_COLLAPSED = 64;

// Molecule logo — N-shaped connection (4 nodes forming letter N)
const MolecularLogo = ({ size = 40, onClick }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    onClick={onClick}
    style={{ cursor: onClick ? "pointer" : "default", flexShrink: 0 }}
  >
    <circle cx="24" cy="24" r="24" fill="#111827" />
    {/* N-shape: left vertical, diagonal, right vertical */}
    <line x1="15" y1="32" x2="15" y2="16" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="15" y1="16" x2="33" y2="32" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="33" y1="32" x2="33" y2="16" stroke="#0ABFBC" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="15" cy="16" r="4.5" fill="#FFFFFF"/>
    <circle cx="15" cy="32" r="3.5" fill="#CBD5E1"/>
    <circle cx="33" cy="16" r="3.5" fill="#CBD5E1"/>
    <circle cx="33" cy="32" r="4.5" fill="#0ABFBC"/>
  </svg>
);


const SideBar = ({
  onNewResearch,
  onLogout = () => {},
  user = { name: "Alex Rivera", email: "researcher@novapath.ai", initials: "AR" },
}) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleNewResearch = () => {
    if (onNewResearch) {
      onNewResearch();
    } else {
      navigate('/dashboard/new-research');
    }
  };

  const handleNavClick = (path) => {
    if (collapsed) {
      setCollapsed(false);
    }
    navigate(path);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <Box sx={{
      width: collapsed ? `${SIDEBAR_W_COLLAPSED}px` : `${SIDEBAR_W_FULL}px`,
      height: "100%", bgcolor: SIDEBAR_BG,
      display: "flex", flexDirection: "column",
      justifyContent: "space-between",
      p: collapsed ? "16px 12px" : "16px 16px 12px 16px",
      boxSizing: "border-box", fontFamily: FONT,
      borderRight: `1px solid ${BORDER}`,
      transition: "width 0.3s ease, padding 0.3s ease",
    }}>
      {/* Top section */}
      <Box>
        {/* Logo row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", mb: "20px", flexDirection: "column", gap: collapsed ? "16px" : 0 }}>
          {!collapsed ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", minHeight: "42px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <MolecularLogo size={34} />
                  <Typography sx={{ fontFamily: FONT, fontSize: "18px", fontWeight: 700, color: TEXT, letterSpacing: "-0.02em" }}>
                    iNovaPath
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  <IconButton onClick={() => setCollapsed(true)} size="small" sx={{ color: MUTED, "&:hover": { color: TEXT, bgcolor: HOVER_BG }, width: 28, height: 28 }}>
                    <MenuOpenOutlined sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <MolecularLogo size={34} onClick={() => setCollapsed(false)} />
            </>
          )}
        </Box>

        {/* New research CTA */}
        <Box
          onClick={handleNewResearch}
          sx={{
            display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
            gap: "10px",
            width: "100%",
            borderRadius: "10px", cursor: "pointer", mb: "16px",
            background: "linear-gradient(90deg, #00B9D3 0%, #00BB83 100%)",
            px: collapsed ? 0 : "16px",
            py: "10px",
            boxSizing: "border-box",
            justifyContent: collapsed ? "center" : "flex-start",
            "&:hover": { filter: "brightness(1.06)" },
          }}
        >
          <AddOutlined sx={{ fontSize: collapsed ? 20 : 18, color: "#FFFFFF", fontWeight: 700, flexShrink: 0 }} />
          {!collapsed && (
            <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: "#FFFFFF", lineHeight: 1 }}>
              New Research
            </Typography>
          )}
        </Box>

        {/* Navigation items */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Box onClick={() => handleNavClick('/dashboard')} sx={{
            display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: "10px",
            px: collapsed ? 0 : "10px", py: "10px", borderRadius: "8px", cursor: "pointer",
            "&:hover": { bgcolor: HOVER_BG },
            background: "rgba(255,255,255,0.00)",
          }}>
            <HomeOutlined sx={{ fontSize: 20, color: TEXT, opacity: 0.9 }} />
            {!collapsed && (
              <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 500, color: TEXT, opacity: 0.95 }}>
                Home
              </Typography>
            )}
          </Box>

          <Box onClick={() => handleNavClick('/dashboard/recent-sessions')} sx={{
            display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: "10px",
            px: collapsed ? 0 : "10px", py: "10px", borderRadius: "8px", cursor: "pointer",
            "&:hover": { bgcolor: HOVER_BG },
          }}>
            <HistoryOutlined sx={{ fontSize: 20, color: MUTED }} />
            {!collapsed && (
              <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: TEXT, opacity: 0.8 }}>
                Recent Sessions
              </Typography>
            )}
          </Box>

          <Box onClick={() => handleNavClick('/dashboard/active-projects')} sx={{
            display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: "10px",
            px: collapsed ? 0 : "10px", py: "10px", borderRadius: "8px", cursor: "pointer",
            "&:hover": { bgcolor: HOVER_BG },
          }}>
            <FolderOutlined sx={{ fontSize: 20, color: MUTED }} />
            {!collapsed && (
              <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: TEXT, opacity: 0.8 }}>
                Projects
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* User profile */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: collapsed ? "column" : "row",
        gap: collapsed ? "0" : "10px",
        pt: "12px", borderTop: `1px solid ${BORDER}`,
      }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          bgcolor: TEAL, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: collapsed ? "pointer" : "default",
        }}>
          <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: SIDEBAR_BG }}>
            {user.initials}
          </Typography>
        </Box>
        {!collapsed && (
          <>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: TEXT, lineHeight: 1.3 }}>
                {user.name}
              </Typography>
              <Typography sx={{
                fontFamily: FONT, fontSize: "12px", color: MUTED, lineHeight: 1.3,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {user.email}
              </Typography>
            </Box>
            <Typography
              onClick={handleLogout}
              sx={{
                fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: MUTED,
                cursor: "pointer", flexShrink: 0, "&:hover": { color: TEXT },
              }}
            >
              Log out
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SideBar;