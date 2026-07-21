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
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { setTutionFees } from "@/utils/fees/tutionFees";
import { setTutionFeeMode } from "@/utils/fees/tutionFeeModeSlice";
import { accountApi } from "@/common/main";

const ClassFeesPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allClass = useSelector((state) => state.class.classNames);
  const allTutionFees = useSelector((state) => state.tutionFees.tutionFees);
  const tutionFeesMode = useSelector(
    (state) => state?.tutionFeeMode?.tutionFeeMode
  );
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    monthlyFee: "",
    className: "",
  });

  const [editInput, setEditInput] = useState({
    monthlyFee: "",
  });

  const handleEditClick = (item) => {
    setEditInput({
      monthlyFee: item.monthlyFee,
    });
  };

  const [selectedOption, setSelectedOption] = useState("");

  // console.log("selectedOption : ", selectedOption);

  // Function to handle checkbox change
  const handleCheckboxChange = (e) => {
    setSelectedOption(e.target.name); // Only one option can be selected at a time
  };

  // Submit handler
  const handleSubmit1 =async (e) => {
    e.preventDefault();

    if (!selectedOption) {
      alert("Please select one option.");
      return;
    }

    const response =await axios.post(`${accountApi}/api/feeSelection`, {
      feeType: selectedOption},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("response : ", response?.data?.data?.feeType);

    if (response) {
      dispatch(setTutionFeeMode(response?.data?.data?.feeType));
      toast.success("Fees selected successfully!");
      
    }

    
  };

  const dataLength = allTutionFees.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const fetchTutionFees = async () => {
    try {
      const response = await axios.get(
        `${accountApi}/api/tuition-fees`
      );

      // console.log("response : ", response)

      if (response) {
        dispatch(setTutionFees(response?.data?.data));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchTutionFees();
  }, []);

  // for add new tution fees data
  const addNewTutionFees = async (e) => {
    e.preventDefault();
    // console.log("input : ", input);
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${accountApi}/api/tuition-fees`,
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
          monthlyFee: "",
          className: "",
        });
        fetchTutionFees();
        toast.success("Tution Fees added successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add tution fees");
    } finally {
      setPostApiLoading(false);
    }
  };

  const updateTutionFeesData = async (e, id) => {
    // console.log("editInput : ", editInput);
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${accountApi}/api/tuition-fees/${id}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        // console.log("response : ", response);
        toast.success("Class updated successfully!");
        const updatedData = allTutionFees?.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );
        setEditInput({ monthlyFee: "" });
        fetchTutionFees();
        dispatch(setTutionFees(updatedData));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update tuition fees"
      );
    } finally {
      setPostApiLoading(false);
    }
  };

  const dialogHeader = "Tuition Fees";
  const formData = [
    {
      name: "monthlyFee",
      label: "Monthly Fees",
      type: "text",
      placeholder: "Enter Monthly Tuition Fees",
      required: true,
    },
  ];

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = allTutionFees.slice(
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
        id="className"
        name="className"
        className="w-full border border-slate-200 rounded p-2 mt-1 focus-visible:ring-1"
        value={input.className} // Bind value to input state
        onChange={changeEventHandler} // Update state on change
        required
      >
        <option value="">Select Class</option>
        {allClass?.map((className) => (
          <option key={className} value={className}>
            {className}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className={` ${theme === "light" ? "dark" : "light"} h-[100vh]`}>
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
              Tution Fees
            </span>
          </div>

          <div className="flex items-center text-[1.25rem]">
            <AddNewComponents
              onChangeFunctin={changeEventHandler}
              onSubmitFunction={addNewTutionFees}
              dialogHeader={dialogHeader}
              formData={formData}
              inputValue={input}
              postApiLoading={postApiLoading}
              customContent={classDropdown}
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
                "Class",
                "Monthly Fees",
                "Quarterly Fees",
                "Half Yearly Fees",
                "Yearly Fees",
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
                  } ${
                    [
                      "Monthly Fees",
                      "Quarterly Fees",
                      "Half Yearly Fees",
                    ].includes(header)
                      ? "hidden sm:table-cell"
                      : ""
                  } `}
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
                  } hidden sm:table-cell `}
                >
                  {item.monthlyFee}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }  hidden sm:table-cell `}
                >
                  {item.quarterlyFee}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }  hidden sm:table-cell`}
                >
                  {item.halfYearlyFee}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.yearlyFee}
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
                    <EditDataComponent
                      formData={formData}
                      postApiLoading={postApiLoading}
                      onChangeFunctin={(e) =>
                        setEditInput({
                          ...editInput,
                          [e.target.name]: e.target.value,
                        })
                      }
                      inputValue={editInput}
                      onSubmitFunction={(e) => updateTutionFeesData(e, item.id)}
                      onEditClick={() => handleEditClick(item)}
                    />

                    <DeleteComponent
                      name={item?.className} // Name of the class
                      deletePath={`${accountApi}/api/tuition-fees/${item.id}`} // API endpoint for deletion
                      onDelete={() => {
                        const updatedData = allTutionFees?.filter(
                          (data) => data.id !== item.id
                        );
                        dispatch(setTutionFees(updatedData)); // Update the Redux state after deletion
                      }}
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

      <div
        className={`mt-4 font-poppins border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${
          theme === "light"
            ? "border-[rgba(193,193,193,0.3)]"
            : " border-slate-200 bg-white"
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <h3 className="text-lg font-semibold">Set Tuition Fees mode </h3>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit1}>

            <h1 className="text-lg mb-4">Currently selected option : <span className="font-semibold"> {tutionFeesMode}</span> </h1>
  
            <h3 className="text-lg mb-4">Select one option to change the mode :  </h3>
            <div className="flex gap-5">
              <div>
                <label className="flex gap-2 font-semibold">
                  <input
                    type="checkbox"
                    name="monthly"
                    checked={selectedOption === "monthly"}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5"
                  />
                  Monthly
                </label>
              </div>

              <div>
                <label className="flex gap-2 font-semibold">
                  <input
                    type="checkbox"
                    name="quarterly"
                    checked={selectedOption === "quarterly"}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5"
                  />
                  Quarterly
                </label>
              </div>

              <div>
                <label className="flex gap-2 font-semibold">
                  <input
                    type="checkbox"
                    name="halfyearly"
                    checked={selectedOption === "halfyearly"}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5"
                  />
                  Half Yearly
                </label>
              </div>

              <div>
                <label className="flex gap-2  font-semibold ">
                  <input
                    type="checkbox"
                    name="yearly"
                    checked={selectedOption === "yearly"}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5"
                  />
                  Yearly
                </label>
              </div>
            </div>
            {
              !tutionFeesMode && (<Button
                type="submit"
                className="bg-[#452B90] hover:bg-[#c29732] flex items-center mt-4"
              >
                Submit
              </Button>)
            }
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassFeesPage;
