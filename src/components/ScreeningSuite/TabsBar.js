import React from "react";

const TabsBar = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex border-b-2 border-gray-300">
    {tabs.map((tab, index) => (
      <button
        key={index}
        onClick={() => onTabChange(index)}
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
);

export default TabsBar;
