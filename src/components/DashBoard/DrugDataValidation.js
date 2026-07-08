import React, { useEffect, useState } from "react";
import axios from "axios";
import API_CONFIG from "../../apiconfig";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
} from "@mui/material";
import { C, GRAD_H } from "../../utils/colors";

const DrugDataValidation = ({ drugData }) => {
  console.log("drugdata", drugData);
  const { BASE_URL, PORT4 } = API_CONFIG;
  const [data, setdata] = useState([]);

  useEffect(() => {
    fetchValidationData(drugData);
  }, [drugData]);

  const fetchValidationData = async (updatedData) => {
    const response = await axios.post(
      `${BASE_URL}:${PORT4}/validate`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const parsedData = response.data.validation_results.map((str) =>
      JSON.parse(str)
    );
    console.log("datavalid", response.data.validation_results);
    setdata(parsedData);
  };

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
    <Box sx={{ mx: "auto", p: 3 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        textAlign="center"
        mb={3}
        sx={{ color: C.navy }}
      >
        Drug Data
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ boxShadow: 3, borderRadius: 2, overflowX: "auto" }}
      >
        <Table
          size="small"
          sx={{
            tableLayout: "fixed",
            width: "100%",
            minWidth: 600,
            borderCollapse: "collapse",
          }}
        >
          <colgroup>
            <col style={{ width: "22%" }} />
            <col style={{ width: "60%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>

          <TableHead>
            <TableRow sx={{ background: GRAD_H }}>
              <TableCell sx={headerCellSx}>Compound Name</TableCell>
              <TableCell sx={headerCellSx}>Criteria</TableCell>
              <TableCell sx={{ ...headerCellSx, textAlign: "center" }}>
                Validity
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((compound, compoundIndex) =>
              compound?.criteria.map((item, index) => {
                console.log("item is", item);
                return (
                  <TableRow
                    key={`${compoundIndex}-${index}`}
                    sx={{
                      "&:hover": { bgcolor: C.sky },
                      "&:nth-of-type(even)": { bgcolor: C.bg },
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    {/* Compound Name — only on first row of each compound */}
                    <TableCell
                      sx={{
                        px: 2,
                        py: 1.5,
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        color: C.teal,
                      }}
                    >
                      {index === 0 ? compound.compound_name : ""}
                    </TableCell>

                    {/* Criteria */}
                    <TableCell
                      sx={{
                        px: 2,
                        py: 1.5,
                        fontSize: "0.8rem",
                        color: "text.primary",
                        textTransform: "capitalize",
                      }}
                    >
                      <Box component="span" fontWeight={700}>
                        {(item?.step_name || item?.step)?.replace(/_/g, " ")}
                      </Box>
                      {" : "}
                      {item?.statement}
                    </TableCell>

                    {/* Validity */}
                    <TableCell sx={{ px: 2, py: 1.5, textAlign: "center" }}>
                      <Chip
                        label={item?.validity}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          bgcolor:
                            item.validity === "valid" ? "#DCFCE7" : "#FEE2E2",
                          color:
                            item.validity === "valid" ? C.sage : "#B91C1C",
                          borderRadius: "6px",
                          px: 1,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DrugDataValidation;