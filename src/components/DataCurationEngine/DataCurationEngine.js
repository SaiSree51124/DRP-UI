import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { C } from "../../utils/colors";
import DrugDataCollection from "./DrugDataCollection";
import ModuleHeader from "./ModuleHeader";
import InfoDialog from "./InfoDialog";

const DataCurationEngine = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [drugData, setDrugData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (event, index) => {
    if (index === 1 && !drugData) return;
    setActiveTab(index);
  };

  const tabs = [
    {
      name: "Drug Data Collection and Validation",
      index: 0,
      component: <DrugDataCollection setDrugData={setDrugData} />,
    },
  ];

  return (
    <>
      <ModuleHeader title="Data Curation Engine" onHelpClick={() => setIsOpen(true)} />

      <InfoDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <Box sx={{ mt: 3, mx: "auto" }}>
        <Box sx={{ borderBottom: `2px solid ${C.border}` }}>
          <Tabs
            value={activeTab}
            onChange={handleTabClick}
            TabIndicatorProps={{ style: { backgroundColor: C.teal, height: 3 } }}
            sx={{
              "& .MuiTab-root": {
                fontWeight: 500,
                fontSize: "0.875rem",
                color: C.muted,
                textTransform: "none",
                "&.Mui-selected": { color: C.navy, fontWeight: 700 },
                "&.Mui-disabled": { color: "text.disabled", cursor: "not-allowed" },
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.name} disabled={index === 1 && !drugData} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ mt: 2 }}>
          {tabs[activeTab]?.component}
        </Box>
      </Box>
    </>
  );
};

export default DataCurationEngine;
