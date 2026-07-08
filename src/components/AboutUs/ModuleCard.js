import React, { useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { C } from "../../utils/colors";
import { DiagramMap } from "./diagrams/Diagrams";
import useInView from "./hooks/useInView";

function ModuleCard({ mod, index }) {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useInView(0.12);
  const DiagramComp = DiagramMap[mod.diagram];

  return (
    <Box
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        borderRadius: "16px", overflow: "hidden",
        border: `1.5px solid ${hovered ? C.teal + "55" : C.border}`,
        background: C.card,
        boxShadow: hovered ? "0 12px 40px rgba(10,46,82,0.13)" : "0 2px 10px rgba(10,46,82,0.06)",
        transition: "all .3s cubic-bezier(.4,0,.2,1)",
        transform: hovered ? "translateY(-4px)" : visible ? "translateY(0)" : "translateY(20px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 0.08}s`,
        display: "flex", flexDirection: { xs: "column", md: index % 2 === 0 ? "row" : "row-reverse" },
      }}
    >
      {/* Info panel */}
      <Box sx={{ flex: 1, p: { xs: "22px", md: "28px 30px" }, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flexWrap: "wrap" }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "10px", flexShrink: 0, background: `linear-gradient(135deg,${mod.from},${mod.to})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <mod.Icon sx={{ fontSize: 18, color: "#fff" }} />
          </Box>
          <Chip label={mod.tag} size="small" sx={{ height: 22, fontSize: "10px", fontWeight: 700, background: mod.from + "15", color: mod.from, border: `1px solid ${mod.from}30`, borderRadius: "6px" }} />
          <Chip label={mod.badge} size="small" sx={{ height: 22, fontSize: "10px", fontWeight: 700, background: `linear-gradient(90deg,${mod.from},${mod.to})`, color: "#fff", borderRadius: "6px" }} />
        </Box>

        <Box>
          <Typography sx={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: { xs: "15px", md: "17px" }, color: C.navy, mb: 0.3 }}>
            {mod.title}
          </Typography>
          <Typography sx={{ fontSize: "11.5px", color: C.teal, fontWeight: 600 }}>{mod.subtitle}</Typography>
        </Box>

        <Typography sx={{ fontSize: "12.5px", color: C.muted, lineHeight: 1.78 }}>{mod.body}</Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6 }}>
          {mod.stats.map((s, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 13, color: C.teal, flexShrink: 0 }} />
              <Typography sx={{ fontSize: "11.5px", color: "#374151" }}>{s}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Diagram panel */}
      <Box sx={{
        width: { xs: "100%", md: "260px" }, flexShrink: 0,
        background: `linear-gradient(135deg,${mod.from}0A,${mod.to}18)`,
        borderLeft: { md: index % 2 === 0 ? `1px solid ${C.border}` : "none" },
        borderRight: { md: index % 2 !== 0 ? `1px solid ${C.border}` : "none" },
        borderTop: { xs: `1px solid ${C.border}`, md: "none" },
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        p: "16px", minHeight: { xs: 160, md: "auto" }, position: "relative",
      }}>
        <DiagramComp />
      </Box>
    </Box>
  );
}

export default ModuleCard;
