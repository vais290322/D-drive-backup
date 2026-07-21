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

const BankTransactionPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [bankData, setBankData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
            item?.amount?.toLowerCase()?.includes(searchTerm?.toLowerCase())
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
        `${accountApi}/bank-transactions`
      );

      // console.log("response : ", response);

      setBankData(response?.data?.data);
      setFilteredData(response?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
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
        `${accountApi}/bank-transactions`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          // withCredentials: true,
        }
      );

      // console.log("response : ", response);

      if (response) {
        setInput({
          amount: "",
          incomeSource: "",
          date: "",
          paymentMethod: "",
          description: "",
        });
        fetchBankData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add income ");
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
        className="w-full border border-slate-200 rounded p-2 mt-1 focus-visible:ring-1"
        value={input.transactionType} // Bind value to input state
        onChange={changeEventHandler} // Update state on change
        required
      >
        <option value="">Select options</option>
        <option value="WITHDRAW">Withdrawl</option>
        <option value="DEPOSIT">Deposit</option>
        {/* Add more class options here */}
      </select>
    </div>
  );

  return (
    <div className={` ${theme === "light" ? "dark" : "light"} h-[100vh]`}>
      <div
        className={`flex flex-col md:flex-row gap-2 p-4  mt-4 font-poppins border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${
          theme === "light"
            ? "border-[rgba(193,193,193,0.3)]  "
            : " border-slate-200 bg-white "
        }`}
      >
        <input
          type="text"
          placeholder="Search bank transaction..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <p className="mt-3">To</p>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <button
          className=" text-white px-4 py-2 rounded bg-[#452B90] hover:bg-[#c29732] "
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setSearchTerm("");
            setFilteredData(incomeData);
          }}
        >
          Reset
        </button>
      </div>
      <div
        className={`mt-4 font-poppins border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${
          theme === "light"
            ? "border-[rgba(193,193,193,0.3)]"
            : " border-slate-200 bg-white"
        }`}
      >
        {/* Page Header Section */}
        <div
          className={`flex justify-between items-center p-3 sm:p-4 border-b-[1px] ${
            theme === "light"
              ? "border-[rgba(193,193,193,0.3)]"
              : "border-slate-200"
          }`}
        >
          <div>
            <span className="text-[1rem] sm:text-[1.5rem] font-bold font-poppins">
              Bank Transactions
            </span>
          </div>

          <div className="sm:flex hidden items-center text-[1.25rem]">
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

        {/* Table */}
        <Table className="table-auto w-full border-collapse border border-slate-200">
          <TableHeader
            className={`bg-gray-100 text-left ${
              theme === "light" ? "bg-[#212121]" : "light"
            }`}
          >
            <TableRow>
              {[
                "S.No",
                "Transaction Type",
                "Date",
                "Amount",
                "Account Number",
                "Description",
                "Action",
              ].map((header, index) => (
                <TableHead
                  key={index}
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)] text-white "
                      : "border-slate-200 text-black"
                  } font-semibold  ${
                    header === "Action"
                      ? "text-right hidden sm:block"
                      : "text-left"
                  }`}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={item.id}
                className={`hover:bg-gray-50 border ${
                  theme === "light"
                    ? "border-[rgba(193,193,193,0.3)]"
                    : "border-slate-200"
                }  `}
              >
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } ${item?.transactionType === "WITHDRAW" ? "text-red-700" : "text-green-700"} font-bold  `}
                >
                  {item?.transactionType}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.date}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } ${item?.transactionType === "WITHDRAW" ? "text-red-700" : "text-green-700"} font-bold `}
                >
                 {item?.transactionType === "DEPOSIT" ? "+" : "-"} {item.amount}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.accountNumber}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.description}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } hidden sm:table-cell `}
                >
                  <div className="flex justify-end items-center gap-2">
                    {/* <EditDataComponent
                      formData={formData}
                      postApiLoading={postApiLoading}
                      onChangeFunctin={changeEventHandler}
                      inputValue={input}
                      onSubmitFunction={addBankjData}
                      customContent={transactionTypeDropdown}
                    /> */}

                    <DeleteComponent
                      name={item?.expenseType} // Name of the class
                      deletePath={`${accountApi}/bank-transactions/${item?.id}`} // API endpoint for deletion
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination Section */}
        <PaginationComponent
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          onRowsPerPageChange={handleRowsPerPageChange}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default BankTransactionPage;
