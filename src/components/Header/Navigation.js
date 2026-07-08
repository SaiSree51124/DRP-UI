import React from "react";
import { NavLink } from "react-router-dom";
import { Box } from "@mui/material";
import { C } from "../../utils/colors";
import { UnderlineIcon } from "@heroicons/react/24/solid";

const Navigation = () => {
  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? C.card : C.light,
    onhover: { UnderlineIcon },
    textDecoration: isActive ? "underline" : "none",
    textUnderlineOffset: "6px",
    fontSize: "14px",
    padding: "8px 16px",
    borderRadius: "4px",
    fontWeight: "500",
  });

  const handleMouseEnter = (e) => {
    e.target.style.textDecoration = "underline";
  };

  const handleMouseLeave = (e) => {
    if (!e.target.classList.contains("active")) {
      e.target.style.textDecoration = "none";
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 3 }}>
      <NavLink
        to="/dashboard/TxKG-knowledge-graph"
        style={navLinkStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        TxKG
      </NavLink>
      <NavLink
        to="/dashboard/literature-mining"
        style={navLinkStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        LitMineX
      </NavLink>
      <NavLink
        to="/dashboard/data-curation-engine"
        style={navLinkStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        CurateX
      </NavLink>
      <NavLink
        to="/dashboard/screening-suite"
        style={navLinkStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        ScreenSuite
      </NavLink>
      <NavLink
        to="/dashboard/novelty-search-agent"
        style={navLinkStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        NovSearch
      </NavLink>
      <NavLink
        to="/dashboard/aboutus"
        style={navLinkStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        About Us
      </NavLink>
    </Box>
  );
};

export default Navigation;
