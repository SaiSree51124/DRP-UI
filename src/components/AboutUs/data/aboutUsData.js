import { C } from "../../../utils/colors";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import HubIcon from "@mui/icons-material/Hub";
import ArticleIcon from "@mui/icons-material/Article";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import TimelineIcon from "@mui/icons-material/Timeline";

export const modules = [
  {
    id: "txkg",
    tag: "Knowledge Graph",
    Icon: AccountTreeIcon,
    title: "TxKG — Target Identification",
    subtitle: "Disease-Protein-Drug Network Analysis",
    from: C.navy, to: C.slate,
    badge: "KG",
    stats: ["Context-aware graph", "2M+ relationships", "AI confidence scoring"],
    body: "Explores biological networks and disease pathways to identify promising protein targets. Analyzes disease–protein–drug relationships with AI-driven confidence scores, accelerating early-stage discovery.",
    diagram: "network",
  },
  {
    id: "litmine",
    tag: "Literature Mining",
    Icon: ArticleIcon,
    title: "LitMineX — Evidence Extraction",
    subtitle: "Semantic PubMed Retrieval & MeSH-Enhanced Search",
    from: C.teal, to: "#005F66",
    badge: "LLM",
    stats: ["MeSH-enhanced semantic search", "LLM-driven contextual retrieval", "Article scoring & ranking"],
    body: "Retrieves scientifically relevant PubMed articles using semantic search powered by MeSH terminology and contextual understanding. Filters studies based on user-defined keywords and related biomedical concepts to deliver precise, high-quality evidence for drug repurposing. The component also streamlines literature ranking, relevance scoring, and full-text PDF access for faster scientific exploration.",
    diagram: "flow",
  },
  {
    id: "curatex",
    tag: "Data Curation Engine",
    Icon: HubIcon,
    title: "CurateX — Compound Curation",
    subtitle: "AI-Powered Compound Retrieval & Validation",
    from: C.sage, to: C.teal,
    badge: "AI",
    stats: ["Semantic compound matching", "Confidence-based ranking", "Validated evidence sources"],
    body: "Retrieves and validates drug compounds using AI-driven semantic analysis of user-defined criteria. Integrates trusted medical sources and PubMed evidence to generate confidence-ranked, verified compound profiles for downstream screening.",
    diagram: "grid",
  },
  {
    id: "screen",
    tag: "Virtual Screening",
    Icon: SettingsSuggestRoundedIcon,
    title: "ScreenSuite — Interaction Analysis",
    subtitle: "AutoDock Vina + PLIP Profiling",
    from: C.teal, to: C.navy,
    badge: "Docking",
    stats: ["AutoDock Vina engine", "PLIP interaction profiling", "H-bonds, π-stacking"],
    body: "Automates retrieval, preparation, and high-throughput docking. Post-docking, the PLIP module profiles hydrogen bonds, hydrophobic contacts, salt bridges, and π-stacking to prioritize effective candidates.",
    diagram: "scatter",
  },
  {
    id: "novsearch",
    tag: "Novelty Search",
    Icon: TravelExploreIcon,
    title: "NovSearch — Patent Intelligence",
    subtitle: "Literature & Patent Landscape Analysis",
    from: C.navy, to: C.sage,
    badge: "GenAI",
    stats: ["Patent landscape analysis", "Prior art identification", "Novelty & FTO assessment"],
    body: "Analyzes scientific concepts, drug candidates, and therapeutic strategies against existing patent literature to identify prior art, assess novelty, evaluate freedom-to-operate risks, and generate evidence-backed patent intelligence insights.",
    diagram: "bubble",
  },
];

export const flowSteps = [
  { label: "Target Identification",  Icon: AccountTreeIcon,              badge: "KG",    from: C.navy,  to: C.slate,    desc: "Identify disease-linked protein targets" },
  { label: "Literature Mining",       Icon: ArticleIcon,                  badge: "LLM",   from: C.slate, to: C.teal,     desc: "Semantic scientific evidence extraction" },
  { label: "Data Curation",           Icon: HubIcon,                      badge: "LLM",   from: C.teal,  to: "#00696F",  desc: "LLM-validated compound collection" },
  { label: "Virtual Screening",       Icon: SettingsSuggestRoundedIcon,   badge: "Dock",  from: "#00696F", to: C.sage,   desc: "Docking & interaction profiling" },
  { label: "Novelty Search",          Icon: TravelExploreIcon,            badge: "GenAI", from: C.sage,  to: C.navy,     desc: "Patent analysis and novelty assessment" },
];

export const metrics = [
  { value: "Scientist-Led",  label: "Interactive validation and decision-making across every analysis stage", Icon: PsychologyIcon },
  { value: "Context-Aware",  label: "Connected biological and therapeutic reasoning across workflows",          Icon: HubIcon },
  { value: "Export-Ready",   label: "Structured outputs and downloadable research artifacts",                  Icon: DownloadDoneIcon },
  { value: "End-to-End",     label: "Automated pipeline from target to novelty check",                         Icon: TimelineIcon },
];
