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
import { FaEdit, FaPlus, FaPray, FaBook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setReligions } from "@/utils/settings/settingsSlice";
import settingUrlApi from "@/common/setting";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ReligionsPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const religions = useSelector((state) => state.settings.religions) || [];
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user);
  const schoolId = useSelector((state)=>state.auth.schoolId);
  const [input, setInput] = useState({
    religionName: "",
  });

  const [editInput, setEditInput] = useState({
    religionName: "",
  });

  const dataLength = religions?.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (item) => {
    setEditInput({
      religionName: item.religionName,
    });
  };

  // for fetch the data
  const fetchReligionData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${settingUrlApi.getAllReligion.url}/${schoolId}`
      );

      if (response) {
        dispatch(setReligions(response?.data?.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReligionData();
  }, []);
  
  // for add new data
  const addNewReligion = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${settingUrlApi.getAllReligion.url}/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        setInput({
          religionName: "",
        });
        fetchReligionData();
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setPostApiLoading(false);
    }
  };

  const updateReligionData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${settingUrlApi.getAllReligion.url}/${id}/${schoolId}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.success("Religion updated successfully!");
        const updatedData = religions.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );
        setEditInput({ religionName: "" });
        dispatch(setReligions(updatedData));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update Religion");
    } finally {
      setPostApiLoading(false);
    }
  };

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = religions?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const headers = ["S.No", "Religion Name"];
  if (["edp", "admin","vais"].includes(role)) {
    headers.push("Action");
  }

  return (
    <div className={`${theme === "light" ? "dark" : "light"} min-h-screen bg-gradient-to-b ${theme === "light" ? "from-gray-900 to-gray-800" : "from-gray-50 to-white"}`}>
      <div className="container mx-auto py-8 px-4">
        <div className={`rounded-xl shadow-lg overflow-hidden ${theme === "light" ? "bg-gray-800" : "bg-white"}`}>
          {/* Header */}
          <div className={`flex justify-between items-center p-6 ${theme === "light" ? "bg-gray-700" : "bg-gradient-to-r from-indigo-600 to-purple-600"}`}>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <FaPray className="text-yellow-400" />
              <span>Religions Management</span>
            </h1>
            
            {["admin","edp","vais"].includes(role) && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-700 hover:from-indigo-600 hover:to-purple-800 text-white font-medium rounded-full px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
                    <FaPlus /> <span className="hidden md:inline">Add New Religion</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center">Add A New Religion</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={addNewReligion}>
                    <div className="grid gap-6 py-4">
                      {/* Religion name */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="religionName" className="flex items-center gap-2 text-sm font-medium">
                          <FaBook className="text-indigo-500" />
                          Religion Name
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          id="religionName"
                          name="religionName"
                          value={input.religionName}
                          onChange={changeEventHandler}
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter Religion Name"
                          required
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      {postApiLoading ? (
                        <Button disabled className="w-full bg-gray-400 text-white rounded-full">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Processing...
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-full px-6 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Save Religion
                        </Button>
                      )}
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Content */}
          <div className={`p-6 ${theme === "light" ? "text-white" : "text-gray-800"}`}>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                <span className="ml-2 text-lg">Loading religions...</span>
              </div>
            ) : religions && religions.length > 0 ? (
              <div className="overflow-hidden rounded-xl shadow-md">
                <Table className="w-full">
                  <TableHeader
                    className={`${
                      theme === "light" ? "bg-gray-700" : "bg-gradient-to-r from-indigo-100 to-purple-100"
                    }`}
                  >
                    <TableRow>
                      {headers.map((header, index) => (
                        <TableHead
                          key={index}
                          className={`px-6 py-4 ${
                            theme === "light"
                              ? "text-white"
                              : "text-gray-700 font-bold"
                          } ${
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
                        className={`border-b transition-colors hover:bg-gray-50 ${
                          theme === "light" 
                            ? "border-gray-700 hover:bg-gray-700" 
                            : "border-gray-200"
                        }`}
                      >
                        <TableCell className="px-6 py-4 font-medium">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="px-6 py-4 flex items-center">
                          <FaPray className="mr-2 text-indigo-500" />
                          <span className="font-medium">{item.religionName}</span>
                        </TableCell>
                        {["admin", "edp", "vais"].includes(role) && (
                          <TableCell className="px-6 py-4">
                            <div className="flex justify-end items-center gap-3">
                              {/* Edit button */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-amber-500 hover:bg-amber-600 text-white rounded-md flex items-center gap-1 px-3 py-1 transition-all duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditClick(item);
                                    }}
                                  >
                                    <FaEdit className="h-4 w-4" />
                                    <span className="hidden sm:inline">Edit</span>
                                  </Button>
                                </DialogTrigger>
                                
                                <DialogContent className="sm:max-w-[425px] rounded-xl">
                                  <DialogHeader>
                                    <DialogTitle className="text-xl font-bold text-center">Edit Religion</DialogTitle>
                                  </DialogHeader>
                                  <form onSubmit={(e) => updateReligionData(e, item.id)}>
                                    <div className="grid gap-6 py-4">
                                      {/* Religion name */}
                                      <div className="flex flex-col gap-2">
                                        <Label htmlFor="religionName" className="flex items-center gap-2 text-sm font-medium">
                                          <FaBook className="text-indigo-500" />
                                          Religion Name
                                          <sup className="text-red-600">*</sup>
                                        </Label>
                                        <Input
                                          id="religionName"
                                          name="religionName"
                                          value={editInput.religionName}
                                          onChange={(e) =>
                                            setEditInput({
                                              ...editInput,
                                              religionName: e.target.value,
                                            })
                                          }
                                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                          placeholder="Enter Religion Name"
                                          required
                                        />
                                      </div>
                                    </div>

                                    <DialogFooter>
                                      {postApiLoading ? (
                                        <Button disabled className="w-full bg-gray-400 text-white rounded-full">
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Processing...
                                        </Button>
                                      ) : (
                                        <Button
                                          type="submit"
                                          className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-medium rounded-full px-6 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                          Update Religion
                                        </Button>
                                      )}
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>

                              {/* Delete button */}
                              <DeleteComponent
                                name={item.religionName}
                                deletePath={`${settingUrlApi.getAllReligion.url}/${item.id}/${schoolId}`}
                                onDelete={() => {
                                  const updatedData = religions.filter(
                                    (data) => data.id !== item.id
                                  );
                                  dispatch(setReligions(updatedData));
                                }}
                                buttonClassName="bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center gap-1 px-3 py-1 transition-all duration-200"
                              />
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                               {/* Pagination */}
                               <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    dataLength={dataLength}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className={`p-6 rounded-full ${theme === "light" ? "bg-gray-700" : "bg-gray-100"} mb-4`}>
                  <FaPray className={`text-5xl ${theme === "light" ? "text-indigo-400" : "text-indigo-600"}`} />
                </div>
                <p className="text-center text-lg font-medium mb-2">No Religions Available</p>
                <p className={`text-center ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>
                  {["admin", "edp", "vais"].includes(role)
                    ? "Please add religions using the button above."
                    : "No religions have been added to the system yet."}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReligionsPage;