import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Fragment } from "react";
import API_CONFIG from "../../apiconfig";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  Divider,
  InputAdornment,
  IconButton,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
  Pagination,
  Link,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { C, GRAD, GRAD_H } from "../../utils/colors";

const LiteratureMining = () => {
  const { BASE_URL, PORT1 } = API_CONFIG;
  const [fileError, setFileError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [queryparams, setqueryparams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);

  const handlePreview = (item) => {
    setSelectedPreview(item);
    setIsPreviewOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      proteinName: "",
      dataSource: "",
    },
    validationSchema: Yup.object({
      proteinName: Yup.string().required("Primary term is required"),
      dataSource: Yup.string().required("Associated keywords are required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      handleSearch(values);
    },
  });

  const handleSearch = async (keywords) => {
    console.log("key", keywords);
    setSearchLoading(true);
    setLoading(true);
    try {
      const encodedProteinName = encodeURIComponent(
        keywords.proteinName
          .split(",")
          .map((item) => item.trim())
          .join(", ")
      );
      const encodedDataSource = encodeURIComponent(
        keywords.dataSource
          .split(",")
          .map((item) => item.trim())
          .join(", ")
      );
      const url = `${BASE_URL}:${PORT1}/api/v1/search-keywords/?article_keywords=${encodedProteinName}&search_keywords=${encodedDataSource}`;
      const response = await axios.get(url);
      setLoading(false);
      console.log("76::", response.data.results);
      setSearchResults(response.data.results);
      setSearchLoading(true);
    } catch (error) {
      console.error("Search Error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const sortedResults = [...searchResults].sort((a, b) => b.score - a.score);
  const currentResults = sortedResults.slice(indexOfFirstResult, indexOfLastResult);

  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  // Truncate long text
  const truncate = (text, maxLength = 60) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const headerCellSx = {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left",
    whiteSpace: "nowrap",
    background: "transparent",
    py: 1.5,
    px: 2,
  };

  return (
    <>
      {/* Preview Dialog */}
      <Dialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
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
            onClick={() => setIsPreviewOpen(false)}
            sx={{ bgcolor: C.teal, ":hover": { bgcolor: C.navy } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Box>
        {/* Header + Form */}
        <Box
          sx={{
            mb: 3,
            p: "10px",
            border: `1px solid ${C.teal}`,
            borderRadius: 2,
            height: "auto",
            minHeight: "50px",
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ color: C.navy }}>
            Literature Mining
          </Typography>
          <Typography mt={1} color="textSecondary" textAlign="justify">
            Retrieves scientifically relevant PubMed articles using semantic search powered by MeSH
            terminology and contextual understanding. Filters studies based on user-defined keywords
            and related biomedical concepts to deliver precise, high-quality evidence for drug
            repurposing.
          </Typography>

          {/* Form Card */}
          <Card variant="outlined" sx={{ p: 3, mt: 1, borderRadius: 2, boxShadow: 1 }}>
            <Box component="form" onSubmit={formik.handleSubmit}>
              <Grid container spacing={2} alignItems="flex-end">

                {/* Primary Search */}
                <Grid item xs={3.5}>
                  <Stack spacing={1}>
                    <Typography sx={{ color: C.navy }} fontWeight={600}>
                      Primary Search
                    </Typography>
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
                            <IconButton>
                              <SearchIcon sx={{ color: C.muted }} />
                            </IconButton>
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
                    sx={{
                      borderColor: C.muted,
                      borderWidth: "1px",
                      mx: "10px",
                      alignSelf: "stretch",
                    }}
                  />
                </Grid>

                {/* Keyword Search */}
                <Grid item xs={5.5}>
                  <Stack spacing={1.5}>
                    <Typography sx={{ color: C.navy }} fontWeight={600}>
                      Keyword Search
                    </Typography>
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
        </Box>

        {/* Loading Spinner */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" mt={10}>
            <CircularProgress size={64} thickness={4} sx={{ color: C.teal }} />
          </Box>
        )}

        {/* Results Table */}
        {!loading && searchResults.length > 0 && (
          <Box sx={{ width: "100%", mt: 3 }}>
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                overflowX: "auto",   // horizontal scroll on small screens
              }}
            >
              <Table
                size="small"
                sx={{
                  tableLayout: "fixed",  // critical — enforces column widths
                  width: "100%",
                  minWidth: 900,         // prevents collapse below readable size
                  borderCollapse: "collapse",
                }}
              >
                {/* Explicit column widths */}
                <colgroup>
                  <col style={{ width: "12%" }} />   {/* Primary Term */}
                  <col style={{ width: "28%" }} />   {/* Title */}
                  <col style={{ width: "7%" }}  />   {/* Score */}
                  <col style={{ width: "27%" }} />   {/* PDF File Path */}
                  <col style={{ width: "18%" }} />   {/* Found Keyword */}
                  <col style={{ width: "8%" }}  />   {/* Preview */}
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
                      sx={{
                        "&:hover": { bgcolor: C.sky },
                        "&:nth-of-type(even)": { bgcolor: C.bg },
                      }}
                    >
                      {/* Primary Term */}
                      <TableCell
                        sx={{
                          fontSize: "0.75rem",
                          color: "text.primary",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          px: 2, py: 1.5,
                        }}
                      >
                        <Tooltip title={item.protein_name} placement="top" arrow>
                          <span>{item.protein_name}</span>
                        </Tooltip>
                      </TableCell>

                      {/* Title */}
                      <TableCell
                        sx={{
                          fontSize: "0.75rem",
                          color: "text.primary",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          px: 2, py: 1.5,
                          fontWeight: 500,
                        }}
                      >
                        <Tooltip title={item.title} placement="top" arrow>
                          <span>{item.title}</span>
                        </Tooltip>
                      </TableCell>

                      {/* Score */}
                      <TableCell
                        sx={{
                          fontSize: "0.75rem",
                          color: "text.primary",
                          textAlign: "center",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          px: 2, py: 1.5,
                        }}
                      >
                        {item.score.toFixed(2)}
                      </TableCell>

                      {/* PDF File Path */}
                      <TableCell
                        sx={{
                          fontSize: "0.75rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          px: 2, py: 1.5,
                        }}
                      >
                        <Tooltip title={item.title} placement="top" arrow>
                          <Link
                            href={item.pdf_file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{ color: C.teal, fontSize: "0.75rem" }}
                          >
                            {truncate(item.title, 50)}
                          </Link>
                        </Tooltip>
                      </TableCell>

                      {/* Found Keywords */}
                      <TableCell
                        sx={{
                          fontSize: "0.75rem",
                          color: item.found_keywords ? C.sage : C.muted,
                          fontWeight: item.found_keywords ? 600 : "normal",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          px: 2, py: 1.5,
                        }}
                      >
                        <Tooltip title={(item.found_keywords || []).join(", ")} placement="top" arrow>
                          <span>{(item.found_keywords || []).join(", ")}</span>
                        </Tooltip>
                      </TableCell>

                      {/* Preview */}
                      <TableCell sx={{ textAlign: "center", px: 2, py: 1.5 }}>
                        <IconButton
                          onClick={() => handlePreview(item)}
                          size="small"
                          title="Preview"
                          sx={{ color: C.teal, "&:hover": { color: C.navy } }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, value) => setCurrentPage(value)}
                color="primary"
                shape="rounded"
                variant="outlined"
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default LiteratureMining;