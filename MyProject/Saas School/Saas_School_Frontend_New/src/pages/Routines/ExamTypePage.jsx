import React, { useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux';
import { setExamType } from '@/utils/routines/examTypeSlice';
import routineUrlApi from '@/common/routines';
import { BookOpen, Loader2 } from 'lucide-react';
 
const ExamTypePage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const dispatch= useDispatch();
  const examTypeData= useSelector(state => state.examType.examType) || [];
  const role = useSelector((state) => state?.auth?.user);
  const schoolId=useSelector((state)=>state?.auth?.schoolId)
  // console.log("examTypeData : ", examTypeData)
  const [input, setInput] = useState(
    {
      examTypeName: "",
      examMarks: "",
    }
  );
  const dataLength = examTypeData?.length;
  const [editInput, setEditInput] = useState({
    examTypeName: "",
    examMarks: "",
    });

  const handleEditClick = (item) => {
    setEditInput({
      examTypeName: item.examTypeName,
      examMarks: item.examMarks,
    });
  };

  const updateExamTypeData = async (e, id) => {
      e.preventDefault();
      try {
        setPostApiLoading(true);
        const response = await axios.put(
          `${routineUrlApi.getExamType.url}/${id}/${schoolId}`,
          editInput,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if(response){
        toast.success("Exam Type updated successfully!");
        const updatedData = examTypeData.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );
        setEditInput({ examTypeName: "", examMarks: "" });
        dispatch(setExamType(updatedData));}
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update class");
      } finally {
        setPostApiLoading(false);
      }
    };

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // for fetch the class data 
  const fetchExamTypeData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${routineUrlApi.getExamType.url}/${schoolId}`);

      // console.log("response : ", response)
      dispatch(setExamType(response.data.data))
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch the data");
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchExamTypeData()
  },[])
  // for add new Subject data 
  const addNewExamType = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(`${routineUrlApi.getExamType.url}/${schoolId}`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true,
      });

      // console.log("response : ", response);

      if (response) {
        setInput({
          examTypeName: "",
          examMarks: "",
        })
        toast.success("Exam Type added successfully!");
        fetchExamTypeData()
      }
    } catch (error) {
      toast.error(error.response?.data?.message);

    }
    finally {
      setPostApiLoading(false)
    }
  }

  const dialogHeader = "Exam Type";
  const formData = [
    { name: "examTypeName", label: "Exam Type Name", type: "text", placeholder: "Exam Type Name", required: true },
    { name: "examMarks", label: "Exam Marks", type: "text", placeholder: "Exam Marks", required: true },
  ]

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = examTypeData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };


  const headers = [ "S.No",
    "Exam Type Name",
    "Exam Marks",
    ];
  if (["edp", "admin","vais"].includes(role)) {
    headers.push("Action");
  }

  const isDarkMode = theme === "light";
  const bgColor = isDarkMode ? "bg-[#0f172a]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const borderColor = isDarkMode ? "border-[rgba(193,193,193,0.3)]" : "border-slate-200";

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
      <div
        className={`mt-4 font-poppins border rounded-lg shadow-md mx-4 sm:mx-8 md:mx-14 overflow-hidden transition-all duration-300 ${
          isDarkMode ? 'border-[rgba(193,193,193,0.2)] bg-[#1e293b]' : 'border-slate-200 bg-white'
        }`}
      >
        {/* Page Header Section */}
        <div
          className={`flex justify-between items-center p-4 sm:p-6 border-b ${
            isDarkMode ? 'border-[rgba(193,193,193,0.2)]' : 'border-slate-200'
          } bg-gradient-to-r ${
            isDarkMode ? 'from-[#1e293b] to-[#0f172a]' : 'from-white to-gray-50'
          }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <BookOpen className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <span className="text-xl sm:text-2xl font-bold font-poppins">
              Exam Type Management
            </span>
          </div>
          {
            ["edp", "admin", "vais"].includes(role) && (
              <div className="flex items-center">
                <AddNewComponents 
                  onChangeFunctin={changeEventHandler} 
                  onSubmitFunction={addNewExamType} 
                  dialogHeader={dialogHeader} 
                  formData={formData} 
                  inputValue={input} 
                  postApiLoading={postApiLoading} 
                />
              </div>
            )
          }
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Loading exam types...</span>
          </div>
        ) : examTypeData.length === 0 ? (
          <div className={`text-center py-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No Exam Types Found</h3>
            <p className="mt-2">Add your first exam type to get started.</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader
                  className={`${
                    isDarkMode ? 'bg-[#1e293b]/80' : 'bg-gray-50'
                  } sticky top-0 z-10`}
                >
                  <TableRow>
                    {headers?.map((header, index) => (
                      <TableHead
                        key={index}
                        className={`px-4 py-3 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        } font-semibold text-sm uppercase tracking-wider ${
                          header === "Action" ? "text-right" : "text-left"
                        } ${header === "S.No" ? "hidden sm:table-cell w-16" : ""}`}
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
                      className={`transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-[#1e293b]/70 border-[rgba(193,193,193,0.2)]' 
                          : 'hover:bg-blue-50/30 border-slate-200'
                      }`}
                    >
                      <TableCell
                        className={`px-4 py-3 hidden sm:table-cell ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        } font-medium`}
                      >
                        {item.examTypeName}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.examMarks}
                        </span>
                      </TableCell>
                      {
                        ["edp", "admin", "vais"].includes(role) && (
                          <TableCell className="px-4 py-3 text-right">
                            <div className="flex justify-end items-center gap-2">
                              {/* Edit button */}
                              <EditDataComponent 
                                formData={formData} 
                                postApiLoading={postApiLoading} 
                                onChangeFunctin={(e) => setEditInput({
                                  ...editInput,
                                  [e.target.name]: e.target.value,
                                })} 
                                inputValue={editInput} 
                                onSubmitFunction={(e) => updateExamTypeData(e, item.id)} 
                                onEditClick={() => handleEditClick(item)}
                              />
                              
                              {/* Delete button */}
                              <DeleteComponent
                                name={item.examTypeName}
                                deletePath={`${routineUrlApi.getExamType.url}/${item.id}/${schoolId}`}
                                onDelete={() => {
                                  const updatedData = examTypeData?.filter(
                                    (data) => data.id !== item.id
                                  );
                                  dispatch(setExamType(updatedData));
                                }}
                              />
                            </div>
                          </TableCell>
                        )
                      }
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Section */}
            <div className={`border-t ${isDarkMode ? 'border-[rgba(193,193,193,0.2)]' : 'border-slate-200'}`}>
              <PaginationComponent 
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalPages={totalPages}
                onRowsPerPageChange={handleRowsPerPageChange}
                onPageChange={setCurrentPage} 
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
} 

export default ExamTypePage