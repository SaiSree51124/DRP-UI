import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, FormControlLabel, Checkbox,
  IconButton, InputAdornment, Link, TextField, Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, ScienceOutlined, StorageOutlined, ShowChartOutlined } from "@mui/icons-material";

const TEAL = "#0ABFBC";
const DARK = "#0F172A";
const FONT = "'Inter', sans-serif";

/* ── 3D Molecule Viewer ─────────────────────────────────────────── */
const molStyles = `
  .mol-wrap { position: absolute; inset: 0; overflow: hidden; }
  .mol-wrap canvas { width: 100% !important; height: 100% !important; display: block; }
`;

function MoleculeCanvas() {
  const mountRef = useRef(null);
  const spinRef  = useRef(true);

  useEffect(() => {
    let cancelled = false;
    let animId    = null;

    function load3Dmol() {
      return new Promise((resolve, reject) => {
        if (window.$3Dmol) { resolve(window.$3Dmol); return; }
        const s = document.createElement("script");
        s.src     = "https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.0.4/3Dmol-min.js";
        s.onload  = () => resolve(window.$3Dmol);
        s.onerror = () => reject(new Error("3Dmol load failed"));
        document.head.appendChild(s);
      });
    }

    async function init() {
      let $3Dmol;
      try { $3Dmol = await load3Dmol(); } catch (e) { console.error(e); return; }
      if (cancelled || !mountRef.current) return;

      const viewer = $3Dmol.createViewer(mountRef.current, { antialias: true, alpha: true });
      viewer.setBackgroundColor(0x000000, 0);

      let data;
      try {
        const res = await fetch("https://files.rcsb.org/download/2GIF.pdb");
        if (!res.ok) throw new Error("HTTP " + res.status);
        data = await res.text();
      } catch (e) { console.error("PDB fetch failed:", e); return; }
      if (cancelled) return;

      viewer.addModel(data, "pdb");
      viewer.setStyle({}, { cartoon: { color: "#0ABFBC" } });
      viewer.setStyle({ hetflag: true }, {
        sphere: { color: "#38BDF8", scale: 1.1 },
        stick:  { color: "#67E8F9", radius: 0.22 },
      });
      viewer.setStyle({ resn: "HOH" }, {});
      viewer.setStyle({ resn: "WAT" }, {});
      viewer.zoomTo();
      viewer.zoom(1.8, 0);
      viewer.rotate(90, "x");
      viewer.render();

      function spinLoop() {
        if (cancelled) return;
        if (spinRef.current) { viewer.rotate(0.4, "z"); viewer.render(); }
        animId = requestAnimationFrame(spinLoop);
      }
      spinLoop();
    }

    init();
    return () => { cancelled = true; if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <>
      <style>{molStyles}</style>
      <div className="mol-wrap">
        <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </>
  );
}

/* ── Light input style for white card ─────────────────────────── */
const lightInputSx = {
  "& .MuiOutlinedInput-root": {
    height: "44px",
    borderRadius: "8px",
    bgcolor: "#fff",
    fontFamily: FONT,
    fontSize: "14px",
    color: DARK,
    "& fieldset":             { borderColor: "#E2E8F0" },
    "&:hover fieldset":       { borderColor: "#CBD5E1" },
    "&.Mui-focused fieldset": { borderColor: TEAL, borderWidth: "1px" },
  },
  "& .MuiOutlinedInput-input": { padding: "0 14px", height: "44px", boxSizing: "border-box" },
  "& input::placeholder":      { color: "#94A3B8", opacity: 1, fontFamily: FONT, fontSize: "14px" },
  "& .MuiFormHelperText-root": { mx: 0, mt: "4px", color: "#ef4444" },
};

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { username: "", password: "", remember: false },
    validationSchema: Yup.object({
      username: Yup.string().required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      if (values.username === "Admin" && values.password === "Admin") {
        navigate("/dashboard");
      } else {
        formik.setFieldError("password", "Invalid credentials");
      }
    },
  });

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Full-screen container */}
      <Box sx={{ position: "relative", height: "100vh", overflow: "hidden",
        fontFamily: FONT, bgcolor: "#000", display: "flex", flexDirection: "column" }}>

        {/* Molecule — fills entire screen */}
        <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <MoleculeCanvas />
        </Box>

        {/* Dark gradient overlay — lighter so molecule is visible everywhere */}
        <Box sx={{ position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to right, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.30) 50%, rgba(0,0,0,0.12) 100%)" }} />

        {/* Main layout: logo + content left | white card right */}
        <Box sx={{ position: "relative", zIndex: 2, flex: 1, minHeight: 0,
          display: "flex" }}>

          {/* ── LEFT: brand top, headline+features bottom ── */}
          <Box sx={{ flex: "0 0 50%", display: "flex", flexDirection: "column",
            p: { xs: "40px", lg: "80px" } }}>

            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: TEAL,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Box component="img" src="/logo.png" alt="DRP"
                  sx={{ width: 22, height: 22, objectFit: "contain" }} />
              </Box>
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px", fontFamily: FONT }}>
                Drug Repurposing Platform
              </Typography>
            </Box>

            {/* Headline + pills grouped at bottom */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "24px" }}>

            {/* Headline */}
            <Box>
              <Typography sx={{ color: "#fff", fontWeight: 800, fontFamily: FONT,
                fontSize: { xs: "32px", md: "36px", lg: "40px" }, lineHeight: 1.12, mb: "16px" }}>
                Accelerated Drug<br />Discovery with Gen AI
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.58)", fontSize: "14px",
                lineHeight: 1.75, fontFamily: FONT, maxWidth: "400px" }}>
                The advanced Drug Repurposing Platform designed for researchers to identify, validate,
                and simulate novel therapeutic candidates.
              </Typography>
            </Box>

            {/* Feature pills */}
            <Box sx={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {[
                { Icon: ScienceOutlined,   label: "AI-Powered Analysis" },
                { Icon: StorageOutlined,   label: "10k+ Compounds"      },
                { Icon: ShowChartOutlined, label: "Real-time Insights"  },
              ].map(({ Icon, label }) => (
                <Box key={label} sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: "6px",
                    bgcolor: "rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon sx={{ fontSize: 15, color: TEAL }} />
                  </Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: "13px",
                    color: "rgba(255,255,255,0.78)", fontWeight: 500 }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>

            </Box> {/* end bottom group */}
          </Box>

          {/* ── RIGHT: white floating card, vertically centered ── */}
          <Box sx={{ flex: "0 0 50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            p: { xs: "40px", lg: "80px" } }}>
          <Box sx={{ width: "100%", maxWidth: "400px",
            bgcolor: "#fff", borderRadius: "16px", p: "40px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.40)" }}>

            <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: "22px",
              color: DARK, mb: "6px" }}>
              Sign in to continue
            </Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: "#64748B", mb: "28px" }}>
              Enter your research credentials
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Email */}
              <Box>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500,
                  color: DARK, mb: "6px" }}>
                  Email Address
                </Typography>
                <TextField fullWidth id="username" name="username"
                  placeholder="e.g. researcher@drp.net"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  sx={lightInputSx} />
              </Box>

              {/* Password */}
              <Box>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500,
                  color: DARK, mb: "6px" }}>
                  Password
                </Typography>
                <TextField fullWidth id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(v => !v)} edge="end" sx={{ mr: "-4px" }}>
                          {showPassword
                            ? React.createElement(VisibilityOff, { sx: { fontSize: 20, color: "#94A3B8" } })
                            : React.createElement(Visibility,    { sx: { fontSize: 20, color: "#94A3B8" } })}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={lightInputSx} />
              </Box>

              {/* Remember me + Forgot password */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <FormControlLabel sx={{ m: 0, gap: "8px" }}
                  control={
                    <Checkbox name="remember" checked={formik.values.remember}
                      onChange={formik.handleChange}
                      sx={{ p: 0, width: 16, height: 16, borderRadius: "4px",
                        border: "1.5px solid #CBD5E1", color: "transparent",
                        "&.Mui-checked": { color: TEAL, borderColor: TEAL },
                        "& .MuiSvgIcon-root": { fontSize: 16 } }} />
                  }
                  label={
                    <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: "#64748B" }}>
                      Remember me
                    </Typography>
                  }
                />
                <Link href="#" underline="none"
                  sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600,
                    color: TEAL, cursor: "pointer" }}>
                  Forgot password?
                </Link>
              </Box>

              {/* Sign In button */}
              <Button type="submit" fullWidth variant="contained" disableElevation
                sx={{ height: "44px", borderRadius: "8px", bgcolor: TEAL,
                  fontFamily: FONT, fontWeight: 600, fontSize: "15px",
                  color: "#fff", textTransform: "none", mt: "4px",
                  "&:hover": { bgcolor: "#09ADAB" } }}>
                Sign In
              </Button>
            </Box>
          </Box>

          {/* Footer — below the white card */}
          <Box sx={{ mt: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: "12px", color: "rgba(255,255,255,0.32)" }}>
              © DRP | Powered by Gen AI
            </Typography>
            <Box sx={{ display: "flex", gap: "20px" }}>
              {["Help Center", "Privacy Policy", "Terms of Service"].map(text => (
                <Link key={text} href="#" underline="none"
                  sx={{ fontFamily: FONT, fontSize: "12px", color: "rgba(255,255,255,0.38)",
                    "&:hover": { color: "rgba(255,255,255,0.65)" } }}>
                  {text}
                </Link>
              ))}
            </Box>
          </Box>
          </Box> {/* end right centering wrapper */}
        </Box>
      </Box>
    </>
  );
};

export default Login;
