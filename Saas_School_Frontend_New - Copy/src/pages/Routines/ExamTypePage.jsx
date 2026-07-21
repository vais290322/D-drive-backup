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
      toast.error(error.response.data.message || "Failed to fetch the data");
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
      toast.error(error.response.data.message);

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


  return (
    <div className={` ${theme === "light" ? 'dark' : 'light'} h-[100vh]`}>
      <div
        className={`mt-4 font-poppins border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${theme === "light" ? 'border-[rgba(193,193,193,0.3)]' : ' border-slate-200 bg-white'
          }`}
      >
        {/* Page Header Section */}
        <div
          className={`flex justify-between items-center p-3 sm:p-4 border-b-[1px] ${theme === "light" ? 'border-[rgba(193,193,193,0.3)]' : 'border-slate-200'
            }`}>
          <div>
            <span className="text-[1rem] sm:text-[1.5rem] font-bold font-poppins">
              Exam Type 
            </span>
          </div>
            {
              ["edp", "admin", "vais",].includes(role) && (<div className="flex items-center text-[1.25rem]">
                <AddNewComponents onChangeFunctin={changeEventHandler} onSubmitFunction={addNewExamType} dialogHeader={dialogHeader} formData={formData} inputValue={input} postApiLoading={postApiLoading} />
              </div>)
            }
          
        </div>

        {/* Table */}
        <Table className="table-auto w-full border-collapse border border-slate-200">
          <TableHeader
            className={`bg-gray-100 text-left ${
              theme === "light" ? "bg-[#212121]" : "light"
            }`}
          >
            <TableRow>
              {headers?.map((header, index) => (
                <TableHead
                  key={index}
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)] text-white "
                      : "border-slate-200 text-black"
                  } font-semibold  ${
                    header === "Action" ? "text-right" : "text-left"
                  } ${header==="S.No" ? " hidden sm:table-cell " : ""} `}
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
                  {item.examTypeName}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.examMarks}
                </TableCell>
{
  ["edp", "admin", "vais",].includes(role) && (<TableCell
    className={`px-4 py-2 border text-left ${
      theme === "light"
        ? "border-[rgba(193,193,193,0.3)]"
        : "border-slate-200"
    } `}
  >
    <div className="flex justify-end items-center gap-2">
      {/* for edit data */}
      <EditDataComponent formData={formData} postApiLoading={postApiLoading} onChangeFunctin={(e)=> setEditInput({
        ...editInput,
        [e.target.name]: e.target.value,
      })} inputValue={editInput} onSubmitFunction={(e) => updateExamTypeData(e, item.id)} onEditClick={() => handleEditClick(item)}/>
      {/* here we update the edit function later  */}

      {/* for conformation delete the data start here */}
      <DeleteComponent
        name={item.examTypeName} // Name of the class
        deletePath={`${routineUrlApi.getExamType.url}/${item.id}/${schoolId}`} // API endpoint for deletion
        onDelete={() => {
          const updatedData = examTypeData?.filter(
            (data) => data.id !== item.id
          );
          dispatch(setExamType(updatedData)); // Update the Redux state after deletion
        }}
      />
      {/* till now delete section  */}
    </div>
  </TableCell>)
}
                

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

export default ExamTypePage