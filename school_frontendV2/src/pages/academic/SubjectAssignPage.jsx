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
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaEdit, FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { setSubjectAssign } from "@/utils/academic/subjectAssignSlice";
import { Loader2 } from "lucide-react";
import { academicUrlApi } from "@/common";
const SubjectAssignPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [input, setInput] = useState({
    classId: "",
    subjectId: "",
  });
  const [editInput, setEditInput] = useState({
    classId: "",
    subjectId: "",
    roomNo: "",
  });

  const allClass = useSelector((state) => state.class.classNames);
  const allSubject = useSelector((state) => state.subject.subjectNames);
  const subjectAssign = useSelector(
    (state) => state.subjectAssign.subjectAssign
  );
  const dispatch = useDispatch();
  const dataLength = subjectAssign.length;

  // for fetch the class data
  const fetchSubjectAssignData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${academicUrlApi.SubjectAssign.url}`
      );
      // console.log("response : ", response);
      dispatch(setSubjectAssign(response.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchSubjectAssignData();
  }, []);

  // for add new Subject Assign data
  const addNewSubjectAssign = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${academicUrlApi.SubjectAssign.url}`,
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
          className: "",
          class_Code: "",
        });
        toast.success(response.data);
        fetchSubjectAssignData();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setPostApiLoading(false);
    }
  };

  const updateSubjectAssignData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${academicUrlApi.SubjectAssign.url}/${id}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if(response){
      toast.success("Subject Assign updated successfully!");
      const updatedData = subjectAssign.map((item) =>
        item.id === id ? { ...item, ...editInput } : item
      );
      setEditInput({ classId: "", subjectId: "" });
      dispatch(setSubjectAssign(updatedData));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update subject assign"
      );
    } finally {
      setPostApiLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditInput({
      classId: item.classId,
      subjectId: item.subjectId,
    });
  };
  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = subjectAssign.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div
      className={` ${
        theme === "light" ? "dark" : "light"
      } h-[100vh] font-poppins  `}
    >
      <div
        className={`mt-4 border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${
          theme === "light"
            ? "border-[rgba(193,193,193,0.3)]"
            : "border-slate-200 bg-white"
        }   `}
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
            <span className="text-[1rem] sm:text-[1.5rem] font-bold">
              Subject assign
            </span>
          </div>

          <div className="flex items-center text-[1.25rem]">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-[#452B90] hover:bg-[#c29732] text-white ">
                  <span>
                    <FaPlus className="hidden sm:block" />
                  </span>
                  <span>Add New Subject Assign</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Subject Assign</DialogTitle>
                </DialogHeader>
                <form onSubmit={addNewSubjectAssign}>
                  <div className="grid gap-6 py-4">
                    {/* Class Selection */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="className">Select a Class</Label>
                      <Select
                        onValueChange={(value) =>
                          setInput({ ...input, classId: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Class</SelectLabel>
                            {allClass.map((className, index) => (
                              <SelectItem key={index + 1} value={className}>
                                {capitalizeFirstLetter(className)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* subject Selection */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="sectionName">Select a Subject</Label>
                      <Select
                        onValueChange={(value) =>
                          setInput({ ...input, subjectId: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Subject</SelectLabel>
                            {allSubject.map((subject, index) => (
                              <SelectItem key={index + 1} value={subject}>
                                {capitalizeFirstLetter(subject)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    {postApiLoading ? (
                      <Button className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full bg-[#452B90] hover:bg-[#c29732] "
                      >
                        Save
                      </Button>
                    )}
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table */}
        <Table className="table-auto w-full border-collapse border border-slate-200  ">
          <TableHeader
            className={`bg-gray-100 text-left ${
              theme === "light" ? "bg-[#212121]" : "light"
            }`}
          >
            <TableRow>
              {[
                "S.No",
                "Class Name",
                "Subject Name",
                "Subject Code",
                "Action",
              ].map((n, index) => (
                <TableHead
                  key={index}
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)] text-white "
                      : "border-slate-200 text-black"
                  } font-semibold  ${
                    n === "Action" ? "text-right" : "text-left"
                  }  ${n === "Subject Code" ? "hidden sm:table-cell" : ""} ${
                    n === "S.No" ? "hidden sm:table-cell" : ""
                  }
                `}
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
                className={`hover:bg-gray-50 border ${
                  theme === "light"
                    ? "border-[rgba(193,193,193,0.3)]"
                    : "border-slate-200"
                }`}
              >
                <TableCell
                  className={`px-4 py-2 border text-left hidden sm:table-cell ${
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
                  {item.classId}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.subjectId}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left hidden sm:table-cell ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.subjectCode}
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <FaEdit
                          className="sm:w-8 sm:h-8 w-6 h-6 bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer rounded-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(item);
                          }}
                        />
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit this data</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => updateSubjectAssignData(e, item.id)}
                        >
                          <div className="grid gap-6 py-4">
                            {/* Class Selection */}
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="className">Select a Class</Label>
                              <Select
                                defaultValue={item.classId}
                                onValueChange={(value) =>
                                  setEditInput({ ...editInput, classId: value })
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder={item.classId} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Class</SelectLabel>
                                    {allClass.map((item, index) => (
                                      <SelectItem key={index} value={item}>
                                        {capitalizeFirstLetter(item)}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Subject Selection */}
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="sectionName">
                                Select a Subject
                              </Label>
                              <Select
                                defaultValue={item.subjectId}
                                onValueChange={(value) =>
                                  setEditInput({
                                    ...editInput,
                                    subjectId: value,
                                  })
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder={item.subjectId} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Subject</SelectLabel>
                                    {allSubject.map((item, index) => (
                                      <SelectItem key={index} value={item}>
                                        {capitalizeFirstLetter(item)}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <DialogFooter>
                            {postApiLoading ? (
                              <Button
                                className="w-full bg-[#452B90] hover:bg-[#c29732] "
                                type="submit"
                              >
                                <Loader2 className="animate-spin"></Loader2>
                                Loading...
                              </Button>
                            ) : (
                              <Button
                                type="submit"
                                className="w-full bg-[#452B90] hover:bg-[#c29732] "
                              >
                                Save changes
                              </Button>
                            )}
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    {/* for conformation delete the data start here */}
                    <DeleteComponent
                      name={item.classId} // Name of the class
                      deletePath={`${academicUrlApi.SubjectAssign.url}/${item.id}`} // API endpoint for deletion
                      onDelete={() => {
                        const updatedData = subjectAssign.filter(
                          (data) => data.id !== item.id
                        );
                        dispatch(setSubjectAssign(updatedData)); // Update the Redux state after deletion
                      }}
                    />
                    {/* till now delete section  */}
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
    </div>
  );
};

export default SubjectAssignPage;
