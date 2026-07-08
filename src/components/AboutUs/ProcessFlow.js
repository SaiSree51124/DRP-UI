import React from "react";
import { Box, Typography } from "@mui/material";
import { C, GRAD, GRAD_H } from "../../utils/colors";
import { flowSteps } from "./data/aboutUsData";
import useInView from "./hooks/useInView";

function ProcessFlow() {
  const [ref, visible] = useInView(0.1);
  return (
    <Box ref={ref} sx={{ mb: 4 }}>
      <Box sx={{
        background: C.card, borderRadius: "18px", p: { xs: "20px 14px", md: "30px 32px 26px" },
        border: `1px solid ${C.border}`, boxShadow: "0 4px 20px rgba(10,46,82,0.07)",
        position: "relative", overflow: "hidden",
      }}>
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: GRAD }} />
        <Typography sx={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: { xs: "16px", md: "19px" }, color: C.navy, mb: 0.5, textAlign: "center" }}>
          Repurposing Pipeline
        </Typography>
        <Typography sx={{ fontSize: "12.5px", color: C.muted, textAlign: "center", mb: 3.5 }}>
          Five integrated modules · Fully automated · AI-native throughout
        </Typography>

        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
          {flowSteps.map((step, i) => {
            const IconComp = step.Icon;
            const prog = visible ? Math.max(0, Math.min(1, 1 - (flowSteps.length - 1 - i) * 0.12)) : 0;
            return (
              <React.Fragment key={step.label}>
                <Box sx={{ flex: 1, minWidth: 0, opacity: prog, transform: `translateY(${(1 - prog) * 12}px)`, transition: `opacity .45s ${i * 0.1}s, transform .45s ${i * 0.1}s` }}>
                  <Box sx={{ borderRadius: "12px", overflow: "hidden", border: `1.5px solid ${C.border}`, background: C.card, boxShadow: "0 2px 8px rgba(10,46,82,0.06)", "&:hover": { boxShadow: "0 8px 28px rgba(10,46,82,0.14)", transform: "translateY(-3px)", transition: "all .25s" }, transition: "all .25s" }}>
                    <Box sx={{ background: `linear-gradient(135deg,${step.from},${step.to})`, p: "10px 8px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(255,255,255,0.35)" }}>
                        <IconComp sx={{ fontSize: 16, color: "#fff" }} />
                      </Box>
                      {step.badge && (
                        <Box sx={{ px: 0.9, py: 0.15, borderRadius: "8px", background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.3)" }}>
                          <Typography sx={{ fontSize: "8.5px", fontWeight: 700, color: "#fff", letterSpacing: ".3px" }}>{step.badge}</Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ p: "8px 8px 10px", background: C.card }}>
                      <Typography sx={{ fontSize: "10.5px", fontWeight: 700, color: C.navy, textAlign: "center", lineHeight: 1.3, mb: 0.4 }}>{step.label}</Typography>
                      <Typography sx={{ fontSize: "9px", color: C.muted, textAlign: "center", lineHeight: 1.5 }}>{step.desc}</Typography>
                    </Box>
                  </Box>
                </Box>
                {i < flowSteps.length - 1 && (
                  <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0, width: { xs: "14px", md: "22px" }, mt: "42px", opacity: visible ? 1 : 0, transition: `opacity .4s ${(i + 1) * 0.1}s` }}>
                    <Box sx={{ flex: 1, height: "1.5px", background: GRAD_H }} />
                    <Box sx={{ width: 0, height: 0, borderTop: "4px solid transparent", borderBottom: "4px solid transparent", borderLeft: "6px solid " + C.teal }} />
                  </Box>
                )}
              </React.Fragment>
            );
          })}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2.5, opacity: visible ? 1 : 0, transition: "opacity .6s .7s" }}>
          <Box sx={{ width: "2px", height: "22px", background: GRAD }} />
          <Box sx={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: `12px solid ${C.teal}` }} />
          <Box sx={{ mt: 1, px: 4, py: 1.2, borderRadius: "30px", background: "linear-gradient(#fff,#fff) padding-box, linear-gradient(90deg,#0A2E52,#007B82,#2D6A4F) border-box", border: "2px solid transparent" }}>
            <Typography sx={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "14px", background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Repurposing Hit Identification
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProcessFlow;
