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
import { expansePageSteps } from "@/components/Tour/Steps/AccountsSteps/Step";
import { Calendar, CreditCard, Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExpensePage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const [input, setInput] = useState({
    amount: "",
    expenseType: "",
    date: "",
    paymentMethod: "",
    description: "",
  });

  useEffect(() => {
    let filtered = expenseData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item?.expenseType
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          item?.paymentMethod
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
  }, [searchTerm, startDate, endDate, expenseData]);

  const dataLength = filteredData?.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // for fetch the class data
  const fetchExpenseData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${accountApi}/expenses/all/${schoolId}`
      );

      if (response) {
        setExpenseData(response?.data?.data || []);
        setFilteredData(response?.data?.data || []);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseData();
  }, []);

  // for add new Subject data
  const addNewExpense = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${accountApi}/expenses/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        setInput({
          amount: "",
          expenseType: "",
          date: "",
          paymentMethod: "",
          description: "",
        });
        toast.success("Expense added successfully!");
        fetchExpenseData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add expense");
    } finally {
      setPostApiLoading(false);
    }
  };

  const dialogHeader = "Expense";
  const formData = [
    {
      name: "amount",
      label: "Total Amount",
      type: "text",
      placeholder: "Enter total amount",
      required: true,
    },
    {
      name: "date",
      label: "Date of Expense",
      type: "date",
      placeholder: "Enter date",
      required: true,
    },
    {
      name: "description",
      label: "Description of Expense",
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

  const isDarkMode = theme === "light";
  const bgColor = isDarkMode ? "bg-[#0f172a]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const borderColor = isDarkMode ? "border-[rgba(193,193,193,0.2)]" : "border-slate-200";

  const paymentMethodDropdown = (
    <div className="mb-4">
      <label 
        htmlFor="paymentMethod" 
        className={`block text-sm font-medium ${
          isDarkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        Payment Method <sup className="text-red-500">*</sup>
      </label>
      <select
        id="paymentMethod"
        name="paymentMethod"
        className={`w-full border rounded p-2 mt-1 focus-visible:ring-1 ${
          isDarkMode 
            ? "bg-[#1a2747] text-white border-[#1e2a4a] focus-visible:ring-red-500/50" 
            : "bg-white text-gray-800 border-slate-200 focus-visible:ring-red-500/50"
        }`}
        value={input.paymentMethod}
        onChange={changeEventHandler}
        required
      >
        <option value="" className={isDarkMode ? "bg-[#1a2747]" : ""}>Select options</option>
        <option value="online" className={isDarkMode ? "bg-[#1a2747]" : ""}>Online</option>
        <option value="cash" className={isDarkMode ? "bg-[#1a2747]" : ""}>Cash</option>
        <option value="cheque" className={isDarkMode ? "bg-[#1a2747]" : ""}>Cheque</option>
        <option value="card" className={isDarkMode ? "bg-[#1a2747]" : ""}>Card</option>
      </select>
    </div>
  );
  
  const expenseTypeDropdown = (
    <div className="mb-1">
      <label htmlFor="expenseType" className="block text-sm font-medium">
        Expense Type <sup className="text-red-500">*</sup>
      </label>
      <select
        id="expenseType"
        name="expenseType"
        className="w-full border border-slate-200 rounded p-2 mt-1 focus-visible:ring-1"
        value={input.expenseType}
        onChange={changeEventHandler}
        required
      >
        <option value="" disabled>
          Select options
        </option>
        <option value="salary">Salary</option>
        <option value="maintenance">Maintenance</option>
        <option value="utilities">Utilities</option>
        <option value="other">Other</option>
      </select>
    </div>
  );

 

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
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
              <Search className={`h-5 w-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Search Expense Records</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative w-full sm:w-auto flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search expense..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 searchBox pr-4 py-2 w-full rounded-md border ${
                  isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white border-gray-200'
                } focus:outline-none focus:ring-2 ${
                  isDarkMode ? 'focus:ring-red-500/50' : 'focus:ring-red-500/50'
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
                    isDarkMode ? 'focus:ring-red-500/50' : 'focus:ring-red-500/50'
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
                    isDarkMode ? 'focus:ring-red-500/50' : 'focus:ring-red-500/50'
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
                setFilteredData(expenseData);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Expense Table Section */}
      <div className={`mt-6 mx-4 sm:mx-8 md:mx-14 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-slate-200'
      }`}>
        {/* Page Header Section */}
        <div className={`flex justify-between items-center p-4 sm:p-6 border-b ${borderColor} bg-gradient-to-r ${
          isDarkMode ? 'from-[#1e293b] to-[#0f172a]' : 'from-white to-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
              <CreditCard className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Expense Management
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <TourButton steps={expansePageSteps} tourName="expense_page" />
            <AddNewComponents 
              onChangeFunctin={changeEventHandler} 
              onSubmitFunction={addNewExpense} 
              dialogHeader={dialogHeader} 
              formData={formData} 
              inputValue={input} 
              postApiLoading={postApiLoading} 
              customContent={paymentMethodDropdown}
              customContent2={expenseTypeDropdown}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            <span className="ml-2 text-lg">Loading expense records...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className={`text-center py-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No Expense Records Found</h3>
            <p className="mt-2">
              {searchTerm || startDate || endDate 
                ? "Try adjusting your search filters" 
                : "Add your first expense record to get started"}
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
                    {/* <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Expense Type
                    </TableHead> */}
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Date
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Amount
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Payment Method
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
                          : 'hover:bg-red-50/30 border-slate-200'
                      }`}
                    >
                      {/* S.No */}
                      <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </span>
                      </TableCell>

                      {/* Expense Type */}
                      {/* <TableCell className={`px-4 py-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {item?.expenseType}
                        </span>
                      </TableCell> */}

                      {/* Date */}
                      <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                          isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.date}
                        </span>
                      </TableCell>

                      {/* Amount */}
                      <TableCell className={`px-4 py-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                          isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
                        }`}>
                          ₹{item.amount}
                        </span>
                      </TableCell>

                      {/* Payment Method */}
                      <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {item.paymentMethod}
                        </span>
                      </TableCell>

                      {/* Description */}
                      <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-[200px] truncate`}>
                        {item.description}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-4 py-3 text-right hidden sm:table-cell">
                        <div className="flex justify-end items-center gap-2">
                          <DeleteComponent
                            name={item?.amount}
                            deletePath={`${accountApi}/expenses/de/${item?.id}/${schoolId}`}
                            onDelete={fetchExpenseData}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Section */}
            <div className={`border-t mb-10 ${isDarkMode ? 'border-[rgba(193,193,193,0.2)]' : 'border-slate-200'}`}>
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

export default ExpensePage;