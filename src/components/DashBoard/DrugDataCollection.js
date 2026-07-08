import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import API_CONFIG from "../../apiconfig";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Card,
  Typography,
  TextField,
  Box,
  IconButton,
  Tooltip,
  Grid,
  FormControl,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Link,
} from "@mui/material";
import { C, GRAD, GRAD_H } from "../../utils/colors";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const DrugDataCollection = ({ setDrugData }) => {
  const { BASE_URL, PORT1 } = API_CONFIG;
  console.log("BASEURL", BASE_URL, PORT1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [compounds, setcompounds] = useState([]);

  const formik = useFormik({
    initialValues: {
      story_content: "",
    },
    validationSchema: Yup.object({
      story_content: Yup.string().trim().required("Story content is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setMessage("");
      console.log("Val");
      try {
        const response = await axios.post(
          `${BASE_URL}:${PORT1}/api/v1/drug-curation/fetch_compounds`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setMessage("✅ Successfully Fetched!");
        console.log("46::", response.data.compounds);
        console.log("47::", response.data);
        setcompounds(response.data.compounds);
        setDrugData(response.data);
        resetForm();
      } catch (error) {
        setMessage("❌ Error While Fetching. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const headerCellSx = {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    whiteSpace: "nowrap",
    background: "transparent",
    py: 1.5,
    px: 2,
  };

  return (
    <>
      <Box
        sx={{
          mx: "20px",
          border: `1px solid ${C.teal}`,
          borderRadius: 2,
          p: "10px",
          height: "auto",
          minHeight: "50px",
        }}
      >
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600} sx={{ color: C.navy }}>
            Data Curation Engine
          </Typography>
          {/* <Tooltip title="Information">
            <IconButton>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip> */}
        </Box>

        {/* Description */}
        <Typography color="text.secondary">
          The Data Curation Engine collects ligand data based on user-defined
          criteria using LLMs and verifies their presence in specified reference
          sources. This step ensures that only validated, high-confidence drug
          candidates proceed for further screening and analysis...
        </Typography>

        {/* Drug Data Label */}
        <Typography mt={1} fontWeight={600} sx={{ color: C.navy }}>
          Drug Data
        </Typography>

        {/* Prompt Query Form */}
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              gap: 1,
              p: 1.5,
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: 4,
              backgroundColor: C.card,
              boxShadow: 1,
              transition: "all 0.2s ease",
              "&:focus-within": {
                borderColor: C.teal,
                boxShadow: `0 0 0 3px ${C.teal}20`,
              },
            }}
          >
            {/* Expanding Prompt Text Area */}
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={12}
              variant="standard"
              placeholder="Enter drug selection criteria... E.g., 'Identify approved oral drugs with high bioavailability and low toxicity that target GPCRs.'"
              name="story_content"
              value={formik.values.story_content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.story_content &&
                Boolean(formik.errors.story_content)
              }
              helperText={
                formik.touched.story_content &&
                formik.errors.story_content
              }
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  padding: "8px 12px",
                },
                "& textarea": {
                  resize: "none",
                },
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              // title="Fetch Drug List"
              sx={{
                minWidth: 48,
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: C.teal,
                color: "#fff",
                flexShrink: 0,
                boxShadow: 2,
                position: "relative",
                overflow: "visible",
                transition: "all 0.3s ease",

                /* Arrow icon transition */
                "& .MuiSvgIcon-root": {
                  transition: "color 0.3s ease, transform 0.3s ease",
                },

                /* Hover label */
                "& .button-label": {
                  position: "absolute",
                  right: "56px",
                  top: "50%",
                  transform: "translateY(-50%) translateX(10px)",
                  whiteSpace: "nowrap",
                  backgroundColor: C.navy,
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  opacity: 0,
                  pointerEvents: "none",
                  transition: "all 0.25s ease",
                  boxShadow: 2,
                },

                /* Hover state */
                "&:hover": {
                  bgcolor: C.navy,
                  transform: "scale(1.08)",
                },

                /* Change arrow color on hover */
                "&:hover .MuiSvgIcon-root": {
                  color: "#ffffff",
                  transform: "translateY(-1px)",
                },

                /* Show hover label */
                "&:hover .button-label": {
                  opacity: 1,
                  transform: "translateY(-50%) translateX(0)",
                },
              }}
            >
              <ArrowUpwardIcon />

              <Box className="button-label">
                Fetch Drug List
              </Box>
            </Button>

          </Box>
        </Box>

        {/* Note */}
        {/* <Typography fontSize={12} fontWeight={500} color="text.secondary">
          <strong>*Note:</strong> Specify the criteria that the LLM should
          follow for optimal results.
        </Typography> */}
      </Box>

      {/* Loading Spinner */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={10}>
          <CircularProgress size={64} thickness={4} sx={{ color: C.teal }} />
        </Box>
      )}

      {/* Results Table */}
      {!loading && compounds.length > 0 && (
        <Box sx={{ mx: "auto", mt: 4, px: 2 }}>
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              overflowX: "auto",
            }}
          >
            <Table
              size="small"
              sx={{
                tableLayout: "fixed",
                width: "100%",
                minWidth: 700,
                borderCollapse: "collapse",
              }}
            >
              <colgroup>
                <col style={{ width: "15%" }} /> {/* Compound Name */}
                <col style={{ width: "40%" }} /> {/* Content */}
                <col style={{ width: "5%" }} /> {/* Confidence Score */}
                <col style={{ width: "40%" }} /> {/* Websites */}
              </colgroup>

              <TableHead>
                <TableRow sx={{ background: GRAD_H }}>
                  <TableCell sx={headerCellSx}>Compound Name</TableCell>
                  <TableCell sx={headerCellSx}>Content</TableCell>
                  <TableCell sx={{ ...headerCellSx, textAlign: "center", whiteSpace: "pre-wrap" }}>
                    Confidence Score
                  </TableCell>
                  <TableCell sx={headerCellSx}>Websites</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {compounds.map((compound, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": { bgcolor: C.sky },
                      "&:nth-of-type(even)": { bgcolor: C.bg },
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    {/* Compound Name */}
                    <TableCell
                      sx={{
                        px: 2,
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: C.navy,
                      }}
                    >
                      {compound["compound_name"]}
                    </TableCell>

                    {/* Content */}
                    <TableCell sx={{ px: 2, py: 1.5, fontSize: "0.9rem" }}>
                      {Object.entries(compound.content).map(([key, value]) => (
                        <Box key={key} mb={0.5}>
                          <Box component="span" fontWeight={700}>
                            {key}:
                          </Box>{" "}
                          {typeof value === "object" && value !== null
                            ? Object.entries(value).map(([k2, v2]) => (
                                <Box key={k2} ml={2}>
                                  <Box component="span" fontWeight={700}>
                                    {k2}:
                                  </Box>{" "}
                                  {v2}
                                </Box>
                              ))
                            : value}
                        </Box>
                      ))}
                    </TableCell>

                    {/* Confidence Score */}
                    <TableCell
                      sx={{
                        px: 2,
                        py: 1.5,
                        textAlign: "center",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: C.teal,
                      }}
                    >
                      {compound["confidence_score"]}%
                    </TableCell>

                    {/* Websites */}
                    <TableCell
                      sx={{
                        px: 2,
                        py: 1.5,
                        fontSize: "0.9rem",
                      }}
                    >
                      {compound.websites.map((url, i) => (
                        <Link
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          display="block"
                          sx={{
                            color: C.teal,
                            fontSize: "0.9rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {url}
                        </Link>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
};

export default DrugDataCollection;