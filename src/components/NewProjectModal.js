import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, Box, Typography, TextField, Button, IconButton,
} from "@mui/material";
import { CloseOutlined, AddOutlined, ScienceOutlined, CheckCircleOutlined } from "@mui/icons-material";
import { useProjects } from "../context/ProjectsContext";

const TEAL = "#0ABFBC";
const DARK = "#0F172A";
const SUB  = "#64748B";
const FONT = "'Inter', sans-serif";

const NewProjectModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [step, setStep] = useState("form");

  const handleCreate = () => {
    addProject(name);
    setStep("success");
  };

  const handleClose = () => {
    setName("");
    setDesc("");
    setStep("form");
    onClose();
  };

  const handleViewProject = () => {
    handleClose();
    navigate("/dashboard");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          width: "480px",
          maxWidth: "480px",
          p: 0,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      {step === "form" ? (
        <>
          <Box sx={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            px: "28px", pt: "28px", pb: "20px",
          }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: "10px", bgcolor: "#E6FAFA",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <ScienceOutlined sx={{ fontSize: 22, color: TEAL }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: "18px", color: DARK, lineHeight: 1.3 }}>
                  Create New Project
                </Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, mt: "2px" }}>
                  Start a new research project
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} size="small" sx={{ color: "#94A3B8", mt: "-4px", mr: "-4px" }}>
              <CloseOutlined sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <Box sx={{ height: "1px", bgcolor: "#E2E8F0" }} />

          <DialogContent sx={{ px: "28px", pt: "24px", pb: "24px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Box>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: DARK, mb: "8px" }}>
                  Project Name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="e.g. Metformin to Parkinson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px", fontFamily: FONT, fontSize: "13px",
                      "& fieldset": { borderColor: "#E2E8F0" },
                      "&:hover fieldset": { borderColor: "#CBD5E1" },
                      "&.Mui-focused fieldset": { borderColor: TEAL, borderWidth: "1.5px" },
                    },
                    "& input::placeholder": { color: "#94A3B8", opacity: 1, fontFamily: FONT },
                  }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", fontWeight: 500, color: DARK, mb: "8px" }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Describe the repurposing hypothesis..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px", fontFamily: FONT, fontSize: "13px",
                      bgcolor: "#F8FAFC", alignItems: "flex-start",
                      "& fieldset": { borderColor: "#E2E8F0" },
                      "&:hover fieldset": { borderColor: "#CBD5E1" },
                      "&.Mui-focused fieldset": { borderColor: TEAL, borderWidth: "1.5px" },
                    },
                    "& textarea::placeholder": { color: "#94A3B8", opacity: 1, fontFamily: FONT },
                  }}
                />
              </Box>
            </Box>
          </DialogContent>

          <Box sx={{ height: "1px", bgcolor: "#E2E8F0" }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "10px", px: "28px", py: "20px" }}>
            <Button
              onClick={handleClose}
              sx={{
                fontFamily: FONT, fontSize: "13px", fontWeight: 500,
                color: DARK, textTransform: "none", borderRadius: "8px", px: "18px",
                "&:hover": { bgcolor: "#F8FAFC" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddOutlined sx={{ fontSize: 15 }} />}
              onClick={handleCreate}
              disabled={!name.trim()}
              sx={{
                fontFamily: FONT, fontSize: "13px", fontWeight: 500,
                bgcolor: TEAL, color: "#fff", textTransform: "none",
                borderRadius: "8px", px: "18px",
                "&:hover": { bgcolor: "#09ADAB" },
                "&.Mui-disabled": { bgcolor: "#A5F3F2", color: "#fff" },
              }}
            >
              Create Project
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            px: "28px", pt: "28px", pb: "20px",
          }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: "10px", bgcolor: "#E6FAFA",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <ScienceOutlined sx={{ fontSize: 22, color: TEAL }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: "18px", color: DARK, lineHeight: 1.3 }}>
                  Project Created
                </Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB, mt: "2px" }}>
                  Success confirmation
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} size="small" sx={{ color: "#94A3B8", mt: "-4px", mr: "-4px" }}>
              <CloseOutlined sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <Box sx={{ height: "1px", bgcolor: "#E2E8F0" }} />

          <DialogContent sx={{ px: "28px", pt: "40px", pb: "40px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <Box sx={{
                width: 64, height: 64, borderRadius: "50%",
                bgcolor: "#ECFDF5", border: "2px solid #A7F3D0",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <CheckCircleOutlined sx={{ fontSize: 36, color: "#10B981" }} />
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: "20px", color: DARK, mb: "8px" }}>
                  Project Created Successfully!
                </Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: "13px", color: SUB }}>
                  {name || "Your project"} has been added to your active projects.
                </Typography>
              </Box>
              <Button
                variant="contained"
                disableElevation
                onClick={handleViewProject}
                sx={{
                  mt: "8px", fontFamily: FONT, fontSize: "13px", fontWeight: 500,
                  bgcolor: TEAL, color: "#fff", textTransform: "none",
                  borderRadius: "8px", px: "28px", py: "9px",
                  "&:hover": { bgcolor: "#09ADAB" },
                }}
              >
                View Project
              </Button>
            </Box>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default NewProjectModal;
