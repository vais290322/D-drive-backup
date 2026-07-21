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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import { FaEdit, FaPlus, FaTint } from "react-icons/fa";
import { FaDroplet } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setBloodGroups } from "@/utils/settings/settingsSlice";
import { Loader2 } from "lucide-react";
import settingUrlApi from "@/common/setting";

const BloodGroupPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const bloodGroups = useSelector((state) => state.settings.bloodGroups) || [];
  const role = useSelector((state) => state.auth.user);
  const schoolId = useSelector((state) => state.auth.schoolId);
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    bloodGroupName: "",
    bloodGroupType: "",
  });

  const [editInput, setEditInput] = useState({
    bloodGroupName: "",
    bloodGroupType: "",
  });

  const dataLength = bloodGroups.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (item) => {
    setEditInput({
      bloodGroupName: item.bloodGroupName,
      bloodGroupType: item.bloodGroupType,
    });
  };

  // for fetch the class data
  const fetchBloodGroupData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${settingUrlApi.getAllBloodGroup.url}/${schoolId}`
      );

      if (response) {
        dispatch(setBloodGroups(response?.data?.data));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodGroupData();
  }, []);

  // for add new Subject data
  const addNewBloodGroup = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${settingUrlApi.getAllBloodGroup.url}/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setInput({
          bloodGroupName: "",
          bloodGroupType: "",
        });
        toast.success(response?.data?.message);
        fetchBloodGroupData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setPostApiLoading(false);
    }
  };

  const updateBloodGroupData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${settingUrlApi.getAllBloodGroup.url}/${id}/${schoolId}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.success("Blood Group updated successfully!");
        const updatedData = bloodGroups.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );
        setEditInput({ bloodGroupName: "", bloodGroupType: "" });
        dispatch(setBloodGroups(updatedData));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update blood group"
      );
    } finally {
      setPostApiLoading(false);
    }
  };

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = bloodGroups.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const headers = ["S.No", "Blood Group Name", "Blood Group Type"];
  if (["edp", "admin", "vais"].includes(role)) {
    headers.push("Action");
  }

  // Get blood group icon color based on type
  const getBloodGroupColor = (type) => {
    return type === "Positive" ? "text-red-600" : "text-red-400";
  };

  return (
    <div
      className={`${
        theme === "light" ? "dark" : "light"
      } min-h-screen bg-gradient-to-b ${
        theme === "light"
          ? "from-gray-900 to-gray-800"
          : "from-gray-50 to-white"
      }`}
    >
      <div className="container mx-auto py-8 px-4">
        <div
          className={`rounded-xl shadow-lg overflow-hidden ${
            theme === "light" ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Header */}
          <div
            className={`flex justify-between items-center p-6 ${
              theme === "light"
                ? "bg-gray-700"
                : "bg-gradient-to-r from-red-600 to-purple-600"
            }`}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <FaTint className="text-red-400" />
              <span>Blood Groups Management</span>
            </h1>

            {["admin", "edp", "vais"].includes(role) && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-medium rounded-full px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
                    <FaPlus />{" "}
                    <span className="hidden md:inline">
                      Add New Blood Group
                    </span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center">
                      Add A New Blood Group
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={addNewBloodGroup}>
                    <div className="grid gap-6 py-4">
                      {/* blood group name */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="bloodGroupName"
                          className="flex items-center gap-2 text-sm font-medium"
                        >
                          <FaDroplet className="text-red-500" />
                          Blood Group Name
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          id="bloodGroupName"
                          name="bloodGroupName"
                          value={input.bloodGroupName}
                          onChange={changeEventHandler}
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="Enter Blood Group Name (e.g., A, B, AB, O)"
                          required
                        />
                      </div>
                      {/* blood group type  */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="bloodGroupType"
                          className="flex items-center gap-2 text-sm font-medium"
                        >
                          <FaTint className="text-red-500" />
                          Select Blood Group Type
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Select
                          value={input.bloodGroupType}
                          onValueChange={(value) =>
                            setInput({ ...input, bloodGroupType: value })
                          }
                          required
                        >
                          <SelectTrigger className="w-full border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
                            <SelectValue placeholder="Select a blood group type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Blood Group Type</SelectLabel>
                              <SelectItem value="Positive">
                                Positive (+)
                              </SelectItem>
                              <SelectItem value="Negative">
                                Negative (-)
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter>
                      {postApiLoading ? (
                        <Button
                          disabled
                          className="w-full bg-gray-400 text-white rounded-full"
                        >
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-medium rounded-full px-6 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Save Blood Group
                        </Button>
                      )}
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Content */}
          <div
            className={`p-6 ${
              theme === "light" ? "text-white" : "text-gray-800"
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-red-500" />
                <span className="ml-2 text-lg">Loading blood groups...</span>
              </div>
            ) : bloodGroups.length > 0 ? (
              <div className="overflow-hidden rounded-xl shadow-md">
                <Table className="w-full">
                  <TableHeader
                    className={`${
                      theme === "light"
                        ? "bg-gray-700"
                        : "bg-gradient-to-r from-red-100 to-purple-100"
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
                          <FaDroplet
                            className={`mr-2 ${getBloodGroupColor(
                              item.bloodGroupType
                            )}`}
                          />
                          <span className="font-medium">
                            {item.bloodGroupName}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.bloodGroupType === "Positive"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {item.bloodGroupType}
                          </span>
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
                                    <span className="hidden sm:inline">
                                      Edit
                                    </span>
                                  </Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-[425px] rounded-xl">
                                  <DialogHeader>
                                    <DialogTitle className="text-xl font-bold text-center">
                                      Edit Blood Group
                                    </DialogTitle>
                                  </DialogHeader>
                                  <form
                                    onSubmit={(e) =>
                                      updateBloodGroupData(e, item.id)
                                    }
                                  >
                                    <div className="grid gap-6 py-4">
                                      {/* blood group name */}
                                      <div className="flex flex-col gap-2">
                                        <Label
                                          htmlFor="bloodGroupName"
                                          className="flex items-center gap-2 text-sm font-medium"
                                        >
                                          <FaDroplet className="text-red-500" />
                                          Blood Group Name
                                          <sup className="text-red-600">*</sup>
                                        </Label>
                                        <Input
                                          id="bloodGroupName"
                                          name="bloodGroupName"
                                          value={editInput.bloodGroupName}
                                          onChange={(e) =>
                                            setEditInput({
                                              ...editInput,
                                              bloodGroupName: e.target.value,
                                            })
                                          }
                                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                          placeholder="Enter Blood Group Name"
                                          required
                                        />
                                      </div>
                                      {/* blood group type */}
                                      <div className="flex flex-col gap-2">
                                        <Label
                                          htmlFor="bloodGroupType"
                                          className="flex items-center gap-2 text-sm font-medium"
                                        >
                                          <FaTint className="text-red-500" />
                                          Select Blood Group Type
                                          <sup className="text-red-600">*</sup>
                                        </Label>
                                        <Select
                                          value={editInput.bloodGroupType}
                                          onValueChange={(value) =>
                                            setEditInput({
                                              ...editInput,
                                              bloodGroupType: value,
                                            })
                                          }
                                          required
                                        >
                                          <SelectTrigger className="w-full border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
                                            <SelectValue placeholder="Select a blood group type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectLabel>
                                                Blood Group Type
                                              </SelectLabel>
                                              <SelectItem value="Positive">
                                                Positive (+)
                                              </SelectItem>
                                              <SelectItem value="Negative">
                                                Negative (-)
                                              </SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <DialogFooter>
                                      {postApiLoading ? (
                                        <Button
                                          disabled
                                          className="w-full bg-gray-400 text-white rounded-full"
                                        >
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Processing...
                                        </Button>
                                      ) : (
                                        <Button
                                          type="submit"
                                          className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-medium rounded-full px-6 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                          Update Blood Group
                                        </Button>
                                      )}
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>

                              {/* Delete button */}
                              <DeleteComponent
                                id={item.id}
                                url={`${settingUrlApi.getAllBloodGroup.url}/${item.id}/${schoolId}`}
                                onSuccess={() => {
                                  toast.success(
                                    "Blood group deleted successfully!"
                                  );
                                  fetchBloodGroupData();
                                }}
                                buttonText="Delete"
                                buttonIcon={
                                  <span className="hidden sm:inline">
                                    Delete
                                  </span>
                                }
                                confirmationText="Are you sure you want to delete this blood group?"
                                confirmationDescription="This action cannot be undone. This will permanently delete the blood group from the system."
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
                <div
                  className={`p-6 rounded-full ${
                    theme === "light" ? "bg-gray-700" : "bg-gray-100"
                  } mb-4`}
                >
                  <FaTint
                    className={`text-5xl ${
                      theme === "light" ? "text-red-400" : "text-red-600"
                    }`}
                  />
                </div>
                <p className="text-center text-lg font-medium mb-2">
                  No Blood Groups Available
                </p>
                <p
                  className={`text-center ${
                    theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {["admin", "edp", "vais"].includes(role)
                    ? "Please add blood groups using the button above."
                    : "No blood groups have been added to the system yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodGroupPage;
