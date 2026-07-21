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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaMoneyBillWave, FaRegCalendarAlt } from "react-icons/fa";
// Remove Badge import since we're creating our own
// import { Badge } from "@/components/ui/badge";
import TourButton from "@/components/Tour/TourButton";
import { feesPageSteps } from "@/components/Tour/Steps/FeesSteps/Steps";

// Custom Badge component
const Badge = ({ children, variant = "default", className = "" }) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  
  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-[#452B90] text-white",
    outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
  };
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

const ClassFeesPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allClass = useSelector((state) => state?.class?.classNames) || [];
  const allTutionFees = useSelector((state) => state?.tutionFees?.tutionFees) || [];
  const tutionFeesMode = useSelector(
    (state) => state?.tutionFeeMode?.tutionFeeMode
  );

  const [feeMode, setFeeMode] = useState("");

  

  const schoolId = useSelector((state) => state?.auth?.schoolId);
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

  const fetchTutionFeeMode = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${accountApi}/api/feeSelection/${schoolId}`
      ); 
      if(response?.data?.data?.feeType){
        dispatch(setTutionFeeMode(response?.data?.data?.feeType));
        setFeeMode(response?.data?.data?.feeType); }
    }
    catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong"); 
    } 
  }
  

  // Function to handle checkbox change
  const handleCheckboxChange = (e) => {
    setSelectedOption(e.target.name); // Only one option can be selected at a time
  };

 // console.log("feees mode : ",tutionFeesMode, selectedOption, )

  // Submit handler
  const handleSubmit1 = async (e) => {
    e.preventDefault();

    if (!selectedOption) {
      toast.error("Please select one option.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${accountApi}/api/feeSelection/${schoolId}`, {
        feeType: selectedOption
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        dispatch(setTutionFeeMode(response?.data?.data?.feeType));
        toast.success("Fees mode updated successfully!");
        setSelectedOption("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update fee mode");
    } finally {
      setLoading(false);
    }
  };

  const dataLength = allTutionFees?.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const fetchTutionFees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${accountApi}/api/tuition-fees/${schoolId}`
      );

      if (response) {
        dispatch(setTutionFees(response?.data?.data || []));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutionFees();
    fetchTutionFeeMode();
  }, []);

  // for add new tution fees data
  const addNewTutionFees = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${accountApi}/api/tuition-fees/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        setInput({
          monthlyFee: "",
          className: "",
        });
        fetchTutionFees();
        toast.success("Tuition Fees added successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add tuition fees");
    } finally {
      setPostApiLoading(false);
    }
  };

  const updateTutionFeesData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${accountApi}/api/tuition-fees/${id}/${schoolId}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.success("Fees updated successfully!");
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

  const dialogHeader = "Add Tuition Fees";
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
        value={input.className}
        onChange={changeEventHandler}
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

  // Fee mode options
  const feeOptions = [
    { name: "monthly", label: "Monthly" },
    { name: "quarterly", label: "Quarterly" },
    { name: "halfyearly", label: "Half Yearly" },
    { name: "yearly", label: "Yearly" },
  ];

  return (
    <div className={`${theme === "light" ? "bg-gray-900 text-white" : "light"} min-h-screen pb-8`}>
      <div className="container mx-auto px-4 py-6">
        <div className="w-full flex flex-row-reverse items-center mb-4">
          <div className="flex items-center h-full">
            <TourButton steps={feesPageSteps} tourName="feesPage" />
          </div>
        </div>
        <div className="grid gap-6">
          {/* Tuition Fees Table Card */}
          <Card className={`shadow-lg overflow-hidden ${theme === "light" ? "bg-[#1e293b] text-white border-gray-700" : "bg-white"}`}>
            <CardHeader className="pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <FaMoneyBillWave className="text-[#452B90]" />
                  Tuition Fees
                </CardTitle>
                <p className="text-sm opacity-70 mt-1">Manage class-wise tuition fees</p>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className={`mr-3 ${theme === "light" ? "border-gray-600" : ""}`}>
                  {tutionFeesMode ? `${tutionFeesMode.charAt(0).toUpperCase() + tutionFeesMode.slice(1)} Mode` : "No Mode Set"}
                </Badge>
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
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#452B90]"></div>
                </div>
              ) : dataLength === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FaMoneyBillWave className="text-4xl text-gray-400 mb-3" />
                  <p className="text-lg font-medium">No tuition fees added yet</p>
                  <p className="text-sm opacity-70 mb-4">Add your first class fee using the button above</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader
                      className={`${
                        theme === "light" ? "bg-[#333]" : "bg-gray-50"
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
                            className={`px-4 py-3 ${
                              theme === "light"
                                ? "border-gray-700 text-white"
                                : "border-gray-200 text-gray-700"
                            } font-semibold ${
                              header === "Action" ? "text-right" : "text-left"
                            } ${
                              [
                                "Monthly Fees",
                                "Quarterly Fees",
                                "Half Yearly Fees",
                              ].includes(header)
                                ? "hidden sm:table-cell"
                                : ""
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
                          className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            theme === "light"
                              ? "border-gray-700"
                              : "border-gray-200"
                          }`}
                        >
                          <TableCell
                            className={`px-4 py-3 ${
                              theme === "light"
                                ? "border-gray-700"
                                : "border-gray-200"
                            }`}
                          >
                            {(currentPage - 1) * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 font-medium ${
                              theme === "light"
                                ? "border-gray-700"
                                : "border-gray-200"
                            }`}
                          >
                            {item.className}
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${
                              theme === "light"
                                ? "border-gray-700"
                                : "border-gray-200"
                            } hidden sm:table-cell`}
                          >
                            ₹{item.monthlyFee}
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${
                              theme === "light"
                                ? "border-gray-700"
                                : "border-gray-200"
                            } hidden sm:table-cell`}
                          >
                            ₹{item.quarterlyFee}
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${
                              theme === "light"
                                ? "border-gray-700"
                                : "border-gray-200"
                            } hidden sm:table-cell`}
                          >
                            ₹{item.halfYearlyFee}
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${
                              theme === "light"
                                ? "border-gray-700"
                                : "border-gray-200"
                            }`}
                          >
                            ₹{item.yearlyFee}
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${
                              theme === "light"
                                ? "border-gray-700"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex justify-end items-center gap-2">
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
                                name={item?.className}
                                deletePath={`${accountApi}/api/tuition-fees/${item.id}/${schoolId}`}
                                onDelete={() => {
                                  const updatedData = allTutionFees?.filter(
                                    (data) => data.id !== item.id
                                  );
                                  dispatch(setTutionFees(updatedData));
                                }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination Section */}
              {dataLength > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <PaginationComponent
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    totalPages={totalPages}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fee Mode Selection Card */}
          <Card className={`shadow-lg ${theme === "light" ? "bg-[#1e293b] text-white border-gray-700" : "bg-white"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FaRegCalendarAlt className="text-[#452B90]" />
                Fee Collection Mode
              </CardTitle>
              <p className="text-sm opacity-70">Set how you want to collect fees from students</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit1}>
                <div className="mb-4">
                  <div className={`p-3 rounded-md ${theme === "light" ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className="text-sm font-medium mb-1">Current Mode:</p>
                    <p className="text-lg font-semibold">
                      {tutionFeesMode ? (
                        <span className="flex items-center gap-2">
                          <Badge variant="secondary" className="py-1">
                            {tutionFeesMode.charAt(0).toUpperCase() + tutionFeesMode.slice(1)}
                          </Badge>
                        </span>
                      ) : (
                        <span className="text-gray-500">Not set</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-md font-medium mb-3">Select a new fee collection mode:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {feeOptions.map((option) => (
                      <div 
                        key={option.name}
                        className={`
                          relative rounded-md border p-3 cursor-pointer transition-all
                          ${selectedOption === option.name 
                            ? `ring-2 ring-[#452B90] ${theme === "light" ? "bg-gray-800" : "bg-gray-50"}` 
                            : `${theme === "light" ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"}`
                          }
                        `}
                        onClick={() => setSelectedOption(option.name)}
                      >
                        <input
                          type="checkbox"
                          name={option.name}
                          checked={selectedOption === option.name}
                          onChange={handleCheckboxChange}
                          className="absolute top-3 right-3 w-4 h-4 accent-[#452B90]"
                        />
                        <p className="font-medium">{option.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {  selectedOption && tutionFeesMode !== selectedOption && (
                  <Button
                    type="submit"
                    className="bg-[#452B90] hover:bg-[#5a3cb8] transition-colors w-full sm:w-auto"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Updating...
                      </>
                    ) : (
                      "Update Fee Mode"
                    )}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassFeesPage;