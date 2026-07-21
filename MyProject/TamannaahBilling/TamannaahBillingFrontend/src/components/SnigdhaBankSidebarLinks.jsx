import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { backendDomainS } from "../common/index";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BsBank } from 'react-icons/bs';

const SnigdhaBankSidebarLinks = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${backendDomainS}/api/v1/bank/all`);
      setBanks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching banks for sidebar:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add the missing handleAddNew function
  const handleAddNew = (e) => {
    // Prevent default to avoid navigation conflicts
    e.preventDefault();
    // Keep the sidebar expanded when adding a new bank
    setExpanded(true);
    // Navigate is handled by the NavLink component itself
  };

  return (
    <div className="mt-2">
      <div 
        className="pl-6 pr-4 py-2 cursor-pointer flex justify-between items-center hover:bg-slate-600 transition-all duration-200"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-teal-300 font-medium flex items-center">
          <BsBank className="text-green-500 mr-2" />
          All Bank Accounts 
        </span>
        {expanded ? (
          <FaChevronUp className="text-teal-300 text-xs" />
        ) : (
          <FaChevronDown className="text-teal-300 text-xs" />
        )}
      </div>
      
      {expanded && (
        <div className="bg-slate-800 bg-opacity-50">
          {loading ? (
            <div className="flex items-center px-3 py-2 text-sm text-gray-400">
              <svg className="animate-spin h-4 w-4 mr-2 text-teal-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading banks...
            </div>
          ) : banks.length > 0 ? (
            banks.map(bank => (
              <NavLink 
                key={bank._id}
                to={`/billing/bank/${bank._id}`}
                className={({ isActive }) => 
                  `pl-10 pr-4 py-2 cursor-pointer transition-all duration-200 ${
                    isActive ? 'bg-slate-700 border-l-2 border-teal-300' : 'hover:bg-slate-700'
                  } flex items-center`
                }
              >
                <div className="w-1 h-1 rounded-full bg-teal-200 mr-2"></div>
                <span className="text-sm">{bank.bankName}</span>
              </NavLink>
            ))
          ) : (
            <div className="pl-10 pr-4 py-2 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="w-1 h-1 rounded-full bg-gray-400 mr-2"></div>
                <span>No banks found</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SnigdhaBankSidebarLinks;

