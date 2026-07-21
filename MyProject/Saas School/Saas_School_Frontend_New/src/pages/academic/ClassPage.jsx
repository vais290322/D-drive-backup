import { academicUrlApi } from "@/common";
import AddNewComponents from "@/components/Addnew/AddNewComponents";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import EditDataComponent from "@/components/EditData/EditDataComponent";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import { classPageSteps } from "@/components/Tour/Steps/AcademicSteps/Steps";
import TourButton from "@/components/Tour/TourButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/context/ThemeContext";
import { setClass } from "@/utils/academic/classSlice";
import axios from "axios";
import { GraduationCap, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const ClassPage = () => {
  const { theme } = useTheme();
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const classData = useSelector((state) => state.class.class) || [];
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const [input, setInput] = useState({
    className: "",
    class_Code: "",
  });
  const [editInput, setEditInput] = useState({
    className: "",
    class_Code: "",
  });
  const [editId, setEditId] = useState(null);

  // Filter data based on search term
  const filteredData = classData.filter(
    (item) =>
      item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.class_Code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dataLength = filteredData?.length;

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
      setLoading(true);
      const response = await axios.get(
        `${academicUrlApi.getAllClass.url}/all/${schoolId}`
      );
      dispatch(setClass(response.data));
    } catch (error) {
      console.error("Error fetching class data:", error);
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
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

      if (response.data.success) {
        setInput({ className: "", class_Code: "" });
        toast.success(response?.data?.message || "Class added successfully");
        fetchClassData();
      }
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
        // Ensure we're passing a string to toast.success
        if (typeof response?.data === "string") {
          toast.success(response.data);
        } else if (response?.data?.message) {
          toast.success(response.data.message);
        } else {
          toast.success("Class updated successfully!");
        }

        // Update the local state with the edited data
        const updatedData = classData.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );
        setEditInput({ className: "", class_Code: "" });
        setEditId(null);
        dispatch(setClass(updatedData));
      }
    } catch (error) {
      console.error("Error updating class:", error);
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
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "light"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="container mx-auto py-8 px-4">
        {/* Page Header with Gradient */}
        <div
          className={`mb-6 ${
            theme === "light" ? "text-white" : "text-gray-800"
          }`}
        >
          <h1 className="text-2xl md:text-3xl font-bold relative inline-block">
            Class Management
            <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-80">
            Create and manage classes for your school
          </p>
        </div>

        {/* Main Content Card */}
        <div
          className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
            theme === "light"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Card Header */}
          <div
            className={`flex flex-col md:flex-row justify-between items-center p-4 sm:p-6 border-b ${
              theme === "light" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="mb-4 md:mb-0">
              <h2
                className={`text-xl font-bold flex items-center ${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                Classes
              </h2>
              <p
                className={`classesAvailable mt-1 text-sm ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {classData.length} classes available
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Search Input */}
              <div
                className={`searchBox relative w-full md:w-64 ${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              >
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  className={`pl-10 pr-4 py-2 w-full rounded-md border ${
                    theme === "light" 
                      ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" 
                      : "bg-white border-gray-300 focus:border-purple-500"
                  } focus:outline-none`}
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Add New Button */}
              <AddNewComponents
                onChangeFunctin={changeEventHandler}
                onSubmitFunction={addNewClass}
                dialogHeader="Class"
                formData={formData}
                inputValue={input}
                postApiLoading={postApiLoading}
                buttonClassName={`${
                  theme === "light"
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                } text-white shadow-md hover:shadow-lg transition-all duration-300`}
              />

              {/* Tour Button */}
              <div>
                <TourButton
                  tourName={"classpage-tour"}
                  steps={classPageSteps}
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="flex flex-col items-center">
                <Loader2
                  className={`h-12 w-12 animate-spin ${
                    theme === "light" ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <p
                  className={`mt-4 ${
                    theme === "light" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Loading classes...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {classData.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <GraduationCap
                    className={`w-16 h-16 mb-4 ${
                      theme === "light" ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-lg font-medium ${
                      theme === "light" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    No classes found
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Add your first class to get started
                  </p>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader
                        className={`${
                          theme === "light" ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <TableRow>
                          {["S.No", "Class Name", "Class Code", "Action"].map(
                            (header, index) => (
                              <TableHead
                                key={index}
                                className={`px-4 py-3 ${
                                  theme === "light"
                                    ? "text-gray-200"
                                    : "text-gray-700"
                                } font-semibold text-sm ${
                                  header === "Action"
                                    ? "text-right"
                                    : "text-left"
                                }`}
                              >
                                {header}
                              </TableHead>
                            )
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData?.map((item, index) => (
                          <TableRow
                            key={item.id}
                            className={`transition-colors hover:bg-opacity-10 ${
                              theme === "light"
                                ? "hover:bg-gray-600 border-t border-gray-700"
                                : "hover:bg-gray-100 border-t border-gray-200"
                            }`}
                          >
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              }`}
                            >
                              {(currentPage - 1) * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 font-medium ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              {item.className}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {item.class_Code}
                              </span>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              {!item?.universal ? (
                                <div className="actions flex gap-2 justify-end">
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
                                      updateClassData(e, item.id)
                                    }
                                    onEditClick={() => handleEditClick(item)}
                                    buttonClassName={`${
                                      theme === "light"
                                        ? "bg-amber-600 hover:bg-amber-700"
                                        : "bg-amber-500 hover:bg-amber-600"
                                    } text-white transition-colors`}
                                  />
                                  <DeleteComponent
                                    name={item.className}
                                    deletePath={`${academicUrlApi.getAllClass.url}/${item.id}/${schoolId}`}
                                    onDelete={() => {
                                      const updatedData = classData.filter(
                                        (data) => data.id !== item.id
                                      );
                                      dispatch(setClass(updatedData));
                                    }}
                                    buttonClassName={`${
                                      theme === "light"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-red-500 hover:bg-red-600"
                                    } text-white transition-colors`}
                                  />
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500 italic flex justify-end">
                                  System Default
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* No Results State */}
                  {searchTerm && filteredData.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <Search
                        className={`w-12 h-12 mb-3 ${
                          theme === "light" ? "text-gray-400" : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`text-lg font-medium ${
                          theme === "light" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        No results found
                      </p>
                      <p
                        className={`text-sm mt-2 ${
                          theme === "light" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Try adjusting your search term
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {filteredData.length > 0 && (
                    <div
                      className={`pagination-component p-4 border-t ${
                        theme === "light"
                          ? "border-gray-700"
                          : "border-gray-200"
                      }`}
                    >
                      <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        dataLength={dataLength}
                        theme={theme}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
