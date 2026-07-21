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
import { setGradeSystem } from "@/utils/result/resultSlice";
import resultUrlApi from "@/common/result";

const GradeSystemPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const role = useSelector((state) => state.auth.user);
  const gradeSystem = useSelector((state) => state.result.gradeSystem) || [];
  // console.log("grade system : ", gradeSystem);
  const dispatch = useDispatch();
  // console.log("role from grade system: ", role);
  const [input, setInput] = useState({
    scaleStartMarks: "",
    scaleEndMarks: "",
    letterGrade: "",
    performanceIndicator: "",
  });

  const [editInput, setEditInput] = useState({
    scaleStartMarks: "",
    scaleEndMarks: "",
    letterGrade: "",
    performanceIndicator: "",
  });

  const dataLength = gradeSystem.length;

  const handleEditClick = (item) => {
    setEditInput({
      scaleStartMarks: item.scaleStartMarks,
      scaleEndMarks: item.scaleEndMarks,
      letterGrade: item.letterGrade,
      performanceIndicator: item.performanceIndicator,
    });
  };

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // for fetch the class data
  const fetchGradeSystemData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${resultUrlApi.allGradeSystem.url}`);

      // console.log("response : ", response);
      if(response){
        dispatch(setGradeSystem(response.data.data));
      }

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchGradeSystemData();
  }, []);

  const addNewGradeSystem = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(`${resultUrlApi.allGradeSystem.url}`, input, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log("response : ", response);
      setInput({
        scaleStartMarks: "",
        scaleEndMarks: "",
        letterGrade: "", 
        performanceIndicator: "",
      });
      toast.success(response.data.message || "Grade System added successfully!");
      // dispatch(setGradeSystem([...gradeSystem, response.data]));
      fetchGradeSystemData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding class");
    } finally {
      setPostApiLoading(false);
    }
  };

  const updateGradeSystemData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(`${resultUrlApi.allGradeSystem.url}/${id}`, editInput, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response) {
        toast.success("Grade system updated successfully!");
        const updatedData = gradeSystem.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );

         dispatch(setGradeSystem(updatedData));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update class");
    } finally {
      setPostApiLoading(false);
    }
  };

  const dialogHeader = "Grade System";
  const formData = [
    {
      name: "scaleStartMarks",
      label: "Scale start mark",
      type: "text",
      placeholder: "enter start mark",
      required: true,
    },
    {
      name: "scaleEndMarks",
      label: "Scale end mark",
      type: "text",
      placeholder: "enter end mark",
      required: true,
    },

    {
      name: "letterGrade",
      label: "Letter grade",
      type: "text",
      placeholder: "ex: A+",
      required: true,
    },
    {
      name: "performanceIndicator",
      label: "Performance indicator",
      type: "text",
      placeholder: "ex: excellent",
      required: true,
    },
  ];

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = gradeSystem.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const headers = ["S.No", "Score %", "Letter Grade", "Performance Indicator"];
  if (["edp", "admin"].includes(role)) {
    headers.push("Action");
  }

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
              Grade System
            </span>
          </div>
          {["edp", "admin"].includes(role) && (
            <div className="flex items-center text-[1.25rem]">
              <AddNewComponents
                onChangeFunctin={changeEventHandler}
                onSubmitFunction={addNewGradeSystem}
                dialogHeader={dialogHeader}
                formData={formData}
                inputValue={input}
                postApiLoading={postApiLoading}
              />
            </div>
          )}
        </div>

        {/* Table */}
        <Table className="table-auto w-full border-collapse border border-slate-200">
          <TableHeader
            className={`bg-gray-100 text-left ${
              theme === "light" ? "bg-[#212121]" : "light"
            }`}
          >
            <TableRow>
              {headers.map((header, index) => (
                <TableHead
                  key={index}
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)] text-white "
                      : "border-slate-200 text-black"
                  } font-semibold  ${
                    header === "Action" ? "text-right" : "text-left"
                  } ${header === "S.No" ? "hidden sm:table-cell" : ""} `}
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
                  } hidden sm:table-cell `}
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
                  {item.scaleStartMarks} - {item.scaleEndMarks}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.letterGrade}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.performanceIndicator}
                </TableCell>
                {["edp", "admin"].includes(role) && (
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
                        onSubmitFunction={(e) =>
                          updateGradeSystemData(e, item.id)
                        }
                        onEditClick={() => handleEditClick(item)}
                      />

                      {/* for conformation delete the data start here */}
                      <DeleteComponent
                        name={item.performanceIndicator} // Name of the class
                        deletePath={`${resultUrlApi.allGradeSystem.url}/${item.id}`} // API endpoint for deletion
                        onDelete={() => {
                          const updatedData = gradeSystem.filter(
                            (data) => data.id !== item.id
                          );
                           dispatch(setGradeSystem(updatedData)); // Update the Redux state after deletion
                        }}
                      />
                      {/* till now delete section  */}
                    </div>
                  </TableCell>
                )}
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

export default GradeSystemPage;



