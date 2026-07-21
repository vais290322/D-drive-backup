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
import { FaPlus } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { setStudentFees } from "@/utils/fees/studentFeesSlice";
import { TiEye } from "react-icons/ti";
import { accountApi } from "@/common/main";

const AddStudentFeesPage = () => {
  const { theme } = useTheme();
  const [postApiLoading, setPostApiLoading] = useState(false);
  const dispatch = useDispatch();
  const allClass = useSelector((state) => state.class.classNames);
  const [dynamicFields, setDynamicFields] = useState([]);
  const allStudentFees = useSelector((state) => state.studentFees.studentFees);
  const [fetchTuitionsFees, setFetchTuitionsFees] = useState(0);
  const [currentClass, setCurrentClass] = useState("");


  // console.log("allStudentFees : ", allStudentFees);

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

  const showModalHandler = (itme) => {
    setCurrentClass(itme);
  };

  const fetchTutionFees = async () => {
    try {
      const response = await axios.get(
        `${accountApi}/api/tuition-fees/by-class/${input?.className}`
      );

      // console.log("response : ", response);
      if (response) {
        setFetchTuitionsFees(response?.data?.data);
        setInput((prev) => ({
          ...prev,
          tuitionFees: response?.data?.data, // Update snake_case key
        }));
      }
    } catch (error) {
      // console.log("error : ", error);
    }
  };

  useEffect(() => {
    fetchTutionFees();
  }, [input?.className]);

  const fetchStudentFeesData = async () => {
    try {
      const response = await axios.get(
        `${accountApi}/api/fees-structure/all`
      );
      // console.log("response : ", response);
      dispatch(setStudentFees(response?.data?.data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    }
  };

  const updateStudentFeesData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${accountApi}/api/fees-structure/${id}`,
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
    // console.log("Form Submitted", payload);

    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${accountApi}/api/fees-structure`,
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

        // dispatch(setStudentFees([...allStudentFees, response.data.data]));
        toast.success(
          response.data.message || "Student Fees added successfully!"
        );
        // console.log("response : ", response);
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

  const dataLength = allStudentFees.length;
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = allStudentFees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  return (
    <div className={` ${theme === "light" ? "dark" : "light"} h-[100vh]`}>
      <div
        className={`mt-4 font-poppins border-[1px] rounded-[0.675rem] mx-1 sm:mx-14 ${
          theme === "light"
            ? "border-[rgba(193,193,193,0.3)]"
            : " border-slate-200 bg-white"
        }`}
      >
        <div
          className={`flex justify-between items-center p-3 sm:p-4 border-b-[1px] ${
            theme === "light"
              ? "border-[rgba(193,193,193,0.3)]"
              : "border-slate-200"
          }`}
        >
          <span className="text-[1rem] sm:text-[1.5rem] font-bold font-poppins">
            Student's Fees
          </span>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-[#452B90] hover:bg-[#c29732] text-white ">
                  <span>
                    <FaPlus />
                  </span>
                  <span>Add New Student Fees </span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[36%]">
                <DialogHeader>
                  <DialogTitle>Creat Student Fees Collection </DialogTitle>
                </DialogHeader>

                <form onSubmit={(e) => handleSubmit(e)}>
                  <div className="grid grid-cols-2 gap-6 py-4">
                    {/* for class */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="class">
                        Class
                        <sup className="text-red-600">*</sup>
                      </Label>
                      <Select
                        onValueChange={(e) =>
                          setInput({ ...input, className: e })
                        }
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
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
                      <Label htmlFor="admission_Fees">
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
                      />
                    </div>
                    {/* for tution fee */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="tuitionFees">
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
                      />
                    </div>
                    {/* for donation */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="donation">
                        Donation{" "}
                        <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Input
                        type="text"
                        value={input.donation}
                        id="donation"
                        name="donation"
                        onChange={changeEventHandler}
                      />
                    </div>
                    {/* for books */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="books">
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
                      />
                    </div>
                    {/* for id card charges */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="id_Card_Charges">
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
                      />
                    </div>
                    {/* for late fees */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="late_Fees">
                        Late Fees{" "}
                        <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Input
                        type="text"
                        value={input.late_Fees}
                        id="late_Fees"
                        name="late_Fees"
                        onChange={changeEventHandler}
                      />
                    </div>
                    {/* for fine */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="fine">
                        Fine <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Input
                        type="text"
                        value={input.fine}
                        id="fine"
                        name="fine"
                        onChange={changeEventHandler}
                      />
                    </div>
                    {/* for miscellaneous */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="miscellaneous">
                        Miscellaneous{" "}
                        <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Input
                        type="text"
                        value={input.miscellaneous}
                        id="miscellaneous"
                        name="miscellaneous"
                        onChange={changeEventHandler}
                      />
                    </div>
                    {/* for uniform charges */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="uniform_Charges">
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
                      />
                    </div>
                    {/* for transportation fee */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="transportationalFees">
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
                      />
                    </div>
                  </div>

                  {/* for dynamic fields which user can add and remove */}
                  <div className="mt-4">
                    <h4>Additional Charges</h4>
                    {dynamicFields.map((field, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-4 items-center my-2"
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
                        />
                        <Button
                          variant="destructive"
                          onClick={() => removeField(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addNewField}
                      className="mt-2 bg-blue-500 text-white"
                    >
                      Add New Field
                    </Button>
                  </div>

                  <DialogFooter>
                    <Button
                      type="submit"
                      className=" bg-[#452B90] hover:bg-[#c29732] "
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Table className="table-auto w-full border-collapse border border-slate-200">
          <TableHeader
            className={`bg-gray-100 ${
              theme === "light" ? "bg-[#212121]" : "light"
            }`}
          >
            <TableRow>
              {[
                "S.No",
                "Class Name",
                "Admission Fee",
                "Tution Fee",
                "Donation",
                "books",
                "Total Fees",
                "Action",
              ].map((n, index) => (
                <TableHead
                  key={index}
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)] text-white"
                      : "border-slate-200 text-black"
                  } font-semibold ${
                    n === "Action" ? "text-right" : "text-left"
                  }`}
                >
                  {n}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={item.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  theme === "light"
                    ? "border-[rgba(193,193,193,0.3)]"
                    : "border-slate-200"
                }`}
              >
                <TableCell
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  {item.className}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  {item.admission_Fees}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  {item.tuitionFees}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  {item.donation}
                </TableCell>

                <TableCell
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  {item.books}
                </TableCell>

                <TableCell
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  {item.totalFees}
                </TableCell>

                <TableCell
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex gap-2 justify-end">
                    {/* for view details  */}
                    <div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <TiEye
                            className="sm:w-8 sm:h-8 w-6 h-6 bg-[#72a324] text-white p-1 sm:p-2 cursor-pointer rounded-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              showModalHandler(item);
                            }}
                          />
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[40%] p-6 rounded-lg shadow-md">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-semibold text-gray-900">
                              Student Fees Details
                            </DialogTitle>
                          </DialogHeader>

                          <div className="p-4 bg-gray-100 rounded-md">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4">
                              <div>
                                <p className="text-gray-600 font-medium">
                                  Class Name:
                                </p>
                                <p className="font-semibold">
                                  {currentClass.className}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 font-medium">
                                  Total Fees:
                                </p>
                                <p className="font-semibold text-green-600">
                                  ₹{currentClass.totalFees}
                                </p>
                              </div>
                            </div>

                            {/* Fees Breakdown */}
                            <div className="space-y-2 border-b pb-4 mb-4">
                              <h3 className="text-md font-semibold text-gray-700">
                                Fee Breakdown
                              </h3>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                                <p>
                                  <strong>Admission:</strong> ₹
                                  {currentClass?.admission_Fees}
                                </p>
                                <p>
                                  <strong>Books:</strong> ₹{currentClass?.books}
                                </p>
                                <p>
                                  <strong>Donation:</strong> ₹
                                  {currentClass?.donation}
                                </p>
                                <p>
                                  <strong>Fine:</strong> ₹{currentClass?.fine}
                                </p>
                                <p>
                                  <strong>ID Card:</strong> ₹
                                  {currentClass?.id_Card_Charges}
                                </p>
                                <p>
                                  <strong>Late Fees:</strong> ₹
                                  {currentClass?.late_Fees}
                                </p>
                                <p>
                                  <strong>Miscellaneous:</strong> ₹
                                  {currentClass?.miscellaneous}
                                </p>
                                <p>
                                  <strong>Transport:</strong> ₹
                                  {currentClass?.transportationalFees}
                                </p>
                                <p>
                                  <strong>Uniform:</strong> ₹
                                  {currentClass?.uniform_Charges}
                                </p>
                                <p>
                                  <strong>Tuition:</strong> ₹
                                  {currentClass?.tuitionFees}
                                </p>
                              </div>
                            </div>

                            {/* Additional Charges */}
                            {currentClass?.additionalCharges?.length > 0 && (
                              <div className="space-y-2">
                                <h3 className="text-md font-semibold text-gray-700">
                                  Additional Charges
                                </h3>
                                <ul className="list-disc pl-4 text-sm text-gray-800">
                                  {currentClass?.additionalCharges?.map(
                                    (charge, index) => (
                                      <li
                                        key={index}
                                        className="flex justify-between"
                                      >
                                        <span className="font-medium">
                                          {charge.description}:
                                        </span>
                                        <span className="font-semibold text-red-600">
                                          ₹{charge.charges}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

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
                      onSubmitFunction={(e) =>
                        updateStudentFeesData(e, item.id)
                      }
                      onEditClick={() => handleEditClick(item)}
                      customClass="grid grid-cols-4"
                    />
                    <DeleteComponent
                      name={item?.className} // Name of the class
                      deletePath={`${accountApi}/api/fees-structure/delete/${item.id}`} // API endpoint for deletion
                      onDelete={() => {
                        const updatedData = allStudentFees?.filter(
                          (data) => data.id !== item.id
                        );
                        dispatch(setStudentFees(updatedData)); // Update the Redux state after deletion
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {dataLength === 0 && (
          <div className="text-center py-4">
            <p>No data found!</p>
          </div>
        )}
        <div className="p-3 sm:p-4">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AddStudentFeesPage;
