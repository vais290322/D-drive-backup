import React, { useState } from 'react';

const Tabs = ({ tabs, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === index
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            style={{ fontFamily: 'Gyrotrope' }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="py-4">{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;