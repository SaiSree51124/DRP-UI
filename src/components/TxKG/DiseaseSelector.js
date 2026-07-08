import React from "react";
import { Box, Typography, Autocomplete, TextField, CircularProgress } from "@mui/material";
import { C, GRAD_H } from "../../utils/colors";

const DiseaseSelector = ({ diseases, selectedDisease, onDiseaseChange, loadingDiseases }) => (
  <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2, color: C.navy }}>
    <Typography fontWeight={600}>Diseases:</Typography>

    <Autocomplete
      sx={{
        minWidth: 300,
        "& .MuiOutlinedInput-root": {
          bgcolor: C.bg,
          color: "black",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: C.navy },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: C.sage },
          "& .MuiSvgIcon-root": { color: C.navy },
        },
        "& .MuiAutocomplete-listbox": {
          bgcolor: GRAD_H,
          color: C.navy,
          "& .MuiAutocomplete-option:hover": { backgroundColor: C.sage, color: C.light },
        },
      }}
      options={diseases.map((d) => d.name)}
      value={selectedDisease || null}
      onChange={(event, newValue) => onDiseaseChange(newValue || "")}
      loading={loadingDiseases}
      clearOnEscape
      filterOptions={(options, { inputValue }) => {
        const iv = (inputValue || "").toLowerCase();
        if (!iv) return options;
        return options.filter((option) => String(option).toLowerCase().includes(iv));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search for a disease..."
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            style: { color: "black" },
            endAdornment: (
              <>
                {loadingDiseases ? <CircularProgress color={C.navy} size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  </Box>
);

export default DiseaseSelector;
