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
import { setSubject } from "@/utils/academic/subjectSlice";
import { academicUrlApi } from "@/common";
const SubjectPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false); 
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [input, setInput] = useState({
    subjectName: "",
    subject_index: "",
  });
  const [editInput, setEditInput] = useState({
    subjectName: "",
    subject_index: "",
    });
    // console.log("editInput : ", editInput);
  const dispatch = useDispatch();
  const subjectData = useSelector((state) => state.subject.subject) || [];
  const dataLength = subjectData?.length || 0;
// console.log("subjectData : ", subjectData);
  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (item) => {
    setEditInput({
      subjectName: item.subjectName,
      subject_index: item.subject_index,
    });
    // setEditId(item.id);
  };

  // for fetch the class data
  const fetchSubjectData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${academicUrlApi.getAllSubject.url}`);
      if (response) {
      dispatch(setSubject(response.data));
      }
    } catch (error) {
      toast.error(error.response.data.message || "Error fetching data");
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectData();
  }, []);

  // for add new Subject data
  const addNewSubject = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(`${academicUrlApi.getAllSubject.url}`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true,
      });
      if (response) {
        setInput({
          subjectName: "",
          subject_index: "",
        });
        toast.success(response.data);
        fetchSubjectData();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setPostApiLoading(false);
    }
  };

  // const updateSubjectData = async (e, id) => {
  //     e.preventDefault();
  //     try {
  //       setPostApiLoading(true);
  //       const response = await axios.put(
  //         `http://192.168.0.141:8081/api/v1/Academic/subjects/${id}`,
  //         editInput,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       toast.success("Subject updated successfully!");
  //       const updatedData = subjectData.map((item) =>
  //         item.id === id ? { ...item, ...editInput } : item
  //       );
  //       setEditInput({ subjectName: "", subject_index: "" });
  //       dispatch(setSubject(updatedData));
  //     } catch (error) {
  //       toast.error(error.response?.data?.message || "Failed to update subject");
  //     } finally {
  //       setPostApiLoading(false);
  //     }
  //   };
  
  const updateSubjectData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
  
      // Ensure no empty fields are sent in the request
      if (!editInput.subjectName || !editInput.subject_index) {
        toast.error("Both Subject Name and Subject Code are required!");
        return;
      }
  
      const response = await axios.put(
        `${academicUrlApi.getAllSubject.url}/${id}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if(response){
        
      
      // Update the specific subject in the Redux store
      const updatedData = subjectData.map((item) =>
        item.id === id
          ? { ...item, subjectName: editInput.subjectName, subject_index: editInput.subject_index }
          : item
      );
      // console.log("updatedtata", updatedData);
      dispatch(setSubject(updatedData)); // Update Redux store
      toast.success("Subject updated successfully!");
      setEditInput({ subjectName: "", subject_index: "" }); 
      }// Clear input fields
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update subject");
    } finally {
      setPostApiLoading(false);
    }
  };
  

  const dialogHeader = "Subject";
  const formData = [
    {
      name: "subjectName",
      label: "Subject Name",
      type: "text",
      placeholder: "Subject Name",
      required: true,
    },
    {
      name: "subject_index",
      label: "Subject Code",
      type: "text",
      placeholder: "Subject Code",
      required: true,
    },
  ];

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = subjectData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  return (
    <div
      className={` ${
        theme === "light" ? "dark" : "light"
      } h-[100vh] font-poppins  `}
    >
      <div
        className={`mt-4 border-[1px] shadow-sm rounded-[0.675rem] mx-1 sm:mx-14 ${
          theme === "light"
            ? "border-[rgba(193,193,193,0.3)]"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* Page Header Section */}
        <div
          className={`flex flex-col sm:flex-row gap-4  sm:justify-between items-center p-3 sm:p-4 border-b-[1px] ${
            theme === "light"
              ? "border-[rgba(193,193,193,0.3)]"
              : "border-slate-200"
          }`}
        >
          <div>
            <span className="text-[1rem] sm:text-[1.5rem] font-bold">
              Subjects
            </span>
          </div>

          <div className="flex items-center text-[1.25rem]">
            <AddNewComponents
              onChangeFunctin={changeEventHandler}
              onSubmitFunction={addNewSubject}
              dialogHeader={dialogHeader}
              formData={formData}
              inputValue={input}
              postApiLoading={postApiLoading}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto  ">
          <Table className="table-auto w-full border-collapse border border-slate-200 ">
            <TableHeader
              className={`bg-gray-100 text-left ${
                theme === "light" ? "bg-[#212121]" : "light"
              }`}
            >
              <TableRow>
                {["S.No", "Subject Name", "Subject Code", "Action"].map(
                  (n, index) => (
                    <TableHead
                      key={index}
                      className={`px-4 py-2 border ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)] text-white "
                          : "border-slate-200 text-black"
                      } font-semibold  ${
                        n === "Action" ? "text-right" : "text-left"
                      }
                 ${n === "Subject Code" ? "hidden sm:table-cell" : ""} `}
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
                    {item.subjectName}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left hidden sm:table-cell ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.subject_index}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    <div className="flex justify-end items-center gap-2 ">
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
                      onSubmitFunction={(e) => updateSubjectData(e, item.id)}
                      onEditClick={() => handleEditClick(item)}
                    />

                      {/* for conformation delete the data start here */}
                      <DeleteComponent
                      name={item.subjectName} // Name of the subject
                      deletePath={`${academicUrlApi.getAllSubject.url}/${item.id}`} // API endpoint for deletion
                      onDelete={() => {
                        const updatedData = subjectData.filter(
                          (data) => data.id !== item.id
                        );
                        dispatch(setSubject(updatedData)); // Update the Redux state after deletion
                      }}
                    />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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

export default SubjectPage;
