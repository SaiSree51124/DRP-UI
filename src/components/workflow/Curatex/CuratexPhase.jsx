import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import {
  AddOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import {
  FONT,
  TEAL,
  USER_MSG_BG,
  GRAY_BG,
  BORDER,
  TEXT_DARK,
  TEXT_MUTED,
} from "../workflowConstants";
import AgentHeader from "../AgentHeader";
import "./CuratexPhase.css";

// Default weight allocation per property — matches Figma "Target Product
// Profile - JAK2" card (weight-field values shown next to each row).
const DEFAULT_WEIGHTS = {
  indication: "15",
  moa: "10",
  route: "15",
  molecularWeight: "10",
  bioavailability: "20",
  halfLife: "15",
  logP: "10",
  solubility: "15",
  plasmaProteinBinding: "10",
};

// Match-detail breakdown shown when the first CurateX results row is
// expanded — mirrors the Figma "row-1-expanded" spec exactly (property,
// target criterion, arrow, matched source value, status icon).
const MATCH_DETAILS = [
  { label: "Molecular Weight", target: "< 500 Da", value: "129.16 Da", status: "match" },
  { label: "Bioavailability", target: "> 60%", value: "50-60%", status: "partial" },
  { label: "Route", target: "Oral", value: "Oral", status: "match" },
  { label: "Half-life", target: "8-12 hours", value: "6.2 hours", status: "match" },
  { label: "LogP", target: "1.5-3.5", value: "-1.43", status: "match" },
  { label: "Solubility", target: "> 10 mg/mL", value: "> 300 mg/mL", status: "match" },
];

const CuratexPhase = ({
  workflowPhase,
  setWorkflowPhase,
  chatMessages = [],
  profileData = {},
  setProfileData,
  profileEditMode,
  setProfileEditMode,
  curateXResults = [],
  setCurateXResults,
  selectedCompound,
  setSelectedCompound,
  setShowCompoundDetail,
  setActiveStep,
}) => {
  const activeCompound = selectedCompound || curateXResults?.[0];

  // Local state — weights per property, and the "Adding new parameter"
  // sub-state inside edit mode (Figma: field-row-new with Parameter
  // name.../Enter value or range... inputs + Save Changes/Cancel).
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [isAddingParameter, setIsAddingParameter] = useState(false);
  const [newParamName, setNewParamName] = useState("");
  const [newParamValue, setNewParamValue] = useState("");
  const [newParamWeight, setNewParamWeight] = useState("");
  const [expandedRow, setExpandedRow] = useState(0);

  const closeLegacyCompoundDetail = () => {
    if (typeof setShowCompoundDetail === "function") {
      setShowCompoundDetail(false);
    }
  };

  const handleViewDataSource = (compound) => {
    setSelectedCompound?.(compound);
    closeLegacyCompoundDetail();
    setWorkflowPhase("curatex-data-source");
  };

  const handleNextFromResults = () => {
    const compound = activeCompound || curateXResults?.[0];

    if (compound) {
      setSelectedCompound?.(compound);
    }

    closeLegacyCompoundDetail();
    setWorkflowPhase("curatex-compound-exploration");
  };

  const handleBackToResults = () => {
    closeLegacyCompoundDetail();
    setWorkflowPhase("curatex-results");
  };

  const handleNextFromCompoundExploration = () => {
    setWorkflowPhase("curatex-candidate-selection");
  };

  const handleViewInScreenSuite = () => {
    setActiveStep?.(3);
    setWorkflowPhase("screensuite-loading");
  };

  const handleAddParameterClick = () => {
    setIsAddingParameter(true);
  };

  const handleDeleteParameter = (key) => {
    if (!profileData || !setProfileData) return;
    const next = { ...profileData };
    delete next[key];
    setProfileData(next);
    setWeights((prev) => {
      const nextWeights = { ...prev };
      delete nextWeights[key];
      return nextWeights;
    });
  };

  const handleCancelEdit = () => {
    setIsAddingParameter(false);
    setNewParamName("");
    setNewParamValue("");
    setNewParamWeight("");
    setProfileEditMode?.(false);
  };

  const handleSaveChanges = () => {
    if (isAddingParameter && newParamName.trim() && newParamValue.trim()) {
      const key = newParamName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase());

      setProfileData?.({ ...profileData, [key]: newParamValue.trim() });
      setWeights((prev) => ({
        ...prev,
        [key]: newParamWeight.trim() || "10",
      }));
    }

    setIsAddingParameter(false);
    setNewParamName("");
    setNewParamValue("");
    setNewParamWeight("");
    setProfileEditMode?.(false);
  };

  const propertyLabel = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();

  // ---------------------------------------------------------------------------
  // CurateX Loading
  // ---------------------------------------------------------------------------
  if (workflowPhase === "curatex-loading") {
    const curatexQuery = "Generate a target candidate profile for JAK2";

    return (
      <Box className="curatex-page">
        <div className="curatex-user-row">
          <div className="curatex-user-bubble">
            <Typography className="curatex-user-name">
              DR. PRIYA (YOU)
            </Typography>

            <Typography className="curatex-user-text">
              {curatexQuery}
            </Typography>
          </div>
        </div>

        <div className="curatex-agent-card">
          <AgentHeader label="INOVAPATH CURATEX AGENT" />

          <Typography className="curatex-body-text curatex-loading-description">
            Searching for candidate compounds matching your JAK2 Target
            Profile...
          </Typography>

          <div className="curatex-progress-track">
            <div className="curatex-progress-fill" />
          </div>

          <div className="curatex-loading-steps">
            {[
              { label: "Analyzing target profile parameters...", state: "done" },
              { label: "Scanning compound databases...", state: "done" },
              { label: "Matching candidates against criteria...", state: "active" },
            ].map((step, index) => (
              <div className="curatex-loading-step" key={index}>
                {step.state === "done" ? (
                  <span className="curatex-step-dot curatex-step-dot--done">✓</span>
                ) : (
                  <span className="curatex-step-dot curatex-step-dot--active">
                    <span className="curatex-spinner" />
                  </span>
                )}

                <Typography
                  className={`curatex-loading-step-text ${
                    step.state === "done" ? "is-done" : "is-active"
                  }`}
                >
                  {step.label}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </Box>
    );
  }

  // ---------------------------------------------------------------------------
  // CurateX Target Product Profile (view / edit / add-parameter)
  // ---------------------------------------------------------------------------
  if (workflowPhase === "curatex-profile") {
    const subtitle = isAddingParameter
      ? "Adding new parameter — fill in the name and value below"
      : profileEditMode
      ? "Editing mode — modify values below, then save changes"
      : "Parameter added successfully. Review and submit to find matching candidates.";

    const showInputs = profileEditMode || isAddingParameter;

    return (
      <Box className="curatex-page">
        <div className="curatex-user-row">
          <div className="curatex-user-bubble">
            <Typography className="curatex-user-name">
              DR. PRIYA (YOU)
            </Typography>

            <Typography className="curatex-user-text">
              {profileEditMode || isAddingParameter
                ? "Please generate a Target Candidate Profile for JAK2."
                : "Generate a target candidate profile for JAK2."}
            </Typography>
          </div>
        </div>

        <div className="curatex-agent-card">
          <AgentHeader label="INOVAPATH CURATEX AGENT" />

          <Typography className="curatex-body-text curatex-profile-intro">
            I've generated a Target Product Profile for JAK2. Review and
            adjust the parameters below, then submit to find matching
            candidates.
          </Typography>

          <div className="curatex-profile-card">
            <Typography className="curatex-profile-title">
              Target Product Profile - JAK2
            </Typography>

            <Typography className="curatex-profile-subtitle">
              {subtitle}
            </Typography>

            <div className="curatex-profile-grid curatex-profile-grid-header">
              {["Property", "Target Criterion", "Weight"].map((header) => (
                <Typography
                  key={header}
                  className={`curatex-table-header-text ${
                    showInputs ? "is-edit" : ""
                  }`}
                >
                  {header}
                </Typography>
              ))}
              <span />
            </div>

            <div className="curatex-profile-grid">
              {Object.entries(profileData).map(([key, value]) => (
                <React.Fragment key={key}>
                  <Typography className="curatex-profile-property">
                    {propertyLabel(key)}
                  </Typography>

                  {profileEditMode ? (
                    <TextField
                      value={value}
                      onChange={(event) =>
                        setProfileData?.({
                          ...profileData,
                          [key]: event.target.value,
                        })
                      }
                      size="small"
                      fullWidth
                      className="curatex-profile-input"
                    />
                  ) : (
                    <Typography className="curatex-profile-value">
                      {value}
                    </Typography>
                  )}

                  <div className="curatex-weight-field">
                    <Typography className="curatex-profile-weight">
                      {weights[key] || "10"}%
                    </Typography>
                  </div>

                  <IconButton
                    size="small"
                    className="curatex-profile-delete"
                    onClick={() => handleDeleteParameter(key)}
                  >
                    <DeleteOutlineOutlined className="curatex-trash-icon" />
                  </IconButton>
                </React.Fragment>
              ))}

              {isAddingParameter && (
                <>
                  <TextField
                    value={newParamName}
                    onChange={(e) => setNewParamName(e.target.value)}
                    placeholder="Parameter name..."
                    size="small"
                    fullWidth
                    className="curatex-profile-input curatex-new-param-input"
                  />

                  <TextField
                    value={newParamValue}
                    onChange={(e) => setNewParamValue(e.target.value)}
                    placeholder="Enter value or range..."
                    size="small"
                    fullWidth
                    className="curatex-profile-input curatex-new-param-input"
                  />

                  <div className="curatex-weight-field curatex-weight-field--new">
                    <TextField
                      value={newParamWeight}
                      onChange={(e) => setNewParamWeight(e.target.value)}
                      placeholder="%"
                      size="small"
                      variant="standard"
                      className="curatex-new-weight-input"
                      InputProps={{ disableUnderline: true }}
                    />
                  </div>

                  <IconButton size="small" className="curatex-profile-delete">
                    <DeleteOutlineOutlined className="curatex-trash-icon" />
                  </IconButton>
                </>
              )}
            </div>

            {profileEditMode && !isAddingParameter && (
              <Button
                startIcon={<AddOutlined />}
                onClick={handleAddParameterClick}
                className="curatex-add-parameter"
              >
                Add Parameter
              </Button>
            )}
          </div>

          <div className="curatex-action-row">
            {profileEditMode || isAddingParameter ? (
              <>
                <Button
                  variant="contained"
                  onClick={handleSaveChanges}
                  className="curatex-primary-button"
                >
                  Save Changes
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleCancelEdit}
                  className="curatex-secondary-button"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    setCurateXResults?.([
                      { rank: 1, name: "Metformin", matchedProps: "MW, Bioavail, Route, Half-life, LogP", mismatchedProps: "Solubility", score: "93.5" },
                      { rank: 2, name: "Pioglitazone", matchedProps: "MW, Route, Half-life, LogP, Solubility", mismatchedProps: "Bioavail", score: "89.2" },
                      { rank: 3, name: "Canagliflozin", matchedProps: "MW, Route, Bioavail, LogP", mismatchedProps: "Half-life, Solubility", score: "85.7" },
                      { rank: 4, name: "Empagliflozin", matchedProps: "MW, Route, Bioavail, Half-life", mismatchedProps: "LogP, Solubility", score: "82.4" },
                      { rank: 5, name: "Liragluide", matchedProps: "MW, Bioavail, Half-life", mismatchedProps: "Route, LogP, Solubility", score: "78.1" },
                      { rank: 6, name: "Sitagliptin", matchedProps: "MW, Route, LogP, Solubility", mismatchedProps: "Bioavail, Half-life, Solubility", score: "74.6" },
                    ]);
                    setWorkflowPhase("curatex-results");
                  }}
                  className="curatex-primary-button"
                >
                  Submit Profile
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => setProfileEditMode?.(true)}
                  className="curatex-secondary-button curatex-edit-button"
                >
                  Edit Values
                </Button>
              </>
            )}
          </div>
        </div>
      </Box>
    );
  }

  // ---------------------------------------------------------------------------
  // CurateX Submitted / Scoring
  // ---------------------------------------------------------------------------
  if (workflowPhase === "curatex-submitted") {
    return (
      <Box className="curatex-page curatex-submitted-page">
        <div className="curatex-agent-card curatex-submitted-card">
          <AgentHeader label="INOVAPATH CURATEX AGENT" />
          <Typography className="curatex-body-text curatex-results-intro">
            Profile submitted. Scoring compounds against your JAK2 target product profile...
          </Typography>
          <div className="curatex-progress-track">
            <div className="curatex-progress-fill" />
          </div>
          <Typography className="curatex-loading-step-text is-active">
            Matching candidates against target criteria...
          </Typography>
        </div>
      </Box>
    );
  }

  // ---------------------------------------------------------------------------
  // CurateX Results
  // ---------------------------------------------------------------------------
  if (workflowPhase === "curatex-results") {
    return (
      <Box className="curatex-page">
        <div className="curatex-user-row">
          <div className="curatex-user-bubble">
            <Typography className="curatex-user-name">
              DR. PRIYA (YOU)
            </Typography>

            <Typography className="curatex-user-text">
              Submit Profile
            </Typography>
          </div>
        </div>

        <div className="curatex-agent-card curatex-results-card">
          <AgentHeader label="INOVAPATH CURATEX AGENT" />

          <Typography className="curatex-body-text curatex-results-intro">
            Profile submitted. Scoring 124 compounds against your JAK2 target
            product profile. Here are the top candidates:
          </Typography>

          <div className="curatex-results-table">
            <div className="curatex-results-header">
              <Typography className="curatex-results-header-cell">
                RANK
              </Typography>
              <Typography className="curatex-results-header-cell">
                COMPOUND
              </Typography>
              <Typography className="curatex-results-header-cell">
                MATCHED PROPERTIES
              </Typography>
              <Typography className="curatex-results-header-cell">
                MISMATCHED
              </Typography>
              <span />
            </div>

            {curateXResults.map((compound, index) => {
              const isExpanded = expandedRow === index;

              return (
                <React.Fragment key={compound.rank ?? compound.name ?? index}>
                  <div
                    className={`curatex-result-row ${
                      isExpanded ? "is-expanded" : ""
                    }`}
                    onClick={() => {
                      setSelectedCompound?.(compound);
                      setExpandedRow(isExpanded ? -1 : index);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        setSelectedCompound?.(compound);
                        setExpandedRow(isExpanded ? -1 : index);
                      }
                    }}
                  >
                    <Typography className="curatex-rank">
                      {compound.rank}
                    </Typography>

                    <Typography className="curatex-compound-name">
                      {compound.name}
                    </Typography>

                    <Typography className="curatex-matched-properties">
                      {compound.matchedProps}
                    </Typography>

                    <Typography className="curatex-mismatched-properties">
                      {compound.mismatchedProps}
                    </Typography>

                    <Typography className="curatex-row-chevron">
                      {isExpanded ? "⌃" : "›"}
                    </Typography>
                  </div>

                  {isExpanded && (
                    <div className="curatex-match-details">
                      <div className="curatex-match-details-heading">
                        <Typography className="curatex-match-details-title">
                          Match Details — {compound.name} vs JAK2 Target
                          Profile
                        </Typography>

                        <Button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleViewDataSource(compound);
                          }}
                          className="curatex-view-source-button"
                        >
                          View Data Source ↗
                        </Button>
                      </div>

                      <div className="curatex-match-detail-list">
                        {MATCH_DETAILS.map((detail) => (
                          <div className="curatex-match-detail-row" key={detail.label}>
                            <Typography className="curatex-match-detail-label">
                              {detail.label}
                            </Typography>
                            <Typography className="curatex-match-detail-target">
                              {detail.target}
                            </Typography>
                            <Typography className="curatex-match-detail-arrow">
                              →
                            </Typography>
                            <Typography className="curatex-match-detail-value">
                              {detail.value}
                            </Typography>
                            <Typography
                              className={`curatex-match-detail-status ${
                                detail.status === "partial" ? "is-partial" : "is-match"
                              }`}
                            >
                              {detail.status === "partial" ? "~" : "✓"}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="curatex-pagination">
            <button type="button" className="curatex-page-button disabled">
              ‹
            </button>
            <button type="button" className="curatex-page-button active">
              1
            </button>
            <button type="button" className="curatex-page-button">2</button>
            <button type="button" className="curatex-page-button">3</button>
            <button type="button" className="curatex-page-button">…</button>
            <button type="button" className="curatex-page-button">12</button>
            <button type="button" className="curatex-page-button">›</button>

            <Typography className="curatex-pagination-text">
              Showing 1-6 of 124 compounds
            </Typography>
          </div>

          <div className="curatex-recommendation-card">
            <Typography className="curatex-recommendation-title">
              Recommendation
            </Typography>

            <Typography className="curatex-recommendation-text">
              Metformin and Pioglitazone are the strongest candidates. Both
              match on molecular weight, route of administration, and
              half-life. Metformin scores highest due to superior
              bioavailability alignment. Recommend carrying both forward to
              screening.
            </Typography>
          </div>

          <div className="curatex-results-actions">
            <Button
              variant="outlined"
              className="curatex-secondary-button"
            >
              Branch
            </Button>

            <Button
              variant="outlined"
              className="curatex-secondary-button"
            >
              Rerun
            </Button>

            <Button
              variant="contained"
              onClick={handleNextFromResults}
              className="curatex-primary-button curatex-next-button"
            >
              Next
            </Button>
          </div>
        </div>
      </Box>
    );
  }

  // ---------------------------------------------------------------------------
  // Data Source Screen
  // ---------------------------------------------------------------------------
  if (workflowPhase === "curatex-data-source") {
    const compound = activeCompound;

    return (
      <Box className="curatex-data-source-page">
        <Button
          onClick={handleBackToResults}
          className="curatex-back-link"
        >
          ← Back to Results
        </Button>

        <Typography className="curatex-data-source-title">
          Data Source: {compound?.name || "Metformin"} — JAK2 Match
        </Typography>

        <div className="curatex-source-summary-card">
          <SourceSummary
            label="Compound Name"
            value={compound?.name || "Metformin"}
            accent
          />

          <SourceSummary label="CAS Number" value="657-24-9" />

          <SourceSummary label="Molecular Formula" value="C₄H₁₁N₅" />

          <SourceSummary label="DrugBank ID" value="DB00331" />

          <div className="curatex-source-summary-field">
            <Typography className="curatex-source-label">
              Overall Match Score
            </Typography>

            <div className="curatex-score-badge">94%</div>
          </div>
        </div>

        <Typography className="curatex-source-section-title">
          Source Data Comparison
        </Typography>

        <div className="curatex-source-table">
          <SourceTableHeader />

          <SourceRow
            parameter="Molecular Weight"
            target="< 500 Da"
            value="129.16 Da"
            source="DrugBank"
            status="✓ Match"
            statusType="match"
            confidence="High"
          />

          <SourceRow
            parameter="Bioavailability"
            target="> 60%"
            value="50-60%"
            source="FDA Label"
            status="⚠ Partial"
            statusType="partial"
            confidence="Medium"
          />

          <SourceRow
            parameter="Half-life"
            target="8-12 hours"
            value="6.2 hours"
            source="PubChem"
            status="✕ Mismatch"
            statusType="mismatch"
            confidence="High"
          />

          <SourceRow
            parameter="LogP"
            target="1.5-3.5"
            value="-1.43"
            source="ChEMBL"
            status="✕ Mismatch"
            statusType="mismatch"
            confidence="High"
          />

          <SourceRow
            parameter="Solubility"
            target="> 10 mg/mL"
            value=">300 mg/mL"
            source="DrugBank"
            status="✓ Match"
            statusType="match"
            confidence="High"
          />

          <SourceRow
            parameter="Route of Administration"
            target="Oral"
            value="Oral"
            source="FDA Label"
            status="✓ Match"
            statusType="match"
            confidence="High"
          />

          <SourceRow
            parameter="Mechanism of Action"
            target="JAK2 Inhibition"
            value="AMPK Activation"
            source="PubMed"
            status="⚠ Partial"
            statusType="partial"
            confidence="Medium"
          />

          <SourceRow
            parameter="Indication"
            target="Type 2 Diabetes"
            value="Type 2 Diabetes"
            source="DailyMed"
            status="✓ Match"
            statusType="match"
            confidence="High"
          />

          <SourceRow
            parameter="Plasma Protein Binding"
            target="< 90%"
            value="Negligible"
            source="DrugBank"
            status="✓ Match"
            statusType="match"
            confidence="High"
          />
        </div>

        <Typography className="curatex-source-section-title">
          Source References
        </Typography>

        <div className="curatex-source-references">
          <SourceReference
            number="1"
            title="DrugBank (DB00331)"
            updated="Last updated: Jan 2024"
            url="drugbank.ca/drugs/DB00331"
          />

          <SourceReference
            number="2"
            title="PubChem (CID 4091)"
            updated="Last updated: Mar 2024"
            url="pubchem.ncbi.nlm.nih.gov"
          />

          <SourceReference
            number="3"
            title="ChEMBL (CHEMBL1431)"
            updated="Last updated: Feb 2024"
            url="ebi.ac.uk/chembl"
          />

          <SourceReference
            number="4"
            title="FDA Label"
            updated="Approval: 1995"
            url="accessdata.fda.gov"
          />

          <SourceReference
            number="5"
            title="PubMed"
            updated="3 relevant articles cited"
            url="pubmed.ncbi.nlm.nih.gov"
          />
        </div>
      </Box>
    );
  }

  // ---------------------------------------------------------------------------
  // Compound Exploration Screen
  // ---------------------------------------------------------------------------
  if (workflowPhase === "curatex-compound-exploration") {
    const compound = activeCompound;

    return (
      <Box className="curatex-page curatex-exploration-page">
        <div className="curatex-user-row">
          <div className="curatex-user-bubble curatex-user-bubble--wide">
            <Typography className="curatex-user-name">
              DR. PRIYA (YOU)
            </Typography>

            <Typography className="curatex-user-text">
              Tell me more about {compound?.name || "Metformin"} - mechanism
              of action, current uses, and patent status.
            </Typography>
          </div>
        </div>

        <div className="curatex-agent-card curatex-exploration-card">
          <AgentHeader label="INOVAPATH CURATEX AGENT" />

          <Typography className="curatex-body-text curatex-exploration-intro">
            Here is the detailed compound profile for{" "}
            {compound?.name || "Metformin"}:
          </Typography>

          <div className="curatex-compound-detail-card">
            <Typography className="curatex-compound-detail-title">
              {compound?.name || "Metformin"} - Compound Detail
            </Typography>

            <Typography className="curatex-compound-detail-subtitle">
              Summary of mechanism, clinical use, and IP status.
            </Typography>

            <CompoundSection
              title="Mechanism of Action"
              text="Metformin activates AMP-activated protein kinase (AMPK), reducing hepatic glucose production and improving insulin sensitivity. In the context of JAK2 inhibition, recent studies suggest Metformin may modulate JAK-STAT signaling indirectly through AMPK activation."
            />

            <CompoundSection
              title="Current Uses"
              text="First-line therapy for Type 2 Diabetes. Also used off-label for PCOS, weight management, and under investigation for anti-aging and oncology applications."
            />

            <CompoundSection
              title="Patent Status"
              text="Original patents expired. Generic formulations widely available. Novel formulations and combination therapies may carry active IP - 3 relevant patents identified by NovSearch."
            />

            <CompoundSection
              title="Match Score"
              text="94% - Strong alignment on 5 of 6 target profile properties."
              last
            />
          </div>

          <Typography className="curatex-source-note">
            Source: PubMed, DrugBank, USPTO via NovSearch
          </Typography>

          <div className="curatex-exploration-actions">
            <Button
              variant="outlined"
              onClick={handleBackToResults}
              className="curatex-secondary-button"
            >
              Back to Results
            </Button>

            <Button
              variant="contained"
              onClick={handleNextFromCompoundExploration}
              className="curatex-primary-button"
            >
              Next
            </Button>
          </div>
        </div>
      </Box>
    );
  }

  // ---------------------------------------------------------------------------
  // Candidate Selection Screen
  // ---------------------------------------------------------------------------
  if (workflowPhase === "curatex-candidate-selection") {
    return (
      <Box className="curatex-page curatex-candidate-page">
        <div className="curatex-agent-card curatex-candidate-question-card">
          <AgentHeader label="INOVAPATH CURATEX AGENT" />

          <Typography className="curatex-body-text curatex-candidate-question">
            Would you like to select specific candidates for screening, or
            should I proceed with the top-ranked compounds (Metformin and
            Pioglitazone) automatically?
          </Typography>
        </div>

        <div className="curatex-user-row">
          <div className="curatex-user-bubble curatex-user-bubble--wide">
            <Typography className="curatex-user-name">
              DR. PRIYA (YOU)
            </Typography>

            <Typography className="curatex-user-text">
              Go with the top two - Metformin and Pioglitazone. Send them to
              ScreenSuite for docking.
            </Typography>
          </div>
        </div>

        <div className="curatex-agent-card curatex-candidate-card">
          <AgentHeader label="INOVAPATH CURATEX AGENT" />

          <Typography className="curatex-body-text curatex-candidate-intro">
            Selected candidates forwarded to ScreenSuite for molecular
            docking:
          </Typography>

          {["Metformin", "Pioglitazone"].map((compoundName) => (
            <div className="curatex-candidate-compound" key={compoundName}>
              <Typography className="curatex-candidate-name">
                {compoundName}
              </Typography>

              <Typography className="curatex-candidate-target">
                Target: JAK2
              </Typography>
            </div>
          ))}

          <Typography className="curatex-candidate-status">
            ScreenSuite is now running PLP docking simulations. Estimated
            completion: ~5 minutes.
          </Typography>

          <div className="curatex-candidate-actions">
            <Button
              variant="contained"
              onClick={handleViewInScreenSuite}
              className="curatex-primary-button"
            >
              View in ScreenSuite
            </Button>

            <Button
              variant="outlined"
              onClick={handleBackToResults}
              className="curatex-secondary-button"
            >
              Back to Results
            </Button>
          </div>
        </div>
      </Box>
    );
  }

  return null;
};

// -----------------------------------------------------------------------------
// Reusable components
// -----------------------------------------------------------------------------

const SourceSummary = ({ label, value, accent = false }) => (
  <div className="curatex-source-summary-field">
    <Typography className="curatex-source-label">{label}</Typography>

    <Typography
      className={`curatex-source-summary-value ${
        accent ? "is-accent" : ""
      }`}
    >
      {value}
    </Typography>
  </div>
);

const SourceTableHeader = () => (
  <div className="curatex-source-table-header">
    {[
      "PARAMETER",
      "TARGET CRITERION",
      "SOURCE VALUE",
      "SOURCE",
      "MATCH STATUS",
      "CONFIDENCE",
    ].map((header) => (
      <Typography key={header} className="curatex-source-table-header-cell">
        {header}
      </Typography>
    ))}
  </div>
);

const SourceRow = ({
  parameter,
  target,
  value,
  source,
  status,
  statusType,
  confidence,
}) => (
  <div className="curatex-source-table-row">
    <Typography className="curatex-source-cell strong">
      {parameter}
    </Typography>

    <Typography className="curatex-source-cell">{target}</Typography>

    <Typography className="curatex-source-cell strong">
      {value}
    </Typography>

    <Typography className="curatex-source-cell">{source}</Typography>

    <div>
      <span
        className={`curatex-status-badge curatex-status-${statusType}`}
      >
        {status}
      </span>
    </div>

    <div>
      <span
        className={`curatex-confidence-badge ${
          confidence === "High" ? "is-high" : "is-medium"
        }`}
      >
        {confidence}
      </span>
    </div>
  </div>
);

const SourceReference = ({ number, title, updated, url }) => (
  <div className="curatex-source-reference">
    <div className="curatex-source-reference-left">
      <div className="curatex-source-reference-number">{number}</div>

      <div>
        <Typography className="curatex-source-reference-title">
          {title}
        </Typography>

        <Typography className="curatex-source-reference-updated">
          {updated}
        </Typography>
      </div>
    </div>

    <Typography className="curatex-source-reference-url">{url}</Typography>
  </div>
);

const CompoundSection = ({ title, text, last = false }) => (
  <div className={`curatex-compound-section ${last ? "is-last" : ""}`}>
    <Typography className="curatex-compound-section-title">
      {title}
    </Typography>

    <Typography className="curatex-compound-section-text">
      {text}
    </Typography>
  </div>
);

export default CuratexPhase;