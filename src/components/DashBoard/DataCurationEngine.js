import React, { useState } from "react";
import DrugDataCollection from "./DrugDataCollection";
import DrugDataValidation from "./DrugDataValidation";
import { Fragment } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tabs,
  Tab,
  IconButton,
  Paper,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { C, GRAD_H } from "../../utils/colors";

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
    /* {
      name: "Drug Data Validation",
      index: 1,
      component: <DrugDataValidation drugData={drugData} />,
    }, */
  ];

  return (
    <>
      {/* Header Bar */}
      <Paper
        elevation={2}
        sx={{
          m: 1,
          p: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: C.navy }}>
          Data Curation Engine
        </Typography>
        <IconButton
          onClick={() => setIsOpen(true)}
          size="small"
          sx={{
            bgcolor: C.teal,
            color: "#fff",
            width: 32,
            height: 32,
            "&:hover": { bgcolor: C.navy },
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Paper>

      {/* Info Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: C.navy }}>
          Data Curation Engine
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.secondary" }}>
            <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
              The Data Curation Engine
            </Box>{" "}
            collects ligand data based on user-defined criteria using{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
              LLMs
            </Box>{" "}
            and verifies their presence in specified reference sources. This step
            ensures that only validated, high-confidence drug candidates proceed
            for further screening and analysis.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsOpen(false)}
            variant="contained"
            sx={{ bgcolor: C.teal, ":hover": { bgcolor: C.navy } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tab Section */}
      <Box sx={{ mt: 3, mx: "auto" }}>
        {/* Tab Buttons */}
        <Box sx={{ borderBottom: `2px solid ${C.border}` }}>
          <Tabs
            value={activeTab}
            onChange={handleTabClick}
            TabIndicatorProps={{
              style: { backgroundColor: C.teal, height: 3 },
            }}
            sx={{
              "& .MuiTab-root": {
                fontWeight: 500,
                fontSize: "0.875rem",
                color: C.muted,
                textTransform: "none",
                "&.Mui-selected": {
                  color: C.navy,
                  fontWeight: 700,
                },
                "&.Mui-disabled": {
                  color: "text.disabled",
                  cursor: "not-allowed",
                },
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.name}
                disabled={index === 1 && !drugData}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ mt: 2 }}>
          {tabs[activeTab]?.component}
        </Box>
      </Box>
    </>
  );
};

export default DataCurationEngine;