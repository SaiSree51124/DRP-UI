import React, { useState, useEffect } from "react";
import StructureDownload from "./StructureDownload";
import StructurePreparation from "./StructurePreparation";
import VirtualScreening from "./VirtualScreening";
import DataAnalysis from "./DataAnalysis";

const ScreeningSuite = () => {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  const tabs = [
    { name: "Structure Download", component: <StructureDownload /> },
    { name: "Structure Preparation", component: <StructurePreparation /> },
    { name: "Virtual Screening", component: <VirtualScreening /> },
    { name: "Data Analysis", component: <DataAnalysis /> },
  ];

  return (
    <div className="container mx-auto mt-6">
      {/* Tab Buttons */}
      <div className="flex border-b-2 border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`py-2 px-6 text-lg font-medium ${
              activeTab === index
                ? "border-b-4 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            } transition-all duration-200 disabled:text-gray-300 disabled:cursor-not-allowed`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {
          <div className="p-4 border border-gray-300 rounded-lg">
            {tabs[activeTab].component}
          </div>
        }
      </div>
    </div>
  );
};

export default ScreeningSuite;
