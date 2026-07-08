import React from "react";
import { Box, Paper, Typography, Grid, TextField, Button, CircularProgress } from "@mui/material";
import { EmojiObjects, AutoAwesome } from "@mui/icons-material";
import { Slide } from "@mui/material";
import { C, GRAD, GRAD_H } from "../../utils/colors";

const RunAgentForm = ({ formik, agentRunning }) => (
  <Slide direction="up" in timeout={600}>
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, background: "white" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <EmojiObjects sx={{ color: C.navy }} />
        <Typography variant="h6" fontWeight={600} sx={{ color: C.navy }}>
          Run Novelty Search
        </Typography>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Drug · Protein · Disease Combination or Patent Title"
              name="searchQuery"
              placeholder='e.g., "metformin AMPK Alzheimer" or "System and method for predicting protein binding"'
              value={formik.values.searchQuery}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              variant="outlined"
              size="small"
              error={formik.touched.searchQuery && Boolean(formik.errors.searchQuery)}
              helperText={formik.touched.searchQuery && formik.errors.searchQuery}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: C.teal },
                  "&.Mui-focused fieldset": { borderColor: C.sage },
                },
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="No. of Patents"
              name="numResults"
              type="number"
              value={formik.values.numResults}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              variant="outlined"
              size="small"
              inputProps={{ min: 1, max: 20 }}
              error={formik.touched.numResults && Boolean(formik.errors.numResults)}
              helperText={formik.touched.numResults && formik.errors.numResults}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: C.teal },
                  "&.Mui-focused fieldset": { borderColor: C.sage },
                },
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={agentRunning}
              startIcon={agentRunning ? <CircularProgress size={18} color="inherit" /> : <AutoAwesome />}
              sx={{
                background: GRAD_H,
                height: 40,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { background: GRAD },
              }}
            >
              {agentRunning ? "Running…" : "Run Agent"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  </Slide>
);

export default RunAgentForm;
