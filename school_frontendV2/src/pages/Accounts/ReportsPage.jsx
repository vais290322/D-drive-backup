import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { TrendingUp } from "lucide-react";
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

const ReportsPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [bankData, setBankData] = useState([]);
  const [bankDetails, setBankDetails] = useState();
  const [cashInHand, setCashInHand] = useState(0);
  const [onlineAmount, setOnlineAmount] = useState(0);

  // console.log("cash : ", cashInHand)

  const [input, setInput] = useState({
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: "",
    accountHolderName: "",
    openingAmount: "",
  });
  // console.log("bank : ", bankDetails);
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
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
      const response = await axios.post(`${accountApi}/account/create`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true,
      });

      // console.log("response : ", response);

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
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add income ");
    } finally {
      setPostApiLoading(false);
    }
  };

  const fetchBankDetails = async () => {
    const response = await axios.get(`${accountApi}/account/get`);
    // console.log("respnose : ", response);
    if (response) {
      setBankDetails(response?.data?.data);
    }
  };

  const fetchCashInHand = async () => {
    const response = await axios.get(`${accountApi}/income/cash-in-hand`);
    // console.log("respnose : ", response);
    if (response) {
      setCashInHand(response?.data);
    }
  };

  const fetchOnlineAmount = async () => {
    const response = await axios.get(`${accountApi}/income/online-payments`);
    // console.log("respnose : ", response);
    if (response) {
      setOnlineAmount(response?.data);
    }
  };

  const fetchBankData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${accountApi}/bank-transactions`);

      setBankData(response?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };

  useEffect(() => {
    fetchBankDetails();
    fetchCashInHand();
    fetchOnlineAmount();
    fetchBankData();
  }, []);

  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ];

  return (
    <div
      className={`${theme === "light" ? "dark" : "light"} h-auto min-h-screen`}
    >
      <div
        className={`mt-4 font-poppins border-[1px] rounded-[0.675rem] mx-2 sm:mx-4 md:mx-14 ${
          theme === "light"
            ? "border-[rgba(193,193,193,0.3)]"
            : " border-slate-200 bg-white"
        }`}
      >
        <div
          className={`flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 border-b-[1px] ${
            theme === "light"
              ? "border-[rgba(193,193,193,0.3)]"
              : "border-slate-200"
          }`}
        >
          <div className="mb-2 sm:mb-0">
            <span className="text-base sm:text-xl md:text-2xl font-bold font-poppins">
              Bank Transactions
            </span>
          </div>

          {!bankDetails && (
            <div className="w-full sm:w-auto flex justify-end">
              <div className="block sm:hidden w-full">
                <AddNewComponents
                  onChangeFunctin={changeEventHandler}
                  onSubmitFunction={addBankjData}
                  dialogHeader={dialogHeader}
                  formData={formData}
                  inputValue={input}
                  postApiLoading={postApiLoading}
                />
              </div>
              <div className="hidden sm:block">
                <AddNewComponents
                  onChangeFunctin={changeEventHandler}
                  onSubmitFunction={addBankjData}
                  dialogHeader={dialogHeader}
                  formData={formData}
                  inputValue={input}
                  postApiLoading={postApiLoading}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-rows-8 gap-4 mb-8 p-2 sm:p-4  ">
          {/* Cash Card */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 lg:row-span-3 p-2">
            <div className="flex h-auto min-h-[250px] w-full flex-col gap-4 items-center justify-center bg-gradient-to-r from-purple-100 to-purple-300 rounded-lg shadow-md p-4">
              <MagicCard
                className="cursor-pointer flex-col whitespace-nowrap bg-purple-300 shadow-lg"
                gradientColor={theme === "dark" ? "#eff2ae" : "#D9D9D955"}
              >
                <div className="flex flex-col items-center p-4 text-wrap ">
                  {/* Cash Wallet Icon */}
                  <Wallet size={50} className="text-orange-700 mb-2" />

                  {/* Cash Amount Label */}
                  <span className="text-lg font-semibold text-wrap ">
                    All Income in Cash:
                  </span>

                  {/* Amount Badge */}
                  <div className="mt-2 px-4 py-2 rounded-full bg-orange-500 text-white font-bold text-lg text-wrap ">
                    ₹ {cashInHand || "0"}
                  </div>

                  {/* Growth Indicator */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-wrap ">
                    {cashInHand > 3000 ? (
                      <TrendingUp size={20} className="text-green-600" />
                    ) : (
                      <TrendingDown size={20} className="text-red-600" />
                    )}
                    <span>{cashInHand > 3000 ? "Growing" : "Decreasing"}</span>
                  </div>
                </div>
              </MagicCard>
            </div>
          </div>

          {/* Online Amount Card */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 lg:row-span-3 p-2">
            <div className="flex h-auto min-h-[250px] w-full flex-col gap-4 items-center justify-center bg-gradient-to-r from-purple-100 to-purple-300 rounded-lg shadow-md p-4">
              <MagicCard
                className="cursor-pointer flex-col whitespace-nowrap bg-purple-300 shadow-lg"
                gradientColor={theme === "dark" ? "#b8f2e8" : "#D9D9D955"}
              >
                <div className="flex flex-col items-center p-4 text-wrap ">
                  {/* Online Payment Icon */}
                  <CreditCard size={50} className="text-yellow-700 mb-2" />

                  {/* Online Amount Display */}
                  <span className="text-lg font-semibold text-wrap ">
                    All Online Amount:
                  </span>

                  {/* Amount Badge */}
                  <div className="mt-2 px-4 py-2 rounded-full bg-yellow-500 text-white font-bold text-lg text-wrap ">
                    ₹ {onlineAmount || "0"}
                  </div>

                  {/* Growth Indicator */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-wrap ">
                    {onlineAmount > 5000 ? (
                      <ArrowUpRight size={20} className="text-green-600" />
                    ) : (
                      <ArrowDownRight size={20} className="text-red-600" />
                    )}
                    <span>
                      {onlineAmount > 5000 ? "Increasing" : "Decreasing"}
                    </span>
                  </div>
                </div>
              </MagicCard>
            </div>
          </div>

          {/* Bank Balance Card */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 lg:row-span-3 p-2">
            <div className="flex h-auto min-h-[250px] w-full flex-col gap-4 items-center justify-center bg-gradient-to-r from-purple-100 to-purple-300 rounded-lg shadow-md p-4">
              <MagicCard
                className="cursor-pointer flex-col whitespace-nowrap bg-purple-300 shadow-lg"
                gradientColor={theme === "dark" ? "#f2c0b8" : "#D9D9D955"}
              >
                <div className="flex flex-col items-center p-4 text-wrap ">
                  {/* Bank Icon */}
                  <Banknote size={50} className="text-blue-600 mb-2" />

                  {/* Bank Balance */}
                  <span className="text-lg font-semibold text-wrap ">
                    Bank Balance:{" "}
                    <strong className="">
                      ₹ {bankDetails?.openingAmount || "0"}
                    </strong>
                  </span>

                  {/* Progress Bar (Visual Representation) */}
                  <div className="w-full bg-gray-300 rounded-full h-3 mt-3 text-wrap">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{
                        width: `${Math.min(
                          (bankDetails?.openingAmount / 10000) * 100,
                          100
                        )}%`, // Adjust percentage
                      }}
                    ></div>
                  </div>

                  {/* Trending Icon for Finances */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-wrap ">
                    <TrendingUp size={20} className="text-green-600" />
                    <span>Financial Growth</span>
                  </div>
                </div>
              </MagicCard>
            </div>
          </div>

          {/* Bank Details Card */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 lg:row-span-3 p-2">
            <div className="flex h-auto min-h-[250px] w-full flex-col gap-4">
              <MagicCard
                className="cursor-pointer flex-col  whitespace-nowrap bg-purple-300 "
                gradientColor={theme === "dark" ? "#c0f2b8" : "#D9D9D955"}
              >
                <div className="flex flex-col p-3 rounded-lg shadow-md ">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 ">
                    <Landmark className="text-blue-500" size={20} /> Bank
                    Details
                  </h2>

                  <div className="space-y-2 ">
                    <p className="flex items-center gap-2 text-wrap">
                      <Banknote className="text-green-500" size={18} />{" "}
                      <span>
                        Bank Name:{" "}
                        <strong>{bankDetails?.bankName || "N/A"}</strong>
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-wrap">
                      <Landmark className="text-indigo-500" size={18} />{" "}
                      <span>
                        Branch: <strong>{bankDetails?.branch || "N/A"}</strong>
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-wrap ">
                      <Hash className="text-red-500" size={18} />{" "}
                      <span className="text-wrap ">
                        IFSC Code:{" "}
                        <strong className="text-wrap">
                          {bankDetails?.ifscCode || "N/A"}
                        </strong>
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-wrap">
                      <CreditCard className="text-yellow-500" size={18} />{" "}
                      <span>
                        Account Number:{" "}
                        <strong>{bankDetails?.accountNumber || "N/A"}</strong>
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-wrap">
                      <User className="text-purple-500" size={18} />{" "}
                      <span>
                        Account Holder:{" "}
                        <strong>
                          {bankDetails?.accountHolderName || "N/A"}
                        </strong>
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-wrap">
                      <DollarSign className="text-green-600" size={18} />{" "}
                      <span>
                        Opening Amount:{" "}
                        <strong>₹ {bankDetails?.openingAmount || "0"}</strong>
                      </span>
                    </p>
                  </div>
                </div>
              </MagicCard>
            </div>
          </div>

          {/* Bank Transactions Table */}
          <div className="col-span-12 lg:col-span-6 row-span-5 lg:row-start-4 border mb-10 p-2">
            <h1 className="font-bold">Last 5 Bank Transactions</h1>
            <div className="overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableCaption>
                  A list of your recent bank transactions.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Payment Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankData
                    ?.slice(-5)
                    .reverse()
                    .map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice?.date}
                        </TableCell>
                        <TableCell className={`${invoice?.transactionType === "WITHDRAW" ? "text-red-700" : "text-green-700"} font-bold `} >{invoice?.transactionType}</TableCell>
                        <TableCell>{invoice?.description}</TableCell>
                        <TableCell className={`${invoice?.transactionType === "WITHDRAW" ? "text-red-700" : "text-green-700"} font-bold text-right `}>
                        {invoice?.transactionType === "DEPOSIT" ? "+" : "-"}  {invoice?.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      $
                      {bankData
                        ?.slice(-5)
                        .reduce((acc, txn) => acc + txn.amount, 0)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
