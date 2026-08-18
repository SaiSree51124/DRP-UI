import React from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  IconButton,
} from '@mui/material';
import {
  VisibilityOutlined,
  CloseOutlined,
} from '@mui/icons-material';

import {
  FONT,
  TEAL,
  USER_MSG_BG,
  GRAY_BG,
  BORDER,
  TEXT_DARK,
  TEXT_MUTED,
} from '../workflowConstants';

/* ==========================================================================
   LITMINEX SPARKLE
   ========================================================================== */

const LitMineXSparkleIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Main sparkle */}
    <path
      d="
        M11.95 2.8
        L13.45 8.45
        C13.58 8.94 13.96 9.32 14.45 9.45
        L20.1 10.95
        C20.62 11.09 20.62 11.83 20.1 11.97
        L14.45 13.47
        C13.96 13.6 13.58 13.98 13.45 14.47
        L11.95 20.12
        C11.81 20.64 11.07 20.64 10.93 20.12
        L9.43 14.47
        C9.30 13.98 8.92 13.60 8.43 13.47
        L2.78 11.97
        C2.26 11.83 2.26 11.09 2.78 10.95
        L8.43 9.45
        C8.92 9.32 9.30 8.94 9.43 8.45
        L10.93 2.8
        C11.07 2.28 11.81 2.28 11.95 2.8Z
      "
      stroke="#00BCD4"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Small sparkle */}
    <path
      d="
        M18.1 3.05
        V6.1
        M16.58 4.575
        H19.62
      "
      stroke="#00BCD4"
      strokeWidth="1.4"
      strokeLinecap="round"
    />

    {/* Small lower-left sparkle */}
    <circle
      cx="5.1"
      cy="18.15"
      r="1.45"
      stroke="#00BCD4"
      strokeWidth="1.45"
    />
  </svg>
);


/* ==========================================================================
   LITMINEX AGENT HEADER
   ========================================================================== */

const LitMineXAgentHeader = ({
  label = 'INOVAPATH LITMINEX AGENT',
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      width: '100%',
      minHeight: '32px',
    }}
  >
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '8px',
        bgcolor: '#F0FDFC',
        border: '1px solid #00BCD4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <LitMineXSparkleIcon size={16} />
    </Box>

    <Typography
      sx={{
        flex: 1,
        fontFamily: FONT,
        fontSize: '11px',
        lineHeight: '13px',
        fontWeight: 700,
        color: '#334155',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </Typography>
  </Box>
);


/* ==========================================================================
   CONFIDENCE COLOR
   ========================================================================== */

const confidenceColor = (conf) => {
  const n = parseInt(conf, 10);

  if (n >= 95) {
    return {
      bg: '#D1FAE5',
      text: '#059669',
    };
  }

  if (n >= 85) {
    return {
      bg: '#FEF3C7',
      text: '#92400E',
    };
  }

  if (n >= 75) {
    return {
      bg: '#FEF3C7',
      text: '#B45309',
    };
  }

  return {
    bg: '#FEE2E2',
    text: '#B91C1C',
  };
};


/* ==========================================================================
   LITMINEX PHASE
   ========================================================================== */

const LiteminexPhase = ({
  workflowPhase,
  chatMessages,
  litMinexResults,
  setSelectedArticle,
  setShowArticleDetail,
}) => {

  /* ------------------------------------------------------------------------
     LOADING
     ------------------------------------------------------------------------ */

  if (workflowPhase === 'litminex-loading') {
    return (
      <Box
        sx={{
          p: '24px 16px 16px 16px',
          bgcolor: GRAY_BG,
        }}
      >

        {/* User message */}
        <Box
          sx={{
            bgcolor: USER_MSG_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: '12px',
            p: '16px',
            mb: '8px',
            maxWidth: '680px',
            width: '100%',
            marginLeft: 'auto',
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT,
              fontSize: '11px',
              fontWeight: 700,
              color: TEAL,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: '12px',
            }}
          >
            DR. PRIYA (YOU)
          </Typography>

          <Typography
            sx={{
              fontFamily: FONT,
              fontSize: '15px',
              fontWeight: 400,
              color: TEXT_DARK,
              lineHeight: '22px',
            }}
          >
            Mine literature for Type 2 Diabetes drug targets with confidence scoring
          </Typography>
        </Box>


        {/* Agent loading card */}
        <Box
          sx={{
            bgcolor: '#FFFFFF',
            border: `1px solid ${BORDER}`,
            borderRadius: '12px',
            p: '16px',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}
          >

            {/* Figma sparkle */}
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                bgcolor: '#F0FDFC',
                border: '1px solid #00BCD4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <LitMineXSparkleIcon size={16} />
            </Box>


            <Box sx={{ flex: 1 }}>

              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: '13px',
                  fontWeight: 700,
                  color: TEXT_DARK,
                  mb: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                INOVAPATH LITMINEX AGENT
              </Typography>


              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >

                <Box
                  sx={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                  }}
                >
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: TEAL,
                        animation: `dot-pulse-${i} 1.4s ease-in-out ${delay}s infinite`,

                        [`@keyframes dot-pulse-${i}`]: {
                          '0%, 80%, 100%': {
                            opacity: 0.3,
                          },
                          '40%': {
                            opacity: 1,
                          },
                        },
                      }}
                    />
                  ))}
                </Box>

                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: '13px',
                    color: TEXT_DARK,
                  }}
                >
                  Scanning PubMed and clinical databases for target literature...
                </Typography>

              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }


  /* ------------------------------------------------------------------------
     RESULTS
     ------------------------------------------------------------------------ */

  if (workflowPhase === 'litminex-results') {

    const firstUserMsg = {
      role: 'user',
      text: 'Mine literature for Type 2 Diabetes drug targets with confidence scoring',
    };


    return (
      <Box
        sx={{
          p: '24px 24px 24px 24px',
          bgcolor: GRAY_BG,
          overflowY: 'auto',
        }}
      >

        {/* ================================================================
            INITIAL USER MESSAGE
            ================================================================ */}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            pb: '12px',
          }}
        >
          <Box
            sx={{
              bgcolor: USER_MSG_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: '12px',
              p: '14px 18px',
              maxWidth: '600px',
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT,
                fontSize: '10px',
                fontWeight: 700,
                color: TEAL,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                mb: '6px',
              }}
            >
              DR. PRIYA (YOU)
            </Typography>

            <Typography
              sx={{
                fontFamily: FONT,
                fontSize: '14px',
                color: TEXT_DARK,
                lineHeight: '20px',
              }}
            >
              {firstUserMsg.text}
            </Typography>
          </Box>
        </Box>


        {/* ================================================================
            MAIN RESULTS CARD
            ================================================================ */}

        <Box
          sx={{
            bgcolor: '#FFFFFF',
            border: `1px solid ${BORDER}`,
            borderRadius: '12px',
            p: '20px',
          }}
        >

          {/* Agent header */}
          <LitMineXAgentHeader label="INOVAPATH LITMINEX AGENT" />


          {/* Description */}
          <Typography
            sx={{
              fontFamily: FONT,
              fontSize: '14px',
              color: TEXT_DARK,
              lineHeight: '20px',
              mb: '16px',
            }}
          >
            Literature mining complete. Found 124 articles across PubMed and clinical databases. Results ranked by confidence score with keyword extraction.
          </Typography>


          {/* ==============================================================
              TABLE + INSIGHTS
              ============================================================== */}

          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              overflow: 'auto',
            }}
          >

            {/* ============================================================
                RESULTS TABLE
                ============================================================ */}

            <Box
              sx={{
                flex: 1,
                minWidth: '660px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >

              {/* Results heading */}
              <Box
                sx={{
                  borderLeft: `3px solid ${TEAL}`,
                  pl: '10px',
                  mb: '6px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: '14px',
                    fontWeight: 700,
                    color: TEXT_DARK,
                  }}
                >
                  Results - 124 articles found
                </Typography>
              </Box>


              {/* Table */}
              <Box
                sx={{
                  border: `1px solid ${BORDER}`,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >

                {/* Header */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns:
                      '20px 24px minmax(160px,1fr) 52px 88px 140px 56px',
                    gap: '8px',
                    px: '12px',
                    py: '8px',
                    bgcolor: GRAY_BG,
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >

                  {[
                    null,
                    '#',
                    'TITLE',
                    'YEAR',
                    'CONFIDENCE',
                    'FOUND KEYWORDS',
                    'PREVIEW',
                  ].map((h, i) => (
                    h === null ? (
                      <Box key={i} />
                    ) : (
                      <Typography
                        key={i}
                        sx={{
                          fontFamily: FONT,
                          fontSize: '10px',
                          fontWeight: 700,
                          color: TEXT_MUTED,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </Typography>
                    )
                  ))}

                </Box>


                {/* Data rows */}
                {litMinexResults.map((article, idx) => {

                  const cc = confidenceColor(article.confidence);

                  return (
                    <Box
                      key={article.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns:
                          '20px 24px minmax(160px,1fr) 52px 88px 140px 56px',
                        gap: '8px',
                        px: '12px',
                        py: '10px',
                        borderBottom:
                          idx < litMinexResults.length - 1
                            ? `1px solid ${BORDER}`
                            : 'none',
                        bgcolor:
                          idx === 0
                            ? '#F0FDFC'
                            : '#FFFFFF',
                        alignItems: 'center',
                      }}
                    >

                      {/* Checkbox */}
                      <Checkbox
                        size="small"
                        checked={idx === 0}
                        readOnly
                        sx={{
                          p: 0,
                          color: BORDER,
                          '&.Mui-checked': {
                            color: TEAL,
                          },
                        }}
                      />


                      {/* Number */}
                      <Typography
                        sx={{
                          fontFamily: FONT,
                          fontSize: '12px',
                          color: TEXT_MUTED,
                        }}
                      >
                        {idx + 1}
                      </Typography>


                      {/* Title */}
                      <Typography
                        sx={{
                          fontFamily: FONT,
                          fontSize: '12px',
                          color: TEXT_DARK,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {article.title}
                      </Typography>


                      {/* Year */}
                      <Typography
                        sx={{
                          fontFamily: FONT,
                          fontSize: '12px',
                          color: TEXT_MUTED,
                        }}
                      >
                        {article.year}
                      </Typography>


                      {/* Confidence */}
                      <Box
                        sx={{
                          bgcolor: cc.bg,
                          borderRadius: '6px',
                          px: '8px',
                          py: '3px',
                          textAlign: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: FONT,
                            fontSize: '11px',
                            fontWeight: 700,
                            color: cc.text,
                          }}
                        >
                          {article.confidence}
                        </Typography>
                      </Box>


                      {/* Keywords */}
                      <Typography
                        sx={{
                          fontFamily: FONT,
                          fontSize: '11px',
                          color: TEXT_MUTED,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {article.keywords}
                      </Typography>


                      {/* Preview */}
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedArticle(article);
                          setShowArticleDetail(true);
                        }}
                      >
                        <VisibilityOutlined
                          sx={{
                            fontSize: 16,
                            color: TEAL,
                          }}
                        />
                      </IconButton>

                    </Box>
                  );
                })}

              </Box>


              {/* ==========================================================
                  PAGINATION
                  ========================================================== */}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '4px',
                  flexWrap: 'wrap',
                }}
              >

                {['‹', '1', '2', '3', '...', '12', '›'].map((p, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 26,
                      height: 26,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      bgcolor:
                        p === '1'
                          ? TEAL
                          : '#F1F5F9',
                      border:
                        p === '1'
                          ? 'none'
                          : `1px solid ${BORDER}`,
                      cursor: 'pointer',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT,
                        fontSize: '12px',
                        color:
                          p === '1'
                            ? '#FFFFFF'
                            : TEXT_MUTED,
                      }}
                    >
                      {p}
                    </Typography>
                  </Box>
                ))}

                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: '11px',
                    color: TEXT_MUTED,
                  }}
                >
                  Showing 1-10 of 47 articles
                </Typography>

              </Box>


              {/* ==========================================================
                  ACTION BUTTONS
                  ========================================================== */}

              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  pt: '4px',
                }}
              >
                {['Branch', 'Rerun', 'Export'].map(label => (
                  <Button
                    key={label}
                    sx={{
                      textTransform: 'none',
                      fontFamily: FONT,
                      fontSize: '13px',
                      fontWeight: 500,
                      color: TEXT_DARK,
                      bgcolor: '#FFFFFF',
                      border: `1px solid ${BORDER}`,
                      borderRadius: '8px',
                      px: '16px',
                      py: '7px',

                      '&:hover': {
                        bgcolor: '#F8FAFC',
                        borderColor: '#CBD5E1',
                      },
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Box>

            </Box>


            {/* ============================================================
                INSIGHTS PANEL
                ============================================================ */}

            <Box
              sx={{
                width: '220px',
                flexShrink: 0,
                border: `1px solid ${BORDER}`,
                borderRadius: '8px',
                p: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >

              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: '13px',
                  fontWeight: 700,
                  color: TEXT_DARK,
                }}
              >
                Insights
              </Typography>


              {litMinexResults[0] && (
                <Box
                  sx={{
                    bgcolor: '#F0FDFC',
                    border: '1px solid rgba(0,188,212,0.35)',
                    borderRadius: '8px',
                    p: '12px',
                  }}
                >

                  <Typography
                    sx={{
                      fontFamily: FONT,
                      fontSize: '11px',
                      fontWeight: 600,
                      color: TEAL,
                      mb: '6px',
                    }}
                  >
                    Article Relevance
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: FONT,
                      fontSize: '11px',
                      color: '#64748B',
                      lineHeight: 1.5,
                    }}
                  >
                    This article demonstrates strong evidence for Metformin-JAK2 interaction with direct insulin signaling pathway involvement and therapeutic potential.
                  </Typography>

                </Box>
              )}

            </Box>

          </Box>

        </Box>


        {/* ================================================================
            FOLLOW-UP CONVERSATION
            ================================================================ */}

        {chatMessages.map((msg, i) =>
          msg.role === 'user' ? (

            <Box
              key={`followup-user-${i}`}
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                pb: '12px',
                pt: '12px',
              }}
            >
              <Box
                sx={{
                  bgcolor: USER_MSG_BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: '12px',
                  p: '14px 18px',
                  maxWidth: '600px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: '10px',
                    fontWeight: 700,
                    color: TEAL,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    mb: '6px',
                  }}
                >
                  DR. PRIYA (YOU)
                </Typography>

                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: '14px',
                    color: TEXT_DARK,
                    lineHeight: '20px',
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            </Box>

          ) : (

            <Box
              key={`followup-agent-${i}`}
              sx={{
                pb: '12px',
              }}
            >
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '12px',
                  p: '20px',
                }}
              >

                <LitMineXAgentHeader label="INOVAPATH LITMINEX AGENT" />

                {msg.articleCard && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: GRAY_BG,
                      border: `1px solid ${BORDER}`,
                      borderRadius: '8px',
                      p: '10px 14px',
                      mb: '10px',
                      gap: '10px',
                    }}
                  >
                    <Typography sx={{ fontSize: '18px', lineHeight: 1 }}>
                      📄
                    </Typography>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: FONT,
                          fontSize: '12px',
                          fontWeight: 600,
                          color: TEXT_DARK,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {msg.articleCard.title}
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: FONT,
                          fontSize: '11px',
                          color: TEXT_MUTED,
                        }}
                      >
                        {msg.articleCard.author}
                        &nbsp;&nbsp;
                        {msg.articleCard.year}
                      </Typography>
                    </Box>

                    <IconButton size="small" sx={{ p: '2px' }}>
                      <CloseOutlined sx={{ fontSize: 14, color: TEXT_MUTED }} />
                    </IconButton>
                  </Box>
                )}

                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: '14px',
                    color: TEXT_DARK,
                    lineHeight: '22px',
                  }}
                >
                  {msg.text}
                </Typography>

              </Box>
            </Box>
          )
        )}

      </Box>
    );
  }


  return null;
};


export default LiteminexPhase;