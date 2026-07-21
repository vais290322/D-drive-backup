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
import AddNewComponents from "@/components/Addnew/AddNewComponents";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import EditDataComponent from "@/components/EditData/EditDataComponent";
import { useDispatch, useSelector } from "react-redux";
import { setClass } from "@/utils/academic/classSlice";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AddStudentFeesPage = () => {
  const { theme } = useTheme();
  const [postApiLoading, setPostApiLoading] = useState(false);
  const dispatch = useDispatch();
  const classData = useSelector((state) => state.class.class);
  const allClass = useSelector((state) => state.class.classNames);
  const [dynamicFields, setDynamicFields] = useState([]);
  const [input, setInput] = useState({
    className: "",
    admission_fees: "",
    tuitionFees: "",
    donation: "",
    books: "",
    id_card_charges: "",
    late_fees: "",
    fine: "",
    miscellaneous: "",
    uniform_charges: "",
    transportationFees: "",
    others: "",
    others2: "",
  });
  const [editInput, setEditInput] = useState({
    admission_fees: "",
    tuition_fees: "",
    donation: "",
    books: "",
    id_card_charges: "",
    late_fees: "",
    fine: "",
    miscellaneous: "",
    uniform_charges: "",
    blank_fields1: "",
    blank_fields2: "",
    polymorphic_ctype: "",
  });

  const dataLength = classData.length;
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (item) => {
    setEditInput({
      className: "",
      admission_fees: "",
      tuition_fees: "",
      donation: "",
      books: "",
      id_card_charges: "",
      late_fees: "",
      fine: "",
      miscellaneous: "",
      uniform_charges: "",
      blank_fields1: "",
      blank_fields2: "",
      polymorphic_ctype: "",
    });
  };

  const fetchClassData = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.141:8081/api/v1/Academic/classes"
      );
      // console.log("response : ", response);
      dispatch(setClass(response.data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    }
  };

  const addNewClass = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        "http://192.168.0.141:8081/api/v1/Academic/classes",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setInput({
        className: "",
        admission_fees: "",
        tuition_fees: "",
        donation: "",
        books: "",
        id_card_charges: "",
        late_fees: "",
        fine: "",
        miscellaneous: "",
        uniform_charges: "",
        blank_fields1: "",
        blank_fields2: "",
        polymorphic_ctype: "",
      });
      toast.success(response.data);
      fetchClassData();
      // dispatch(setClass([...classData, response.data]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding class");
    } finally {
      setPostApiLoading(false);
    }
  };

  const updateClassData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `http://192.168.0.141:8081/api/v1/Academic/classes/${id}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.success("Class updated successfully!");
        const updatedData = classData.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );
        setEditInput({
          admission_fees: "",
          tuition_fees: "",
          donation: "",
          books: "",
          id_card_charges: "",
          late_fees: "",
          fine: "",
          miscellaneous: "",
          uniform_charges: "",
          blank_fields1: "",
          blank_fields2: "",
          polymorphic_ctype: "",
        });
        setEditId(null);
        dispatch(setClass(updatedData));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update class");
    } finally {
      setPostApiLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, []);

  // for add new filed 
  const handleDynamicFieldChange = (index, key, value) => {
    const updatedFields = [...dynamicFields];
    updatedFields[index][key] = value;
    setDynamicFields(updatedFields);
  };

  const addNewField = () => {
    setDynamicFields([
      ...dynamicFields,
      { description: "", charges: "" },
    ]);
  };

  const removeField = (index) => {
    setDynamicFields(dynamicFields.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Combine static input and dynamic fields into one payload
    const payload = {
      ...input,
      additionalCharges: dynamicFields,
    };
    // console.log("Form Submitted", payload);
    // Submit `payload` to the API
  };

  const formData = [
    {
      name: "admission_fees",
      label: "Admission Fees",
      type: "number",
      placeholder: "Admission Fees",
      required: true,
    },
    {
      name: "tuition_fees",
      label: "Tuition Fees",
      type: "number",
      placeholder: "Tuition Fees",
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
      name: "id_card_charges",
      label: "ID Card Charges",
      type: "number",
      placeholder: "ID Card Charges",
      required: true,
    },
    {
      name: "late_fees",
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
      name: "uniform_charges",
      label: "Uniform Charges",
      type: "number",
      placeholder: "Uniform Charges",
      required: true,
    },
    {
      name: "blank_fields1",
      label: "Blank Fields 1",
      type: "number",
      placeholder: "Blank Fields 1",
      required: true,
    },
    {
      name: "blank_fields2",
      label: "Blank Fields 2",
      type: "number",
      placeholder: "Blank Fields 2",
      required: true,
    },
    {
      name: "polymorphic_ctype",
      label: "Polymorphic Ctype",
      type: "number",
      placeholder: "Polymorphic Ctype",
      required: true,
    },
    {
      name: "blank_fields3",
      label: "Blank Fields 3",
      type: "number",
      placeholder: "Blank Fields 3",
      required: true,
    },
  ];

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = classData.slice(
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

                <form onSubmit={""}>
                  <div className="grid grid-cols-2 gap-6 py-4">
                    {/* for class */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="class">
                        Class
                        <sup className="text-red-600">*</sup>
                      </Label>
                      <Select
                        onValueChange={(e) => setInput({ ...input, class: e })}
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
                      <Label htmlFor="admission_fees">
                        Admission Fee
                        <sup className="text-red-600">*</sup>
                      </Label>
                      <Input
                        required
                        type="text"
                        value={input.admission_fees}
                        id="admission_fees"
                        name="admission_fees"
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
                        value={input.tuitionFees}
                        id="tuitionFees"
                        name="tuitionFees"
                        onChange={changeEventHandler}
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
                      <Label htmlFor="id_card_charges">
                        Id's Card Charges
                        <sup className="text-red-600">*</sup>
                      </Label>
                      <Input
                        required
                        type="text"
                        value={input.id_card_charges}
                        id="id_card_charges"
                        name="id_card_charges"
                        onChange={changeEventHandler}
                      />
                    </div>
                    {/* for late fees */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="late _fees">
                        Late Fees{" "}
                        <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Input
                        type="text"
                        value={input.late_fees}
                        id="late _fees"
                        name="late _fees"
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
                      <Label htmlFor="uniform_charges">
                        Uniform Charges
                        <sup className="text-red-600">*</sup>
                      </Label>
                      <Input
                        required
                        type="text"
                        value={input.uniform_charges}
                        id="uniform_charges"
                        name="uniform_charges"
                        onChange={changeEventHandler}
                      />
                    </div>
                    {/* for transportation fee */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="transportationFees">
                      Transportation Fee
                        <sup className="text-red-600">*</sup>
                      </Label>
                      <Input
                        required
                        type="text"
                        value={input.transportationFees}
                        id="transportationFees"
                        name="transportationFees"
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
                          <Button variant="destructive" onClick={() => removeField(index)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline"  onClick={addNewField} className="mt-2 bg-blue-500 text-white">
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
                "Miscellaneous",
                "books",
                "Id Card's Charges",
                "Uniform Charges",
                "Fine",
                "Late fees",
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
                className={`hover:bg-gray-50 ${
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
                  {item.class_Code}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex gap-2 justify-end">
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
                      onSubmitFunction={(e) => updateClassData(e, item.id)}
                      onEditClick={() => handleEditClick(item)}
                      customClass="grid grid-cols-4"
                    />
                    <DeleteComponent
                      name={item.className} // Name of the class
                      deletePath={`http://192.168.0.141:8081/api/v1/Academic/classes/${item.id}`} // API endpoint for deletion
                      onDelete={() => {
                        const updatedData = classData.filter(
                          (data) => data.id !== item.id
                        );
                        dispatch(setClass(updatedData)); // Update the Redux state after deletion
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





