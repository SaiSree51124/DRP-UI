import React, { useState } from "react";
import StructureDownload from "./StructureDownload";
import StructurePreparation from "./StructurePreparation";
import VirtualScreening from "./VirtualScreening";
import DataAnalysis from "./DataAnalysis";
import TabsBar from "./TabsBar";

const tabs = [
  { name: "Structure Download", component: <StructureDownload /> },
  { name: "Structure Preparation", component: <StructurePreparation /> },
  { name: "Virtual Screening", component: <VirtualScreening /> },
  { name: "Data Analysis", component: <DataAnalysis /> },
];

const ScreeningSuite = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="container mx-auto mt-6">
      <TabsBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        <div className="p-4 border border-gray-300 rounded-lg">
          {tabs[activeTab].component}
        </div>
      </div>
    </div>
  );
};

export default ScreeningSuite;
