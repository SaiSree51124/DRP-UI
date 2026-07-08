import React from "react";
import {
  Box, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Tooltip, Link, IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { C, GRAD_H } from "../../utils/colors";

const headerCellSx = {
  fontWeight: "bold",
  color: "#fff",
  textAlign: "left",
  whiteSpace: "nowrap",
  background: "transparent",
  py: 1.5,
  px: 2,
};

const truncate = (text, maxLength = 60) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const ResultsTable = ({ currentResults, onPreview }) => (
  <Box sx={{ width: "100%", mt: 3 }}>
    <TableContainer
      component={Paper}
      sx={{ boxShadow: 3, borderRadius: 2, overflowX: "auto" }}
    >
      <Table
        size="small"
        sx={{ tableLayout: "fixed", width: "100%", minWidth: 900, borderCollapse: "collapse" }}
      >
        <colgroup>
          <col style={{ width: "12%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "7%" }} />
          <col style={{ width: "27%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "8%" }} />
        </colgroup>

        <TableHead>
          <TableRow sx={{ background: GRAD_H }}>
            <TableCell sx={headerCellSx}>Primary Term</TableCell>
            <TableCell sx={headerCellSx}>Title</TableCell>
            <TableCell sx={{ ...headerCellSx, textAlign: "center" }}>Score</TableCell>
            <TableCell sx={headerCellSx}>PDF File Path</TableCell>
            <TableCell sx={headerCellSx}>Found Keyword</TableCell>
            <TableCell sx={{ ...headerCellSx, textAlign: "center" }}>Preview</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {currentResults.map((item, index) => (
            <TableRow
              key={index}
              sx={{ "&:hover": { bgcolor: C.sky }, "&:nth-of-type(even)": { bgcolor: C.bg } }}
            >
              <TableCell sx={{ fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", px: 2, py: 1.5 }}>
                <Tooltip title={item.protein_name} placement="top" arrow>
                  <span>{item.protein_name}</span>
                </Tooltip>
              </TableCell>

              <TableCell sx={{ fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", px: 2, py: 1.5, fontWeight: 500 }}>
                <Tooltip title={item.title} placement="top" arrow>
                  <span>{item.title}</span>
                </Tooltip>
              </TableCell>

              <TableCell sx={{ fontSize: "0.75rem", textAlign: "center", fontWeight: 600, whiteSpace: "nowrap", px: 2, py: 1.5 }}>
                {item.score.toFixed(2)}
              </TableCell>

              <TableCell sx={{ fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", px: 2, py: 1.5 }}>
                <Tooltip title={item.title} placement="top" arrow>
                  <Link href={item.pdf_file_path} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ color: C.teal, fontSize: "0.75rem" }}>
                    {truncate(item.title, 50)}
                  </Link>
                </Tooltip>
              </TableCell>

              <TableCell sx={{ fontSize: "0.75rem", color: item.found_keywords ? C.sage : C.muted, fontWeight: item.found_keywords ? 600 : "normal", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", px: 2, py: 1.5 }}>
                <Tooltip title={(item.found_keywords || []).join(", ")} placement="top" arrow>
                  <span>{(item.found_keywords || []).join(", ")}</span>
                </Tooltip>
              </TableCell>

              <TableCell sx={{ textAlign: "center", px: 2, py: 1.5 }}>
                <IconButton onClick={() => onPreview(item)} size="small" title="Preview" sx={{ color: C.teal, "&:hover": { color: C.navy } }}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default ResultsTable;
