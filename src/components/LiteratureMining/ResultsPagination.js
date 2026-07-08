import React from "react";
import { Box, Pagination } from "@mui/material";

const ResultsPagination = ({ currentPage, totalPages, onPageChange }) => (
  <Box display="flex" justifyContent="center" mt={3}>
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={(e, value) => onPageChange(value)}
      color="primary"
      shape="rounded"
      variant="outlined"
    />
  </Box>
);

export default ResultsPagination;
