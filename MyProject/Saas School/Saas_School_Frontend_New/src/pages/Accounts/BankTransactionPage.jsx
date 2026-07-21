import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { toast } from "sonner";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import AddNewComponents from "@/components/Addnew/AddNewComponents";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import EditDataComponent from "@/components/EditData/EditDataComponent";
import { accountApi } from "@/common/main";
import { useSelector } from "react-redux";
import TourButton from "@/components/Tour/TourButton";
import { bankTransactionPageSteps } from "@/components/Tour/Steps/AccountsSteps/Step";
import { Calendar, DollarSign, Loader2, Search, X, CreditCard,  BanknoteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const BankTransactionPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [bankData, setBankData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  const [input, setInput] = useState({
    transactionType: "",
    accountNumber: "",
    amount: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    let filtered = bankData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item?.transactionType
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          item?.accountNumber
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          item?.description
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          item?.date?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          String(item?.amount)?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Apply date range filter
    if (startDate && endDate) {
      filtered = filtered?.filter((item) => {
        const itemDate = new Date(item?.date);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, startDate, endDate, bankData]);

  const dataLength = filteredData?.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // for fetch the class data
  const fetchBankData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${accountApi}/bank-transactions/all/${schoolId}`
      );

      setBankData(response?.data?.data || []);
      setFilteredData(response?.data?.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankData();
  }, []);

  const addBankjData = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${accountApi}/bank-transactions/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        setInput({
          transactionType: "",
          accountNumber: "",
          amount: "",
          date: "",
          description: "",
        });
        toast.success("Bank transaction added successfully!");
        fetchBankData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add transaction");
    } finally {
      setPostApiLoading(false);
    }
  };

  const dialogHeader = "Bank Transaction";
  const formData = [
    {
      name: "accountNumber",
      label: "Account Number",
      type: "text",
      placeholder: "Enter account number",
      required: true,
    },
    {
      name: "amount",
      label: "Total Amount",
      type: "text",
      placeholder: "Enter amount",
      required: true,
    },
    {
      name: "date",
      label: "Date of Transaction",
      type: "date",
      placeholder: "Enter date",
      required: true,
    },
    {
      name: "description",
      label: "Description of Transaction",
      type: "text",
      placeholder: "Enter description",
      required: true,
    },
  ];

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const transactionTypeDropdown = (
    <div className="mb-4">
      <label htmlFor="transactionType" className="block text-sm font-medium">
        Transaction Type <sup className="text-red-500">*</sup>
      </label>
      <select
        id="transactionType"
        name="transactionType"
        className={`w-full border rounded p-2 mt-1 focus-visible:ring-1 ${
          theme === "light" 
            ? "bg-[#1e293b] border-gray-700 text-white" 
            : "bg-white border-slate-200"
        }`}
        value={input.transactionType}
        onChange={changeEventHandler}
        required
      >
        <option value="">Select options</option>
        <option value="WITHDRAW">Withdrawal</option>
        <option value="DEPOSIT">Deposit</option>
      </select>
    </div>
  );

  const isDarkMode = theme === "light";
  const bgColor = isDarkMode ? "bg-[#0f172a]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const borderColor = isDarkMode ? "border-[rgba(193,193,193,0.2)]" : "border-slate-200";

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-300 font-poppins`}>
      {/* Search Section */}
      <div className={`mt-4 mx-4 sm:mx-8 md:mx-14 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-slate-200'
      }`}>
        <div className={`p-4 sm:p-6 border-b ${borderColor} bg-gradient-to-r ${
          isDarkMode ? 'from-[#1e293b] to-[#0f172a]' : 'from-white to-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <Search className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Search Bank Transactions</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative w-full sm:w-auto flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bank transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full searchBox rounded-md border ${
                  isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white border-gray-200'
                } focus:outline-none focus:ring-2 ${
                  isDarkMode ? 'focus:ring-blue-500/50' : 'focus:ring-blue-500/50'
                }`}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className={`relative ${isDarkMode ? 'text-white' : ''}`}>
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-md border ${
                    isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white border-gray-200'
                  } focus:outline-none focus:ring-2 ${
                    isDarkMode ? 'focus:ring-blue-500/50' : 'focus:ring-blue-500/50'
                  }`}
                />
              </div>
              
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>to</span>
              
              <div className={`relative ${isDarkMode ? 'text-white' : ''}`}>
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-md border ${
                    isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white border-gray-200'
                  } focus:outline-none focus:ring-2 ${
                    isDarkMode ? 'focus:ring-blue-500/50' : 'focus:ring-blue-500/50'
                  }`}
                />
              </div>
            </div>

            <Button
              className={`${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setSearchTerm("");
                setFilteredData(bankData);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Bank Transaction Table Section */}
      <div className={`mt-6 mx-4 sm:mx-8 md:mx-14 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-slate-200'
      }`}>
        {/* Page Header Section */}
        <div className={`flex justify-between items-center p-4 sm:p-6 border-b ${borderColor} bg-gradient-to-r ${
          isDarkMode ? 'from-[#1e293b] to-[#0f172a]' : 'from-white to-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <BanknoteIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Bank Transaction Management
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <TourButton steps={bankTransactionPageSteps} tourName="bank_transaction_page" />
            <AddNewComponents 
              onChangeFunctin={changeEventHandler} 
              onSubmitFunction={addBankjData} 
              dialogHeader={dialogHeader} 
              formData={formData} 
              inputValue={input} 
              postApiLoading={postApiLoading} 
              customContent={transactionTypeDropdown} 
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Loading bank transactions...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className={`text-center py-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <BanknoteIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No Bank Transactions Found</h3>
            <p className="mt-2">
              {searchTerm || startDate || endDate 
                ? "Try adjusting your search filters" 
                : "Add your first bank transaction to get started"}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader className={`${isDarkMode ? 'bg-[#1e293b]/80' : 'bg-gray-50'} sticky top-0 z-10`}>
                  <TableRow>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      S.No
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Transaction Type
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Date
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Amount
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Account Number
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Description
                    </TableHead>
                    <TableHead className={`px-4 py-3 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider hidden sm:table-cell`}>
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData?.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className={`transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-[#1e293b]/70 border-[rgba(193,193,193,0.2)]' 
                          : 'hover:bg-blue-50/30 border-slate-200'
                      }`}
                    >
                      <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell className={`px-4 py-3 font-medium ${
                        item?.transactionType === "WITHDRAW" 
                          ? 'text-red-500' 
                          : 'text-green-500'
                      }`}>
                        <div className="flex items-center">
                          {item?.transactionType === "WITHDRAW" ? (
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Withdrawal
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                              Deposit
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {item.date}
                        </div>
                      </TableCell>
                      <TableCell className={`px-4 py-3 font-medium ${
                        item?.transactionType === "WITHDRAW" 
                          ? 'text-red-500' 
                          : 'text-green-500'
                      }`}>
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          {item?.transactionType === "DEPOSIT" ? "+" : "-"} ₹{item.amount}
                        </div>
                      </TableCell>
                      <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                            {item.accountNumber}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} max-w-[200px] truncate`}>
                        {item.description}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right hidden sm:table-cell">
                        <div className="flex justify-end items-center gap-2">
                          <DeleteComponent
                            name={`Transaction for ${item?.accountNumber}`}
                            deletePath={`${accountApi}/bank-transactions/delete/${item?.id}/${schoolId}`}
                            onDelete={fetchBankData}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Section */}
            <div className={`border-t ${borderColor} p-4`}>
              <PaginationComponent
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalPages={totalPages}
                onRowsPerPageChange={handleRowsPerPageChange}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BankTransactionPage;