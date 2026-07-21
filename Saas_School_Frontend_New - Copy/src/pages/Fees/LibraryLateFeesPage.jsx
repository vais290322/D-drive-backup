import React, { useState } from 'react'
import { useTheme } from '@/context/ThemeContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from 'axios';
import { toast } from 'sonner';
import PaginationComponent from '@/components/pagination/PaginationComponent';
import AddNewComponents from '@/components/Addnew/AddNewComponents';
import DeleteComponent from '@/components/DeleteData/DeleteComponent';
import EditDataComponent from '@/components/EditData/EditDataComponent';

const LibraryLateFeesPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [input, setInput] = useState(
    {
      libraryLateFee: "",
      class:"",
    }
  );

  // console.log("input : ", input);

  // table data
  const data = [
    { id: 1, className: "one" , libraryLateFee: "5" },
    { id: 2, className: "two", libraryLateFee: "7" },
    { id: 3, className: "three",  libraryLateFee: "9" },
    { id: 4, className: "four",  libraryLateFee: "10" },  
    { id: 5, className: "five",  libraryLateFee: "10" },
    { id: 6, className: "six",  libraryLateFee: "10" },
    
  ];
  const dataLength = data.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // for fetch the class data 
  const fetchClassData = async () => {

    try {
      setLoading(true);
      const response = await axios.get("url")

      // console.log("response : ", response)
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  // for add new Subject data 
  const addNewExamType = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post("url", input, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true,
      });

      // console.log("response : ", response);

      if (response.success) {
        setInput({
          examTypeName: "",
          monthlyFees: "",
        })
      }
    } catch (error) {
      toast.error(error.response.data.message);

    }
    finally {
      setPostApiLoading(false)
    }
  }

  const dialogHeader = "Library Late Fees";
  const formData = [
    { name: "libraryLateFee", label: "Late Fees", type: "text", placeholder: "Enter Late Fees", required: true },
  ]

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const classDropdown = (
    <div className="mb-4">
      <label htmlFor="class" className="block text-sm font-medium">
        Class<span className="text-red-500">*</span>
      </label>
      <select
        id="class"
        name="class"
        className="w-full border border-slate-200 rounded p-2 mt-1 focus-visible:ring-1"
        value={input.class} // Bind value to input state
        onChange={changeEventHandler} // Update state on change
        required
      >
        <option value="">Select Class</option>
        <option value="one">One</option>
        <option value="two">Two</option>
        {/* Add more class options here */}
      </select>
    </div>
  );


  return (
    <div className={` ${theme === "light" ? 'dark' : 'light'} h-[100vh]`}>
      <div
        className={`mt-4 font-poppins border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${theme === "light" ? 'border-[rgba(193,193,193,0.3)]' : ' border-slate-200 bg-white'
          }`}
      >
        {/* Page Header Section */}
        <div
          className={`flex flex-col sm:flex-row gap-5 justify-between items-center p-3 sm:p-4 border-b-[1px] ${theme === "light" ? 'border-[rgba(193,193,193,0.3)]' : 'border-slate-200'
            }`}>
          <div>
            <span className="text-[1rem] sm:text-[1.5rem] font-bold font-poppins">
              Library Late Fees
            </span>
          </div>

          <div className="flex items-center text-[1.25rem]">
            <AddNewComponents onChangeFunctin={changeEventHandler} onSubmitFunction={addNewExamType} dialogHeader={dialogHeader} formData={formData} inputValue={input} postApiLoading={postApiLoading} customContent={classDropdown}/>
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
                "Class",
                "Late fee (day)",
                "Action",
              ].map((header, index) => (
                <TableHead
                  key={index}
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)] text-white "
                      : "border-slate-200 text-black"
                  } font-semibold  ${
                    header === "Action" ? "text-right" : "text-left"
                  }  `}
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
                  {item.className}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.libraryLateFee}
                </TableCell>
                
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  <div className="flex justify-end items-center gap-2">
                    {/* for edit data */}
                    <EditDataComponent formData={formData} postApiLoading={postApiLoading} onChangeFunctin={changeEventHandler} inputValue={input} onSubmitFunction={addNewExamType} customContent={classDropdown} />
                    {/* here we update the edit function later  */}

                    {/* for conformation delete the data start here */}
                    <DeleteComponent />
                    {/* till now delete section  */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination Section */}
        <PaginationComponent currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          onRowsPerPageChange={handleRowsPerPageChange}
          onPageChange={setCurrentPage} />

      </div>
    </div>
  )
}

export default LibraryLateFeesPage 