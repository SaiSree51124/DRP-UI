import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  TextField, Button, Box, Stack, Typography, Link,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { C, GRAD, GRAD_H } from "../utils/colors";
import LockIcon from '@mui/icons-material/Lock';

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: C.navy },
    text: { primary: C.navy, secondary: C.muted },
  },
  typography: { fontFamily: "'Sora', sans-serif" },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            background: C.card,
            "& fieldset": { borderColor: C.border },
            "&:hover fieldset": { borderColor: C.navy },
            "&.Mui-focused fieldset": { borderColor: C.navy },
          },
          "& .MuiInputLabel-root": { color: C.muted },
          "& .MuiInputLabel-root.Mui-focused": { color: C.navy },
          "& .MuiInputBase-input": { color: C.navy },
        },
      },
    },
  },
});

const tipStyles = `
  .mol-wrap {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .mol-canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
  /* 3Dmol injects a canvas — make sure it fills too */
  .mol-canvas canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
  .tip {
    position: fixed;
    background: rgba(8,18,46,0.92);
    border: 1px solid rgba(56,189,248,0.45);
    border-radius: 10px;
    padding: 10px 13px;
    width: 230px;
    font-family: 'Sora', sans-serif;
    font-size: 10.5px;
    line-height: 1.65;
    color: #cbd5e1;
    pointer-events: none;
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.6);
    z-index: 9999;
  }
  .tip-title {
    font-size: 12px;
    font-weight: 700;
    color: #38bdf8;
    margin-bottom: 5px;
  }
  .tip-badge {
    display: inline-block;
    margin-top: 6px;
    background: rgba(83,69,253,0.3);
    border: 1px solid rgba(83,69,253,0.45);
    border-radius: 4px;
    font-size: 9px;
    padding: 1px 6px;
    color: #a5b4fc;
    font-weight: 600;
    letter-spacing: 0.4px;
  }
`;

function isLigandAtom(atom) {
  return atom.hetflag && atom.resn !== "HOH" && atom.resn !== "WAT";
}

function MoleculeCanvas() {
  const mountRef   = useRef(null);
  const viewerRef  = useRef(null);
  const tipElemRef = useRef(null);
  const spinRef    = useRef(true);

  useEffect(() => {
    let cancelled = false;
    let animId    = null;
    let angle     = 0;

    function load3Dmol() {
      return new Promise((resolve, reject) => {
        if (window.$3Dmol) { resolve(window.$3Dmol); return; }
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.0.4/3Dmol-min.js";
        s.onload  = () => resolve(window.$3Dmol);
        s.onerror = () => reject(new Error("3Dmol load failed"));
        document.head.appendChild(s);
      });
    }

    function showTip(x, y, type) {
      const tip = tipElemRef.current;
      if (!tip) return;
      tip.querySelector(".tip-protein").style.display = type === "protein" ? "block" : "none";
      tip.querySelector(".tip-ligand").style.display  = type === "ligand"  ? "block" : "none";
      tip.style.left    = (x + 16) + "px";
      tip.style.top     = (y - 12) + "px";
      tip.style.display = "block";
    }

    function hideTip() {
      const tip = tipElemRef.current;
      if (tip) tip.style.display = "none";
    }

    async function init() {
      let $3Dmol;
      try { $3Dmol = await load3Dmol(); } catch (e) { console.error(e); return; }
      if (cancelled || !mountRef.current) return;

      const el = mountRef.current;

      const viewer = $3Dmol.createViewer(el, {
        antialias: true,
        alpha: true,
      });
      viewerRef.current = viewer;
      viewer.setBackgroundColor(0x000000, 0);

      let data;
      try {
        const res = await fetch("/docked.pdb");
        if (!res.ok) throw new Error("HTTP " + res.status);
        data = await res.text();
      } catch (e) {
        console.error("PDB fetch failed:", e);
        return;
      }
      if (cancelled) return;

      viewer.addModel(data, "pdb");
      viewer.setStyle({}, { cartoon: { color: C.teal, clickable: true } });
      viewer.setStyle({ hetflag: true }, {
        sphere: { color: C.sky, scale: 1.2, clickable: true },
        stick:  { color: C.sage, radius: 0.25, clickable: true },
      });
      viewer.setStyle({ resn: "HOH" }, {});
      viewer.setStyle({ resn: "WAT" }, {});

      viewer.zoomTo();
      viewer.rotate(90, "x");   // stand upright
      viewer.render();

      // Manual spin loop — increments Y in the current rotated frame
      function spinLoop() {
        if (cancelled) return;
        if (spinRef.current) {
          viewer.rotate(0.5, "z");
          viewer.render();
        }
        animId = requestAnimationFrame(spinLoop);
      }
      spinLoop();

      // Hover — use setHoverable with 0 duration, tooltip follows mousemove
      const canvas = el.querySelector("canvas");
      let mouseX = 0, mouseY = 0;

      if (canvas) {
        canvas.addEventListener("mousemove", (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          const tip = tipElemRef.current;
          if (tip && tip.style.display === "block") {
            tip.style.left = (mouseX + 16) + "px";
            tip.style.top  = (mouseY - 12) + "px";
          }
        });
        canvas.addEventListener("mouseleave", () => {
          spinRef.current = true;
          hideTip();
        });
      }

      viewer.setHoverable({}, true,
        function onHover(atom) {
          if (!atom) return;
          spinRef.current = false;
          const type = isLigandAtom(atom) ? "ligand" : "protein";
          showTip(mouseX, mouseY, type);
        },
        function onUnhover() {
          hideTip();
          spinRef.current = true;
        }
      );
    }

    init();
    return () => {
      cancelled = true;
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <style>{tipStyles}</style>
      <div className="mol-wrap">
        <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      </div>

      <div ref={tipElemRef} className="tip" style={{ display: "none", position: "fixed" }}>
        <div className="tip-protein">
          <div className="tip-title">AcrB</div>
          Multidrug efflux transporter from Gram-negative bacteria.
          <div className="tip-badge">TARGET PROTEIN</div>
        </div>
        <div className="tip-ligand">
          <div className="tip-title">Montelukast</div>
          India's first AI-enabled, drug-repurposed antimicrobial adjuvant
          progressing into human clinical trials. Identified as a potent AcrB
          efflux pump inhibitor, restoring antibiotic susceptibility.
          <div className="tip-badge"><LockIcon sx={{ fontSize: "1rem", mr: 1 }} /> PATENTED · CLINICAL STAGE</div>
        </div>
      </div>
    </>
  );
}

const pills = [
  { icon: "⬡", label: "Target Identification", sub: "Knowledge Graph"      },
  { icon: "◈", label: "Literature Mining",     sub: "Evidence Extraction"  },
  { icon: "⬢", label: "Data Curation Engine",  sub: "Compound Curation"    },
  { icon: "◉", label: "Virtual Screening",     sub: "Interaction Analysis" },
  { icon: "◎", label: "Novelty Search",        sub: "Patent Intelligence"  },
];

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: Yup.object({
      username: Yup.string().oneOf(["Admin"], "Username must be 'Admin'").required("Username is required"),
      password: Yup.string().oneOf(["Admin"], "Password must be 'Admin'").required("Password is required"),
    }),
    onSubmit: () => navigate("/dashboard"),
  });

  return (
    <ThemeProvider theme={theme}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet" />

      <Box sx={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        background: GRAD,
        backgroundAttachment: "fixed",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Sora', sans-serif",
      }}>

        {/* Grid overlay */}
        <Box sx={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        {/* TOP: 3-column row */}
        <Box sx={{
          position: "relative",
          zIndex: 2,
          flex: "1 1 auto",
          minHeight: 0,
          display: "flex",
          alignItems: "stretch",
        }}>

          {/* COL 1 — Headline */}
          <Box sx={{
            flex: "1 1 33.33%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: "40px",
            py: "24px",
          }}>
            <Typography component="h1" sx={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(25px, 2.5vw, 32px)",
              fontWeight: 700,
              lineHeight: 1.2,
              mb: "28px",
              letterSpacing: "-0.5px",
              background: `linear-gradient(90deg, ${C.muted} 0%, ${C.tx} 45%, ${C.teal} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Accelerate Drug<br />Discovery with GenAI
            </Typography>

            <Typography sx={{
              color: C.light,
              fontSize: "12px",
              lineHeight: 1.7,
              maxWidth: 400,
            }}>
              An end-to-end generative AI platform combining knowledge graphs, molecular docking,
              and large language models to discover and validate existing drugs for new therapeutic indications.
            </Typography>
          </Box>

          {/* COL 2 — Login Card */}
          <Box sx={{
            flex: "1 1 33.33%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: "20px",
            py: "16px",
            gap: "20px",
          }}>
            <Stack direction="row" alignItems="center" spacing={1.2}>
              <Box
                component="img"
                src="/logo.png"
                alt="Logo"
                sx={{
                  height: 35, width: 35, objectFit: "contain",
                  transition: "transform 0.65s ease",
                  "&:hover": { transform: "scale(1.2) rotate(360deg)", cursor: "pointer" },
                }}
              />
              <Typography sx={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
                fontSize: "20px",
                color: "#fff",
                letterSpacing: "0.1px",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
              }}>
                Drug Repurposing Platform
              </Typography>
            </Stack>

            <Box sx={{
              width: "100%",
              maxWidth: 360,
              background: C.card,
              backdropFilter: "blur(20px)",
              border: `1.5px solid ${C.teal}`,
              borderRadius: "24px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 0 40px rgba(83,69,253,0.18)",
              padding: "24px 26px",
              display: "flex",
              flexDirection: "column",
            }}>
              <Typography component="h2" sx={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 18, fontWeight: 700,
                color: C.teal, textAlign: "center", mb: "2px",
              }}>
                Sign In
              </Typography>
              <Typography sx={{ color: C.navy, fontSize: 11, textAlign: "center", mb: "12px" }}>
                Access DRP
              </Typography>

              <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <TextField
                  fullWidth margin="normal"
                  id="username" name="username" label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                />
                <TextField
                  fullWidth margin="normal" type="password"
                  id="password" name="password" label="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  sx={{ mb: 1.5 }}
                />

                <Box sx={{ textAlign: "right", mt: "4px" }}>
                  <Link href="#" sx={{ fontSize: 11, color: C.navy, textDecoration: "none" }}>
                    Forgot your password?
                  </Link>
                </Box>

                <Button
                  type="submit" fullWidth variant="contained"
                  sx={{
                    mt: 1.5, py: 1.4, borderRadius: "10px",
                    fontSize: 14, fontWeight: 600,
                    textTransform: "none", letterSpacing: 0.3,
                    background: GRAD_H,
                    boxShadow: "0 4px 20px rgba(2,36,170,0.4)",
                    "&:hover": { background: GRAD, boxShadow: "0 6px 24px rgba(2,36,170,0.55)" },
                  }}
                >
                  Login
                </Button>

                <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.8} sx={{ mt: 2, mb: 1.5 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: 11 }}>
                    Create an account
                  </Typography>
                  <Link variant="body2" sx={{ fontWeight: 600, textDecoration: "none", color: C.navy, cursor: "pointer", fontSize: 11 }}>
                    Sign Up
                  </Link>
                </Stack>

                <Typography variant="body2" sx={{ mt: "auto", pt: 1.5, textAlign: "center", color: "#9CA3AF", fontSize: 10 }}>
                  Copyright © 2026 | GEN AI - DRP
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* COL 3 — Molecule */}
          <Box sx={{ position: "relative", zIndex: 1, flex: "1 1 33.33%", overflow: "hidden" }}>
            <MoleculeCanvas />
          </Box>
        </Box>

        {/* BOTTOM: Pills bar */}
        <Box sx={{
          position: "relative", zIndex: 3, flexShrink: 0,
          width: "100%", display: "flex", justifyContent: "center",
          alignItems: "center", flexWrap: "nowrap",
          gap: "10px", px: "32px", py: "10px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(0,0,0,0.15)",
          backdropFilter: "blur(10px)",
        }}>
          {pills.map((p) => (
            <Box key={p.label} sx={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px", px: "12px", py: "6px",
              whiteSpace: "nowrap",
              transition: "background 0.2s, border-color 0.2s",
              "&:hover": { background: "rgba(255,255,255,0.09)", borderColor: "rgba(56,189,248,0.35)", cursor: "default" },
            }}>
              <Typography sx={{ fontSize: 13, color: C.light, lineHeight: 1 }}>{p.icon}</Typography>
              <Box>
                <Typography sx={{ color: C.light, fontSize: 10, fontWeight: 600, lineHeight: 1.2 }}>{p.label}</Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: 9, mt: "1px" }}>{p.sub}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

      </Box>
    </ThemeProvider>
  );
};

export default Login;