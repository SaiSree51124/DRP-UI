import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Timeline as TimelineIcon,
  LinearScaleOutlined as LinearScaleOutlinedIcon,
} from '@mui/icons-material';
import { C, GRAD, GRAD_H } from '../../utils/colors';

const NODE_COLORS = {
  disease:            '#0A2E52',
  'gene/protein':     '#2D6A4F',
  pathway:            '#007B82',
  biological_process: '#1E3A5F',
  molecular_function: '#02A7B0',
  cellular_component: '#5B6FA3',
  complex:            '#7B5EA7',
  genetic_disorder:   '#D32F2F',
  tissue:             '#7FB685',
  cell:               '#D7FCFE',
  drug:               '#43A047',
  other:              '#64748B',
};

const contrastText = (hex) => {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return (r*299 + g*587 + b*114)/1000 > 128 ? '#000' : '#fff';
};

const KGMetaPath = ({ disease, API_BASE_URL }) => {
  const [metapathData, setMetapathData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedTarget, setExpandedTarget] = useState(false);

  const [maxHops, setMaxHops] = useState(3);
  const [targetLimit, setTargetLimit] = useState(10);
  const [maxPathsPerTarget, setMaxPathsPerTarget] = useState(10);

  const fetchMetapaths = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/metapaths`, {
        params: {
          disease: disease,
          limit: targetLimit,
          max_hops: maxHops,
          max_paths: maxPathsPerTarget,
        }
      });

      const data = response.data;

      if (data.success) {
        setMetapathData(data);
        if (data.metapaths?.length > 0) {
          setExpandedTarget(data.metapaths[0].target_id);
        }
      } else {
        setError(data.message || 'Failed to load reasoning paths');
      }
    } catch (err) {
      console.error('Metapaths fetch failed:', err);
      setError(err.response?.data?.message || err.message || 'Could not connect to the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!disease) return;
    fetchMetapaths();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disease]);

  const handleAccordionChange = (targetId) => (event, isExpanded) => {
    setExpandedTarget(isExpanded ? targetId : false);
  };

  const getHopChipColor = (hopCount) => {
    const colors = {
      1: C.navy,
      2: C.teal,
      3: C.sage,
    };
    return colors[hopCount] || C.muted;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 8, flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={60} sx={{ color: C.navy, mb: 3}} />
        <Typography variant="h5" sx={{ color: C.navy, fontWeight: 600, mb: 2 }}>
          Loading reasoning paths...
        </Typography>
        <Typography variant="body1" sx={{ color: C.muted, mb:1 }}>
          Disease:<Box component="span" sx={{ color: C.navy, fontWeight: 600 }}>
            {disease || "Not specified"}
          </Box>
        </Typography>
        <Typography variant="body2" sx={{ color: C.muted }}>
          Fetching metapaths to the top targets 
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!metapathData) {
    return (
      <Box sx={{ p: 8, textAlign: 'center', 
        background: C.sky,
        borderRadius: 2, m: 2 }}>
        <LinearScaleOutlinedIcon sx={{ fontSize: "80px", color: C.navy, mb: 3 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: C.navy, mb: 2 }}>
          Select a disease to see reasoning paths
        </Typography>
        <Typography variant="body1" sx={{ color: C.muted }}>
          Current disease: {" "} 
          <Box component="span" sx={{ color: C.navy, fontWeight: 600 }}>
            {disease || "None selected"}
          </Box>
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
    
      {/* Header + Stats */}
      <Paper elevation={2} sx={{ mb: 2, overflow: 'hidden', background : "white" }}>
        <Box sx={{ background: "white", color: C.navy, p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimelineIcon />
          <Typography variant="h5" fontWeight={600}>
            Meta-Paths — {metapathData.disease}
          </Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', background: C.teal, color: 'white' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 700, color:"white"}}>
                    {metapathData.summary?.total_paths || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ fontweight: 600, color: "white", textTransform: "uppercase"}}>
                    Total Paths</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', background: C.teal, color: 'white' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 700, color:"white"}}>
                    {metapathData.targets_analyzed || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ fontweight: 600, color: "white", textTransform: "uppercase"}}>
                    Targets
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', background: C.teal, color: 'white' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 700, color:"white"}}>
                    {metapathData.max_hops_searched || maxHops}
                  </Typography>
                  <Typography variant="body2" sx={{ fontweight: 600, color: "white", textTransform: "uppercase"}}>
                    Max Hops
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', background: C.teal, color: 'white' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 700, color:"white"}}>
                    {metapathData.summary?.avg_paths_per_target?.toFixed(1) || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ fontweight: 600, color: "white", textTransform: "uppercase"}}>
                    Avg Paths/Target
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Targets List */}
      <Stack spacing={2}>
        {metapathData.metapaths.map((target, idx) => (
          <Accordion
            key={target.target_id}
            expanded={expandedTarget === target.target_id}
            onChange={handleAccordionChange(target.target_id)}
            sx={{ borderRadius: 2, overflow: 'hidden' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                <Typography fontWeight="bold" minWidth={35} color="primary">
                  {idx + 1}.
                </Typography>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {target.target_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {target.target_id} • {target.total_paths} path{target.total_paths !== 1 ? 's' : ''}{' '}
                    {target.paths_by_hop && `(${Object.entries(target.paths_by_hop)
                      .map(([h, c]) => `${h}: ${c}`)
                      .join(', ')})`}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                  <Typography variant="caption" color="text.secondary">
                    Score
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={target.score >= 80 ? 'success.main' : target.score >= 60 ? 'warning.main' : 'text.primary'}
                  >
                    {target.score}
                  </Typography>
                </Box>
              </Stack>
            </AccordionSummary>

            <AccordionDetails sx={{ bgcolor: 'grey.50', pt: 1 }}>
              {target.paths?.length === 0 ? (
                <Typography color="text.secondary" align="center" py={4}>
                  No reasoning paths found within current hop limit
                </Typography>
              ) : (
                <Stack spacing={2.5}>
                  {target.paths.map((path, i) => (
                    <Paper
                      key={i}
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        borderColor: getHopChipColor(path.hop_count),
                        borderWidth: 2,
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={path.path_type}
                            size="small"
                            sx={{
                              bgcolor: getHopChipColor(path.hop_count),
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                          <Typography variant="body2">{path.path}</Typography>
                        </Stack>

                        {/* Visual Path */}
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          {/* Disease node — actual disease name */}
                          <Chip
                            label={metapathData.disease}
                            sx={{ bgcolor: NODE_COLORS.disease, color: contrastText(NODE_COLORS.disease), fontWeight: 600 }}
                          />
                          {/* Intermediate nodes — colored by node type */}
                          {path.node_names?.slice(1, -1).map((name, nIdx) => {
                            const nodeType = path.node_types?.[nIdx + 1] || 'other';
                            const bg = NODE_COLORS[nodeType] ?? NODE_COLORS.other;
                            return (
                              <React.Fragment key={nIdx}>
                                <span style={{ color: C.muted }}>→</span>
                                <Chip
                                  label={name}
                                  size="small"
                                  sx={{ bgcolor: bg, color: contrastText(bg), fontWeight: 500 }}
                                />
                              </React.Fragment>
                            );
                          })}
                          <span style={{ color: C.muted }}>→</span>
                          <Chip
                            label={target.target_name}
                            sx={{ bgcolor: C.sage, color: 'white' }}
                          />
                        </Stack>

                        {/* Edges */}
                        {path.edges?.length > 0 && (
                          <>
                            <Divider />
                            <Typography variant="caption" color="text.secondary">
                              Relationships:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {path.edges.map((edge, idx) => (
                                <Chip
                                  key={idx}
                                  label={edge.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Stack>
                          </>
                        )}
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </AccordionDetails>
          </Accordion>
        ))}

        {metapathData.metapaths.length === 0 && (
          <Paper sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}>
            <Typography>No targets with paths found</Typography>
            <Typography variant="caption">Try increasing max hops</Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  );
};

export default KGMetaPath;