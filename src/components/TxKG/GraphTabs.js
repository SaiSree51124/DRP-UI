import React from "react";
import { Box, Button } from "@mui/material";
import { C, GRAD } from "../../utils/colors";
import KGSubgraph from "./KGSubgraph";
import KGMetaPath from "./KGMetaPath";

const TABS = ["Sub-Graph", "Meta-Path"];

const GraphTabs = ({ activeTab, onTabChange, selectedDisease, API_BASE_URL }) => {
  const renderGraph = () => {
    switch (activeTab) {
      case "Meta-Path":
        return <KGMetaPath disease={selectedDisease} API_BASE_URL={API_BASE_URL} />;
      case "Sub-Graph":
      default:
        return <KGSubgraph disease={selectedDisease} API_BASE_URL={API_BASE_URL} />;
    }
  };

  return (
    <Box sx={{ mt: 4, borderRadius: 1, overflow: "hidden", background: C.sky }}>
      {/* Tab strip */}
      <Box sx={{ display: "flex", borderBottom: "0px solid #2c5f7c", background: GRAD }}>
        {TABS.map((tab) => (
          <Button
            key={tab}
            onClick={() => onTabChange(tab)}
            sx={{
              flex: 1,
              py: 1.5,
              fontWeight: activeTab === tab ? "bold" : 500,
              bgcolor: activeTab === tab ? C.card : "transparent",
              color: activeTab === tab ? C.navy : C.card,
              borderRadius: 0,
              "&:hover": {
                bgcolor: activeTab === tab ? C.card : C.sky,
                color: activeTab === tab ? C.navy : "black",
              },
            }}
          >
            {tab}
          </Button>
        ))}
      </Box>

      {/* Graph content */}
      <Box sx={{ minHeight: 300, bgcolor: C.sky }}>
        {renderGraph()}
      </Box>
    </Box>
  );
};

export default GraphTabs;
