import React from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { C } from "../../utils/colors";

const PreviewDialog = ({ isOpen, selectedPreview, onClose }) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    maxWidth="md"
    fullWidth
    PaperProps={{ sx: { borderRadius: 3, maxHeight: "80vh" } }}
  >
    <DialogContent sx={{ overflowY: "auto" }}>
      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
        {selectedPreview?.preview || "No preview available."}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ position: "sticky", bottom: 0, bgcolor: "#fff", pt: 1 }}>
      <Button
        variant="contained"
        onClick={onClose}
        sx={{ bgcolor: C.teal, ":hover": { bgcolor: C.navy } }}
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default PreviewDialog;
