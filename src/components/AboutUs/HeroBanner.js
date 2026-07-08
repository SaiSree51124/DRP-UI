import React from "react";
import { Box, Typography } from "@mui/material";
import { C, GRAD } from "../../utils/colors";
import ParticleCanvas from "./ParticleCanvas";

function HeroBanner() {
  return (
    <Box sx={{ position: "relative", borderRadius: "20px", overflow: "hidden", mb: 4, background: GRAD, minHeight: { xs: 260, md: 300 } }}>
      <ParticleCanvas dark />
      <Box sx={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

      <Box sx={{ position: "relative", zIndex: 1, p: { xs: "28px 22px", md: "44px 52px" }, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box component="img" src="/logo.png" alt="logo" sx={{ height: 44, width: 44, objectFit: "contain", transition: "transform 0.25s ease", "&:hover": { transform: "scale(1.05) rotate(2deg)" } }} />
          <Typography sx={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: { xs: "25px", md: "30px" }, color: "#fff", letterSpacing: "0.3px" }}>
            Drug Repurposing Platform
          </Typography>
        </Box>

        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 1.5, py: 0.45, borderRadius: "20px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", width: "fit-content" }}>
          <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#5EEAD4", animation: "blink 1.8s ease-in-out infinite" }} />
          <Typography sx={{ fontSize: "10.5px", fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "1.2px", textTransform: "uppercase" }}>
            Powered by GenAI
          </Typography>
        </Box>

        <Typography sx={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: { xs: "15px", md: "25px" }, color: "#fff", lineHeight: 1.22, maxWidth: "100%" }}>
          From Target to Repurposing Hit —<br />Automated &amp; Intelligent
        </Typography>
        <Typography sx={{ fontSize: "13.5px", color: "rgba(255,255,255,0.78)", lineHeight: 1.8, maxWidth: "100%" }}>
          An end-to-end pipeline that combines knowledge graphs, scientific evidence <br />
          extraction, compound curation, molecular interaction analysis, and <br />
          patent intelligence to accelerate repurposing decisions.
        </Typography>
      </Box>

      <Box sx={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "45%", pointerEvents: "none", overflow: "hidden", display: { xs: "none", md: "block" } }}>
        {[...Array(12)].map((_, i) => (
          <Box key={i} sx={{ position: "absolute", width: 10 + (i % 3) * 4, height: 10 + (i % 3) * 4, borderRadius: "50%", background: i % 2 === 0 ? "rgba(94,234,212,0.7)" : "rgba(255,255,255,0.25)", filter: "blur(0.2px)", animation: `floatAnim ${4 + (i % 4)}s ease-in-out infinite`, top: `${10 + i * 7}%`, left: `${20 + (i % 5) * 15}%` }} />
        ))}
      </Box>
    </Box>
  );
}

export default HeroBanner;
