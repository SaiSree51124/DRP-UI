import { useState } from "react";
import {
  X,
  Plus,
  Check,
  Target,
  FlaskConical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./WelcomeScreen.css";

/**
 * Backward-compatible background export.
 */
export const BG_IMAGE =
  "radial-gradient(100% 100% at 50% 50%, rgba(0, 194, 181, 0.65) 0%, rgba(0, 194, 181, 0) 100%), " +
  "radial-gradient(100% 100% at 50% 50%, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0) 100%), " +
  "#f8fafc";


/* ============================================================
   Therapeutic specialties
   ============================================================ */

const SPECIALTIES = [
  {
    label: "Oncology / Cancer",
    defaultOn: true,
  },
  {
    label: "Neurodegenerative (Alzheimer's, Parkinson's)",
    defaultOn: false,
  },
  {
    label: "Diabetes",
    defaultOn: true,
  },
  {
    label: "Cardiovascular Systems",
    defaultOn: false,
  },
  {
    label: "Immunology & Inflammation",
    defaultOn: false,
  },
  {
    label: "Infectious Viruses",
    defaultOn: false,
  },
];


/* ============================================================
   Initial search tags
   ============================================================ */

const INITIAL_SEARCH_TAGS = [
  "Type 2 Diabetes",
  "Oncology",
  "Rare Diseases",
];


/* ============================================================
   iNovaPath Logo
   Figma properties:

   Frame:
   Width  : 106px
   Height : 28px
   Radius : 20px
   Padding: 6px 12px

   Text:
   Content       : ◇ iNovaPath
   Width         : 82px
   Height        : 16px
   Font          : Inter
   Weight        : 600
   Size           : 13px
   Line height    : 100%
   Letter spacing: 0%
   Color          : #00C2B5
   ============================================================ */

function NovaPathLogo() {
  return (
    <div
      className="ws-badge"
      aria-label="iNovaPath"
    >
      <span className="ws-logo-text">
        ◈ iNovaPath
      </span>
    </div>
  );
}


/* ============================================================
   Step Card
   ============================================================ */

function StepCard({
  step,
  iconType,
  title,
  description,
  tags,
}) {
  return (
    <article className="ws-step-card">

      {/* Step header */}

      <div className="ws-step-header">

        {/* Figma STEP badge */}

        <span className="ws-step-label">
          STEP {step}
        </span>


        {/* Step icon */}

        <div
          className="ws-step-icon"
          aria-hidden="true"
        >
          {iconType === "target" ? (
            <Target
              size={24}
              strokeWidth={2}
            />
          ) : (
            <FlaskConical
              size={22}
              strokeWidth={2}
            />
          )}
        </div>

      </div>


      {/* Title */}

      <h2>
        {title}
      </h2>


      {/* Description */}

      <p>
        {description}
      </p>


      {/* Tags */}

      <div className="ws-tag-row">

        {tags.map((tag) => (
          <span
            className="ws-tag-pill"
            key={tag}
          >
            {tag}
          </span>
        ))}

      </div>

    </article>
  );
}


/* ============================================================
   Search Tag
   ============================================================ */

function SearchTag({
  label,
  onRemove,
}) {
  return (
    <span className="ws-search-tag">

      <span>
        {label}
      </span>


      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
      >
        <X size={12} />
      </button>

    </span>
  );
}


/* ============================================================
   Welcome Screen
   ============================================================ */

export default function WelcomeScreen({
  userName = "Priya",
  onSave,
  onSkip,
}) {
  const navigate = useNavigate();


  /* ============================================================
     Selected specialties state
     ============================================================ */

  const [selected, setSelected] = useState(() =>
    Object.fromEntries(
      SPECIALTIES.map(
        ({ label, defaultOn }) => [
          label,
          defaultOn,
        ]
      )
    )
  );


  /* ============================================================
     Search tags state
     ============================================================ */

  const [searchTags, setSearchTags] =
    useState(INITIAL_SEARCH_TAGS);

  const [draft, setDraft] =
    useState("");


  /* ============================================================
     Toggle specialty
     ============================================================ */

  const toggleSpecialty = (label) => {
    setSelected((previous) => ({
      ...previous,
      [label]: !previous[label],
    }));
  };


  /* ============================================================
     Remove search tag
     ============================================================ */

  const removeSearchTag = (label) => {
    setSearchTags((previous) =>
      previous.filter(
        (item) => item !== label
      )
    );
  };


  /* ============================================================
     Add search tag
     ============================================================ */

  const addDraftTag = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    const value = draft.trim();

    if (!value) {
      return;
    }

    event.preventDefault();

    setSearchTags((previous) =>
      previous.includes(value)
        ? previous
        : [...previous, value]
    );

    setDraft("");
  };


  /* ============================================================
     Save
     ============================================================ */

  const handleSave = () => {
    onSave?.({
      selected,
      searchTags,
    });

    navigate("/dashboard/new-research");
  };


  /* ============================================================
     Skip
     ============================================================ */

  const handleSkip = () => {
    onSkip?.();

    navigate("/dashboard/new-research");
  };


  return (
    <main className="welcome-screen">

      {/* ========================================================
          BACKGROUND
          ======================================================== */}

      <div
        className="ws-background"
        aria-hidden="true"
      >

        {/* Main glow */}

        <div className="bg-glow-main" />


        {/* Center rings */}

        <div className="bg-ring bg-ring-1" />

        <div className="bg-ring bg-ring-2" />

        <div className="bg-ring bg-ring-3" />


        {/* Corner glows */}

        <div className="bg-glow bg-glow-tl-1" />

        <div className="bg-glow bg-glow-tl-2" />

        <div className="bg-glow bg-glow-mid-left" />

        <div className="bg-glow bg-glow-top-right" />

        <div className="bg-glow bg-glow-bottom-right" />

      </div>


      {/* ========================================================
          VIEWPORT
          ======================================================== */}

      <div className="ws-viewport">

        <div className="ws-design-frame">


          {/* ====================================================
              HERO
              ==================================================== */}

          <header className="ws-hero">

            {/* iNovaPath Figma logo */}

            <NovaPathLogo />


            {/* Heading */}

            <h1>
              Welcome to iNovaPath, {userName}!
            </h1>


            {/* Description */}

            <p>
              Your AI-powered research assistant.
              Let&apos;s get you set up to accelerate
              therapeutic discoveries in under 2 minutes.
            </p>

          </header>


          {/* ====================================================
              GETTING STARTED GUIDE
              ==================================================== */}

          <div className="ws-guide">

            <span />

            <strong>
              Getting started guide
            </strong>

            <span />

          </div>


          {/* ====================================================
              STEP CARDS
              ==================================================== */}

          <section className="ws-onboarding">

            <div className="ws-step-grid">


              {/* ==================================================
                  STEP 1
                  ================================================== */}

              <StepCard
                step={1}
                iconType="target"
                title="Set Research Focus"
                description="Identify therapeutic focus areas to customize recommendations for target protein and drug repurposing algorithms."
                tags={[
                  "Oncology",
                  "Rare Diseases",
                  "Neurology",
                ]}
              />


              {/* ==================================================
                  STEP 2
                  ================================================== */}

              <StepCard
                step={2}
                iconType="flask"
                title="Run First Analysis"
                description="Pose natural language questions to the TxKG engine or start high-throughput screening on approved drug structures."
                tags={[
                  "TxKG Query",
                  "Target Mapping",
                  "SaaS Pipeline",
                ]}
              />

            </div>

          </section>


          {/* ====================================================
              QUICK START
              ==================================================== */}

          <section className="ws-quick-card">

            <h2>
              Quick Start: Select Therapeutic Targets of Interest
            </h2>


            <p>
              Search or select therapeutic areas to seed
              your home dashboard view.
            </p>


            {/* Search */}

            <div className="ws-search-box">

              {searchTags.map((tag) => (
                <SearchTag
                  key={tag}
                  label={tag}
                  onRemove={() =>
                    removeSearchTag(tag)
                  }
                />
              ))}


              <input
                type="text"
                value={draft}
                onChange={(event) =>
                  setDraft(event.target.value)
                }
                onKeyDown={addDraftTag}
                placeholder="Add more disease areas..."
                aria-label="Add disease area"
              />

            </div>


            {/* Therapeutic areas */}

            <div className="ws-specialty-row">

              {SPECIALTIES.map((specialty) => {

                const active =
                  selected[specialty.label];


                return (
                  <button
                    type="button"
                    key={specialty.label}
                    className={`ws-specialty ${
                      active
                        ? "is-selected"
                        : ""
                    }`}
                    onClick={() =>
                      toggleSpecialty(
                        specialty.label
                      )
                    }
                    aria-pressed={active}
                  >

                    <span>
                      {specialty.label}
                    </span>


                    {active ? (
                      <Check
                        size={13}
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    ) : (
                      <Plus
                        size={13}
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    )}

                  </button>
                );

              })}

            </div>

          </section>


          {/* ====================================================
              ACTIONS
              ==================================================== */}

          <div className="ws-actions">

            <button
              type="button"
              className="ws-primary"
              onClick={handleSave}
            >
              Save Focus &amp; Get Started
            </button>


            <div className="ws-skip">

              <span>
                Skip for now -
              </span>


              <button
                type="button"
                onClick={handleSkip}
              >
                take me to the new research task
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}