import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
// import LoginIcon from "@mui/icons-material/Login"; // Importing the Login icon
import { C, GRAD } from "../../utils/colors";
import { UnderlineIcon } from "@heroicons/react/24/solid";

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <AppBar
        position="fixed" // Changed to fixed
        sx={{
          background: GRAD,
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ paddingLeft: "10px !important", paddingRight: "10px !important" }}>
          {/* Left side: Platform Title */}
          <img
            src="/logo.png" // Replace with your logo path
            alt="Logo"
            style={{ width: 40, height: 40, marginRight: 10 }}
          />
            <Typography
              variant="div"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                fontSize: "25px",
                lineHeight: "100%",
                letterSpacing: "0%",
                verticalAlign: "middle",
                color: C.card,
              }}
            >
            Drug Repurposing Platform
            </Typography>

          {/* Right side: Navbar links */}
          <Box sx={{ display: "flex", gap: 3 }}>
            <NavLink
              to="/dashboard/TxKG-knowledge-graph"
              style={({ isActive }) => ({
                color: isActive ? C.card : C.light,
                onhover: { UnderlineIcon },
                textDecoration: isActive ? "underline" : "none",
                textUnderlineOffset: "6px",
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "4px",
                fontWeight: "500",
              })}
               onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
               onMouseLeave={(e) => {
                if (!e.target.classList.contains("active")) {
                    e.target.style.textDecoration = "none";
                }
              }}
            >
              TxKG
            </NavLink>
            <NavLink
              to="/dashboard/literature-mining"
              style={({ isActive }) => ({
                color: isActive ? C.card : C.light,
                onhover: { UnderlineIcon },
                textDecoration: isActive ? "underline" : "none",
                textUnderlineOffset: "6px",                
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "4px",
                fontWeight: "500",
              })}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => {
                if (!e.target.classList.contains("active")) {
                    e.target.style.textDecoration = "none";
                }
              }}
            >
              LitMineX
            </NavLink>
            <NavLink
              to="/dashboard/data-curation-engine"
              style={({ isActive }) => ({
                color: isActive ? C.card : C.light,
                onhover: { UnderlineIcon },
                textDecoration: isActive ? "underline" : "none",
                textUnderlineOffset: "6px",
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "4px",
                fontWeight: "500",
              })}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => {
                if (!e.target.classList.contains("active")) {
                    e.target.style.textDecoration = "none";
                }
              }}
            >
              CurateX
            </NavLink>
            <NavLink
              to="/dashboard/screening-suite"
              style={({ isActive }) => ({
                color: isActive ? C.card : C.light,
                onhover: { UnderlineIcon },
                textDecoration: isActive ? "underline" : "none",
                textUnderlineOffset: "6px",                
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "4px",
                fontWeight: "500",
              })}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => {
                if (!e.target.classList.contains("active")) {
                    e.target.style.textDecoration = "none";
                }
              }}
            >
              ScreenSuite
            </NavLink>
            <NavLink
              to="/dashboard/novelty-search-agent"  // changed from module to agent for testing novely search agent
              style={({ isActive }) => ({
                color: isActive ? C.card : C.light,
                onhover: { UnderlineIcon },
                textDecoration: isActive ? "underline" : "none",
                textUnderlineOffset: "6px",
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "4px",
                fontWeight: "500",
              })}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => {
                if (!e.target.classList.contains("active")) {
                    e.target.style.textDecoration = "none";
                }
              }}
            >
              NovSearch
            </NavLink>
            <NavLink
              to="/dashboard/aboutus"
              style={({ isActive }) => ({
                color: isActive ? C.card : C.light,
                onhover: { UnderlineIcon },
                textDecoration: isActive ? "underline" : "none",
                textUnderlineOffset: "6px",
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "4px",
                fontWeight: "500",
              })}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => {
                if (!e.target.classList.contains("active")) {
                    e.target.style.textDecoration = "none";
                }
              }}
            >
              About Us
            </NavLink>
            
          </Box>

          {/* Rightmost: Login Icon */}
          <IconButton color="inherit" sx={{ marginLeft: 2 }}>
            <img
              src="/authbtn.png" // Replace with your image path
              alt="User Profile"
              style={{ width: 32, height: 32, borderRadius: "50%" }} // Adjust size and make it circular
            />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          backgroundColor: C.bg,
          overflowY: "auto", // Enables vertical scrolling
          marginTop: "64px", // Adjusts for AppBar height
          height: "calc(100vh - 64px)",
        }}
      >
        {/* Outlet to render the corresponding route content */}
        <Outlet />
      </Box>
    </div>
  );
};

export default Dashboard;
