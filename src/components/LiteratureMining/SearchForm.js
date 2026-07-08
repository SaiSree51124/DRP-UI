import React from "react";
import {
  Box, Grid, Typography, TextField, Button, Card,
  Divider, InputAdornment, IconButton, Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { C } from "../../utils/colors";

const SearchForm = ({ formik }) => (
  <Card variant="outlined" sx={{ p: 3, mt: 1, borderRadius: 2, boxShadow: 1 }}>
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="flex-end">

        {/* Primary Search */}
        <Grid item xs={3.5}>
          <Stack spacing={1}>
            <Typography sx={{ color: C.navy }} fontWeight={600}>Primary Search</Typography>
            <TextField
              fullWidth
              id="proteinName"
              name="proteinName"
              label="Primary Term *"
              variant="outlined"
              value={formik.values.proteinName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.proteinName && Boolean(formik.errors.proteinName)}
              helperText={formik.touched.proteinName && formik.errors.proteinName}
              sx={{
                "& .MuiInputBase-root": { height: "40px" },
                "& .MuiInputBase-input": { padding: "8px" },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton><SearchIcon sx={{ color: C.muted }} /></IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Grid>

        {/* Vertical Divider */}
        <Grid item sx={{ display: "flex", alignSelf: "stretch", px: 0 }}>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: C.muted, borderWidth: "1px", mx: "10px", alignSelf: "stretch" }}
          />
        </Grid>

        {/* Keyword Search */}
        <Grid item xs={5.5}>
          <Stack spacing={1.5}>
            <Typography sx={{ color: C.navy }} fontWeight={600}>Keyword Search</Typography>
            <TextField
              fullWidth
              id="dataSource"
              name="dataSource"
              label="Associated Terms *"
              variant="outlined"
              value={formik.values.dataSource}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.dataSource && Boolean(formik.errors.dataSource)}
              helperText={formik.touched.dataSource && formik.errors.dataSource}
              sx={{
                "& .MuiInputBase-root": { height: "40px" },
                "& .MuiInputBase-input": { padding: "8px" },
              }}
            />
          </Stack>
        </Grid>

        {/* Search Button */}
        <Grid item xs={2} sx={{ display: "flex", alignItems: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: C.teal,
              ":hover": { bgcolor: C.navy },
              width: "100%",
              minWidth: "150px",
              height: "40px",
            }}
          >
            Search
          </Button>
        </Grid>

      </Grid>
    </Box>
  </Card>
);

export default SearchForm;
