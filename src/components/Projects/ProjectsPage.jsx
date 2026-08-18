import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Popover,
  Divider,
} from "@mui/material";

import {
  SearchOutlined,
  AddOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  MoreVertOutlined,
  KeyboardArrowDownOutlined,
} from "@mui/icons-material";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────── */

const FONT = "'Inter', sans-serif";

const TEAL = "#00BCD4";

const TOPNAV_BORDER = "#E2E8F0";
const BREADCRUMB_COLOR = "#64748B";
const TITLE_COLOR = "#0F172A";
const SUBTITLE_COLOR = "#64748B";
const CARD_BORDER = "#E2E8F0";
const SEARCH_ICON_COLOR = "#CBD5E1";
const DROPDOWN_LABEL_COLOR = "#64748B";
const DROPDOWN_VALUE_COLOR = "#0F172A";
const MUTED = "#94A3B8";
const BG = "#F8FAFC";

/*
  Shared table column definition.

  IMPORTANT:
  The exact same grid is used by:
  - table header
  - table rows

  This keeps Disease, Last Module and Status perfectly aligned.
*/
const TABLE_GRID = "minmax(220px, 1fr) 230px 155px 130px 40px";

/* ─────────────────────────────────────────────────────────────
   PROJECT DATA
───────────────────────────────────────────────────────────── */

const ALL_PROJECTS = [
  {
    id: "type-2-diabetes",
    name: "Type 2 Diabetes",
    disease: "Type 2 Diabetes",
    module: "TxKG",
    status: "ACTIVE",
  },
  {
    id: "rapamycin-for-neuro",
    name: "Rapamycin for Neuro",
    disease: "Alzheimer's Disease",
    module: "LitMineX",
    status: "ACTIVE",
  },
  {
    id: "sildenafil-for-cv",
    name: "Sildenafil for CV",
    disease: "Pulmonary Hypertension",
    module: "CurateX",
    status: "ON HOLD",
  },
  {
    id: "anastrozole-for-lung",
    name: "Anastrozole for Lung",
    disease: "NSCLC",
    module: "NovSearch",
    status: "ACTIVE",
  },
  {
    id: "propranolol-for-hema",
    name: "Propranolol for Hema",
    disease: "Hemangioma",
    module: "LitMineX",
    status: "ACTIVE",
  },
  {
    id: "imatinib-for-nsclc",
    name: "Imatinib for NSCLC",
    disease: "Lung Cancer",
    module: "CurateX",
    status: "REVIEW",
  },
  {
    id: "losartan-for-fibrosis",
    name: "Losartan for Fibrosis",
    disease: "Hepatic Fibrosis",
    module: "TxKG",
    status: "ACTIVE",
  },
  {
    id: "thalidomide-for-myeloma",
    name: "Thalidomide for Myeloma",
    disease: "Multiple Myeloma",
    module: "NovSearch",
    status: "REVIEW",
  },
  {
    id: "metformin-for-breast-cancer",
    name: "Metformin for Breast Cancer",
    disease: "Breast Cancer",
    module: "LitMineX",
    status: "ACTIVE",
  },
];

/* ─────────────────────────────────────────────────────────────
   STATUS COLORS
───────────────────────────────────────────────────────────── */

const STATUS_META = {
  ACTIVE: {
    color: "#0D9488",
    bg: "#E6FAF7",
  },

  "ON HOLD": {
    color: "#7C3AED",
    bg: "#EDE9FE",
  },

  REVIEW: {
    color: "#D97706",
    bg: "#FEF3C7",
  },

  "IN REVIEW": {
    color: "#D97706",
    bg: "#FEF3C7",
  },

  COMPLETED: {
    color: "#164E63",
    bg: "#DDF4F4",
  },

  ARCHIVED: {
    color: "#64748B",
    bg: "#F1F5F9",
  },
};

/* ─────────────────────────────────────────────────────────────
   STATUS CHIP
───────────────────────────────────────────────────────────── */

const StatusChip = ({ status, onClick }) => {
  const { color, bg } =
    STATUS_META[status] || {
      color: MUTED,
      bg: "#F1F5F9",
    };

  return (
    <Box
      component="button"
      onClick={(event) => {
        event.stopPropagation();

        if (onClick) {
          onClick(event);
        }
      }}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        px: "8px",
        py: "3px",

        minHeight: "28px",

        border: "none",
        borderRadius: "4px",

        bgcolor: bg,
        color,

        cursor: "pointer",

        fontFamily: FONT,

        "&:hover": {
          filter: "brightness(0.98)",
        },
      }}
    >
      <Typography
        sx={{
          fontFamily: FONT,
          fontSize: "11px",
          fontWeight: 700,
          color,
          letterSpacing: "0.4px",
          lineHeight: 1,
        }}
      >
        {status}
      </Typography>
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────────
   FILTER SELECT
───────────────────────────────────────────────────────────── */

const FilterSelect = ({
  value,
  onChange,
  options,
  label,
  allLabel,
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      size="small"
      displayEmpty
      IconComponent={() => null}
      renderValue={(selectedValue) => (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            maxWidth: "100%",
            minWidth: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <Typography
            component="span"
            sx={{
              flexShrink: 0,
              fontFamily: FONT,
              fontSize: "13px",
              fontWeight: 400,
              color: DROPDOWN_LABEL_COLOR,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {label}:
          </Typography>

          <Typography
            component="span"
            sx={{
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontFamily: FONT,
              fontSize: "13px",
              fontWeight: 600,
              color: DROPDOWN_VALUE_COLOR,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {selectedValue || allLabel}
          </Typography>

          <KeyboardArrowDownOutlined
            sx={{
              flexShrink: 0,
              marginLeft: "1px",
              fontSize: "16px",
              color: "#64748B",
              pointerEvents: "none",
            }}
          />
        </Box>
      )}
      sx={{
        width: "100%",
        height: "40px",
        minWidth: 0,
        bgcolor: "#FFFFFF",
        borderRadius: "8px",
        flexShrink: 0,

        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: CARD_BORDER,
          borderWidth: "1px",
        },

        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#CBD5E1",
        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: TEAL,
          borderWidth: "1px",
        },

        "& .MuiSelect-select": {
          width: "100%",
          minHeight: "unset !important",
          height: "40px",
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          padding: "0 12px 0 14px !important",
          overflow: "hidden",
          whiteSpace: "nowrap",
        },

      }}
    >
      <MenuItem
        value=""
        sx={{
          fontFamily: FONT,
          fontSize: "13px",
        }}
      >
        {allLabel}
      </MenuItem>

      {options.map((option) => (
        <MenuItem
          key={option}
          value={option}
          sx={{
            fontFamily: FONT,
            fontSize: "13px",
          }}
        >
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

/* ─────────────────────────────────────────────────────────────
   SORT SELECT
───────────────────────────────────────────────────────────── */

const SortSelect = ({ value, onChange }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      size="small"
      IconComponent={() => null}
      renderValue={(selectedValue) => (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            maxWidth: "100%",
            minWidth: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <Typography
            component="span"
            sx={{
              flexShrink: 0,
              fontFamily: FONT,
              fontSize: "13px",
              fontWeight: 400,
              color: DROPDOWN_LABEL_COLOR,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            Sort by:
          </Typography>

          <Typography
            component="span"
            sx={{
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontFamily: FONT,
              fontSize: "13px",
              fontWeight: 600,
              color: DROPDOWN_VALUE_COLOR,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {selectedValue}
          </Typography>

          <KeyboardArrowDownOutlined
            sx={{
              flexShrink: 0,
              marginLeft: "1px",
              fontSize: "16px",
              color: "#64748B",
              pointerEvents: "none",
            }}
          />
        </Box>
      )}
      sx={{
        width: "100%",
        height: "40px",
        minWidth: 0,
        bgcolor: "#FFFFFF",
        borderRadius: "8px",
        flexShrink: 0,

        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: CARD_BORDER,
          borderWidth: "1px",
        },

        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#CBD5E1",
        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: TEAL,
          borderWidth: "1px",
        },

        "& .MuiSelect-select": {
          width: "100%",
          minHeight: "unset !important",
          height: "40px",
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          padding: "0 12px 0 14px !important",
          overflow: "hidden",
          whiteSpace: "nowrap",
        },

      }}
    >
      {["Latest Activity", "Name", "Status"].map((option) => (
        <MenuItem
          key={option}
          value={option}
          sx={{
            fontFamily: FONT,
            fontSize: "13px",
          }}
        >
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

/* ─────────────────────────────────────────────────────────────
   STATUS DROPDOWN
   Figma:
   Width: 180px
   Height: 216px
   Radius: 8px
   Padding top/bottom: 8px
───────────────────────────────────────────────────────────── */

const StatusDropdown = ({
  anchorEl,
  open,
  onClose,
  currentStatus,
  onStatusChange,
}) => {
  const statuses = [
    {
      value: "ACTIVE",
      label: "Active",
      color: "#00BCD4",
      bg: "#E6FAF7",
    },
    {
      value: "REVIEW",
      label: "In Review",
      color: "#F59E0B",
      bg: "#FEF3C7",
    },
    {
      value: "ON HOLD",
      label: "On Hold",
      color: "#8B5CF6",
      bg: "#F0EBFF",
    },
    {
      value: "COMPLETED",
      label: "Completed",
      color: "#164E63",
      bg: "#DDF4F4",
    },
    {
      value: "ARCHIVED",
      label: "Archived",
      color: "#64748B",
      bg: "#F1F5F9",
    },
  ];

  const handleStatusChange = (status) => {
    onStatusChange?.(status);
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      slotProps={{
        paper: {
          sx: {
            width: "180px",
            height: "216px",
            mt: "8px",
            borderRadius: "8px",
            bgcolor: "#FFFFFF",
            overflow: "hidden",
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.12)",
            border: "none",
          },
        },
      }}
    >
      <Box
        sx={{
          width: "180px",
          height: "216px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          py: "8px",
        }}
      >
        {/* Figma: dropdown-header — 180 Fill × 24 Hug, padding 6px 14px */}
        <Box
          sx={{
            width: "180px",
            height: "24px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            boxSizing: "border-box",
            px: "14px",
            py: "6px",
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT,
              fontSize: "12px",
              fontWeight: 700,
              color: "#64748B",
              letterSpacing: "0.5px",
              lineHeight: "12px",
              textTransform: "uppercase",
            }}
          >
            Set Status
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "#E2E8F0", flexShrink: 0 }} />

        {/* Figma: each option — 180 Fill × 35 Hug, padding 7px 14px, gap 10px */}
        <Box
          sx={{
            width: "180px",
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {statuses.map((status) => {
            const selected = currentStatus === status.value;

            return (
              <Box
                key={status.value}
                onClick={(event) => {
                  event.stopPropagation();
                  handleStatusChange(status.value);
                }}
                sx={{
                  width: "180px",
                  height: "35px",
                  minHeight: "35px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                  px: "14px",
                  py: "7px",
                  gap: "10px",
                  bgcolor: selected ? "#F5F7FA" : "#FFFFFF",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#F5F7FA",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "fit-content",
                    minWidth: "fit-content",
                    px: "12px",
                    py: "6px",
                    borderRadius: "14px",
                    bgcolor: status.bg,
                    boxSizing: "border-box",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT,
                      fontSize: "12px",
                      fontWeight: 500,
                      color: status.color,
                      lineHeight: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {status.label}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Popover>
  );
};

/* ─────────────────────────────────────────────────────────────
   ACTIONS DROPDOWN
   Figma:
   Width: 160px
   Height: 157px
   Radius: 8px
   Padding top/bottom: 6px
───────────────────────────────────────────────────────────── */

const ActionsDropdown = ({
  anchorEl,
  open,
  onClose,
  onAction,
}) => {
  const actions = [
    { value: "edit", label: "Edit Project" },
    { value: "duplicate", label: "Duplicate" },
    { value: "archive", label: "Archive" },
    { value: "delete", label: "Delete", danger: true },
  ];

  const handleAction = (action) => {
    onAction?.(action);
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          sx: {
            width: "160px",
            height: "157px",
            mt: "6px",
            borderRadius: "8px",
            bgcolor: "#FFFFFF",
            overflow: "hidden",
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.12)",
            border: "none",
          },
        },
      }}
    >
      <Box
        sx={{
          width: "160px",
          height: "157px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          py: "6px",
        }}
      >
        {actions.map((action) => (
          <React.Fragment key={action.value}>
            {action.value === "delete" && (
              <Divider
                sx={{
                  borderColor: "#E2E8F0",
                  flexShrink: 0,
                }}
              />
            )}

            <Box
              onClick={(event) => {
                event.stopPropagation();
                handleAction(action.value);
              }}
              sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                px: "24px",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "#F8FAFC",
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: "16px",
                  fontWeight: 400,
                  color: action.danger ? "#EF4444" : "#333333",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {action.label}
              </Typography>
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Popover>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGINATION BUTTON
───────────────────────────────────────────────────────────── */

const ROWS_PER_PAGE = 10;
const TOTAL_ITEMS = 47;
const TOTAL_PAGES = 12;

function PageButton({
  children,
  active,
  onClick,
  disabled,
  "aria-label": ariaLabel,
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        width: "32px",
        height: "32px",

        padding: 0,

        borderRadius: "4px",

        border: active
          ? `1.5px solid ${TEAL}`
          : "1.5px solid transparent",

        background: active
          ? "transparent"
          : "#F1F5F9",

        color: disabled
          ? "#CBD5E1"
          : active
          ? TEAL
          : "#6B7280",

        cursor: disabled
          ? "default"
          : "pointer",

        fontFamily: FONT,
        fontSize: "12px",
        fontWeight: 500,

        lineHeight: 1,

        boxSizing: "border-box",

        transition:
          "background 0.15s, border-color 0.15s",

        "&:hover": disabled
          ? {}
          : {
              background: active
                ? "transparent"
                : "#E7ECF3",
            },
      }}
    >
      {children}
    </Box>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROJECTS PAGE
───────────────────────────────────────────────────────────── */

const ProjectsPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] =
    useState("Latest Activity");

  const [page, setPage] = useState(1);

  /* Status dropdown state */
  const [statusAnchorEl, setStatusAnchorEl] =
    useState(null);

  const [selectedProjectId, setSelectedProjectId] =
    useState(null);

  /* Actions dropdown state */
  const [actionsAnchorEl, setActionsAnchorEl] =
    useState(null);

  const [actionProjectId, setActionProjectId] =
    useState(null);

  /* ─────────────────────────────────────────────
     FILTERED PROJECTS
  ───────────────────────────────────────────── */

  const filtered = ALL_PROJECTS.filter((project) => {
    const query = search.toLowerCase();

    return (
      (!query ||
        project.name
          .toLowerCase()
          .includes(query) ||
        project.disease
          .toLowerCase()
          .includes(query)) &&
      (!moduleFilter ||
        project.module === moduleFilter) &&
      (!statusFilter ||
        project.status === statusFilter)
    );
  });

  /* ─────────────────────────────────────────────
     PAGINATION
  ───────────────────────────────────────────── */

  const rangeStart =
    (page - 1) * ROWS_PER_PAGE + 1;

  const rangeEnd = Math.min(
    page * ROWS_PER_PAGE,
    TOTAL_ITEMS
  );

  /* ─────────────────────────────────────────────
     STATUS DROPDOWN
  ───────────────────────────────────────────── */

  const handleStatusClick = (
    event,
    projectId
  ) => {
    event.stopPropagation();

    setSelectedProjectId(projectId);

    setStatusAnchorEl(event.currentTarget);
  };

  const handleStatusClose = () => {
    setStatusAnchorEl(null);
    setSelectedProjectId(null);
  };

  const handleStatusChange = (status) => {
    console.log(
      "Change project status:",
      selectedProjectId,
      status
    );

    /*
      Connect your API/update logic here.

      For now the dropdown behavior is implemented
      and the selected project/status are available.
    */
  };

  /* ─────────────────────────────────────────────
     ACTIONS DROPDOWN
  ───────────────────────────────────────────── */

  const handleActionsClick = (
    event,
    projectId
  ) => {
    event.stopPropagation();

    setActionProjectId(projectId);

    setActionsAnchorEl(
      event.currentTarget
    );
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
    setActionProjectId(null);
  };

  const handleProjectAction = (action) => {
    console.log(
      "Project action:",
      action,
      actionProjectId
    );

    /*
      Connect your API/action handlers here.

      edit
      duplicate
      archive
      delete
    */
  };

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",

        display: "flex",
        flexDirection: "column",

        bgcolor: BG,

        boxSizing: "border-box",

        overflow: "hidden",
      }}
    >
      {/* ─────────────────────────────────────────
          TOP NAV
      ───────────────────────────────────────── */}

      <Box
        sx={{
          flexShrink: 0,

          height: "57px",

          bgcolor: "#FFFFFF",

          borderBottom:
            `1px solid ${TOPNAV_BORDER}`,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          padding: "14px 32px",

          boxSizing: "border-box",
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: "13px",
            fontWeight: 500,

            color: BREADCRUMB_COLOR,

            lineHeight: 1,
          }}
        >
          Projects
        </Typography>
      </Box>

      {/* ─────────────────────────────────────────
          CONTENT
      ───────────────────────────────────────── */}

      <Box
        sx={{
          flex: 1,

          minHeight: 0,

          display: "flex",
          flexDirection: "column",

          padding: "32px",

          gap: "24px",

          "@media (max-width: 1200px)": {
            padding: "28px",
            gap: "20px",
          },

          "@media (max-width: 700px)": {
            padding: "20px",
            gap: "18px",
          },

          "@media (max-width: 520px)": {
            padding: "16px",
            gap: "16px",
          },

          boxSizing: "border-box",

          overflow: "hidden",
        }}
      >
        {/* ───────────────────────────────────────
            HEADER
        ─────────────────────────────────────── */}

        <Box
          sx={{
            flexShrink: 0,

            display: "flex",
            alignItems: "flex-start",

            justifyContent:
              "space-between",

            gap: "20px",

            "@media (max-width: 700px)": {
              flexDirection: "column",
              alignItems: "stretch",
              gap: "14px",
            },
          }}
        >
          {/* Title */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",

              gap: "4px",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT,
                fontSize: "28px",
                fontWeight: 700,

                color: TITLE_COLOR,

                lineHeight: "1.2",
              }}
            >
              Projects
            </Typography>

            <Typography
              sx={{
                fontFamily: FONT,
                fontSize: "14px",
                fontWeight: 400,

                color: SUBTITLE_COLOR,

                lineHeight: 1,
              }}
            >
              Manage and track your research
            </Typography>
          </Box>

          {/* New Project */}
          <Box
            component="button"
            onClick={() => {}}
            sx={{
              display: "flex",
              alignItems: "center",

              gap: "8px",

              padding: "10px 18px",

              borderRadius: "8px",

              bgcolor: TEAL,
              color: "#FFFFFF",

              border: "none",

              cursor: "pointer",

              fontFamily: FONT,
              fontSize: "14px",
              fontWeight: 600,

              boxShadow:
                "0px 4px 12px 0px rgba(0,194,181,0.1255)",

              flexShrink: 0,

              "@media (max-width: 700px)": {
                alignSelf: "flex-start",
              },

              "&:hover": {
                bgcolor: "#00A8BD",
              },
            }}
          >
            <AddOutlined
              sx={{
                fontSize: 16,
                width: 16,
                height: 16,
              }}
            />

            New Project
          </Box>
        </Box>

        {/* ───────────────────────────────────────
            FILTER BAR
        ─────────────────────────────────────── */}

        <Box
          sx={{
            flexShrink: 0,
            width: "100%",
            display: "grid",
            /*
              Desktop: keep all four controls on one line while
              allowing the search field to take the remaining space.
              The smaller gaps also keep the controls visually grouped.
            */
            gridTemplateColumns: "minmax(0, 1fr) 220px 165px 205px",
            alignItems: "center",
            gap: "8px",
            boxSizing: "border-box",

            "@media (max-width: 1200px)": {
              gridTemplateColumns: "minmax(0, 1fr) 205px 155px 190px",
              gap: "8px",
            },

            "@media (max-width: 980px)": {
              gridTemplateColumns: "minmax(300px, 1fr) 180px",
              gap: "10px",
            },

            "@media (max-width: 700px)": {
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            },

            "@media (max-width: 520px)": {
              gridTemplateColumns: "1fr",
              gap: "10px",
            },
          }}
        >
          {/* Search */}
          <TextField
            placeholder="Search projects..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            variant="outlined"
            InputProps={{
              startAdornment: (
                <SearchOutlined
                  sx={{
                    fontSize: "15px",
                    color:
                      SEARCH_ICON_COLOR,
                    mr: "10px",
                  }}
                />
              ),
            }}
            sx={{
              width: "100%",
              minWidth: 0,

              "& .MuiOutlinedInput-root": {
                height: "40px",

                borderRadius: "8px",

                bgcolor: "#FFFFFF",

                pl: "14px",
                pr: "14px",

                "& fieldset": {
                  borderColor: CARD_BORDER,
                },

                "&:hover fieldset": {
                  borderColor: "#CBD5E1",
                },

                "&.Mui-focused fieldset": {
                  borderColor: TEAL,
                  borderWidth: "1px",
                },
              },

              "& input": {
                fontFamily: FONT,
                fontSize: "13px",

                color: TITLE_COLOR,

                p: 0,
              },

              "& input::placeholder": {
                color: SEARCH_ICON_COLOR,
                opacity: 1,
              },
            }}
          />

          {/* Last Module */}
          <FilterSelect
            value={moduleFilter}
            onChange={(event) =>
              setModuleFilter(
                event.target.value
              )
            }
            options={[
              "TxKG",
              "LitMineX",
              "CurateX",
              "NovSearch",
            ]}
            label="Last Module"
            allLabel="All Modules"
          />

          {/* Status */}
          <FilterSelect
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            options={[
              "ACTIVE",
              "ON HOLD",
              "REVIEW",
            ]}
            label="Status"
            allLabel="All Status"
          />

          {/* Sort */}
          <SortSelect
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
          />
        </Box>

        {/* ───────────────────────────────────────
            TABLE CARD
        ─────────────────────────────────────── */}

        <Box
          sx={{
            flex: 1,

            minHeight: 0,

            display: "flex",
            flexDirection: "column",

            bgcolor: "#FFFFFF",

            border:
              `1px solid ${CARD_BORDER}`,

            borderRadius: "12px",

            boxShadow:
              "0px 2px 8px rgba(0,0,0,0.039)",

            overflow: "hidden",

            boxSizing: "border-box",
          }}
        >
          {/* Card title */}
          <Box
            sx={{
              px: "24px",
              py: "20px",

              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT,
                fontSize: "16px",
                fontWeight: 600,

                color: TITLE_COLOR,
              }}
            >
              Repurposing Projects
            </Typography>
          </Box>

          {/* ─────────────────────────────────────
              TABLE HEADER

              Uses SAME TABLE_GRID as rows.
          ───────────────────────────────────── */}

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns:
                TABLE_GRID,

              alignItems: "center",

              bgcolor: BG,

              px: "24px",
              py: "10px",

              borderTop:
                `1px solid ${CARD_BORDER}`,

              borderBottom:
                `1px solid ${CARD_BORDER}`,

              flexShrink: 0,

              boxSizing: "border-box",
              minWidth: "775px",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT,
                fontSize: "11px",
                fontWeight: 700,

                color: MUTED,

                letterSpacing:
                  "0.4px",

                whiteSpace: "nowrap",
              }}
            >
              PROJECT NAME
            </Typography>

            <Typography
              sx={{
                fontFamily: FONT,
                fontSize: "11px",
                fontWeight: 700,

                color: MUTED,

                letterSpacing:
                  "0.4px",

                whiteSpace: "nowrap",
              }}
            >
              DISEASE
            </Typography>

            <Typography
              sx={{
                fontFamily: FONT,
                fontSize: "11px",
                fontWeight: 700,

                color: MUTED,

                letterSpacing:
                  "0.4px",

                whiteSpace: "nowrap",
              }}
            >
              LAST MODULE
            </Typography>

            <Typography
              sx={{
                fontFamily: FONT,
                fontSize: "11px",
                fontWeight: 700,

                color: MUTED,

                letterSpacing:
                  "0.4px",

                whiteSpace: "nowrap",
              }}
            >
              STATUS
            </Typography>

            {/* Action column spacer */}
            <Box />
          </Box>

          {/* ─────────────────────────────────────
              TABLE ROWS
          ───────────────────────────────────── */}

          <Box
            sx={{
              flex: 1,

              minHeight: 0,

              overflowY: "auto",

              overflowX: "auto",
            }}
          >
            {filtered.map((project, index) => (
              <Box
                key={project.id}
                onClick={() =>
                  navigate(
                    `/dashboard/active-projects/${project.id}`
                  )
                }
                sx={{
                  display: "grid",

                  /*
                    SAME grid as table header.
                    This fixes Disease / Last Module /
                    Status alignment.
                  */
                  gridTemplateColumns:
                    TABLE_GRID,

                  alignItems: "center",

                  px: "24px",
                  py: "16px",

                  minHeight: "74px",

                  borderBottom:
                    index ===
                    filtered.length - 1
                      ? "none"
                      : "1px solid #F0F2F5",

                  cursor: "pointer",

                  boxSizing: "border-box",
                  minWidth: "775px",

                  "&:hover": {
                    bgcolor: BG,
                  },
                }}
              >
                {/* Project name */}
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: "14px",
                    fontWeight: 600,

                    color: TITLE_COLOR,

                    minWidth: 0,

                    overflow: "hidden",
                    textOverflow:
                      "ellipsis",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {project.name}
                </Typography>

                {/* Disease */}
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: "14px",
                    fontWeight: 400,

                    color: "#475569",

                    minWidth: 0,

                    overflow: "hidden",
                    textOverflow:
                      "ellipsis",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {project.disease}
                </Typography>

                {/* Last Module */}
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: "14px",
                    fontWeight: 400,

                    color: "#475569",

                    minWidth: 0,

                    overflow: "hidden",
                    textOverflow:
                      "ellipsis",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {project.module}
                </Typography>

                {/* Status */}
                <Box
                  sx={{
                    minWidth: 0,

                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "flex-start",
                  }}
                >
                  <StatusChip
                    status={project.status}
                    onClick={(event) =>
                      handleStatusClick(
                        event,
                        project.id
                      )
                    }
                  />
                </Box>

                {/* Actions */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "flex-end",
                  }}
                >
                  <Box
                    component="button"
                    onClick={(event) =>
                      handleActionsClick(
                        event,
                        project.id
                      )
                    }
                    aria-label={`Actions for ${project.name}`}
                    sx={{
                      width: "28px",
                      height: "32px",

                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "center",

                      border: "none",
                      bgcolor:
                        "transparent",

                      borderRadius: "4px",

                      cursor: "pointer",

                      p: 0,

                      "&:hover": {
                        bgcolor: "#F1F5F9",
                      },
                    }}
                  >
                    <MoreVertOutlined
                      sx={{
                        fontSize: 18,
                        color: MUTED,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}

            {/* Empty state */}
            {filtered.length === 0 && (
              <Box
                sx={{
                  minHeight: "180px",

                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: "14px",
                    color: MUTED,
                  }}
                >
                  No projects found
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* ───────────────────────────────────────
            PAGINATION
        ─────────────────────────────────────── */}

        <Box
          sx={{
            flexShrink: 0,

            width: "100%",

            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",

            flexWrap: "wrap",

            gap: "8px",
          }}
        >
          <PageButton
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() =>
              setPage((currentPage) =>
                Math.max(
                  1,
                  currentPage - 1
                )
              )
            }
          >
            <ChevronLeftOutlined
              sx={{ fontSize: 16 }}
            />
          </PageButton>

          {[1, 2, 3].map((number) => (
            <PageButton
              key={number}
              active={page === number}
              onClick={() =>
                setPage(number)
              }
            >
              {number}
            </PageButton>
          ))}

          <Box
            sx={{
              px: "4px",

              color: "#6B7280",

              fontFamily: FONT,
              fontSize: "12px",
            }}
          >
            &hellip;
          </Box>

          <PageButton
            active={
              page === TOTAL_PAGES
            }
            onClick={() =>
              setPage(TOTAL_PAGES)
            }
          >
            {TOTAL_PAGES}
          </PageButton>

          <PageButton
            aria-label="Next page"
            disabled={
              page === TOTAL_PAGES
            }
            onClick={() =>
              setPage((currentPage) =>
                Math.min(
                  TOTAL_PAGES,
                  currentPage + 1
                )
              )
            }
          >
            <ChevronRightOutlined
              sx={{ fontSize: 16 }}
            />
          </PageButton>

          <Typography
            sx={{
              fontFamily: FONT,
              fontSize: "12px",
              fontWeight: 400,

              color: "#6B7280",

              whiteSpace: "nowrap",

              ml: "8px",
            }}
          >
            Showing {rangeStart}-
            {rangeEnd} of {TOTAL_ITEMS}{" "}
            articles
          </Typography>
        </Box>
      </Box>

      {/* ─────────────────────────────────────────
          STATUS DROPDOWN
      ───────────────────────────────────────── */}

      <StatusDropdown
        anchorEl={statusAnchorEl}
        open={Boolean(statusAnchorEl)}
        onClose={handleStatusClose}
        currentStatus={
          ALL_PROJECTS.find(
            (project) =>
              project.id ===
              selectedProjectId
          )?.status
        }
        onStatusChange={
          handleStatusChange
        }
      />

      {/* ─────────────────────────────────────────
          ACTIONS DROPDOWN
      ───────────────────────────────────────── */}

      <ActionsDropdown
        anchorEl={actionsAnchorEl}
        open={Boolean(actionsAnchorEl)}
        onClose={handleActionsClose}
        onAction={
          handleProjectAction
        }
      />
    </Box>
  );
};

export default ProjectsPage;