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
import { FaEdit, FaPlus } from "react-icons/fa";
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

  // console.log("bloodGroups : ", bloodGroupNames);
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
    // setEditId(item.id);
  };

  // for fetch the class data
  const fetchBloodGroupData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${settingUrlApi.getAllBloodGroup.url}`
      );

      // console.log("response : ", response.data.data);
      if (response) {
        dispatch(setBloodGroups(response?.data?.data));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
        `${settingUrlApi.getAllBloodGroup.url}`,
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
          bloodGroupName: "",
          bloodGroupType: "",
        });
        // dispatch(setClass([...sectionData, response.data]));
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
        `${settingUrlApi.getAllBloodGroup.url}/${id}`,
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

  const headers = ["S.No", "Blood Group  Name", "Blood Group Type"];
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
              All Blood Groups
            </span>
          </div>
          {["admin","edp"].includes(role) && (
            <div className="flex items-center text-[1.25rem]">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#452B90] hover:bg-[#c29732] text-white ">
                    <span>
                      <FaPlus className="hidden sm:block" />
                    </span>
                    <span>Add New Blood Group</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add A New Blood Group</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={addNewBloodGroup}>
                    <div className="grid gap-6 py-4">
                      {/* blood group name */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="bloodGroupName">Blood Group Name</Label>
                        <Input
                          id="bloodGroupName"
                          name="bloodGroupName"
                          value={input.bloodGroupName}
                          onChange={changeEventHandler}
                          className="w-full"
                          placeholder="Enter Blood Group Name"
                        />
                      </div>
                      {/* blood group type  */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="bloodGroupType">
                          Select Blood Group Type
                        </Label>
                        <Select
                          value={input.bloodGroupType}
                          onValueChange={(value) =>
                            setInput({ ...input, bloodGroupType: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a blood group type " />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>blood group type</SelectLabel>
                              <SelectItem value="Positive">Positive</SelectItem>
                              <SelectItem value="Negative">Negative</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter>
                      {postApiLoading ? (
                        <Button disabled>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          loading...
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
              {headers.map(
                (n, index) => (
                  <TableHead
                    key={index}
                    className={`px-4 py-2 border ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)] text-white "
                        : "border-slate-200 text-black"
                    } font-semibold  ${
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
                className={`hover:bg-gray-50 border ${
                  theme === "light"
                    ? "border-[rgba(193,193,193,0.3)]"
                    : "border-slate-200"
                }`}
              >
                <TableCell
                  lassName={`px-4 py-2 border text-left ${
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
                  {item.bloodGroupName}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.bloodGroupType}
                </TableCell>
                {
                  ["admin", "edp","vais"].includes(role) && (<TableCell
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
                            className="sm:w-8 sm:h-8 w-6 h-6 bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer rounded-sm "
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
                            onSubmit={(e) => updateBloodGroupData(e, item.id)}
                          >
                            <div className="grid gap-6 py-4">
                              {/* blood group name */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="bloodGroupName">
                                  Blood Group Name
                                </Label>
                                <Input
                                  id="bloodGroupName"
                                  name="bloodGroupName"
                                  defaultValue={editInput.bloodGroupName}
                                  value={editInput.bloodGroupName}
                                  onChange={(e) =>
                                    setEditInput({
                                      ...editInput,
                                      bloodGroupName: e.target.value,
                                    })
                                  }
                                  className="w-full"
                                  placeholder="Enter Blood Group Name"
                                />
                              </div>
                              {/* blood group type  */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="bloodGroupType">
                                  Select Blood Group Type
                                </Label>
                                <Select
                                  value={editInput.bloodGroupType}
                                  onValueChange={(value) =>
                                    setEditInput({
                                      ...editInput,
                                      bloodGroupType: value,
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a blood group type " />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>blood group type</SelectLabel>
                                      <SelectItem value="Positive">
                                        Positive
                                      </SelectItem>
                                      <SelectItem value="Negative">
                                        Negative
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
  
                            <DialogFooter>
                              <Button
                                type="submit"
                                className="w-full bg-[#452B90] hover:bg-[#c29732] "
                              >
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
  
                      {/* for conformation delete the data start here */}
                      <DeleteComponent
                        name={item.bloodGroup} // Name of the item
                        deletePath={`${settingUrlApi.getAllBloodGroup.url}/${item.id}`} // API endpoint for deletion
                        onDelete={() => {
                          const updatedData = bloodGroups.filter(
                            (data) => data.id !== item.id
                          );
                          dispatch(setBloodGroups(updatedData)); // Update the Redux state after deletion
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

export default BloodGroupPage;
