import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { C, GRAD_H } from "../../utils/colors";

const ArticlesPanel = ({ articles, loadingArticles }) => (
  <Paper
    elevation={2}
    sx={{ border: "0px solid #2c5f7c", borderRadius: 1, overflow: "hidden", background: C.card }}
  >
    <Box sx={{ background: GRAD_H, color: "white", p: 1.5 }}>
      <Typography fontWeight={600}>Articles/Sources</Typography>
    </Box>
    <Box sx={{ p: 2, maxHeight: 200, overflowY: "auto" }}>
      {loadingArticles ? (
        <Typography color={C.muted} fontStyle="italic">Loading articles...</Typography>
      ) : articles.length > 0 ? (
        articles.map((article, idx) => (
          <Box
            key={idx}
            sx={{
              mb: 1,
              pb: 1,
              borderBottom: idx < articles.length - 1 ? "1px solid #e0e0e0" : "none",
            }}
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.navy, textDecoration: "none", fontSize: "14px" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              {article.title}
            </a>
            {article.source && (
              <Typography component="span" sx={{ ml: 1, color: C.muted, fontSize: 12 }}>
                ({article.source})
              </Typography>
            )}
          </Box>
        ))
      ) : (
        <Typography color={C.muted} textAlign="center">No articles available</Typography>
      )}
    </Box>
  </Paper>
);

export default ArticlesPanel;
