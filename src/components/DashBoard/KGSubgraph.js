import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import BarChartIcon from "@mui/icons-material/BarChart";
import BugReportIcon from "@mui/icons-material/BugReport";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { C, GRAD, GRAD_H } from "../../utils/colors";

const KGSubgraph = ({ disease, API_BASE_URL }) => {
  const [graphHtml, setGraphHtml] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const fetchSubgraph = async () => {
      if (!disease) {
        console.log("⚠️ No disease provided");
        return;
      }

      setLoading(true);
      setError(null);
      setGraphHtml(null);
      setDebugInfo(null);

      try {
        console.log(`🔍 Fetching subgraph for: ${disease}`);
        console.log(`🌐 API URL: ${API_BASE_URL}/subgraph`);

        const response = await axios.get(`${API_BASE_URL}/subgraph`, {
          params: {
            disease,
            max_nodes: 100,
          },
        });

        console.log("✅ Subgraph response:", response.data);

        if (response.data.success) {
          setStats(response.data.subgraph.statistics);

          const htmlContentUrl = `${API_BASE_URL}/graph-html-content`;
          console.log("📊 Fetching HTML content from:", htmlContentUrl);

          const htmlResponse = await axios.get(htmlContentUrl);

          if (htmlResponse.data.success && htmlResponse.data.html) {
            console.log(
              "✅ HTML fetched successfully, length:",
              htmlResponse.data.html.length
            );
            setGraphHtml(htmlResponse.data.html);
            setDebugInfo({
              disease: disease,
              html_length: htmlResponse.data.html.length,
              file_path: htmlResponse.data.file_path,
              timestamp: new Date().toISOString(),
            });
          } else {
            throw new Error("Invalid HTML response format");
          }
        } else {
          setError(
            response.data.message || "No data available for this disease"
          );
        }
      } catch (err) {
        console.error("❌ Error:", err);
        console.error("Error response:", err.response?.data);

        setError(
          err.response?.data?.detail ||
            err.message ||
            "Failed to load subgraph. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubgraph();
  }, [disease, API_BASE_URL]);

  // Loading State
  if (loading) {
    return (
      <Box
        sx={{
          p: 5,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={60} sx={{ color: C.navy, mb: 3 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: C.navy, mb: 2 }}>
          Loading Knowledge Graph
        </Typography>
        <Typography variant="body1" sx={{ color: C.muted, mb: 1 }}>
          Disease: <Box component="span" sx={{ color: C.navy, fontWeight: 600 }}>
            {disease || "Not specified"}
          </Box>
        </Typography>
        <Typography variant="body2" sx={{ color: C.muted }}>
          Building interactive visualization with entity name enrichment...
        </Typography>
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            border: "2px solid #d32f2f",
            borderRadius: 2,
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle sx={{ fontWeight: 600 }}>Error Loading Knowledge Graph</AlertTitle>
            {error}
          </Alert>

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{
              bgcolor: C.teal,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: C.slate,
              },
            }}
          >
            Reload Page
          </Button>

          {debugInfo && (
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BugReportIcon sx={{ fontSize: 20 }} />
                  <Typography fontWeight={600}>Debug Information</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  component="pre"
                  sx={{
                    fontSize: "12px",
                    bgcolor: C.card,
                    p: 2,
                    borderRadius: 1,
                    overflow: "auto",
                    fontFamily: "monospace",
                  }}
                >
                  {JSON.stringify(debugInfo, null, 2)}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </Paper>
      </Box>
    );
  }

  // No Disease Selected State
  if (!graphHtml) {
    return (
      <Box
        sx={{
          p: 8,
          textAlign: "center",
          background: C.sky,
          borderRadius: 2,
          m: 2,
        }}
      >
        <SearchIcon sx={{ fontSize: "80px", color: C.navy, mb: 3 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: C.navy, mb: 2 }}>
          Select a disease to view its knowledge graph
        </Typography>
        <Typography variant="body1" sx={{ color: C.muted }}>
          Current disease:{" "}
          <Box component="span" sx={{ color: disease ? C.navy : C.muted, fontWeight: 600 }}>
            {disease || "None selected"}
          </Box>
        </Typography>
      </Box>
    );
  }

  // Main Graph Display
  return (
    <Box sx={{ width: "100%" }}>
      {/* Statistics Card - Matching TxKG Theme */}
      {stats && (
        <Paper
          elevation={2}
          sx={{
            background: "white",
            border: "0px solid #0225AA",
            borderRadius: 1,
            overflow: "hidden",
            mb: 2,
          }}
        >
          <Box
            sx={{
              background: C.card,
              color: C.navy,
              p: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <BarChartIcon />
            <Typography variant="h5" fontWeight={600}>
              Knowledge Graph Statistics - {disease}
            </Typography>
          </Box>

          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    textAlign: "center",
                    background: C.teal,
                    border: "0px solid #0225AA",
                  }}
                >
                  <CardContent>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: "white" }}>
                      {stats.total_nodes || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "white", textTransform: "uppercase" }}>
                      Nodes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    textAlign: "center",
                    background: C.teal,
                    backdropFilter: "blur(10px)",
                    border: "0px solid #0225AA",
                  }} 
                > 
                  <CardContent>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: "white" }}>
                      {stats.total_edges || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "white", textTransform: "uppercase" }}>
                      Edges
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    textAlign: "center",
                    background: C.teal,
                    border: "0px solid #0225AA",
                  }}
                >
                  <CardContent>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: "white" }}>
                      {stats.protein_count || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "white", textTransform: "uppercase" }}>
                      Proteins
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    textAlign: "center",
                    background: C.teal,
                    border: "0px solid #0225AA",
                  }}
                >
                  <CardContent>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: "white" }}>
                      {stats.predicted_targets || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "white", textTransform: "uppercase" }}>
                      Predicted Targets
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      {/* Interactive Graph Iframe */}
      <Paper
        elevation={2}
        sx={{
          border: "0px solid #0225AA",
          borderRadius: 1,
          overflow: "hidden",
          mb: 2,
        }}
      >
        <Box
          sx={{
            background: C.teal,
            color: "white",
            p: 1.5,
          }}
        >
          <Typography fontWeight={600}>Interactive Knowledge Graph</Typography>
        </Box>
        <Box
          component="iframe"
          srcDoc={graphHtml}
          title="Knowledge Graph Visualization"
          sx={{
            width: "100%",
            height: "800px",
            border: "none",
            display: "block",
          }}
          sandbox="allow-scripts allow-same-origin allow-forms"
          onLoad={() => console.log("✅ Iframe loaded successfully")}
          onError={(e) => console.error("❌ Iframe error:", e)}
        />
      </Paper>

      {/* Interactive Controls - Matching TxKG Theme */}
      <Paper
        elevation={2}
        sx={{
          border: "0px solid #0225AA",
          borderRadius: 1,
          overflow: "hidden",
          mb: 2,
        }}
      >
        <Box
          sx={{
            background: C.teal,
            color: "white",
            p: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <LightbulbIcon />
          <Typography fontWeight={600}>Interactive Controls</Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {[
              { icon: "→", text: "Drag nodes to reposition them in the graph" },
              { icon: "→", text: "Scroll to zoom in and out" },
              { icon: "→", text: "Click nodes to view detailed information" },
              { icon: "→", text: "Click edges to see relationship types" },
              { icon: "→", text: "Use sidebar controls to fit view, reset layout" },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "start" }}>
                  <Typography sx={{ fontWeight: 700, color: C.navy, minWidth: "20px" }}>
                    {item.icon}
                  </Typography>
                  <Typography sx={{ fontSize: "14px", color: C.navy }}>
                    {item.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* Debug Information */}
      {/*{debugInfo && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              bgcolor: "#f5f5f5",
              "&:hover": { bgcolor: "#eeeeee" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BugReportIcon sx={{ color: "#0225AA" }} />
              <Typography fontWeight={600} color="#0225AA">
                Technical Details
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: "#fafafa" }}>
            <Box
              component="pre"
              sx={{
                fontSize: "12px",
                bgcolor: "#fff",
                p: 2,
                borderRadius: 1,
                overflow: "auto",
                border: "1px solid #e0e0e0",
                fontFamily: "monospace",
              }}
            >
              {JSON.stringify(debugInfo, null, 2)}
            </Box>
          </AccordionDetails>
        </Accordion> 
      )}*/}
    </Box>
  );
};

export default KGSubgraph;