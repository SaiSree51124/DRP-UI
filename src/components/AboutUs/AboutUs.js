import React from "react";
import { Box, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { C } from "../../utils/colors";
import { modules } from "./data/aboutUsData";
import HeroBanner from "./HeroBanner";
import MetricsBar from "./MetricsBar";
import ProcessFlow from "./ProcessFlow";
import ModuleCard from "./ModuleCard";

const theme = createTheme({
  palette: { mode: "light", primary: { main: "#0A2E52" } },
  typography: { fontFamily: "'Sora', sans-serif" },
});

const AboutUs = () => (
  <ThemeProvider theme={theme}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
      @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.25} }
      * { box-sizing: border-box; }
    `}</style>
    <Box sx={{ minHeight: "100vh", width: "100%", background: C.bg, p: { xs: "14px", md: "24px 28px" } }}>
      <Box sx={{ maxWidth: 1080, mx: "auto" }}>
        <HeroBanner />
        <MetricsBar />
        <ProcessFlow />

        {/* Modules section header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
          <Typography sx={{ fontSize: "10px", fontWeight: 700, color: C.muted, letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Platform Components
          </Typography>
          <Box sx={{ flex: 1, height: "1px", background: `linear-gradient(90deg,${C.navy}40,transparent)` }} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {modules.map((mod, i) => <ModuleCard key={mod.id} mod={mod} index={i} />)}
        </Box>

        <Typography sx={{ mt: 4, mb: 1, textAlign: "center", fontSize: "11px", color: "#9CA3AF" }}>
          Copyright © 2026 | Drug Repurposing Platform · Powered by GenAI
        </Typography>
      </Box>
    </Box>
  </ThemeProvider>
);

export default AboutUs;
