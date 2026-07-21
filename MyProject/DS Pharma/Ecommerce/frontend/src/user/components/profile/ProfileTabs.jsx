import React from 'react';

const ProfileTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden p-2 my-2 md:p-4" style={{ padding: '10px' }}>
            <div className="grid grid-cols-4 gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 py-2 md:px-6 md:py-4 font-medium transition-colors cursor-pointer text-[8px] sm:text-xs md:text-base ${activeTab === tab.id
                                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        style={{ fontFamily: 'Gyrotrope' }}
                    >
                        <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-[10px] md:text-base">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProfileTabs;
