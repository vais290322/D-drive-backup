import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { backendDomainA } from "../common/index";

const BankSidebarLinks = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${backendDomainA}/api/v1/bank/all`);
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
        className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 rounded-md"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg> */}
          <span className="font-bold text-md ml-[-10px] text-green-400">-- All Bank Accounts For MNS</span>
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${expanded ? 'transform rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {expanded && (
        <div className="ml-6 mt-1 space-y-1">
          <NavLink 
            to="/add-bank-mns" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 text-sm rounded-md ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-white hover:bg-gray-600'
              }`
            }
            end
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            All Banks
          </NavLink>
          
          {loading ? (
            <div className="flex items-center px-3 py-2 text-sm text-gray-500">
              <svg className="animate-spin h-4 w-4 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          ) : banks.length > 0 ? (
            banks.map(bank => (
              <NavLink 
                key={bank._id}
                to={`/billing/bank/${bank._id}`}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 text-sm rounded-md ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-white hover:bg-gray-700'
                  }`
                }
              >
                <div className="flex-shrink-0 h-4 w-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-2">
                  {bank.bankName.charAt(0).toUpperCase()}
                </div>
                {bank.bankName}
              </NavLink>
            ))
          ) : (
            <div className="flex items-center px-3 py-2 text-sm text-gray-500">
              No banks found
            </div>
          )}
          
          {/* <NavLink 
            to="/add-bank-mns"
            className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
            onClick={handleAddNew}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Bank
          </NavLink> */}
        </div>
      )}
    </div>
  );
};

export default BankSidebarLinks;