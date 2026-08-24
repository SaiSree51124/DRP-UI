import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { signOut } from "@aws-amplify/auth";
import { Box } from "@mui/material";
import SideBar from "../SideBar/SideBar";
import ResearchStepHeader from "../Researchstepheader/Researchstepheader";

const ResearchLayout = ({ 
  children,
  showHeader = true,
  headerProps = {},
}) => {
  const navigate = useNavigate();

  const handleNewResearch = () => {
    navigate('/dashboard/new-research');
  };

  const handleSelectSession = (session) => {
    console.log('Selected session:', session);
    // Navigate to the session or load it
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <SideBar
        onNewResearch={handleNewResearch}
        onSelectSession={handleSelectSession}
        onLogout={handleLogout}
      />

      {/* Main content area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Research Step Header (optional) */}
        {showHeader && (
          <ResearchStepHeader
            title={headerProps.title || "find repurposing drugs for blood cancer"}
            stageLabel={headerProps.stageLabel || "Target identification"}
            currentIndex={headerProps.currentIndex || 0}
            {...headerProps}
          />
        )}

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {children || <Outlet />}
        </Box>
      </Box>
    </Box>
  );
};

export default ResearchLayout;
