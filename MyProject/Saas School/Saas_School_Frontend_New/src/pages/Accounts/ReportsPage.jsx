import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Calendar, TrendingUp } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Wallet, TrendingDown } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import AddNewComponents from "@/components/Addnew/AddNewComponents";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import { MagicCard } from "@/components/magicui/magic-card";
import {
  Banknote,
  Landmark,
  Hash,
  CreditCard,
  User,
  DollarSign,
  Loader2,
  Search,
  X,
  BarChart3,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { accountApi } from "@/common/main";
import { useSelector } from "react-redux";
import TourButton from "@/components/Tour/TourButton";
import { reportPageSteps } from "@/components/Tour/Steps/AccountsSteps/Step";
import { Button } from "@/components/ui/button";

const ReportsPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [bankData, setBankData] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [cashInHand, setCashInHand] = useState(0);
  const [onlineAmount, setOnlineAmount] = useState(0);
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  const [input, setInput] = useState({
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: "",
    accountHolderName: "",
    openingAmount: "",
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  console.log("bankDetails", bankDetails);

  const dialogHeader = "Bank Details ";
  const formData = [
    {
      name: "accountNumber",
      label: "Account Number",
      type: "text",
      placeholder: "Enter account number",
      required: true,
    },
    {
      name: "ifscCode",
      label: "IFSC Code",
      type: "text",
      placeholder: "Enter ifsc code",
      required: true,
    },
    {
      name: "bankName",
      label: "Bank Name",
      type: "text",
      placeholder: "Enter bank name",
      required: true,
    },
    {
      name: "branch",
      label: "Branch Name",
      type: "text",
      placeholder: "Enter branch name",
      required: true,
    },
    {
      name: "accountHolderName",
      label: "Account Holder Name",
      type: "text",
      placeholder: "Enter account holder name",
      required: true,
    },
    {
      name: "openingAmount",
      label: "Opening Amount",
      type: "text",
      placeholder: "Enter opening amount",
      required: true,
    },
  ];

  const addBankjData = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${accountApi}/account/create/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        toast.success(
          response.data.message || "Account created successfully !"
        );
        setInput({
          accountNumber: "",
          ifscCode: "",
          bankName: "",
          branch: "",
          accountHolderName: "",
          openingAmount: "",
        });
        fetchBankDetails();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add income ");
    } finally {
      setPostApiLoading(false);
    }
  };

  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(`${accountApi}/account/get/${schoolId}`);
      if (response) {
        setBankDetails(response?.data?.data || []);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch bank details");
    }
  };

  const fetchCashInHand = async () => {
    try {
      const response = await axios.get(
        `${accountApi}/income/cash-in-hand/${schoolId}`
      );
      if (response) {
        setCashInHand(response?.data?.data || response?.data || 0);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch cash in hand");
    }
  };

  const fetchOnlineAmount = async () => {
    try {
      const response = await axios.get(
        `${accountApi}/income/online-payments/${schoolId}`
      );
      if (response) {
        setOnlineAmount(response?.data?.data || response?.data || 0);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch online amount");
    }
  };

  const fetchBankData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${accountApi}/bank-transactions/all/${schoolId}`
      );
      setBankData(response?.data?.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
    fetchCashInHand();
    fetchOnlineAmount();
    fetchBankData();
  }, []);

  const isDarkMode = theme === "light";
  const borderColor = isDarkMode ? "border-[rgba(193,193,193,0.2)]" : "border-slate-200";

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-300 font-poppins`}>
      {/* Page Header Section */}
      <div className={`mt-4 mx-4 sm:mx-8 md:mx-14 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-slate-200'
      }`}>
        <div className={`flex justify-between items-center p-4 sm:p-6 border-b ${borderColor} bg-gradient-to-r ${
          isDarkMode ? 'from-[#1e293b] to-[#0f172a]' : 'from-white to-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
              <BarChart3 className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Financial Reports Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <TourButton steps={reportPageSteps} tourName={"reportPage-tour"} />
            {bankDetails.length === 0 && (
              <AddNewComponents
                onChangeFunctin={changeEventHandler}
                onSubmitFunction={addBankjData}
                dialogHeader={dialogHeader}
                formData={formData}
                inputValue={input}
                postApiLoading={postApiLoading}
              />
            )} 
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className={`mt-6 mx-4 sm:mx-8 md:mx-14 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-slate-200'
      }`}>
        <div className={`p-4 sm:p-6 border-b ${borderColor} bg-gradient-to-r ${
          isDarkMode ? 'from-[#1e293b] to-[#0f172a]' : 'from-white to-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <DollarSign className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold">Financial Overview</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-lg">Loading financial data...</span>
          </div>
        ) : (
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Cash Card */}
              <div className={`rounded-lg shadow-md overflow-hidden ${isDarkMode ? 'bg-[#1e293b]/70' : 'bg-white'}`}>
                <div className={`p-4 border-b ${borderColor} ${isDarkMode ? 'bg-[#1e293b]' : 'bg-blue-50'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Cash In Hand</h3>
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-white'}`}>
                      <Wallet className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹ {typeof cashInHand === "object" ? JSON.stringify(cashInHand) : cashInHand || "0"}
                      </span>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        Number(cashInHand) > 3000 
                          ? (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800') 
                          : (isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800')
                      }`}>
                        {Number(cashInHand) > 3000 ? (
                          <>
                            <TrendingUp size={14} />
                            <span>Growing</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown size={14} />
                            <span>Decreasing</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total cash payments received
                    </p>
                  </div>
                </div>
              </div>

              {/* Online Amount Card */}
              <div className={`rounded-lg shadow-md overflow-hidden ${isDarkMode ? 'bg-[#1e293b]/70' : 'bg-white'}`}>
                <div className={`p-4 border-b ${borderColor} ${isDarkMode ? 'bg-[#1e293b]' : 'bg-green-50'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Online Payments</h3>
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-white'}`}>
                      <CreditCard className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹ {typeof onlineAmount === "object" ? JSON.stringify(onlineAmount) : onlineAmount || "0"}
                      </span>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        Number(onlineAmount) > 5000 
                          ? (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800') 
                          : (isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800')
                      }`}>
                        {Number(onlineAmount) > 5000 ? (
                          <>
                            <ArrowUpRight size={14} />
                            <span>Increasing</span>
                          </>
                        ) : (
                          <>
                            <ArrowDownRight size={14} />
                            <span>Decreasing</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total online transactions
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Balance Card */}
              <div className={`rounded-lg shadow-md overflow-hidden ${isDarkMode ? 'bg-[#1e293b]/70' : 'bg-white'}`}>
                <div className={`p-4 border-b ${borderColor} ${isDarkMode ? 'bg-[#1e293b]' : 'bg-purple-50'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Bank Balance</h3>
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-purple-900/30' : 'bg-white'}`}>
                      <Banknote className={`h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-col">
                    <span className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹ {bankDetails?.openingAmount || "0"}
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 dark:bg-gray-700">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{
                          width: `${Math.min((bankDetails?.openingAmount / 10000) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Current bank balance
                      </p>
                      <div className={`flex items-center gap-1 text-xs font-medium ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`}>
                        <TrendingUp size={14} />
                        <span>Growth</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details Card */}
              <div className={`rounded-lg shadow-md overflow-hidden ${isDarkMode ? 'bg-[#1e293b]/70' : 'bg-white'}`}>
                <div className={`p-4 border-b ${borderColor} ${isDarkMode ? 'bg-[#1e293b]' : 'bg-yellow-50'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Bank Account</h3>
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-900/30' : 'bg-white'}`}>
                      <Landmark className={`h-5 w-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Banknote className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        <span className="font-medium">Bank:</span> {bankDetails?.bankName || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Landmark className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        <span className="font-medium">Branch:</span> {bankDetails?.branch || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className={`h-4 w-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        <span className="font-medium">IFSC:</span> {bankDetails?.ifscCode || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className={`h-4 w-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        <span className="font-medium">A/C:</span> {bankDetails?.accountNumber || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className={`h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        <span className="font-medium">Holder:</span> {bankDetails?.accountHolderName || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions Table */}
      <div className={`mt-6 mx-4 sm:mx-8 md:mx-14 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-slate-200'
      }`}>
        <div className={`p-4 sm:p-6 border-b ${borderColor} bg-gradient-to-r ${
          isDarkMode ? 'from-[#1e293b] to-[#0f172a]' : 'from-white to-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
              <Banknote className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold">Recent Bank Transactions</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-lg">Loading transactions...</span>
          </div>
        ) : bankData.length === 0 ? (
          <div className={`text-center py-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Banknote className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No Bank Transactions Found</h3>
            <p className="mt-2">Add your first bank transaction to get started</p>
          </div>
        ) : (
          <div className="p-4 sm:p-6">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader className={`${isDarkMode ? 'bg-[#1e293b]/80' : 'bg-gray-50'} sticky top-0 z-10`}>
                  <TableRow>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Date
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Transaction Type
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Description
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider text-right`}>
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankData
                    ?.slice(-5)
                    .reverse()
                    .map((item) => (
                      <TableRow
                        key={item.id}
                        className={`transition-colors ${
                          isDarkMode 
                            ? 'hover:bg-[#1e293b]/70 border-[rgba(193,193,193,0.2)]' 
                            : 'hover:bg-blue-50/30 border-slate-200'
                        }`}
                      >
                        <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <div className="flex items-center">
                            <div className={`p-1 rounded-full mr-2 ${
                              isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100'
                            }`}>
                              <Calendar className={`h-3 w-3 ${
                                isDarkMode ? 'text-blue-400' : 'text-blue-600'
                              }`} />
                            </div>
                            {item?.date}
                          </div>
                        </TableCell>
                        <TableCell className={`px-4 py-3 font-medium ${
                          item?.transactionType === "WITHDRAW" 
                            ? (isDarkMode ? 'text-red-400' : 'text-red-600')
                            : (isDarkMode ? 'text-green-400' : 'text-green-600')
                        }`}>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item?.transactionType === "WITHDRAW"
                              ? (isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800')
                              : (isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800')
                          }`}>
                            {item?.transactionType === "WITHDRAW" ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {item?.transactionType === "WITHDRAW" ? "Withdrawal" : "Deposit"}
                          </div>
                        </TableCell>
                        <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} max-w-[200px] truncate`}>
                          {item.description}
                        </TableCell>
                        <TableCell className={`px-4 py-3 font-medium text-right ${
                          item?.transactionType === "WITHDRAW" 
                            ? (isDarkMode ? 'text-red-400' : 'text-red-600')
                            : (isDarkMode ? 'text-green-400' : 'text-green-600')
                        }`}>
                          <div className="flex items-center justify-end">
                            <CreditCard className="h-4 w-4 mr-2" />
                            {item?.transactionType === "DEPOSIT" ? "+" : "-"} ₹{item.amount}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow className={isDarkMode ? 'bg-[#1e293b]/80' : 'bg-gray-50'}>
                    <TableCell colSpan={3} className="px-4 py-3 font-bold">
                      Total Recent Transactions
                    </TableCell>
                    <TableCell className="px-4 py-3 font-bold text-right">
                      ₹{" "}
                      {bankData && Array.isArray(bankData)
                        ? bankData
                            .slice(-5)
                            .reduce(
                              (acc, txn) => acc + (Number(txn.amount) || 0),
                              0
                            )
                        : 0}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;