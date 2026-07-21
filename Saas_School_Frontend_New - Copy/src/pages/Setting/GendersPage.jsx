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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import { FaEdit, FaPlus, FaVenus, FaMars } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setGenders } from "@/utils/settings/settingsSlice";
import { Loader2 } from "lucide-react";
import settingUrlApi from "@/common/setting";

const GendersPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const genders = useSelector((state) => state.settings.genders) || [];
  const role = useSelector((state) => state.auth.user);
  const schoolId = useSelector((state)=>state.auth.schoolId);
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    genderName: "",
  });

  const [editInput, setEditInput] = useState({
    genderName: "",
  });

  const dataLength = genders.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (item) => {
    setEditInput({
      genderName: item.genderName,
    });
  };

  // for fetch the data
  const fetchGenderData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${settingUrlApi.getAllGender.url}/${schoolId}`);

      if (response) {
        dispatch(setGenders(response?.data?.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenderData();
  }, []);
  
  // for add new data
  const addNewGender = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${settingUrlApi.getAllGender.url}/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        setInput({
          genderName: "",
        });
        toast.success("Gender added successfully!");
        fetchGenderData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setPostApiLoading(false);
    }
  };

  const updateGenderData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${settingUrlApi.getAllGender.url}/${id}/${schoolId}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.success("Gender updated successfully!");
        const updatedData = genders.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );
        setEditInput({ genderName: "" });
        dispatch(setGenders(updatedData));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update gender");
    } finally {
      setPostApiLoading(false);
    }
  };

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = genders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const headers = ["S.No", "Gender Name"];
  if (["edp", "admin","vais"].includes(role)) {
    headers.push("Action");
  }

  return (
    <div className={`${theme === "light" ? "dark" : "light"} min-h-screen bg-gradient-to-b ${theme === "light" ? "from-gray-900 to-gray-800" : "from-gray-50 to-white"}`}>
      <div className="container mx-auto py-8 px-4">
        <div className={`rounded-xl shadow-lg overflow-hidden ${theme === "light" ? "bg-gray-800" : "bg-white"}`}>
          {/* Header */}
          <div className={`flex justify-between items-center p-6 ${theme === "light" ? "bg-gray-700" : "bg-gradient-to-r from-pink-600 to-blue-600"}`}>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <div className="flex">
                <FaVenus className="text-pink-400" />
                <FaMars className="text-blue-400 -ml-1" />
              </div>
              <span>Genders Management</span>
            </h1>
            
            {["admin","edp","vais"].includes(role) && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-medium rounded-full px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
                    <FaPlus /> <span className="hidden md:inline">Add New Gender</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center">Add A New Gender</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={addNewGender}>
                    <div className="grid gap-6 py-4">
                      {/* Gender name */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="genderName" className="flex items-center gap-2 text-sm font-medium">
                          <div className="flex">
                            <FaVenus className="text-pink-500" />
                            <FaMars className="text-blue-500 -ml-1" />
                          </div>
                          Gender Name
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          id="genderName"
                          name="genderName"
                          value={input.genderName}
                          onChange={changeEventHandler}
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                          placeholder="Enter Gender Name"
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
                          className="w-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white font-medium rounded-full px-6 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Save Gender
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
                <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
                <span className="ml-2 text-lg">Loading genders...</span>
              </div>
            ) : genders && genders.length > 0 ? (
              <div className="overflow-hidden rounded-xl shadow-md">
                <Table className="w-full">
                  <TableHeader
                    className={`${
                      theme === "light" ? "bg-gray-700" : "bg-gradient-to-r from-pink-100 to-blue-100"
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
                    {paginatedData.map((item, index) => (
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
                          {item.genderName.toLowerCase().includes('female') || item.genderName.toLowerCase().includes('f') ? (
                            <FaVenus className="mr-2 text-pink-500" />
                          ) : item.genderName.toLowerCase().includes('male') || item.genderName.toLowerCase().includes('m') ? (
                            <FaMars className="mr-2 text-blue-500" />
                          ) : (
                            <div className="flex mr-2">
                              <FaVenus className="text-pink-500" />
                              <FaMars className="text-blue-500 -ml-1" />
                            </div>
                          )}
                          <span className="font-medium">{item.genderName}</span>
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
                                    <DialogTitle className="text-xl font-bold text-center">Edit Gender</DialogTitle>
                                  </DialogHeader>
                                  <form onSubmit={(e) => updateGenderData(e, item.id)}>
                                    <div className="grid gap-6 py-4">
                                      {/* Gender name */}
                                      <div className="flex flex-col gap-2">
                                        <Label htmlFor="genderName" className="flex items-center gap-2 text-sm font-medium">
                                          <div className="flex">
                                            <FaVenus className="text-pink-500" />
                                            <FaMars className="text-blue-500 -ml-1" />
                                          </div>
                                          Gender Name
                                          <sup className="text-red-600">*</sup>
                                        </Label>
                                        <Input
                                          id="genderName"
                                          name="genderName"
                                          value={editInput.genderName}
                                          onChange={(e) =>
                                            setEditInput({
                                              ...editInput,
                                              genderName: e.target.value,
                                            })
                                          }
                                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                          placeholder="Enter Gender Name"
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
                                          Update Gender
                                        </Button>
                                      )}
                                    </DialogFooter>
                                  </form>
                                  </DialogContent>
                              </Dialog>

                              {/* Delete button */}
                              <DeleteComponent
                                id={item.id}
                                url={`${settingUrlApi.getAllGender.url}/${item.id}/${schoolId}`}
                                onSuccess={() => {
                                  toast.success("Gender deleted successfully!");
                                  fetchGenderData();
                                }}
                                buttonText="Delete"
                                buttonIcon={<span className="hidden sm:inline">Delete</span>}
                                confirmationText="Are you sure you want to delete this gender?"
                                confirmationDescription="This action cannot be undone. This will permanently delete the gender from the system."
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
                  <div className="flex">
                    <FaVenus className={`text-5xl ${theme === "light" ? "text-pink-400" : "text-pink-600"}`} />
                    <FaMars className={`text-5xl -ml-2 ${theme === "light" ? "text-blue-400" : "text-blue-600"}`} />
                  </div>
                </div>
                <p className="text-center text-lg font-medium mb-2">No Genders Available</p>
                <p className={`text-center ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>
                  {["admin", "edp", "vais"].includes(role)
                    ? "Please add genders using the button above."
                    : "No genders have been added to the system yet."}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GendersPage;