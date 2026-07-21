import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { backendDomainN } from "../../../common/index";
import { FiMail, FiSearch, FiSend } from "react-icons/fi";

const ApplyLeavePage = () => {
  const [email, setEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [loadingStates, setLoadingStates] = useState({}); // To track loading state for each email

  const fetchSearchResults = async () => {
    try {
      setIsSearching(true);
      const response = await axios.get(
        `${backendDomainN}/api/employees/search?email=${encodeURIComponent(email)}`
      );
      console.log("response : ", response);
      setFilteredEmails(response?.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      if (email.trim()) {
        fetchSearchResults();
      } else {
        setFilteredEmails([]);
      }
    }, 300);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [email]);

  const handleSendEmail = async (emailToSend, id) => {
    if (!emailToSend) return;

    setLoadingStates((prevState) => ({ ...prevState, [id]: true })); // Set loading for the specific email
    try {
      const response = await axios.post(
        `${backendDomainN}/api/leaves/sendMail`,
        { email: emailToSend },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response) {
        throw new Error("Failed to send email.");
      }

      toast.success("Email sent successfully.");
    } catch (error) {
      // console.error("Error sending email:", error);
      toast.error(error?.response?.data?.message || "Something went wrong, try again.");
    } finally {
      setLoadingStates((prevState) => ({ ...prevState, [id]: false })); // Reset loading for the specific email
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <FiMail className="w-10 h-10 mr-3" />
              <h1 className="text-3xl font-bold">Leave Application</h1>
            </div>
            <p className="text-center text-blue-100">
              Search for an employee by email to send leave application form
            </p>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <label htmlFor="email-search" className="block text-sm font-medium text-gray-700 mb-2">
                Employee Email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-search"
                  type="text"
                  placeholder="Search by email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900"
                />
              </div>
              {isSearching && (
                <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                  <BiLoaderCircle className="animate-spin w-5 h-5 mr-2" />
                  <span>Searching...</span>
                </div>
              )}
            </div>

            {filteredEmails.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900 mb-3">Search Results</h2>
                <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
                  {filteredEmails.map((entry) => (
                    <div
                      key={entry.id}
                      className="mb-3 last:mb-0 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                            {entry.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="block text-gray-900 font-medium">{entry.email}</span>
                            {entry.name && <span className="text-sm text-gray-500">{entry.name}</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => handleSendEmail(entry.email, entry.id)}
                          disabled={loadingStates[entry.id]}
                          className={`px-4 py-2 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2 transition-all duration-200 ${
                            loadingStates[entry.id]
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                        >
                          {loadingStates[entry.id] ? (
                            <>
                              <BiLoaderCircle className="animate-spin w-5 h-5" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <FiSend className="w-4 h-4" />
                              <span className="cursor-pointer">Send Form</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : email.trim() !== "" && !isSearching ? (
              <div className="text-center py-8 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
                <p className="text-gray-500">Try a different email address or check your spelling</p>
              </div>
            ) : null}
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              Enter an employee's email address to send them a leave application form
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeavePage;