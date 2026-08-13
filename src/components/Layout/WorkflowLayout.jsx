import React from "react";
import { Box } from "@mui/material";
import SideBar from "../SideBar/SideBar";

const WorkflowLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <SideBar />
      
      {/* Main content area - takes full remaining space */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {children}
      </Box>
    </Box>
  );
};

export default WorkflowLayout;
