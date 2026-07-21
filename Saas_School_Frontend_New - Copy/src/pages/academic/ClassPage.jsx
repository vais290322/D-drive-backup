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
import { setClass } from "@/utils/academic/classSlice";
import { academicUrlApi } from "@/common";

const ClassPage = () => {
  const { theme } = useTheme();
  const [postApiLoading, setPostApiLoading] = useState(false);
  const dispatch = useDispatch();
  const classData = useSelector((state) => state.class.class);
  const schoolId = useSelector((state=>state?.auth?.schoolId));
  const [input, setInput] = useState({
    className: "",
    class_Code: "",
  });
  const [editInput, setEditInput] = useState({
    className: "",
    class_Code: "",
  });
  const [editId, setEditId] = useState(null);
  const dataLength = classData.length;
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (item) => {
    setEditInput({
      className: item.className,
      class_Code: item.class_Code,
    });
    setEditId(item.id);
  };


  const fetchClassData = async () => {
    try {
      const response = await axios.get(`${academicUrlApi.getAllClass.url}/${schoolId}`);
      // console.log("response : ", response);
      dispatch(setClass(response?.data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    }
  };

  const addNewClass = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
       `${academicUrlApi.getAllClass.url}/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setInput({ className: "", class_Code: "" });
      toast.success(response?.data || "class added ");
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
        `${academicUrlApi.getAllClass.url}/${id}/${schoolId}`,
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
        setEditInput({ className: "", class_Code: "" });
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

  const formData = [
    {
      name: "className",
      label: "Class Name",
      type: "text",
      placeholder: "Class Name",
      required: true,
    },
    {
      name: "class_Code",
      label: "Class Code",
      type: "text",
      placeholder: "Class Code",
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
             Class
          </span>
          <AddNewComponents
            onChangeFunctin={changeEventHandler}
            onSubmitFunction={addNewClass}
            dialogHeader="Class"
            formData={formData}
            inputValue={input}
            postApiLoading={postApiLoading}
          />
        </div>

        <Table className="table-auto w-full border-collapse border border-slate-200">
          <TableHeader
            className={`bg-gray-100 ${
              theme === "light" ? "bg-[#212121]" : "light"
            }`}
          >
            <TableRow>
              {["S.No", "Class Name", "Class Code", "Action"].map(
                (n, index) => (
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
                )
              )}
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
                    />
                    <DeleteComponent
                      name={item.className} // Name of the class
                      deletePath={`${academicUrlApi.getAllClass.url}/${item.id}/${schoolId}`} // API endpoint for deletion
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

export default ClassPage;
