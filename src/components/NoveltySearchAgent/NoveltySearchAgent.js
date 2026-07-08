import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_CONFIG from "../../apiconfig";
import { Box, Grid } from "@mui/material";
import { C } from "../../utils/colors";
import { PIPELINE_STEPS } from "./PipelineProgress";

import AgentHeader from "./AgentHeader";
import RunAgentForm from "./RunAgentForm";
import AgentStatusAlerts from "./AgentStatusAlerts";
import PatentListPanel from "./PatentListPanel";
import ChatPanel from "./ChatPanel";

const NoveltySearchAgent = () => {
  const { BASE_URL, PORT1 } = API_CONFIG;

  const [agentRunning, setAgentRunning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [patents, setPatents] = useState([]);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);
  const [agentDone, setAgentDone] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, answerLoading, agentRunning]);

  useEffect(() => {
    if (!agentRunning) { setPipelineStep(0); return; }
    const id = setInterval(() => {
      setPipelineStep((s) => (s < PIPELINE_STEPS.length - 1 ? s + 1 : s));
    }, 5000);
    return () => clearInterval(id);
  }, [agentRunning]);

  const formik = useFormik({
    initialValues: { searchQuery: "", numResults: "" },
    validationSchema: Yup.object({
      searchQuery: Yup.string().required("Required"),
      numResults: Yup.number().min(1).max(20).required("Required"),
    }),
    onSubmit: (values) => handleRunAgent(values),
  });

  const handleRunAgent = async (values) => {
    setAgentRunning(true);
    setPipelineStep(0);
    setPatents([]);
    setSelectedPatent(null);
    setChatHistory([]);
    setAgentDone(false);

    setChatHistory([{ role: "user", content: values.searchQuery, timestamp: new Date().toISOString() }]);

    try {
      const { data } = await axios.post(
        `${BASE_URL}:${PORT1}/api/v1/agent/run`,
        null,
        { params: { user_query: values.searchQuery, num_results: values.numResults } }
      );

      const patentsUsed = data.patents_used || [];
      setPatents(patentsUsed);
      if (patentsUsed.length > 0) setSelectedPatent(patentsUsed[0]);
      setAgentDone(true);

      setChatHistory((prev) => [...prev, {
        role: "assistant",
        content: data.agent_answer,
        recommendations: data.recommendations,
        pipeline_steps: data.pipeline_steps,
        mode: "agent_run",
        timestamp: new Date().toISOString(),
      }]);

      toast.success(`Analysis complete — ${patentsUsed.length} patent${patentsUsed.length !== 1 ? "s" : ""} analysed`, { autoClose: 4000 });
    } catch (err) {
      console.error("Agent run error:", err);
      const detail = err.response?.data?.detail || "Agent run failed. Please try again.";
      toast.error(detail);
      setChatHistory((prev) => [...prev, { role: "assistant", content: `The agent encountered an error: ${detail}`, timestamp: new Date().toISOString() }]);
    } finally {
      setAgentRunning(false);
    }
  };

  const handleAskSingle = async () => {
    if (!currentQuery.trim()) { toast.warning("Please enter a question"); return; }
    if (!selectedPatent?.PatentID) { toast.warning("Select a patent from the list first"); return; }
    if (!agentDone) { toast.warning("Run the agent first"); return; }

    setAnswerLoading(true);
    setChatHistory((prev) => [...prev, { role: "user", content: `[${selectedPatent.PatentID}] ${currentQuery}`, timestamp: new Date().toISOString() }]);

    try {
      const { data } = await axios.get(
        `${BASE_URL}:${PORT1}/api/v1/agent/ask`,
        { params: { query: currentQuery, patent_id: selectedPatent.PatentID } }
      );
      setChatHistory((prev) => [...prev, { role: "assistant", content: data.answer, mode: "single_patent", timestamp: new Date().toISOString() }]);
      setCurrentQuery("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to get answer.");
    } finally {
      setAnswerLoading(false);
    }
  };

  const handleAskAll = async () => {
    if (!currentQuery.trim()) { toast.warning("Please enter a question"); return; }
    if (!agentDone) { toast.warning("Run the agent first"); return; }

    setAnswerLoading(true);
    setChatHistory((prev) => [...prev, { role: "user", content: `[All Patents] ${currentQuery}`, timestamp: new Date().toISOString() }]);

    try {
      const { data } = await axios.get(
        `${BASE_URL}:${PORT1}/api/v1/agent/ask_all`,
        { params: { query: currentQuery } }
      );
      setChatHistory((prev) => [...prev, { role: "assistant", content: data.answer, patents_analyzed: data.patents_analyzed, mode: "multi_patent", timestamp: new Date().toISOString() }]);
      setCurrentQuery("");
      toast.info(`Synthesised across ${data.patents_analyzed?.length || 0} patents`, { autoClose: 3000 });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to get answer.");
    } finally {
      setAnswerLoading(false);
    }
  };

  const handleReset = () => {
    setAgentRunning(false);
    setPatents([]);
    setSelectedPatent(null);
    setChatHistory([]);
    setAgentDone(false);
    setPipelineStep(0);
    setCurrentQuery("");
    formik.resetForm();
    toast.success("Session reset");
  };

  return (
    <Box sx={{ p: 2, background: C.bg, minHeight: "100vh" }}>
      <AgentHeader />

      <RunAgentForm formik={formik} agentRunning={agentRunning} />

      <AgentStatusAlerts
        agentRunning={agentRunning}
        pipelineStep={pipelineStep}
        agentDone={agentDone}
        patentsCount={patents.length}
      />

      {(patents.length > 0 || chatHistory.length > 0) && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <PatentListPanel
              patents={patents}
              selectedPatent={selectedPatent}
              onSelectPatent={setSelectedPatent}
              onReset={handleReset}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <ChatPanel
              chatHistory={chatHistory}
              answerLoading={answerLoading}
              currentQuery={currentQuery}
              setCurrentQuery={setCurrentQuery}
              handleAskSingle={handleAskSingle}
              handleAskAll={handleAskAll}
              selectedPatent={selectedPatent}
              agentDone={agentDone}
              chatEndRef={chatEndRef}
            />
          </Grid>
        </Grid>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default NoveltySearchAgent;
