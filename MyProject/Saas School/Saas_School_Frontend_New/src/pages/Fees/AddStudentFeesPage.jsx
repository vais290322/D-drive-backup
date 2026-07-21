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
import {
  Dialog,
  DialogContent,
  DialogFooter, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import PaginationComponent from "@/components/pagination/PaginationComponent";

import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import EditDataComponent from "@/components/EditData/EditDataComponent";
import { useDispatch, useSelector } from "react-redux";
import { setClass } from "@/utils/academic/classSlice";
import { Button } from "@/components/ui/button";
import { FaEdit, FaPlus } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { setStudentFees } from "@/utils/fees/studentFeesSlice";
import { TiEye } from "react-icons/ti";
import { accountApi } from "@/common/main";
import {
  BookOpen,
  CreditCard,
  DollarSign,
  FileText,
  Loader2,
  PlusCircle,
  Search,
} from "lucide-react";
import TourButton from "@/components/Tour/TourButton";
import { addStudentFeesPageSteps } from "@/components/Tour/Steps/FeesSteps/Steps";

const AddStudentFeesPage = () => {
  const { theme } = useTheme();
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const allClass = useSelector((state) => state.class.classNames);
  const [dynamicFields, setDynamicFields] = useState([]);
  const allStudentFees = useSelector((state) => state.studentFees.studentFees);
  const [fetchTuitionsFees, setFetchTuitionsFees] = useState(0);
  const [currentClass, setCurrentClass] = useState("");
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  // State for search
  const [searchTerm, setSearchTerm] = useState("");

  // ... existing state and handlers ...

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (item) => {
    setEditInput({
      admission_Fees: item.admission_Fees,
      donation: item.donation,
      books: item.books,
      id_Card_Charges: item.id_Card_Charges,
      late_Fees: item.late_Fees,
      fine: item.fine,
      miscellaneous: item.miscellaneous,
      uniform_Charges: item.uniform_Charges,
      transportationalFees: item.transportationalFees,
    });
  };

  const showModalHandler = (item) => {
    setCurrentClass(item);
  };

  // ... existing functions ...

  const [input, setInput] = useState({
    className: "",
    admission_Fees: "",
    tuitionFees: 0,
    donation: "",
    books: "",
    id_Card_Charges: "",
    late_Fees: "",
    fine: "",
    miscellaneous: "",
    uniform_Charges: "",
    transportationalFees: "",
  });

  const [editInput, setEditInput] = useState({
    className: "",
    admission_Fees: "",
    donation: "",
    books: "",
    id_Card_Charges: "",
    late_Fees: "",
    fine: "",
    miscellaneous: "",
    uniform_Charges: "",
    transportationalFees: "",
  });

  const fetchTutionFees = async () => {
    try {
      const response = await axios.get(
        `${accountApi}/api/tuition-fees/by-class/${input?.className}/${schoolId}`
      );

      if (response) {
        setFetchTuitionsFees(response?.data?.data);
        setInput((prev) => ({
          ...prev,
          tuitionFees: response?.data?.data,
        }));
      }
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    fetchTutionFees();
  }, [input?.className]);

  const fetchStudentFeesData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${accountApi}/api/fees-structure/all/${schoolId}`
      );
      dispatch(setStudentFees(response?.data?.data || []));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const updateStudentFeesData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${accountApi}/api/fees-structure/${id}/${schoolId}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.success("Class fees updated successfully!");
        const updatedData = allStudentFees.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );
        setEditInput({
          admission_Fees: "",
          tuitionFees: "",
          donation: "",
          books: "",
          id_Card_Charges: "",
          late_Fees: "",
          fine: "",
          miscellaneous: "",
          uniform_Charges: "",
          polymorphic_ctype: "",
        });

        dispatch(setClass(updatedData));
        fetchStudentFeesData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update class");
    } finally {
      setPostApiLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentFeesData();
  }, []);

  // for add new filed
  const handleDynamicFieldChange = (index, key, value) => {
    const updatedFields = [...dynamicFields];
    updatedFields[index][key] = value;
    setDynamicFields(updatedFields);
  };

  const addNewField = () => {
    setDynamicFields([...dynamicFields, { description: "", charges: "" }]);
  };

  const removeField = (index) => {
    setDynamicFields(dynamicFields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Combine static input and dynamic fields into one payload
    const payload = {
      ...input,
      additionalCharges: dynamicFields,
    };

    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${accountApi}/api/fees-structure/${schoolId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setInput({
          className: "",
          admission_Fees: "",
          tuitionFees: 0,
          donation: "",
          books: "",
          id_Card_Charges: "",
          late_Fees: "",
          fine: "",
          miscellaneous: "",
          uniform_Charges: "",
          transportationalFees: "",
        });
        setDynamicFields([]);
        toast.success(
          response.data.message || "Student Fees added successfully!"
        );
        fetchStudentFeesData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding class");
    } finally {
      setPostApiLoading(false);
    }
  };

  const formData = [
    {
      name: "admission_Fees",
      label: "Admission Fees",
      type: "number",
      placeholder: "Admission Fees",
      required: true,
    },
    {
      name: "donation",
      label: "Donation",
      type: "number",
      placeholder: "Donation",
      required: true,
    },
    {
      name: "books",
      label: "Books",
      type: "number",
      placeholder: "Books",
      required: true,
    },
    {
      name: "id_Card_Charges",
      label: "ID Card Charges",
      type: "number",
      placeholder: "ID Card Charges",
      required: true,
    },
    {
      name: "late_Fees",
      label: "Late Fees",
      type: "number",
      placeholder: "Late Fees",
      required: true,
    },
    {
      name: "fine",
      label: "Fine",
      type: "number",
      placeholder: "Fine",
      required: true,
    },
    {
      name: "miscellaneous",
      label: "Miscellaneous",
      type: "number",
      placeholder: "Miscellaneous",
      required: true,
    },
    {
      name: "uniform_Charges",
      label: "Uniform Charges",
      type: "number",
      placeholder: "Uniform Charges",
      required: true,
    },
    {
      name: "transportationalFees",
      label: "Transport",
      type: "number",
      placeholder: "Transport Charges",
      required: true,
    },
  ];

  // Filter data based on search term
  const filteredData = allStudentFees?.filter((item) =>
    item.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dataLength = filteredData?.length;
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * rowsPerPage, 
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  return (
    <div
      className={`min-h-screen  ${
        theme === "light"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="space-y-6 container mx-auto py-4 ">
        {/* Page Header */}
        <div
          className={`rounded-xl shadow-lg overflow-hidden ${
            theme === "light"
              ? "bg-[#1e293b] border border-[#2d3a4f]"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="p-6">
            <div className=" flex justify-between items-center">
              <div>
                <h1
                  className={`text-2xl font-bold flex items-center ${
                    theme === "light" ? "text-white" : "text-gray-800"
                  }`}
                >
                  <CreditCard className="mr-2 h-6 w-6 text-purple-500" />
                  Student Fees Management
                </h1>
                <p
                  className={`mt-2 ${
                    theme === "light" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Configure and manage fee structures for different classes
                </p>
              </div>
              <div>
                <TourButton
                  steps={addStudentFeesPageSteps}
                  tourName={"addStudentFeesTour"}
                />
              </div>
            </div>

            {/* Search and Add Button */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
              <div
                className={` flex items-center rounded-md border px-3 flex-1 ${
                  theme === "light"
                    ? "bg-[#273244] border-[#374357]"
                    : "bg-white border-gray-300"
                }`}
              >
                <Search
                  className={`h-4 w-4 mr-2 ${
                    theme === "light" ? "text-gray-300" : "text-gray-500"
                  }`}
                />
                <Input
                  type="text"
                  placeholder="Search by class name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`searchBox border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                    theme === "light"
                      ? "bg-[#273244] text-white placeholder:text-gray-400"
                      : "bg-white text-gray-800"
                  }`}
                />
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="addFees bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Fee Structure
                  </Button>
                </DialogTrigger>

                <DialogContent
                  className={`sm:max-w-[700px] max-h-[90vh] overflow-y-auto ${
                    theme === "light"
                      ? "bg-[#1e293b] border-[#2d3a4f] text-white"
                      : "bg-white"
                  }`}
                >
                  <DialogHeader>
                    <DialogTitle
                      className={`text-xl font-semibold ${
                        theme === "light" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Create Fee Structure
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                      {/* for class */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="class"
                          className={theme === "light" ? "text-gray-200" : ""}
                        >
                          Class
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Select
                          onValueChange={(e) =>
                            setInput({ ...input, className: e })
                          }
                          required
                        >
                          <SelectTrigger
                            className={`w-full ${
                              theme === "light"
                                ? "bg-[#273244] border-[#374357] text-white"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                          <SelectContent
                            className={
                              theme === "light"
                                ? "bg-[#273244] border-[#374357] text-white"
                                : ""
                            }
                          >
                            <SelectGroup>
                              <SelectLabel>Class</SelectLabel>
                              {allClass.map((item) => (
                                <SelectItem key={item} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* for admission fee */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="admission_Fees"
                          className={theme === "light" ? "text-gray-200" : ""}
                        >
                          Admission Fee
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.admission_Fees}
                          id="admission_Fees"
                          name="admission_Fees"
                          onChange={changeEventHandler}
                          className={
                            theme === "light"
                              ? "bg-[#273244] border-[#374357] text-white"
                              : ""
                          }
                        />
                      </div>
                      {/* for tution fee */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="tuitionFees"
                          className={theme === "light" ? "text-gray-200" : ""}
                        >
                          Tuition Fee
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={fetchTuitionsFees}
                          id="tuitionFees"
                          name="tuitionFees"
                          readOnly
                          className={`${
                            theme === "light"
                              ? "bg-[#273244] border-[#374357] text-white"
                              : ""
                          } opacity-70`}
                        />
                      </div>
                      {/* for donation */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="donation"
                          className={theme === "light" ? "text-gray-200" : ""}
                        >
                          Donation{" "}
                          <span
                            className={`${
                              theme === "light"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            (optional)
                          </span>
                        </Label>
                        <Input
                          type="text"
                          value={input.donation}
                          id="donation"
                          name="donation"
                          onChange={changeEventHandler}
                          className={
                            theme === "light"
                              ? "bg-[#273244] border-[#374357] text-white"
                              : ""
                          }
                        />
                      </div>
                      {/* for books */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="books"
                          className={theme === "light" ? "text-gray-200" : ""}
                        >
                          Books Fee
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.books}
                          id="books"
                          name="books"
                          onChange={changeEventHandler}
                          className={
                            theme === "light"
                              ? "bg-[#273244] border-[#374357] text-white"
                              : ""
                          }
                        />
                      </div>
                      {/* for id card charges */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="id_Card_Charges"
                          className={theme === "light" ? "text-gray-200" : ""}
                        >
                          Id's Card Charges
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.id_Card_Charges}
                          id="id_Card_Charges"
                          name="id_Card_Charges"
                          onChange={changeEventHandler}
                          className={
                            theme === "light"
                              ? "bg-[#273244] border-[#374357] text-white"
                              : ""
                          }
                        />
                      </div>
                      {/* for late fees */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="late_Fees"
                          className={theme === "light" ? "text-gray-200" : ""}
                        >
                          Late Fees{" "}
                          <span
                            className={`${
                              theme === "light"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            (optional)
                          </span>
                        </Label>
                        <Input
                          type="text"
                          value={input.late_Fees}
                          id="late_Fees"
                          name="late_Fees"
                          onChange={changeEventHandler}
                          className={
                            theme === "light"
                              ? "bg-[#273244] border-[#374357] text-white"
                              : ""
                          }
                        />
                      </div>
                      {/* for fine */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="fine"
                          className={theme === "light" ? "text-gray-200" : ""}
                        >
                          Fine{" "}
                          <span
                            className={`${
                              theme === "light"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            (optional)
                          </span>
                        </Label>
                        <Input
                          type="text"
                          value={input.fine}
                          id="fine"
                          name="fine"
                          onChange={changeEventHandler}
                          className={
                            theme === "light"
                              ? "bg-[#273244] border-[#374357] text-white"
                              : ""
                          }
                        />
                      </div>
                      {/* for miscellaneous */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="miscellaneous"
                          className={theme === "light" ? "text-gray-200" : ""}
                        >
                          Miscellaneous{" "}
                          <span
                            className={`${
                              theme === "light"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            (optional)
                          </span>
                        </Label>
                        <Input
                          type="text"
                          value={input.miscellaneous}
                          id="miscellaneous"
                          name="miscellaneous"
                          onChange={changeEventHandler}
                          className={
                            theme === "light"
                              ? "bg-[#273244] border-[#374357] text-white"
                              : ""
                          }
                        />
                      </div>
                      {/* for uniform charges */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="uniform_Charges"
                          className={theme === "light" ? "text-gray-200" : ""}
                        >
                          Uniform Charges
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.uniform_Charges}
                          id="uniform_Charges"
                          name="uniform_Charges"
                          onChange={changeEventHandler}
                          className={
                            theme === "light"
                              ? "bg-[#273244] border-[#374357] text-white"
                              : ""
                          }
                        />
                      </div>
                      {/* for transportation fee */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="transportationalFees"
                          className={theme === "light" ? "text-gray-200" : ""}
                        >
                          Transportation Fee
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.transportationalFees}
                          id="transportationalFees"
                          name="transportationalFees"
                          onChange={changeEventHandler}
                          className={
                            theme === "light"
                              ? "bg-[#273244] border-[#374357] text-white"
                              : ""
                          }
                        />
                      </div>
                    </div>

                    {/* for dynamic fields which user can add and remove */}
                    <div
                      className={`mt-6 p-4 rounded-md ${
                        theme === "light" ? "bg-[#273244]" : "bg-gray-50"
                      }`}
                    >
                      <h4
                        className={`text-md font-medium mb-3 flex items-center ${
                          theme === "light" ? "text-white" : "text-gray-700"
                        }`}
                      >
                        <PlusCircle className="mr-2 h-4 w-4 text-purple-500" />
                        Additional Charges
                      </h4>
                      {dynamicFields.map((field, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center my-2"
                        >
                          <Input
                            required
                            placeholder="Description"
                            value={field.description}
                            onChange={(e) =>
                              handleDynamicFieldChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className={
                              theme === "light"
                                ? "bg-[#1e293b] border-[#374357] text-white"
                                : ""
                            }
                          />
                          <Input
                            required
                            placeholder="Charges"
                            value={field.charges}
                            onChange={(e) =>
                              handleDynamicFieldChange(
                                index,
                                "charges",
                                e.target.value
                              )
                            }
                            className={
                              theme === "light"
                                ? "bg-[#1e293b] border-[#374357] text-white"
                                : ""
                            }
                          />
                          <Button
                            variant="destructive"
                            onClick={() => removeField(index)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addNewField}
                        className={`mt-2 ${
                          theme === "light"
                            ? "bg-[#1e293b] border-[#374357] text-white hover:bg-[#273244]"
                            : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                        }`}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Field
                      </Button>
                    </div>

                    <DialogFooter className="mt-6">
                      <Button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={postApiLoading}
                      >
                        {postApiLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Fee Structure"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div
          className={`rounded-xl shadow-lg overflow-hidden ${
            theme === "light"
              ? "bg-[#1e293b] border border-[#2d3a4f]"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Card Header */}
          <div
            className={`flex justify-between items-center p-4 sm:p-6 border-b ${
              theme === "light" ? "border-[#2d3a4f]" : "border-gray-200"
            }`}
          >
            <div>
              <h2
                className={`feesAvailble text-xl font-bold flex items-center ${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              >
                <BookOpen className="mr-2 h-5 w-5 text-purple-500" />
                Fee Structures
              </h2>
              <p
                className={`mt-1 text-sm ${
                  theme === "light" ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {dataLength || 0} fee structures found
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="flex flex-col items-center">
                <Loader2
                  className={`h-12 w-12 animate-spin ${
                    theme === "light" ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <p
                  className={`mt-4 ${
                    theme === "light" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Loading fee structures...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {!filteredData || filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <CreditCard
                    className={`w-16 h-16 mb-4 ${
                      theme === "light" ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-lg font-medium ${
                      theme === "light" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    No fee structures found
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "Create your first fee structure to get started"}
                  </p>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader
                        className={`${
                          theme === "light" ? "bg-[#273244]" : "bg-gray-50"
                        }`}
                      >
                        <TableRow>
                          {[
                            "S.No",
                            "Class Name",
                            "Admission Fee",
                            "Tuition Fee",
                            "Books",
                            "Uniform",
                            "Total Fees",
                            "Action",
                          ].map((header, index) => (
                            <TableHead
                              key={index}
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-gray-200"
                                  : "text-gray-700"
                              } font-semibold text-sm ${
                                header === "Action" ? "text-right" : "text-left"
                              }`}
                            >
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData?.map((item, index) => (
                          <TableRow
                            key={item.id}
                            className={`transition-colors hover:bg-opacity-10 ${
                              theme === "light"
                                ? "hover:bg-[#273244] border-t border-[#2d3a4f]"
                                : "hover:bg-gray-100 border-t border-gray-200"
                            }`}
                          >
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              }`}
                            >
                              {(currentPage - 1) * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  theme === "light"
                                    ? "bg-[#3b5998] text-white"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {item.className}
                              </span>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              ₹{item.admission_Fees}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              ₹{item.tuitionFees}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              ₹{item.books}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              ₹{item.uniform_Charges}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <span
                                className={`font-medium ${
                                  theme === "light"
                                    ? "text-green-400"
                                    : "text-green-600"
                                }`}
                              >
                                ₹
                                {Number(item.admission_Fees) +
                                  Number(item.tuitionFees) +
                                  Number(item.books) +
                                  Number(item.uniform_Charges) +
                                  Number(item.id_Card_Charges) +
                                  Number(item.transportationalFees) +
                                  (item.donation ? Number(item.donation) : 0) +
                                  (item.late_Fees
                                    ? Number(item.late_Fees)
                                    : 0) +
                                  (item.fine ? Number(item.fine) : 0) +
                                  (item.miscellaneous
                                    ? Number(item.miscellaneous)
                                    : 0)}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`editButton flex items-center ${
                                        theme === "light"
                                          ? "bg-[#273244] border-[#374357] text-white hover:bg-[#1e293b]"
                                          : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                      }`}
                                      onClick={() => handleEditClick(item)}
                                    >
                                      <FaEdit className="mr-1 h-3.5 w-3.5" />
                                      Edit
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent
                                    className={`sm:max-w-[700px] ${
                                      theme === "light"
                                        ? "bg-[#1e293b] border-[#2d3a4f] text-white"
                                        : "bg-white"
                                    }`}
                                  >
                                    <DialogHeader>
                                      <DialogTitle
                                        className={`text-xl font-semibold ${
                                          theme === "light"
                                            ? "text-white"
                                            : "text-gray-800"
                                        }`}
                                      >
                                        Edit Fee Structure for {item.className}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <form
                                      onSubmit={(e) =>
                                        updateStudentFeesData(e, item.id)
                                      }
                                    >
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                        {formData.map((field) => (
                                          <div
                                            key={field.name}
                                            className="flex flex-col gap-2"
                                          >
                                            <Label
                                              htmlFor={field.name}
                                              className={
                                                theme === "light"
                                                  ? "text-gray-200"
                                                  : ""
                                              }
                                            >
                                              {field.label}
                                              {field.required && (
                                                <sup className="text-red-600">
                                                  *
                                                </sup>
                                              )}
                                            </Label>
                                            <Input
                                              required={field.required}
                                              type={field.type}
                                              value={
                                                editInput[field.name] || ""
                                              }
                                              id={field.name}
                                              name={field.name}
                                              placeholder={field.placeholder}
                                              onChange={(e) =>
                                                setEditInput({
                                                  ...editInput,
                                                  [e.target.name]:
                                                    e.target.value,
                                                })
                                              }
                                              className={
                                                theme === "light"
                                                  ? "bg-[#273244] border-[#374357] text-white"
                                                  : ""
                                              }
                                            />
                                          </div>
                                        ))}
                                      </div>
                                      <DialogFooter className="mt-6">
                                        <Button
                                          type="submit"
                                          className="bg-purple-600 hover:bg-purple-700 text-white"
                                          disabled={postApiLoading}
                                        >
                                          {postApiLoading ? (
                                            <>
                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                              Updating...
                                            </>
                                          ) : (
                                            "Update Fee Structure"
                                          )}
                                        </Button>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                </Dialog>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`viewButton flex items-center ${
                                        theme === "light"
                                          ? "bg-[#273244] border-[#374357] text-white hover:bg-[#1e293b]"
                                          : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                      }`}
                                      onClick={() => showModalHandler(item)}
                                    >
                                      <TiEye className="mr-1 h-3.5 w-3.5" />
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent
                                    className={`sm:max-w-[700px] ${
                                      theme === "light"
                                        ? "bg-[#1e293b] border-[#2d3a4f] text-white"
                                        : "bg-white"
                                    }`}
                                  >
                                    <DialogHeader>
                                      <DialogTitle
                                        className={`text-xl font-semibold ${
                                          theme === "light"
                                            ? "text-white"
                                            : "text-gray-800"
                                        }`}
                                      >
                                        Fee Structure Details -{" "}
                                        {currentClass.className}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div
                                      className={`mt-4 p-4 rounded-lg ${
                                        theme === "light"
                                          ? "bg-[#273244]"
                                          : "bg-gray-50"
                                      }`}
                                    >
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div
                                          className={`p-3 rounded-md ${
                                            theme === "light"
                                              ? "bg-[#1e293b]"
                                              : "bg-white border border-gray-200"
                                          }`}
                                        >
                                          <p
                                            className={`text-sm font-medium ${
                                              theme === "light"
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                            }`}
                                          >
                                            Admission Fee
                                          </p>
                                          <p
                                            className={`text-lg font-semibold ${
                                              theme === "light"
                                                ? "text-white"
                                                : "text-gray-800"
                                            }`}
                                          >
                                            ₹{currentClass.admission_Fees}
                                          </p>
                                        </div>
                                        <div
                                          className={`p-3 rounded-md ${
                                            theme === "light"
                                              ? "bg-[#1e293b]"
                                              : "bg-white border border-gray-200"
                                          }`}
                                        >
                                          <p
                                            className={`text-sm font-medium ${
                                              theme === "light"
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                            }`}
                                          >
                                            Tuition Fee
                                          </p>
                                          <p
                                            className={`text-lg font-semibold ${
                                              theme === "light"
                                                ? "text-white"
                                                : "text-gray-800"
                                            }`}
                                          >
                                            ₹{currentClass.tuitionFees}
                                          </p>
                                        </div>
                                        <div
                                          className={`p-3 rounded-md ${
                                            theme === "light"
                                              ? "bg-[#1e293b]"
                                              : "bg-white border border-gray-200"
                                          }`}
                                        >
                                          <p
                                            className={`text-sm font-medium ${
                                              theme === "light"
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                            }`}
                                          >
                                            Books
                                          </p>
                                          <p
                                            className={`text-lg font-semibold ${
                                              theme === "light"
                                                ? "text-white"
                                                : "text-gray-800"
                                            }`}
                                          >
                                            ₹{currentClass.books}
                                          </p>
                                        </div>
                                        <div
                                          className={`p-3 rounded-md ${
                                            theme === "light"
                                              ? "bg-[#1e293b]"
                                              : "bg-white border border-gray-200"
                                          }`}
                                        >
                                          <p
                                            className={`text-sm font-medium ${
                                              theme === "light"
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                            }`}
                                          >
                                            ID Card Charges
                                          </p>
                                          <p
                                            className={`text-lg font-semibold ${
                                              theme === "light"
                                                ? "text-white"
                                                : "text-gray-800"
                                            }`}
                                          >
                                            ₹{currentClass.id_Card_Charges}
                                          </p>
                                        </div>
                                        <div
                                          className={`p-3 rounded-md ${
                                            theme === "light"
                                              ? "bg-[#1e293b]"
                                              : "bg-white border border-gray-200"
                                          }`}
                                        >
                                          <p
                                            className={`text-sm font-medium ${
                                              theme === "light"
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                            }`}
                                          >
                                            Uniform Charges
                                          </p>
                                          <p
                                            className={`text-lg font-semibold ${
                                              theme === "light"
                                                ? "text-white"
                                                : "text-gray-800"
                                            }`}
                                          >
                                            ₹{currentClass.uniform_Charges}
                                          </p>
                                        </div>
                                        <div
                                          className={`p-3 rounded-md ${
                                            theme === "light"
                                              ? "bg-[#1e293b]"
                                              : "bg-white border border-gray-200"
                                          }`}
                                        >
                                          <p
                                            className={`text-sm font-medium ${
                                              theme === "light"
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                            }`}
                                          >
                                            Transportation Fee
                                          </p>
                                          <p
                                            className={`text-lg font-semibold ${
                                              theme === "light"
                                                ? "text-white"
                                                : "text-gray-800"
                                            }`}
                                          >
                                            ₹{currentClass.transportationalFees}
                                          </p>
                                        </div>
                                        {currentClass.donation && (
                                          <div
                                            className={`p-3 rounded-md ${
                                              theme === "light"
                                                ? "bg-[#1e293b]"
                                                : "bg-white border border-gray-200"
                                            }`}
                                          >
                                            <p
                                              className={`text-sm font-medium ${
                                                theme === "light"
                                                  ? "text-gray-400"
                                                  : "text-gray-500"
                                              }`}
                                            >
                                              Donation
                                            </p>
                                            <p
                                              className={`text-lg font-semibold ${
                                                theme === "light"
                                                  ? "text-white"
                                                  : "text-gray-800"
                                              }`}
                                            >
                                              ₹{currentClass.donation}
                                            </p>
                                          </div>
                                        )}
                                        {currentClass.late_Fees && (
                                          <div
                                            className={`p-3 rounded-md ${
                                              theme === "light"
                                                ? "bg-[#1e293b]"
                                                : "bg-white border border-gray-200"
                                            }`}
                                          >
                                            <p
                                              className={`text-sm font-medium ${
                                                theme === "light"
                                                  ? "text-gray-400"
                                                  : "text-gray-500"
                                              }`}
                                            >
                                              Late Fees
                                            </p>
                                            <p
                                              className={`text-lg font-semibold ${
                                                theme === "light"
                                                  ? "text-white"
                                                  : "text-gray-800"
                                              }`}
                                            >
                                              ₹{currentClass.late_Fees}
                                            </p>
                                          </div>
                                        )}
                                        {currentClass.fine && (
                                          <div
                                            className={`p-3 rounded-md ${
                                              theme === "light"
                                                ? "bg-[#1e293b]"
                                                : "bg-white border border-gray-200"
                                            }`}
                                          >
                                            <p
                                              className={`text-sm font-medium ${
                                                theme === "light"
                                                  ? "text-gray-400"
                                                  : "text-gray-500"
                                              }`}
                                            >
                                              Fine
                                            </p>
                                            <p
                                              className={`text-lg font-semibold ${
                                                theme === "light"
                                                  ? "text-white"
                                                  : "text-gray-800"
                                              }`}
                                            >
                                              ₹{currentClass.fine}
                                            </p>
                                          </div>
                                        )}
                                        {currentClass.miscellaneous && (
                                          <div
                                            className={`p-3 rounded-md ${
                                              theme === "light"
                                                ? "bg-[#1e293b]"
                                                : "bg-white border border-gray-200"
                                            }`}
                                          >
                                            <p
                                              className={`text-sm font-medium ${
                                                theme === "light"
                                                  ? "text-gray-400"
                                                  : "text-gray-500"
                                              }`}
                                            >
                                              Miscellaneous
                                            </p>
                                            <p
                                              className={`text-lg font-semibold ${
                                                theme === "light"
                                                  ? "text-white"
                                                  : "text-gray-800"
                                              }`}
                                            >
                                              ₹{currentClass.miscellaneous}
                                            </p>
                                          </div>
                                        )}
                                      </div>

                                      <div
                                        className={`mt-6 p-4 rounded-md ${
                                          theme === "light"
                                            ? "bg-[#1e293b]"
                                            : "bg-white border border-gray-200"
                                        }`}
                                      >
                                        <div className="flex justify-between items-center">
                                          <p
                                            className={`text-lg font-medium ${
                                              theme === "light"
                                                ? "text-gray-300"
                                                : "text-gray-700"
                                            }`}
                                          >
                                            Total Fees:
                                          </p>
                                          <p
                                            className={`text-xl font-bold ${
                                              theme === "light"
                                                ? "text-green-400"
                                                : "text-green-600"
                                            }`}
                                          >
                                            ₹
                                            {Number(
                                              currentClass.admission_Fees
                                            ) +
                                              Number(currentClass.tuitionFees) +
                                              Number(currentClass.books) +
                                              Number(
                                                currentClass.uniform_Charges
                                              ) +
                                              Number(
                                                currentClass.id_Card_Charges
                                              ) +
                                              Number(
                                                currentClass.transportationalFees
                                              ) +
                                              (currentClass.donation
                                                ? Number(currentClass.donation)
                                                : 0) +
                                              (currentClass.late_Fees
                                                ? Number(currentClass.late_Fees)
                                                : 0) +
                                              (currentClass.fine
                                                ? Number(currentClass.fine)
                                                : 0) +
                                              (currentClass.miscellaneous
                                                ? Number(
                                                    currentClass.miscellaneous
                                                  )
                                                : 0)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <DeleteComponent
                                  id={item.id}
                                  url={`${accountApi}/api/fees-structure/${item.id}/${schoolId}`}
                                  refetch={fetchStudentFeesData}
                                  theme={theme}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div
                    className={`p-4 border-t ${
                      theme === "light" ? "border-[#2d3a4f]" : "border-gray-200"
                    }`}
                  >
                    <PaginationComponent
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      theme={theme}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStudentFeesPage;
