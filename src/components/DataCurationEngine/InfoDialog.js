import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Box,
} from "@mui/material";
import { C } from "../../utils/colors";

const InfoDialog = ({ isOpen, onClose }) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
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
        onClick={onClose}
        variant="contained"
        sx={{ bgcolor: C.teal, ":hover": { bgcolor: C.navy } }}
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default InfoDialog;
