import React, { createContext, useContext, useState } from "react";

const initialProjects = [
  { name: "Metformin for Oncology",  disease: "Pancreatic Cancer",      status: "ACTIVE",   module: "TxKG"        },
  { name: "Rapamycin for Neuro",     disease: "Alzheimer's Disease",    status: "ACTIVE",   module: "LitMineX"    },
  { name: "Sildenafil for CV",       disease: "Pulmonary Hypertension", status: "ON HOLD",  module: "CurateX"     },
  { name: "Anastrozole for Lung",    disease: "NSCLC",                  status: "ACTIVE",   module: "TxKG"        },
  { name: "Propranolol for Hema",    disease: "Hemangioma",             status: "ACTIVE",   module: "LitMineX"    },
];

// Extract disease name from "Drug for Disease" pattern
const extractDisease = (name) => {
  const match = name.match(/for (.+)$/i);
  if (!match) return "—";
  const part = match[1].trim();
  const lower = part.toLowerCase();
  if (lower.includes("disease") || lower.includes("cancer") || lower.includes("syndrome") ||
      lower.includes("fibrosis") || lower.includes("myeloma") || lower.includes("hypertension")) {
    return part;
  }
  return `${part}'s Disease`.replace(/''s/, "'s");
};

const ProjectsContext = createContext(null);

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState(initialProjects);

  const addProject = (name) => {
    const newProject = {
      name,
      disease: extractDisease(name),
      status: "ACTIVE",
      module: "TxKG",
      isNew: true,
    };
    setProjects((prev) => [newProject, ...prev]);
  };

  return (
    <ProjectsContext.Provider value={{ projects, addProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectsContext);
