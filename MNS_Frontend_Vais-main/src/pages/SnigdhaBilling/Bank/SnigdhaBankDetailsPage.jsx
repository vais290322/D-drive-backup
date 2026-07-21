import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { backendDomainS } from "../../../common/index";
import toast from "react-hot-toast";

const SnigdhaBankDetailsPage = () => {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  // console.log("transactions", bank);

  const fetchRecentTransactions = async () => {
    try {
      const response = await axios.get(
        `${backendDomainS}/api/v1/reports/bank-transactions/${bankId}`
      );
      // console.log("response from bank transactions in snigdha ", response);
      if (response?.data?.success) {
        setTransactions(response?.data?.data?.transactions);
      } else {
        setTransactions([]);
        toast.error("No transactions found");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchBankDetails();
    fetchRecentTransactions();
  }, [bankId]);

  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendDomainS}/api/v1/bank/${bankId}`
      );
      // console.log("response from bank details",response.data.data)
      setBank(response.data.data);
    } catch (error) {
      // console.error("Error fetching bank details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!bank) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Bank Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            The bank account you're looking for doesn't exist or has been
            removed.
          </p>
          <button
            onClick={() => navigate("/add-bank-snigdha")}
            className="px-4  cursor-pointer py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Bank Accounts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Bank Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/add-bank-mns")}
              className="mr-4 cursor-pointer bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div className="flex-shrink-0 h-12 w-12 bg-white text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              {bank.bankName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4 text-white">
              <h1 className="text-2xl font-bold">{bank.bankName}</h1>
              <p className="text-blue-100">Account: {bank.accountNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-blue-100 text-sm">Current Balance</p>
              <p className="text-white text-2xl font-bold">
                ₹{bank.currentAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-blue-100 text-sm">Account Holder</p>
              <p className="text-white text-xl">{bank.accountHolderName}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-blue-100 text-sm">IFSC Code</p>
              <p className="text-white text-xl">{bank.ifscCode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details and Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Bank Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Account Details
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Account Number</p>
                  <p className="text-gray-800 font-medium">
                    {bank.accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="text-gray-800 font-medium">Savings Account</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Branch</p>
                  <p className="text-gray-800 font-medium">{bank.branch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">IFSC Code</p>
                  <p className="text-gray-800 font-medium">{bank.ifscCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Opening Balance</p>
                  <p className="text-gray-800 font-medium">
                    ₹{bank.openingAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to={`/add-deposit-snigdha`} className="flex cursor-pointer flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"> 
                <button className="flex cursor-pointer flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors" >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor" 
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Deposit
                  </span>
                </button>
                </Link>

                <Link
                  to={`/withdraw-snigdha`} className="flex cursor-pointer flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">

                <button className="flex cursor-pointer flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Withdraw
                  </span>
                </button>
                </Link>


                <Link to={`/bank-statement-snigdha`} className="flex cursor-pointer flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">

                <button className="flex cursor-pointer flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Statement
                  </span>
                </button>
                </Link>

                <Link to={`/money-transfer-snigdha`} className="flex cursor-pointer flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">

                <button className="flex cursor-pointer flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Transfer
                  </span>
                </button>
                </Link>

              </div>
            </div>
          </div>


        </div>

        {/* Right Column - Transactions */}
        <div className="lg:col-span-2">
          {/* Amount Summary Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Current Balance Box */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-blue-400 bg-opacity-30 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-blue-100">
                    Current Balance
                  </div>
                </div>
                <div className="text-white text-xl font-bold">
                  ₹
                  {bank.currentAmount?.toLocaleString() ||
                    bank.openingAmount?.toLocaleString()}
                </div>
                <div className="text-blue-100 text-xs mt-1">
                  Available for transactions
                </div>
              </div>
            </div>

            {/* Total Deposits Box */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-green-400 bg-opacity-30 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-green-100">
                    Total Deposits
                  </div>
                </div>
                <div className="text-white text-xl font-bold">
                  ₹{bank?.depositeAmount?.toLocaleString()}
                </div>
                <div className="text-green-100 text-xs mt-1">
                  Money added to account
                </div>
              </div>
            </div>

            {/* Total Withdrawals Box */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-red-400 bg-opacity-30 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-red-100">
                    Total Withdrawals
                  </div>
                </div>
                <div className="text-white text-xl font-bold">
                  ₹{bank?.deductionAmount?.toLocaleString()}
                </div>
                <div className="text-red-100 text-xs mt-1">
                  Money withdrawn from account
                </div>
              </div>
            </div>

            {/* Transfer amount debit Box */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="bg-purple-400 bg-opacity-30 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-purple-100">
                    Transfer Amount Debit
                  </div>
                </div>
                <div className="text-white text-xl font-bold">
                  ₹{bank?.totalMoneyTransferDebit?.toLocaleString()}
                </div>
                <div className="text-purple-100 text-xs mt-1">
                  Total transer amount from this account
                </div>
              </div>
            </div>
          </div>

          {/* Additional Amount Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

          {/* Transfer amount credit Box */}
          <div className="bg-gradient-to-r from-pink-500 to-orange-600 rounded-xl shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="bg-pink-400 bg-opacity-30 p-2  rounded-lg">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-purple-100">
                    Transfer Amount Credit
                  </div>
                </div>
                <div className="text-white text-xl font-bold">
                  ₹{bank?.totalMoneyTransferCredit?.toLocaleString()}
                </div>
                <div className="text-purple-100 text-xs mt-1">
                  Total received transer amount on this account
                </div>
              </div>
            </div>

            {/* Products Notes Amount Box */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-amber-400 bg-opacity-30 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-amber-100">
                    Products Notes
                  </div>
                </div>
                <div className="text-white text-xl font-bold">
                  ₹{bank.totalProductsNotesAmount?.toLocaleString() || "0"}
                </div>
                <div className="text-amber-100 text-xs mt-1">
                  Total product transactions
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-cyan-400 bg-opacity-30 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-cyan-100">
                    Purchases Notes
                  </div>
                </div>
                <div className="text-white text-xl font-bold">
                  ₹{bank.totalPurchasesNotesAmount?.toLocaleString() || "0"}
                </div>
                <div className="text-cyan-100 text-xs mt-1">
                  Total purchase transactions
                </div>
              </div>
            </div>

            {/* <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-pink-400 bg-opacity-30 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-pink-100">
                    Services Notes
                  </div>
                </div>
                <div className="text-white text-xl font-bold">
                  ₹{bank.totalServicesNotesAmount?.toLocaleString() || "0"}
                </div>
                <div className="text-pink-100 text-xs mt-1">
                  Total service transactions
                </div>
              </div>
            </div> */}


          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent 5 Transactions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.length > 0 ? (
                    transactions?.slice(0,5)?.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* {transaction.date} */}
                          {new Date(transaction.date).toLocaleDateString(
                            undefined,
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.type === "deposit" ||
                              transaction.type === "transferCredit"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            transaction.type === "deposit" ||
                            transaction.type === "transferCredit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "deposit" ||
                          transaction.type === "transferCredit"
                            ? "+"
                            : "-"}
                          ₹{transaction.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No transactions found for this account
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <Link to={"/bank-statement-snigdha"}> 
              <button className="text-blue-600 cursor-pointer hover:text-blue-800 text-sm font-medium">
                View All Transactions
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnigdhaBankDetailsPage;


