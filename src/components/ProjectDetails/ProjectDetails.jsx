import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Typography } from "@mui/material";

import {
  ChevronRight,
  Download,
  EditOutlined,
  Check,
  ArrowForward,
} from "@mui/icons-material";

import "./ProjectDetails.css";

/* =========================================================
   PROJECT DATA
   ========================================================= */

const PROJECTS = {
  "1": {
    id: "1",
    name: "Type 2 Diabetes Drug Repurposing",
    shortName: "JAK2 Repurposing",
    disease: "Type 2 Diabetes",
    subtitle: "AMPK and SIRT1 pathway modulation",

    overview:
      "This project looked at repurposing options for type 2 diabetes, moving through target identification, literature review, candidate curation, interaction screening, and novelty assessment. AMPK and SIRT1 were the two targets carried through the pipeline, and aspirin emerged as the leading repurposing candidate against AMPK, backed by profile fit, docking results, and low patent risk.",

    targetIdentification:
      "AMPK and SIRT1 surfaced as the two strongest targets connected to type 2 diabetes in the knowledge graph, scoring 88 and 74 respectively. Both sit within the same glucose regulation and insulin sensitivity network, but AMPK shows tighter connectivity and a stronger supporting evidence base, making it the primary target carried forward, with SIRT1 retained as a secondary target given its close pathway relationship to AMPK.",

    literatureReview:
      "AMPK acts as a central energy-sensing enzyme in skeletal muscle and liver, and its activation increases glucose uptake, suppresses hepatic glucose production, and improves overall insulin sensitivity. The same pathway metformin engages clinically. SIRT1 operates alongside AMPK in this same signaling network, deacetylating downstream targets that regulate mitochondrial function and lipid metabolism.",

    candidateSelection:
      "Against a profile built from AMPK's known ligands, aspirin aligns closely on molecular weight, bioavailability, and half-life, and carries a documented mild insulin-sensitizing effect at higher doses. Ibuprofen matches on fewer criteria, making aspirin the stronger candidate.",

    interactionScreening:
      "AMPK paired with aspirin shows the strongest binding affinity (-9.4 kcal/mol) and the most favorable interaction within the target's active pocket. SIRT1 paired with either compound shows weaker affinity, reinforcing AMPK as the more viable target.",

    noveltyAssessment:
      "Patent claims around AMPK-pathway modulation in metabolic disease are broad but general. No claim currently covers aspirin's use for this indication, leaving clear room to pursue without immediate freedom-to-operate conflict.",

    conclusion:
      "Aspirin targeting AMPK stands out as the strongest repurposing candidate for type 2 diabetes, holding up across target relevance, literature support, profile fit, docking strength, and patent risk, and is worth moving into preclinical validation next.",

    modules: [
      "TxKG",
      "LitMineX",
      "CurateX",
      "ScreenSuite",
      "NovSearch",
    ],
  },

  "2": {
    id: "2",
    name: "Rapamycin for Neuro",
    shortName: "Rapamycin Repurposing",
    disease: "Alzheimer's Disease",
    subtitle: "Neurodegenerative pathway modulation",

    overview:
      "This project evaluates potential repurposing opportunities for Alzheimer's Disease through target identification, literature review, candidate curation, interaction screening, and novelty assessment.",

    targetIdentification:
      "Candidate targets were identified through the knowledge graph and prioritized based on connectivity, supporting evidence, and pathway relevance.",

    literatureReview:
      "Literature evidence was reviewed to understand target biology, pathway relationships, and potential therapeutic relevance.",

    candidateSelection:
      "Candidate compounds were evaluated against target profiles and supporting evidence.",

    interactionScreening:
      "Potential target-compound interactions were evaluated based on binding and interaction strength.",

    noveltyAssessment:
      "Patent and novelty considerations were evaluated for the shortlisted repurposing opportunities.",

    conclusion:
      "The strongest candidate can be progressed based on target relevance, literature support, interaction strength, and novelty assessment.",

    modules: [
      "TxKG",
      "LitMineX",
      "CurateX",
      "ScreenSuite",
      "NovSearch",
    ],
  },
};

/* =========================================================
   PROJECT DETAILS
   ========================================================= */

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const project = PROJECTS[projectId] || PROJECTS["1"];

  return (
    <div className="project-details">
      <div className="project-details__content">

        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <header className="project-details__breadcrumb">
          <div className="project-details__breadcrumb-left">

            <button
              type="button"
              className="project-details__breadcrumb-text project-details__breadcrumb-button"
              onClick={() => navigate("/dashboard/active-projects")}
            >
              Projects
            </button>

            <ChevronRight className="project-details__breadcrumb-icon" />

            <span className="project-details__breadcrumb-current">
              {project.name}
            </span>

          </div>

          <div className="project-details__breadcrumb-right">
            <span className="project-details__breadcrumb-text">
              Projects
            </span>

            <span className="project-details__breadcrumb-separator">
              /
            </span>

            <span className="project-details__breadcrumb-current">
              <strong>{project.shortName}</strong>
            </span>
          </div>
        </header>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="project-details__header">

          <div className="project-details__title-block">

            <Typography
              component="h1"
              className="project-details__title"
            >
              Repurposing Assessment: {project.disease}
            </Typography>

            <Typography
              component="p"
              className="project-details__subtitle"
            >
              {project.subtitle}
            </Typography>

          </div>

          {/* ===================================================
              ACTION BUTTONS
          =================================================== */}

          <div className="project-details__actions">

            <button
              type="button"
              className="project-details__button project-details__export-button"
              onClick={() => {
                console.log("Export project:", project.id);
              }}
            >
              <Download />

              <span>
                Export Project Data
              </span>
            </button>

            <button
              type="button"
              className="project-details__button project-details__edit-button"
              onClick={() => {
                console.log("Edit project:", project.id);
              }}
            >
              <EditOutlined />

              <span>
                Edit Project
              </span>
            </button>

          </div>
        </section>

        {/* =====================================================
            PIPELINE
        ===================================================== */}

        <section className="project-details__pipeline">

          <div className="project-details__pipeline-header">
            <h2 className="project-details__pipeline-title">
              Pipeline Modules Completed
            </h2>
          </div>

          <div className="project-details__pipeline-body">

            <div className="project-details__steps">

              {project.modules.map((module) => (
                <div
                  className="project-details__step"
                  key={module}
                >
                  <div className="project-details__step-icon">
                    <Check />
                  </div>

                  <span className="project-details__step-label">
                    {module}
                  </span>
                </div>
              ))}

            </div>

          </div>
        </section>

        {/* =====================================================
            CONTENT SECTIONS
        ===================================================== */}

        <div className="project-details__sections">

          {/* OVERVIEW */}

          <section className="project-details__section">

            <div className="project-details__section-header">
              <h2 className="project-details__section-title">
                Overview
              </h2>
            </div>

            <div className="project-details__section-content">
              <p>
                {project.overview}
              </p>
            </div>

          </section>

          {/* TARGET IDENTIFICATION */}

          <section className="project-details__section">

            <div className="project-details__section-header">

              <h2 className="project-details__section-title">
                Target Identification
              </h2>

              <button
                type="button"
                className="project-details__session-link"
                onClick={() =>
                  navigate(
                    `/dashboard/session/txkg/${project.id}`
                  )
                }
              >
                <span>
                  View TxKG session
                </span>

                <ArrowForward />
              </button>

            </div>

            <div className="project-details__section-content">
              <p>
                {project.targetIdentification}
              </p>
            </div>

          </section>

          {/* LITERATURE REVIEW */}

          <section className="project-details__section">

            <div className="project-details__section-header">

              <h2 className="project-details__section-title">
                Literature Review
              </h2>

              <button
                type="button"
                className="project-details__session-link"
                onClick={() =>
                  navigate(
                    `/dashboard/session/litminex/${project.id}`
                  )
                }
              >
                <span>
                  View LitMineX session
                </span>

                <ArrowForward />
              </button>

            </div>

            <div className="project-details__section-content">
              <p>
                {project.literatureReview}
              </p>
            </div>

          </section>

          {/* CANDIDATE SELECTION */}

          <section className="project-details__section">

            <div className="project-details__section-header">

              <h2 className="project-details__section-title">
                Candidate Selection
              </h2>

              <button
                type="button"
                className="project-details__session-link"
                onClick={() =>
                  navigate(
                    `/dashboard/session/curatex/${project.id}`
                  )
                }
              >
                <span>
                  View CurateX session
                </span>

                <ArrowForward />
              </button>

            </div>

            <div className="project-details__section-content">
              <p>
                {project.candidateSelection}
              </p>
            </div>

          </section>

          {/* INTERACTION SCREENING */}

          <section className="project-details__section">

            <div className="project-details__section-header">

              <h2 className="project-details__section-title">
                Interaction Screening
              </h2>

              <button
                type="button"
                className="project-details__session-link"
                onClick={() =>
                  navigate(
                    `/dashboard/session/screensuite/${project.id}`
                  )
                }
              >
                <span>
                  View ScreenSuite session
                </span>

                <ArrowForward />
              </button>

            </div>

            <div className="project-details__section-content">
              <p>
                {project.interactionScreening}
              </p>
            </div>

          </section>

          {/* NOVELTY ASSESSMENT */}

          <section className="project-details__section">

            <div className="project-details__section-header">

              <h2 className="project-details__section-title">
                Novelty Assessment
              </h2>

              <button
                type="button"
                className="project-details__session-link"
                onClick={() =>
                  navigate(
                    `/dashboard/session/novsearch/${project.id}`
                  )
                }
              >
                <span>
                  View NovSearch session
                </span>

                <ArrowForward />
              </button>

            </div>

            <div className="project-details__section-content">
              <p>
                {project.noveltyAssessment}
              </p>
            </div>

          </section>

          {/* CONCLUSION */}

          <section className="project-details__section project-details__conclusion">

            <div className="project-details__section-header">
              <h2 className="project-details__section-title">
                Conclusion
              </h2>
            </div>

            <div className="project-details__section-content">
              <p>
                {project.conclusion}
              </p>
            </div>

          </section>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;