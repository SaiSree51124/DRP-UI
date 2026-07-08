import React from "react";
import { Alert, Typography, Fade } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { C } from "../../utils/colors";
import PipelineProgress from "./PipelineProgress";

const AgentStatusAlerts = ({ agentRunning, pipelineStep, agentDone, patentsCount }) => (
  <>
    {agentRunning && (
      <Fade in>
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2, borderLeft: "4px solid" + C.teal }}>
          <Typography variant="body2" fontWeight={600}>
            Agent is autonomously analysing patents…
          </Typography>
          <PipelineProgress active={agentRunning} currentStep={pipelineStep} />
        </Alert>
      </Fade>
    )}

    {agentDone && !agentRunning && (
      <Fade in>
        <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 3, borderRadius: 2, borderLeft: "4px solid" + C.sage }}>
          <Typography variant="body2" fontWeight={600}>
            Analysis complete — {patentsCount} patent{patentsCount !== 1 ? "s" : ""} analysed.
            Ask follow-up questions below.
          </Typography>
        </Alert>
      </Fade>
    )}
  </>
);

export default AgentStatusAlerts;
