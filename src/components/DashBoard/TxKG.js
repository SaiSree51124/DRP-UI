//TxKG component for Target Identification 
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_CONFIG from "../../apiconfig";
import KGSubgraph from "./KGSubgraph";
import KGMetaPath from "./KGMetaPath";
import { C, GRAD, GRAD_H } from "../../utils/colors";

import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";


const TxKG = () => {
  const { BASE_URL, PORT1 } = API_CONFIG;
  const API_BASE_URL = `${BASE_URL}:${PORT1}/api/v1/txkg`;

  const [selectedDisease, setSelectedDisease] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [targets, setTargets] = useState([]);
  //const [drugs, setDrugs] = useState([]);
  const [llmInterpretation, setLlmInterpretation] = useState("");
  const [articles, setArticles] = useState([]);
  //const [graphData, setGraphData] = useState(null);

  const [loadingDiseases, setLoadingDiseases] = useState(false);
  const [loadingTargets, setLoadingTargets] = useState(false);
  //const [loadingDrugs, setLoadingDrugs] = useState(false);
  const [loadingLLM, setLoadingLLM] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);
  //const [loadingGraph, setLoadingGraph] = useState(false);

  const [activeTab, setActiveTab] = useState("Sub-Graph");
  

  // Fetch diseases on component mount
  useEffect(() => {
    fetchDiseases();
  }, []);

  // Fetch disease-related data on disease change
  useEffect(() => {
    if (selectedDisease) {
      fetchTargets(selectedDisease);
      //fetchDrugs(selectedDisease);
      fetchLLMInterpretation(selectedDisease);
      fetchArticles(selectedDisease);

      // Only fetch graph data for Node Attention and Meta-Path tabs 
      {/*if (activeTab !== "Sub-Graph"){
        fetchGraphData(selectedDisease, activeTab);
      }*/}
    }
  }, [selectedDisease]);

  // Fetch graph data when switching tabs
  {/*useEffect(() => {
    if (selectedDisease && activeTab && activeTab !== "Sub-Graph") {
      fetchGraphData(selectedDisease, activeTab);
    }
  }, [activeTab]);*/} 

  //=========================
  // FETCH FUNCTIONS
  //=========================

  // Endpoint 1: GET /diseases - Fetch list of available diseases
  const fetchDiseases = async () => {
    try {
      setLoadingDiseases(true);
      const response = await axios.get(`${API_BASE_URL}/diseases`);
      console.log("Fetched diseases:", response.data);

      // Normalize — backend returns { diseases: [{id, name}, ...] }
      const diseasesArray = Array.isArray(response.data.diseases)
        ? response.data.diseases
        : [];

      setDiseases(diseasesArray);
    } catch (error) {
      console.error("Error fetching diseases:", error);
      // Fallback data
      const fallbackNames = [
        "Schizophrenia",
        "Alzheimer Disease",
        "Diabetes",
        "Cancer",
        "Parkinson Disease",
        "Chemical and drug induced liver injury",
      ];
      const fallbackDiseases = fallbackNames.map((n, i) => ({
        id: `F${i}`,
        name: n,
      }));
      setDiseases(fallbackDiseases);
      setSelectedDisease(fallbackDiseases[0].name);
    } finally {
      setLoadingDiseases(false);
    }
  };

  // Endpoint 2: GET /predicted-targets?disease={name}
  const fetchTargets = async (disease) => {
    try {
      setLoadingTargets(true);
      const response = await axios.get(`${API_BASE_URL}/predicted-targets`, {
        params: { disease },
      });

      // Handles both cases: array or { targets: [...] }
      setTargets(response.data.targets || response.data || []);
    } catch (error) {
      console.error("Error fetching targets:", error);
      // Fallback mock data with UniProt IDs
      setTargets([
        {
          uniprot_id: "P14416",
          name: "D(2) dopamine receptor",
          score: 0.95,
        },
        {
          uniprot_id: "P28223",
          name: "5-hydroxytryptamine receptor 2A",
          score: 0.89,
        },
        {
          uniprot_id: "Q12879",
          name: "Glutamate receptor ionotropic, NMDA 2A",
          score: 0.84,
        },
        {
          uniprot_id: "P31645",
          name: "Sodium-dependent serotonin transporter",
          score: 0.78,
        },
        {
          uniprot_id: "P21964",
          name: "Catechol O-methyltransferase",
          score: 0.72,
        },
        {
          uniprot_id: "Q13936",
          name: "Voltage-dependent L-type calcium channel subunit alpha-1C",
          score: 0.7,
        },
        { uniprot_id: "Q9ULB1", name: "Neurexin-1", score: 0.68 },
      ]);
    } finally {
      setLoadingTargets(false);
    }
  };
 
  // Endpoint 3: GET /llm-interpretation?disease={name}
  const fetchLLMInterpretation = async (disease) => {
    try {
      setLoadingLLM(true);
      const response = await axios.get(`${API_BASE_URL}/llm-interpretation`, {
        params: { disease },
      });

      setLlmInterpretation(response.data.interpretation || response.data.text || "");
    } catch (error) {
      console.error("Error fetching LLM interpretation:", error);
      setLlmInterpretation(
        `The predicted targets and drugs for ${disease} show promising therapeutic potential. ` +
          `The targets identified are key proteins involved in the disease pathway. ` +
          `Further research and clinical validation are recommended.`
      );
    } finally {
      setLoadingLLM(false);
    }
  };

  // Endpoint 4: GET /articles?disease={name}
  const fetchArticles = async (disease) => {
    try {
      setLoadingArticles(true);
      const response = await axios.get(`${API_BASE_URL}/articles`, {
        params: { disease },
      });

      setArticles(
        response.data.articles || response.data.sources || response.data || []
      );
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([
        { title: "Sample Article 1", url: "#", source: "PubMed" },
        { title: "Sample Article 2", url: "#", source: "Nature" },
        { title: "Sample Article 3", url: "#", source: "Science" },
      ]);
    } finally {
      setLoadingArticles(false);
    }
  };

  // Endpoint 5: Fetch graph visualization data based on active tab

  {/*const fetchGraphData = async (disease, tabType) => {
    // Skip fetching for Sub-Graph since it handles its own data
    if (tabType === "Sub-Graph") {
      return;
    }

    try {
      setLoadingGraph(true);
      let endpoint = "";

      switch (tabType) {
        case "Node Attention":
          endpoint = `${API_BASE_URL}/attention-tree`;
          break;
        //case "Meta-Path":
          //endpoint = `${API_BASE_URL}/metapath`;
          //break;
        default:
          return;
      }

      const response = await axios.get(endpoint, { params: { disease } });
      //backend may return wrapper {success: true, tree: {...}} or raw tree
      const payload = response.data;
      const tree = payload.tree || payload || null;
      setGraphData(tree);
    } catch (error) {
      console.error(`Error fetching ${tabType} data:`, error);
      setGraphData(null);
    } finally {
      setLoadingGraph(false);
    }
  };*/}

  // Render appropriate graph based on active tab
  const renderGraphVisualization = () => {
    switch (activeTab) {
      case "Sub-Graph":
        return (
          <KGSubgraph
            disease={selectedDisease}
            API_BASE_URL={API_BASE_URL}
          />
        );
      
      case "Meta-Path":
        return (
          <KGMetaPath
            disease={selectedDisease}
            API_BASE_URL={API_BASE_URL}
          />
        );

      default:
        return (
          <KGSubgraph
            disease={selectedDisease}
            API_BASE_URL={API_BASE_URL}
          />
        );
    }
  };

  return (
    <Box sx={{ mx: "20px" }}>
      {/* Header */}
      <Box
        sx={{ mb: 3, p: "10px", border: "1px solid " + C.teal, borderRadius: 2 }}
      >
        <Typography variant="h6" fontWeight={600} sx={{color: C.navy}}>
          TxKG - Therapeutic Target Prediction
        </Typography>
        <Typography mt={1} color={C.muted} textAlign="justify">
          The TxKG module explores biological networks and disease pathways to identify promising protein targets 
          for therapeutic research. By analyzing the relationships between diseases, proteins and drugs TxKG 
          helps researchers uncover novel disease-target associations that might otherwise go unnoticed. 
          This AI-assisted system accelerates the early stages of drug discovery by providing data-driven predictions 
          along with confidence scores, helping scientists focus on the most promising directions for further study.
        </Typography>
      </Box>

      {/* Disease Selection (Autocomplete) */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2, color: C.navy }}>
        <Typography fontWeight={600}>Diseases:</Typography>

        <Autocomplete
          sx={{
            minWidth: 300,
            "& .MuiOutlinedInput-root": {
              bgcolor: C.bg,
              color: "black",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: C.navy,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: C.sage,
              },
              "& .MuiSvgIcon-root": {
                color: C.navy,
              },
            },
            "& .MuiAutocomplete-listbox": {
              bgcolor: GRAD_H,
              color: C.navy,
              "& .MuiAutocomplete-option:hover": {
                backgroundColor: C.sage,
                color: C.light,
              },
            },
          }}
          
          options={diseases.map((d) => d.name)}
          value={selectedDisease || null}
          onChange={(event, newValue) => {
            setSelectedDisease(newValue || "");
          }}
          loading={loadingDiseases}
          clearOnEscape

          //FILTER FUNCTION
          filterOptions={(options, {inputValue}) => {
            const iv = (inputValue || "").toLowerCase();
            if(!iv) return options; //show full list when nothing typed
            return options.filter((option) => 
               String(option).toLowerCase().includes(iv)
            );
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
                    {loadingDiseases ? (
                      <CircularProgress color={C.navy} size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>

      {/* Main Content */}
      <Grid container spacing={2}>
        {/* Left Section: Targets & Drugs */}
        <Grid item xs={12} md={7}>
          {/* Targets Table */}
          <Box sx={{ mb: 3 }}>
            <Paper
              elevation={2}
              sx={{
                border: "0px solid #0225AA",
                borderRadius: 1,
                overflow : "hidden",
              }}
            >
              <Box
                sx={{
                  background: GRAD_H,
                  color: C.card,
                  p: 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontWeight={600} sx={{ width: "33%" }}>
                  Uniprot ID
                </Typography>
                <Typography
                  fontWeight={600}
                  sx={{ width: "33%", textAlign: "center" }}
                >
                  Target
                </Typography>
                <Typography
                  fontWeight={600}
                  sx={{ width: "33%", textAlign: "right" }}
                >
                  Score
                </Typography>
              </Box>

              <Box sx={{ p: 1.5 }}>
                {loadingTargets ? (
                  <Typography sx={{ p: 2, textAlign: "center", color: C.muted }}>
                    Loading targets...
                  </Typography>
                ) : targets.length > 0 ? (
                  targets.map((target, idx) => (
                    <Box
                      key={idx} 
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderBottom: "1px solid " + C.border,
                        background: C.card,
                        cursor: "pointer",
                        "&:hover": { bgcolor: C.sky},
                      }}
                    >
                      <Typography sx={{ width: "15%" }}>
                        {target.uniprot_id || "-"}
                      </Typography>
                      <Typography
                        sx={{ width: "60%", textAlign: "center" }}
                        fontWeight={500}
                        color="black"
                      >
                        {target.name || target.gene || target.protein || "-"}
                      </Typography>
                      <Typography
                        sx={{ width: "15%", textAlign: "right" }}
                        fontWeight={500}
                        color="black"
                      >
                        {(target.score || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ p: 2, textAlign: "center", color: C.muted }}>
                    No targets predicted
                  </Typography>
                )}
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Right Section: LLM & Articles */}
        <Grid item xs={12} md={5}>
          <Grid container direction="column" spacing={2}>
            {/* LLM Interpretation */}
            <Grid item>
              <Paper
                elevation={2}
                sx={{
                  border: "2px solid" + C.teal,
                  borderRadius: 2,
                  p: 2,
                  background: C.card,
                }}
              >
                <Typography
                  variant="h6"
                  color={C.navy}
                  fontWeight={600}
                  mb={1}
                >
                  Interpretation:
                </Typography>
                <Box
                  sx={{
                    minHeight: 150,
                    maxHeight: 250,
                    overflowY: "auto",
                    lineHeight: 1.6,
                  }}
                >
                  {loadingLLM ? (
                    <Typography color={C.muted} fontStyle="italic">
                      Loading interpretation...
                    </Typography>
                  ) : llmInterpretation ? (
                    <Typography>{llmInterpretation}</Typography>
                  ) : (
                    <Typography color={C.muted}>
                      Select a disease to see AI interpretation of the
                      predictions.
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Articles/Sources */}
            <Grid item>
              <Paper
                elevation={2}
                sx={{
                  border: "0px solid #2c5f7c",
                  borderRadius: 1,
                  overflow: "hidden",
                  background: C.card,
                }}
              >
                <Box
                  sx={{
                    background: GRAD_H,
                    color: "white",
                    p: 1.5,
                  }}
                >
                  <Typography fontWeight={600}>Articles/Sources</Typography>
                </Box>
                <Box sx={{ p: 2, maxHeight: 200, overflowY: "auto" }}>
                  {loadingArticles ? (
                    <Typography color={C.muted} fontStyle="italic">
                      Loading articles...
                    </Typography>
                  ) : articles.length > 0 ? (
                    articles.map((article, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          mb: 1,
                          pb: 1,
                          borderBottom:
                            idx < articles.length - 1
                              ? "1px solid #e0e0e0"
                              : "none",
                        }}
                      >
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: C.navy,
                            textDecoration: "none",
                            fontSize: "14px",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.textDecoration = "underline")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.textDecoration = "none")
                          }
                        >
                          {article.title}
                        </a>
                        {article.source && (
                          <Typography
                            component="span"
                            sx={{ ml: 1, color: C.muted, fontSize: 12 }}
                          >
                            ({article.source})
                          </Typography>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography color={C.muted} textAlign="center">
                      No articles available
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Graph Visualization Section */}
      <Box
        sx={{
          mt: 4,
          border: "0px solid" + C.teal,
          borderRadius: 1,
          overflow: "hidden",
          background: C.sky,
        }}
      >
        {/*----- TABS ----*/}
        <Box
          sx={{
            display: "flex",
            borderBottom: "0px solid #2c5f7c",
            background: GRAD }}
        >
          {["Sub-Graph", "Meta-Path"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                flex: 1,
                py: 1.5,
                fontWeight: activeTab === tab ? "bold" : 500,
                bgcolor: activeTab === tab ? C.card : "transparent",
                color: activeTab === tab ? C.navy : C.card,
                borderRadius: 0,
                "&:hover": {
                  bgcolor: activeTab === tab ? C.card: C.sky,
                  color: activeTab === tab ? C.navy : "black",
                },
              }}
            >
              {tab}
            </Button>
          ))}
        </Box>

        {/*---- Graph Content ----*/}
        <Box
          sx={{
            minHeight: 300,
            bgcolor: C.sky,
          }}
        >
          {renderGraphVisualization()}
        </Box>
      </Box>
    </Box>
  );
};

export default TxKG;