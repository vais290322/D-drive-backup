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

const ExpensePage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
      const response = await axios.get(`${accountApi}/expenses`);

      // console.log("response : ", response);
      if (response) {
        setExpenseData(response?.data?.data);
        setFilteredData(response?.data?.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchExpenseData();
  }, []);

  // for add new Subject data
  const addNewExpense = async (e) => {
    e.preventDefault();
    // console.log("input : ", input);
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${accountApi}/expenses`,
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
          expenseType: "",
          date: "",
          paymentMethod: "",
          description: "",
        });
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

  const paymentMethodDropdown = (
    <div className="mb-4">
      <label htmlFor="paymentMethod" className="block text-sm font-medium">
        Payment Method <sup className="text-red-500">*</sup>
      </label>
      <select
        id="paymentMethod"
        name="paymentMethod"
        className="w-full border border-slate-200 rounded p-2 mt-1 focus-visible:ring-1"
        value={input.paymentMethod} // Bind value to input state
        onChange={changeEventHandler} // Update state on change
        required
      >
        <option value="">Select options</option>
        <option value="online">Online</option>
        <option value="cash">Cash</option>
        <option value="cheque">Cheque</option>
        <option value="card">Card</option>
        {/* Add more class options here */}
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
        value={input.expenseType} // Bind value to input state
        onChange={changeEventHandler} // Update state on change
        required
      >
        <option value="" disabled>
          Select options
        </option>
        <option value="salary">Salary </option>
        <option value="maintenance">Maintenance </option>
        <option value="utilities">Utilities </option>
        <option value="other">Other </option>

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
          placeholder="Search expense..."
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
              Expense Management
            </span>
          </div>

          <div className="sm:flex hidden items-center text-[1.25rem]">
            <AddNewComponents
              onChangeFunctin={changeEventHandler}
              onSubmitFunction={addNewExpense}
              dialogHeader={dialogHeader}
              formData={formData}
              inputValue={input}
              postApiLoading={postApiLoading}
              customContent={paymentMethodDropdown}
              expenseType={expenseTypeDropdown}
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
                "Expense Type",
                "Amount",
                "Date",
                "Payment Method",
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
                }`}
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
                  } `}
                >
                  {item.expenseType}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.amount}
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
                  } `}
                >
                  {item.paymentMethod}
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
                      onSubmitFunction={addNewExpense}
                      customContent={paymentMethodDropdown}
                      expenseType={expenseTypeDropdown}
                    /> */}

                    <DeleteComponent
                      name={item?.expenseType} // Name of the class
                      deletePath={`${accountApi}/expenses/${item?.id}`} // API endpoint for deletion
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

export default ExpensePage;
