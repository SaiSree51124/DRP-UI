import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import SideBar from "../SideBar/SideBar";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <SideBar onLogout={handleLogout} />

      {/* Main content area */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden", bgcolor: "#F8FAFC" }}>
        {/* Content */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {children || <Outlet />}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
