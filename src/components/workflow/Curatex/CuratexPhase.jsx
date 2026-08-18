import React, { useMemo, useState } from "react";
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

/* ============================================================================
   DEFAULT PROFILE WEIGHTS
   Figma values:
   Indication              15%
   Mechanism of Action     10%
   Route of Administration 15%
   Molecular Weight        10%
   Bioavailability         20%
   Half-life               15%
   LogP                    10%
   Solubility              15%
============================================================================ */

const DEFAULT_WEIGHTS = {
  indication: "15%",
  mechanismOfAction: "10%",
  routeOfAdministration: "15%",
  molecularWeight: "10%",
  bioavailability: "20%",
  halfLife: "15%",
  logP: "10%",
  solubility: "15%",
};

const PROPERTY_LABELS = {
  indication: "Indication",
  mechanismOfAction: "Mechanism of Action",
  routeOfAdministration: "Route of Administration",
  molecularWeight: "Molecular Weight",
  bioavailability: "Bioavailability",
  halfLife: "Half-life",
  logP: "LogP",
  solubility: "Solubility",
};

/* ============================================================================
   DEFAULT COMPOUND DATA
============================================================================ */

const DEFAULT_COMPOUNDS = [
  {
    rank: 1,
    name: "Metformin",
    matchedProps: "MW, Bioavail, Route, Half-life, LogP",
    mismatchedProps: "Solubility",
    target: "JAK2",
    score: "94%",
    detail: {
      molecularWeight: "129.16 Da",
      bioavailability: "50–60%",
      route: "Oral",
      halfLife: "6.2 hours",
      logP: "-1.43",
      solubility: "> 300 mg/mL",
    },
  },
  {
    rank: 2,
    name: "Pioglitazone",
    matchedProps: "MW, Route, Half-life, LogP, Solubility",
    mismatchedProps: "Bioavailability",
    target: "JAK2",
    score: "91%",
    detail: {
      molecularWeight: "356.44 Da",
      bioavailability: "80%",
      route: "Oral",
      halfLife: "3–7 hours",
      logP: "2.3",
      solubility: "Low",
    },
  },
  {
    rank: 3,
    name: "Canagliflozin",
    matchedProps: "MW, Route, Bioavail, LogP",
    mismatchedProps: "Half-life, Solubility",
    target: "JAK2",
    score: "87%",
  },
  {
    rank: 4,
    name: "Empagliflozin",
    matchedProps: "MW, Route, Bioavail, Half-life",
    mismatchedProps: "LogP, Solubility",
    target: "JAK2",
    score: "84%",
  },
  {
    rank: 5,
    name: "Liraglutide",
    matchedProps: "MW, Bioavail, Half-life",
    mismatchedProps: "Route, LogP, Solubility",
    target: "JAK2",
    score: "78%",
  },
  {
    rank: 6,
    name: "Sitagliptin",
    matchedProps: "MW, Route, LogP",
    mismatchedProps: "Bioavail, Half-life, Solubility",
    target: "JAK2",
    score: "74%",
  },
];

/* ============================================================================
   SHARED STYLES
============================================================================ */

const buttonStyle = {
  minHeight: "34px",
  height: "34px",
  px: "16px",
  borderRadius: "8px",
  fontFamily: FONT,
  fontSize: "13px",
  fontWeight: 500,
  textTransform: "none",
  borderColor: BORDER,
  color: TEXT_DARK,
  boxShadow: "none",
  whiteSpace: "nowrap",

  "&:hover": {
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    boxShadow: "none",
  },
};

const primaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: TEAL,
  color: "#FFFFFF",
  borderColor: TEAL,
  fontWeight: 600,

  "&:hover": {
    backgroundColor: "#00A7BC",
    borderColor: "#00A7BC",
  },
};

/* ============================================================================
   HELPERS
============================================================================ */

const prettifyPropertyName = (key) => {
  if (PROPERTY_LABELS[key]) {
    return PROPERTY_LABELS[key];
  }

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

const normalizeProfileRows = (profileData = {}) => {
  return Object.entries(profileData).map(([key, value]) => ({
    id: `${key}-${Math.random().toString(36).slice(2, 9)}`,
    key,
    property: PROPERTY_LABELS[key] || prettifyPropertyName(key),
    criterion: value ?? "",
    weight: DEFAULT_WEIGHTS[key] || "10%",
  }));
};

/* ============================================================================
   USER MESSAGE
============================================================================ */

const UserMessage = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      width: "100%",
      px: 0,
      py: "8px",
      boxSizing: "border-box",
    }}
  >
    <Box
      sx={{
        maxWidth: "548px",
        minWidth: "280px",
        backgroundColor: USER_MSG_BG,
        border: "1px solid rgba(226,232,240,0.3)",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
        borderRadius: "12px",
        p: "16px",
      }}
    >
      <Typography
        sx={{
          fontFamily: FONT,
          fontSize: "11px",
          lineHeight: "13px",
          fontWeight: 700,
          color: TEAL,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          mb: "8px",
        }}
      >
        DR. PRIYA (YOU)
      </Typography>

      <Typography
        sx={{
          fontFamily: FONT,
          fontSize: "15px",
          lineHeight: "22px",
          fontWeight: 400,
          color: TEXT_DARK,
        }}
      >
        {children}
      </Typography>
    </Box>
  </Box>
);

/* ============================================================================
   PROFILE ROW
============================================================================ */

const ProfileRow = ({
  row,
  editMode,
  onChangeProperty,
  onChangeCriterion,
  onChangeWeight,
  onDelete,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "220px minmax(250px, 400px) 70px 28px",
        columnGap: "8px",
        alignItems: "center",
        minHeight: "28px",
        width: "100%",

        "@media (max-width: 800px)": {
          gridTemplateColumns: "1fr",
          rowGap: "6px",
          py: "8px",
          borderBottom: `1px solid ${BORDER}`,
        },
      }}
    >
      {/* Property */}
      {editMode ? (
        <TextField
          value={row.property}
          onChange={(event) =>
            onChangeProperty(row.id, event.target.value)
          }
          size="small"
          placeholder="Parameter name..."
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "32px",
              fontFamily: FONT,
              fontSize: "12px",
              borderRadius: "5px",

              "& fieldset": {
                borderColor: "#7DD3FC",
              },

              "&:hover fieldset": {
                borderColor: "#38BDF8",
              },
            },

            "& input": {
              padding: "7px 9px",
            },
          }}
        />
      ) : (
        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "13px",
            lineHeight: "16px",
            fontWeight: 600,
            color: "#374151",
          }}
        >
          {row.property}
        </Typography>
      )}

      {/* Target Criterion */}
      {editMode ? (
        <TextField
          value={row.criterion}
          onChange={(event) =>
            onChangeCriterion(row.id, event.target.value)
          }
          size="small"
          placeholder="Enter value or range..."
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "32px",
              fontFamily: FONT,
              fontSize: "12px",
              borderRadius: "5px",

              "& fieldset": {
                borderColor: "#7DD3FC",
              },

              "&:hover fieldset": {
                borderColor: "#38BDF8",
              },
            },

            "& input": {
              padding: "7px 9px",
            },
          }}
        />
      ) : (
        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "13px",
            lineHeight: "16px",
            color: "#111827",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {row.criterion}
        </Typography>
      )}

      {/* Weight */}
      {editMode ? (
        <TextField
          value={row.weight}
          onChange={(event) =>
            onChangeWeight(row.id, event.target.value)
          }
          size="small"
          placeholder="%"
          sx={{
            width: "70px",

            "& .MuiOutlinedInput-root": {
              height: "32px",
              fontFamily: FONT,
              fontSize: "12px",
              borderRadius: "6px",

              "& fieldset": {
                borderColor: "#E2E8F0",
              },
            },

            "& input": {
              padding: "7px 8px",
              textAlign: "center",
            },
          }}
        />
      ) : (
        <Box
          sx={{
            width: "70px",
            height: "28px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${BORDER}`,
            borderRadius: "6px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT,
              fontSize: "13px",
              lineHeight: "16px",
              color: "#262E38",
            }}
          >
            {row.weight}
          </Typography>
        </Box>
      )}

      {/* Delete */}
      {editMode ? (
        <IconButton
          size="small"
          onClick={() => onDelete(row.id)}
          aria-label={`Delete ${row.property}`}
          sx={{
            width: "28px",
            height: "28px",
            color: "#94A3B8",

            "&:hover": {
              color: "#EF4444",
              backgroundColor: "#FEF2F2",
            },
          }}
        >
          <DeleteOutlineOutlined sx={{ fontSize: 17 }} />
        </IconButton>
      ) : (
        <Box sx={{ width: "28px" }} />
      )}
    </Box>
  );
};

/* ============================================================================
   PROFILE CARD
============================================================================ */

const TargetProfileCard = ({
  rows,
  editMode,
  onAddParameter,
  onDelete,
  onChangeProperty,
  onChangeCriterion,
  onChangeWeight,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
        border: `1px solid ${BORDER}`,
        borderRadius: "12px",
        p: "20px",
      }}
    >
      <Typography
        sx={{
          fontFamily: FONT,
          fontSize: "16px",
          lineHeight: "19px",
          fontWeight: 700,
          color: "#111827",
          mb: "4px",
        }}
      >
        Target Product Profile - JAK2
      </Typography>

      <Typography
        sx={{
          fontFamily: FONT,
          fontSize: "13px",
          lineHeight: "16px",
          color: TEXT_MUTED,
          mb: "18px",
        }}
      >
        {editMode
          ? "Editing mode — modify values below, then save changes"
          : "Parameter added successfully. Review and submit to find matching candidates."}
      </Typography>

      {/* Header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "220px minmax(250px, 400px) 70px 28px",
          columnGap: "8px",
          alignItems: "center",
          mb: "8px",

          "@media (max-width: 800px)": {
            display: "none",
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "13px",
            lineHeight: "16px",
            fontWeight: 800,
            color: "#404752",
          }}
        >
          Property
        </Typography>

        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "13px",
            lineHeight: "16px",
            fontWeight: 800,
            color: "#404752",
          }}
        >
          Target Criterion
        </Typography>

        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "13px",
            lineHeight: "16px",
            fontWeight: 800,
            color: "#404752",
          }}
        >
          Weight
        </Typography>
      </Box>

      {/* Rows */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {rows.map((row) => (
          <ProfileRow
            key={row.id}
            row={row}
            editMode={editMode}
            onChangeProperty={onChangeProperty}
            onChangeCriterion={onChangeCriterion}
            onChangeWeight={onChangeWeight}
            onDelete={onDelete}
          />
        ))}
      </Box>

      {/* Add parameter */}
      {editMode && (
        <Button
          startIcon={<AddOutlined />}
          onClick={onAddParameter}
          sx={{
            minHeight: "32px",
            mt: "10px",
            px: 0,
            fontFamily: FONT,
            fontSize: "13px",
            fontWeight: 500,
            color: TEAL,
            textTransform: "none",

            "&:hover": {
              backgroundColor: "transparent",
            },

            "& .MuiButton-startIcon": {
              marginRight: "2px",
            },
          }}
        >
          Add Parameter
        </Button>
      )}
    </Box>
  );
};

/* ============================================================================
   PROFILE SCREEN
============================================================================ */

const ProfileScreen = ({
  profileRows,
  editMode,
  onEdit,
  onSave,
  onCancel,
  onSubmit,
  onAddParameter,
  onDelete,
  onChangeProperty,
  onChangeCriterion,
  onChangeWeight,
}) => {
  return (
    <>
      <UserMessage>
        {editMode
          ? "Please generate a Target Candidate Profile for JAK2."
          : "Please generate a Target Candidate Profile for JAK2."}
      </UserMessage>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          border: `1px solid ${BORDER}`,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
          borderRadius: "16px",
          p: "16px",
          boxSizing: "border-box",
        }}
      >
        <AgentHeader label="INOVAPATH CURATEX AGENT" />

        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "15px",
            lineHeight: "22px",
            color: TEXT_DARK,
            mt: "12px",
            mb: "12px",
          }}
        >
          I've generated a Target Product Profile for JAK2. Review and adjust
          the parameters below, then submit to find matching candidates.
        </Typography>

        <TargetProfileCard
          rows={profileRows}
          editMode={editMode}
          onAddParameter={onAddParameter}
          onDelete={onDelete}
          onChangeProperty={onChangeProperty}
          onChangeCriterion={onChangeCriterion}
          onChangeWeight={onChangeWeight}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            mt: "12px",
            flexWrap: "wrap",
          }}
        >
          {editMode ? (
            <>
              <Button
                variant="contained"
                onClick={onSave}
                sx={primaryButtonStyle}
              >
                Save Changes
              </Button>

              <Button
                variant="outlined"
                onClick={onCancel}
                sx={buttonStyle}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                onClick={onSubmit}
                sx={primaryButtonStyle}
              >
                Submit Profile
              </Button>

              <Button
                variant="outlined"
                onClick={onEdit}
                sx={{
                  ...buttonStyle,
                  color: "#404754",
                }}
              >
                Edit Values
              </Button>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

/* ============================================================================
   RESULTS SCREEN
============================================================================ */

const ResultsScreen = ({
  compounds,
  onCompoundClick,
  onNext,
}) => {
  return (
    <>
      <UserMessage>Submit Profile</UserMessage>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          border: `1px solid ${BORDER}`,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
          borderRadius: "12px",
          p: "16px",
          boxSizing: "border-box",
        }}
      >
        <AgentHeader label="INOVAPATH CURATEX AGENT" />

        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "15px",
            lineHeight: "22px",
            color: TEXT_DARK,
            mt: "12px",
            mb: "16px",
          }}
        >
          Profile submitted. Scoring 124 compounds against your JAK2 target
          product profile. Here are the top candidates:
        </Typography>

        {/* Results table */}
        <Box
          sx={{
            width: "100%",
            border: `1px solid ${BORDER}`,
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 2fr 1fr 24px",
              gap: "16px",
              px: "16px",
              py: "12px",
              backgroundColor: "#F8FAFC",
              borderBottom: `1px solid ${BORDER}`,

              "@media (max-width: 800px)": {
                gridTemplateColumns: "45px 1fr 1fr",
              },
            }}
          >
            {["RANK", "COMPOUND", "MATCHED PROPERTIES", "MISMATCHED"].map(
              (header) => (
                <Typography
                  key={header}
                  sx={{
                    fontFamily: FONT,
                    fontSize: "10px",
                    lineHeight: "12px",
                    fontWeight: 700,
                    color: TEXT_MUTED,
                  }}
                >
                  {header}
                </Typography>
              )
            )}
          </Box>

          {/* Rows */}
          {compounds.map((compound, index) => (
            <Box
              key={compound.rank}
              onClick={() => onCompoundClick(compound)}
              sx={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 2fr 1fr 24px",
                gap: "16px",
                px: "16px",
                py: "12px",
                minHeight: "48px",
                boxSizing: "border-box",
                alignItems: "center",
                cursor: "pointer",
                backgroundColor:
                  index === 0 ? "#F0FDFC" : "#FFFFFF",
                borderBottom:
                  index < compounds.length - 1
                    ? `1px solid ${BORDER}`
                    : "none",

                "&:hover": {
                  backgroundColor: "#F8FAFC",
                },

                "@media (max-width: 800px)": {
                  gridTemplateColumns: "45px 1fr 1fr",
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: "13px",
                  fontWeight: 700,
                  color: TEXT_DARK,
                }}
              >
                {compound.rank}
              </Typography>

              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: TEAL,
                }}
              >
                {compound.name}
              </Typography>

              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: "12px",
                  color: TEXT_DARK,
                }}
              >
                {compound.matchedProps}
              </Typography>

              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: "12px",
                  color: "#EF4444",
                }}
              >
                {compound.mismatchedProps}
              </Typography>

              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: "14px",
                  color: "#94A3B8",
                }}
              >
                ›
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            mt: "14px",
          }}
        >
          {["‹", "1", "2", "3", "...", "12", "›"].map(
            (item, index) => (
              <Box
                key={`${item}-${index}`}
                sx={{
                  minWidth: "28px",
                  height: "28px",
                  px: "7px",
                  borderRadius: "5px",
                  border:
                    item === "1"
                      ? `1px solid ${TEAL}`
                      : `1px solid ${BORDER}`,
                  backgroundColor:
                    item === "1" ? "#F0FDFC" : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: "11px",
                    color: item === "1" ? TEAL : TEXT_MUTED,
                  }}
                >
                  {item}
                </Typography>
              </Box>
            )
          )}
        </Box>

        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "11px",
            color: TEXT_MUTED,
            textAlign: "center",
            mt: "6px",
          }}
        >
          Showing 1-6 of 124 compounds
        </Typography>

        {/* Recommendation */}
        <Box
          sx={{
            mt: "16px",
            p: "14px",
            border: `1px solid ${BORDER}`,
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT,
              fontSize: "13px",
              fontWeight: 700,
              color: TEXT_DARK,
              mb: "5px",
            }}
          >
            Recommendation
          </Typography>

          <Typography
            sx={{
              fontFamily: FONT,
              fontSize: "12px",
              lineHeight: "17px",
              color: "#475569",
            }}
          >
            Metformin and Pioglitazone are the strongest candidates. Both
            match on molecular weight, route of administration, and
            half-life. Metformin scores highest due to superior
            bioavailability alignment. Recommend carrying both forward to
            screening.
          </Typography>
        </Box>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            gap: "12px",
            mt: "16px",
          }}
        >
          <Button variant="outlined" sx={buttonStyle}>
            Branch
          </Button>

          <Button variant="outlined" sx={buttonStyle}>
            Rerun
          </Button>

          <Button
            variant="outlined"
            onClick={onNext}
            sx={{
              ...buttonStyle,
              ml: 0,
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
};

/* ============================================================================
   COMPOUND EXPLORATION SCREEN
============================================================================ */

const CompoundExplorationScreen = ({
  compound,
  onBack,
  onNext,
}) => {
  const selectedCompound = compound || DEFAULT_COMPOUNDS[0];

  return (
    <>
      <UserMessage>
        Tell me more about {selectedCompound.name} - mechanism of action,
        current uses, and patent status.
      </UserMessage>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          border: `1px solid ${BORDER}`,
          borderRadius: "12px",
          p: "16px",
          boxSizing: "border-box",
        }}
      >
        <AgentHeader label="INOVAPATH CURATEX AGENT" />

        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "15px",
            lineHeight: "22px",
            color: TEXT_DARK,
            mt: "12px",
            mb: "12px",
          }}
        >
          Here is the detailed compound profile for{" "}
          {selectedCompound.name}:
        </Typography>

        <Box
          sx={{
            border: `1px solid ${BORDER}`,
            borderRadius: "10px",
            p: "16px",
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT,
              fontSize: "15px",
              fontWeight: 700,
              color: TEXT_DARK,
              mb: "4px",
            }}
          >
            {selectedCompound.name} - Compound Detail
          </Typography>

          <Typography
            sx={{
              fontFamily: FONT,
              fontSize: "12px",
              color: TEXT_MUTED,
              mb: "12px",
            }}
          >
            Summary of mechanism, clinical use, and IP status.
          </Typography>

          <DetailSection
            title="Mechanism of Action"
            text="Metformin activates AMP-activated protein kinase (AMPK), reducing hepatic glucose production and improving insulin sensitivity. In the context of JAK2 inhibition, recent studies suggest metformin may modulate JAK-STAT signaling indirectly through AMPK activation."
          />

          <DetailSection
            title="Current Uses"
            text="First-line therapy for Type 2 Diabetes. Also used off-label for PCOS, weight management, and under investigation for additional applications."
          />

          <DetailSection
            title="Patent Status"
            text="Original patents expired. Generic formulations widely available. Novel formulations and combination therapies may carry active IP."
          />

          <DetailSection
            title="Match Score"
            text={`${selectedCompound.score || "94%"} - Strong alignment with target profile properties.`}
            last
          />
        </Box>

        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "11px",
            color: TEXT_MUTED,
            mt: "8px",
          }}
        >
          Source: PubMed, DrugBank, USPTO via NovSearch
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: "10px",
            mt: "12px",
          }}
        >
          <Button
            variant="outlined"
            onClick={onBack}
            sx={buttonStyle}
          >
            Back to Results
          </Button>

          <Button
            variant="contained"
            onClick={onNext}
            sx={primaryButtonStyle}
          >
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
};

/* ============================================================================
   DETAIL SECTION
============================================================================ */

const DetailSection = ({ title, text, last = false }) => (
  <Box
    sx={{
      pb: last ? 0 : "12px",
      mb: last ? 0 : "12px",
      borderBottom: last ? "none" : `1px solid ${BORDER}`,
    }}
  >
    <Typography
      sx={{
        fontFamily: FONT,
        fontSize: "12px",
        lineHeight: "15px",
        fontWeight: 700,
        color: TEXT_DARK,
        mb: "5px",
      }}
    >
      {title}
    </Typography>

    <Typography
      sx={{
        fontFamily: FONT,
        fontSize: "12px",
        lineHeight: "17px",
        color: "#475569",
      }}
    >
      {text}
    </Typography>
  </Box>
);

/* ============================================================================
   CANDIDATE SELECTION SCREEN
============================================================================ */

const CandidateSelectionScreen = ({
  onBack,
  onScreen,
}) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          border: `1px solid ${BORDER}`,
          borderRadius: "12px",
          p: "16px",
          boxSizing: "border-box",
        }}
      >
        <AgentHeader label="INOVAPATH CURATEX AGENT" />

        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "15px",
            lineHeight: "22px",
            color: TEXT_DARK,
            mt: "12px",
            mb: "16px",
          }}
        >
          Would you like to select specific candidates for screening, or
          should I proceed with the top-ranked compounds (Metformin and
          Pioglitazone) automatically?
        </Typography>

        <UserMessage>
          Go with the top two - Metformin and Pioglitazone. Send them to
          ScreenSuite for docking.
        </UserMessage>

        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "13px",
            fontWeight: 600,
            color: TEXT_DARK,
            mb: "10px",
          }}
        >
          Selected candidates forwarded to ScreenSuite for molecular docking:
        </Typography>

        {["Metformin", "Pioglitazone"].map((compound) => (
          <Box
            key={compound}
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: "8px",
              p: "12px",
              mb: "8px",
              backgroundColor: "#FAFAFA",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT,
                fontSize: "13px",
                fontWeight: 600,
                color: TEXT_DARK,
              }}
            >
              {compound}
            </Typography>

            <Typography
              sx={{
                fontFamily: FONT,
                fontSize: "11px",
                color: "#94A3B8",
                mt: "2px",
              }}
            >
              Target: JAK2
            </Typography>
          </Box>
        ))}

        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "12px",
            fontWeight: 600,
            color: TEXT_DARK,
            mt: "12px",
            mb: "12px",
          }}
        >
          ScreenSuite is now running PLP docking simulations. Estimated
          completion: ~5 minutes.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Button
            variant="contained"
            onClick={onScreen}
            sx={primaryButtonStyle}
          >
            View in ScreenSuite
          </Button>

          <Button
            variant="outlined"
            onClick={onBack}
            sx={buttonStyle}
          >
            Back to Results
          </Button>
        </Box>
      </Box>
    </>
  );
};

/* ============================================================================
   MAIN CURATEX COMPONENT
============================================================================ */

const CuratexPhase = ({
  workflowPhase,
  setWorkflowPhase,

  chatMessages = [],
  setChatMessages,

  profileData = {},
  setProfileData,

  profileEditMode = false,
  setProfileEditMode,

  curateXResults = DEFAULT_COMPOUNDS,

  setSelectedCompound,
  setShowCompoundDetail,

  setActiveStep,
}) => {
  /* --------------------------------------------------------------------------
     Profile rows
  -------------------------------------------------------------------------- */

  const initialRows = useMemo(
    () => normalizeProfileRows(profileData),
    [profileData]
  );

  const [profileRows, setProfileRows] = useState(initialRows);

  const [selectedCompoundLocal, setSelectedCompoundLocal] =
    useState(DEFAULT_COMPOUNDS[0]);

  const compounds =
    curateXResults && curateXResults.length > 0
      ? curateXResults
      : DEFAULT_COMPOUNDS;

  /* --------------------------------------------------------------------------
     Keep profile rows synchronized if profileData changes externally.
  -------------------------------------------------------------------------- */

  React.useEffect(() => {
    if (!profileEditMode) {
      setProfileRows((currentRows) => {
        if (currentRows.length === 0) {
          return normalizeProfileRows(profileData);
        }

        return currentRows;
      });
    }
  }, [profileData, profileEditMode]);

  /* --------------------------------------------------------------------------
     EDIT VALUES
  -------------------------------------------------------------------------- */

  const handleEditValues = () => {
    setProfileEditMode?.(true);
  };

  /* --------------------------------------------------------------------------
     CANCEL
  -------------------------------------------------------------------------- */

  const handleCancelEdit = () => {
    setProfileRows(normalizeProfileRows(profileData));
    setProfileEditMode?.(false);
  };

  /* --------------------------------------------------------------------------
     SAVE CHANGES
  -------------------------------------------------------------------------- */

  const handleSaveChanges = () => {
    const updatedProfile = {};

    profileRows.forEach((row) => {
      const key =
        row.key ||
        row.property
          .replace(/\s+/g, "")
          .replace(/^./, (char) => char.toLowerCase());

      updatedProfile[key] = row.criterion;
    });

    setProfileData?.(updatedProfile);
    setProfileEditMode?.(false);
  };

  /* --------------------------------------------------------------------------
     EDIT PROPERTY NAME
  -------------------------------------------------------------------------- */

  const handleChangeProperty = (id, value) => {
    setProfileRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              property: value,
            }
          : row
      )
    );
  };

  /* --------------------------------------------------------------------------
     EDIT CRITERION
  -------------------------------------------------------------------------- */

  const handleChangeCriterion = (id, value) => {
    setProfileRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              criterion: value,
            }
          : row
      )
    );
  };

  /* --------------------------------------------------------------------------
     EDIT WEIGHT
  -------------------------------------------------------------------------- */

  const handleChangeWeight = (id, value) => {
    setProfileRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              weight: value,
            }
          : row
      )
    );
  };

  /* --------------------------------------------------------------------------
     ADD PARAMETER
  -------------------------------------------------------------------------- */

  const handleAddParameter = () => {
    setProfileRows((current) => [
      ...current,
      {
        id: `custom-${Date.now()}`,
        key: `customParameter${current.length + 1}`,
        property: "",
        criterion: "",
        weight: "10%",
        isNew: true,
      },
    ]);

    setProfileEditMode?.(true);
  };

  /* --------------------------------------------------------------------------
     DELETE PARAMETER
  -------------------------------------------------------------------------- */

  const handleDeleteParameter = (id) => {
    setProfileRows((current) =>
      current.filter((row) => row.id !== id)
    );
  };

  /* --------------------------------------------------------------------------
     ADD USER MESSAGE
     
     IMPORTANT:
     Submit Profile is treated as a real chat/user action.
  -------------------------------------------------------------------------- */

  const appendUserMessage = (text) => {
    if (!setChatMessages) {
      return;
    }

    setChatMessages((currentMessages = []) => [
      ...currentMessages,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  /* --------------------------------------------------------------------------
     SUBMIT PROFILE
  -------------------------------------------------------------------------- */

  const handleSubmitProfile = () => {
    const query = "Submit Profile";

    /*
     * Add the action to the actual conversation history.
     * This makes the action appear as:
     *
     * DR. PRIYA (YOU)
     * Submit Profile
     */
    appendUserMessage(query);

    /*
     * Store the submitted profile so the next phase uses the edited values.
     */
    const submittedProfile = {};

    profileRows.forEach((row) => {
      const key =
        row.key ||
        row.property
          .replace(/\s+/g, "")
          .replace(/^./, (char) => char.toLowerCase());

      submittedProfile[key] = row.criterion;
    });

    setProfileData?.(submittedProfile);

    setProfileEditMode?.(false);

    /*
     * Move directly to the CurateX result state.
     */
    setWorkflowPhase("curatex-results");
  };

  /* --------------------------------------------------------------------------
     SELECT COMPOUND
  -------------------------------------------------------------------------- */

  const handleCompoundClick = (compound) => {
    setSelectedCompoundLocal(compound);

    setSelectedCompound?.(compound);

    /*
     * If the parent already controls a compound-detail overlay,
     * use the existing mechanism.
     */
    if (setShowCompoundDetail) {
      setShowCompoundDetail(true);
    }
  };

  /* --------------------------------------------------------------------------
     NEXT FROM RESULTS
     
     User requested:
     Results -> Next -> Compound Exploration
  -------------------------------------------------------------------------- */

  const handleNextFromResults = () => {
    const compound =
      compounds[0] || DEFAULT_COMPOUNDS[0];

    setSelectedCompoundLocal(compound);
    setSelectedCompound?.(compound);

    /*
     * Prefer an explicit workflow phase so the next screen is
     * a real CurateX screen instead of only opening a modal.
     */
    setWorkflowPhase("curatex-compound-detail");
  };

  /* --------------------------------------------------------------------------
     NEXT FROM COMPOUND DETAIL
     
     Compound Exploration -> Next -> Candidate Selection
  -------------------------------------------------------------------------- */

  const handleNextFromCompoundDetail = () => {
    setWorkflowPhase("curatex-candidate-selection");
  };

  /* --------------------------------------------------------------------------
     VIEW IN SCREENSUITE
  -------------------------------------------------------------------------- */

  const handleViewScreenSuite = () => {
    setActiveStep?.(3);
    setWorkflowPhase("screensuite-loading");
  };

  /* ==========================================================================
     LOADING
  ========================================================================== */

  if (workflowPhase === "curatex-loading") {
    const lastUserMessage =
      chatMessages
        ?.filter((message) => message.role === "user")
        ?.slice(-1)[0]?.text ||
      "Please generate a Target Candidate Profile for JAK2.";

    return (
      <Box
        sx={{
          p: "24px 40px 40px",
          backgroundColor: GRAY_BG,
          minHeight: "100%",
          boxSizing: "border-box",
        }}
      >
        <UserMessage>{lastUserMessage}</UserMessage>

        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            border: `1px solid ${BORDER}`,
            borderRadius: "12px",
            p: "24px",
          }}
        >
          <AgentHeader label="INOVAPATH CURATEX AGENT" />

          <Typography
            sx={{
              fontFamily: FONT,
              fontSize: "14px",
              color: TEXT_DARK,
              mt: "12px",
              mb: "20px",
            }}
          >
            Searching for candidate compounds matching your JAK2 Target
            Profile...
          </Typography>

          <Box
            sx={{
              backgroundColor: "#F1F5F9",
              borderRadius: "4px",
              height: "8px",
              overflow: "hidden",
              mb: "20px",
            }}
          >
            <Box
              sx={{
                backgroundColor: TEAL,
                height: "100%",
                width: "65%",
                borderRadius: "4px",
              }}
            />
          </Box>

          {[
            {
              label: "Analyzing target profile parameters...",
              done: true,
            },
            {
              label: "Scanning compound databases...",
              done: true,
            },
            {
              label: "Matching candidates against criteria...",
              done: false,
            },
          ].map((step, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                mb: "12px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: "14px",
                  color: TEAL,
                }}
              >
                {step.done ? "✓" : "○"}
              </Typography>

              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: "13px",
                  color: step.done ? TEAL : TEXT_DARK,
                }}
              >
                {step.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  /* ==========================================================================
     PROFILE
  ========================================================================== */

  if (workflowPhase === "curatex-profile") {
    return (
      <Box
        sx={{
          p: "24px 40px 40px",
          backgroundColor: GRAY_BG,
          minHeight: "100%",
          boxSizing: "border-box",
        }}
      >
        <ProfileScreen
          profileRows={profileRows}
          editMode={profileEditMode}
          onEdit={handleEditValues}
          onSave={handleSaveChanges}
          onCancel={handleCancelEdit}
          onSubmit={handleSubmitProfile}
          onAddParameter={handleAddParameter}
          onDelete={handleDeleteParameter}
          onChangeProperty={handleChangeProperty}
          onChangeCriterion={handleChangeCriterion}
          onChangeWeight={handleChangeWeight}
        />
      </Box>
    );
  }

  /* ==========================================================================
     RESULTS
  ========================================================================== */

  if (workflowPhase === "curatex-results") {
    return (
      <Box
        sx={{
          p: "24px 40px 40px",
          backgroundColor: GRAY_BG,
          minHeight: "100%",
          boxSizing: "border-box",
        }}
      >
        <ResultsScreen
          compounds={compounds}
          onCompoundClick={handleCompoundClick}
          onNext={handleNextFromResults}
        />
      </Box>
    );
  }

  /* ==========================================================================
     COMPOUND EXPLORATION
  ========================================================================== */

  if (workflowPhase === "curatex-compound-detail") {
    return (
      <Box
        sx={{
          p: "24px 40px 40px",
          backgroundColor: GRAY_BG,
          minHeight: "100%",
          boxSizing: "border-box",
        }}
      >
        <CompoundExplorationScreen
          compound={selectedCompoundLocal}
          onBack={() => setWorkflowPhase("curatex-results")}
          onNext={handleNextFromCompoundDetail}
        />
      </Box>
    );
  }

  /* ==========================================================================
     CANDIDATE SELECTION
  ========================================================================== */

  if (workflowPhase === "curatex-candidate-selection") {
    return (
      <Box
        sx={{
          p: "24px 40px 40px",
          backgroundColor: GRAY_BG,
          minHeight: "100%",
          boxSizing: "border-box",
        }}
      >
        <CandidateSelectionScreen
          onBack={() => setWorkflowPhase("curatex-results")}
          onScreen={handleViewScreenSuite}
        />
      </Box>
    );
  }

  return null;
};

export default CuratexPhase;