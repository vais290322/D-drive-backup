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
import { Button } from "@/components/ui/button";
import { FaEdit, FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { setBookCategory } from "@/utils/library/bookCategorySlice";
import libraryUrlApi from "@/common/library";
import { BookOpen, Bookmark, Loader2, Search, Tag } from "lucide-react";
import TourButton from "@/components/Tour/TourButton";
import { addBookCategoryPageSteps } from "@/components/Tour/Steps/LibrarySteps/Steps";

const AddBookCategoryPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const bookCategoryData =
    useSelector((state) => state.bookCategory.bookCategory) || [];
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const [input, setInput] = useState({
    bookCategory: "",
    bookCategoryCode: "",
  });

  const [editInput, setEditInput] = useState({
    bookCategory: "",
    bookCategoryCode: "",
  });

  const handleEditClick = (item) => {
    setEditInput({
      bookCategory: item.bookCategory,
      bookCategoryCode: item.bookCategoryCode,
    });
  };

  const updateBookCategoryData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${libraryUrlApi.addBookCategory.url}/${id}/${schoolId}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        toast.success("Category updated successfully!");
        const updatedData = bookCategoryData.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );
        setEditInput({ bookCategory: "", bookCategoryCode: "" });
        dispatch(setBookCategory(updatedData));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
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

  // for fetch the libray data
  const fetchLibraryCategoryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${libraryUrlApi.addBookCategory.url}/${schoolId}`
      );
      if (response) {
        dispatch(setBookCategory(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryCategoryData();
  }, []);

  // for add new Subject data
  const addNewBookCategory = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${libraryUrlApi.addBookCategory.url}/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setInput({
          bookCategory: "",
          bookCategoryCode: "",
        });
        toast.success(response.data.message);
        fetchLibraryCategoryData();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setPostApiLoading(false);
    }
  };

  // Filter categories based on search term
  const filteredCategories = bookCategoryData.filter(
    (category) =>
      category.bookCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.bookCategoryCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dataLength = filteredCategories?.length;

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = filteredCategories?.slice(
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
            Book Categories
            <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-80">
            Manage categories for your library books
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
            <div className="categoriesAvailable mb-4 md:mb-0">
              <h2
                className={`text-xl font-bold flex items-center ${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              >
                <Tag className="mr-2 h-5 w-5" />
                Book Categories
              </h2>
              <p
                className={`mt-1 text-sm ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {bookCategoryData.length} categories in your library
              </p>
            </div>

            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
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
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Add New Category Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="addClass bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg">
                    <FaPlus className="mr-2" />
                    Add New Category
                  </Button>
                </DialogTrigger>

                <DialogContent 
                  className={`sm:max-w-[425px] ${
                    theme === "light" 
                      ? "bg-gray-800 border-gray-700 text-white" 
                      : "bg-white border-gray-200"
                  }`}
                >
                  <DialogHeader>
                    <DialogTitle 
                      className={`text-xl flex items-center pb-2 border-b ${
                        theme === "light" 
                          ? "text-white border-gray-700" 
                          : "text-gray-800 border-gray-200"
                      }`}
                    >
                      <Tag className={`mr-2 h-5 w-5 ${theme === "light" ? "text-purple-400" : "text-purple-600"}`} />
                      Add New Book Category
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={addNewBookCategory}>
                    <div className="grid gap-4 py-4">
                      {/* Category Name */}
                      <div className="flex flex-col gap-2">
                        <Label 
                          htmlFor="bookCategory"
                          className={theme === "light" ? "text-gray-200" : "text-gray-700"}
                        >
                          Category Name <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.bookCategory}
                          id="bookCategory"
                          name="bookCategory"
                          placeholder="Enter book category"
                          onChange={changeEventHandler}
                          className={`${
                            theme === "light"
                              ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-purple-500" 
                              : "bg-white border-gray-300 text-gray-900 focus-visible:ring-purple-500"
                          }`}
                        />
                      </div>

                      {/* Category Code */}
                      <div className="flex flex-col gap-2">
                        <Label 
                          htmlFor="bookCategoryCode"
                          className={theme === "light" ? "text-gray-200" : "text-gray-700"}
                        >
                          Category Code <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.bookCategoryCode}
                          id="bookCategoryCode"
                          name="bookCategoryCode"
                          placeholder="Enter category code"
                          onChange={changeEventHandler}
                          className={`${
                            theme === "light"
                              ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-purple-500" 
                              : "bg-white border-gray-300 text-gray-900 focus-visible:ring-purple-500"
                          }`}
                        />
                      </div>
                    </div>

                    <DialogFooter className={`${theme === "light" ? "border-t border-gray-700 pt-4" : "border-t border-gray-200 pt-4"}`}>
                      <Button
                        type="submit"
                        disabled={postApiLoading}
                        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 text-white"
                      >
                        {postApiLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>Save</>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Tour button */}
              <TourButton
                steps={addBookCategoryPageSteps}
                tourName={"addBookCategoryPage-tour"}
              />
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
                  Loading categories...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {bookCategoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Tag
                    className={`w-16 h-16 mb-4 ${
                      theme === "light" ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-lg font-medium ${
                      theme === "light" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    No categories defined
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Add your first category by clicking the "Add New Category"
                    button
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
                          {[
                            "S.No",
                            "Category Name",
                            "Category Code",
                            "Action",
                          ].map((header, index) => (
                            <TableHead
                              key={index}
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-gray-200"
                                  : "text-gray-700"
                              } font-semibold text-sm ${
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
                              <div className="flex items-center">
                                <Bookmark className="h-4 w-4 mr-2 text-purple-500" />
                                {item.bookCategory}
                              </div>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {item.bookCategoryCode}
                              </span>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <div className="flex justify-end items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className={`editClass h-8 w-8 ${
                                        theme === "light"
                                          ? "bg-amber-600 hover:bg-amber-700 border-amber-700"
                                          : "bg-amber-500 hover:bg-amber-600"
                                      } text-white`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(item);
                                      }}
                                    >
                                      <FaEdit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle className="text-xl flex items-center">
                                        <Tag className="mr-2 h-5 w-5" />
                                        Edit Book Category
                                      </DialogTitle>
                                    </DialogHeader>

                                    <form
                                      onSubmit={(e) =>
                                        updateBookCategoryData(e, item.id)
                                      }
                                    >
                                      <div className="grid gap-4 py-4">
                                        {/* Category Name */}
                                        <div className="flex flex-col gap-2">
                                          <Label htmlFor="editBookCategory">
                                            Category Name{" "}
                                            <sup className="text-red-600">
                                              *
                                            </sup>
                                          </Label>
                                          <Input
                                            required
                                            type="text"
                                            value={editInput.bookCategory}
                                            id="editBookCategory"
                                            name="bookCategory"
                                            onChange={(e) => {
                                              setEditInput({
                                                ...editInput,
                                                [e.target.name]: e.target.value,
                                              });
                                            }}
                                            className={`${
                                              theme === "light"
                                                ? "bg-gray-700 border-gray-600 text-white"
                                                : ""
                                            }`}
                                          />
                                        </div>

                                        {/* Category Code */}
                                        <div className="flex flex-col gap-2">
                                          <Label htmlFor="editBookCategoryCode">
                                            Category Code{" "}
                                            <sup className="text-red-600">
                                              *
                                            </sup>
                                          </Label>
                                          <Input
                                            required
                                            type="text"
                                            value={editInput.bookCategoryCode}
                                            id="editBookCategoryCode"
                                            name="bookCategoryCode"
                                            onChange={(e) => {
                                              setEditInput({
                                                ...editInput,
                                                [e.target.name]: e.target.value,
                                              });
                                            }}
                                            className={`${
                                              theme === "light"
                                                ? "bg-gray-700 border-gray-600 text-white"
                                                : ""
                                            }`}
                                          />
                                        </div>
                                      </div>

                                      <DialogFooter>
                                        <Button
                                          type="submit"
                                          disabled={postApiLoading}
                                          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
                                        >
                                          {postApiLoading ? (
                                            <>
                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                              Saving...
                                            </>
                                          ) : (
                                            <>Save changes</>
                                          )}
                                        </Button>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                </Dialog>
                                <DeleteComponent
                                  name={item.bookCategory}
                                  deletePath={`${libraryUrlApi.addBookCategory.url}/${item.id}/${schoolId}`}
                                  onDelete={() => {
                                    const updatedData =
                                      bookCategoryData?.filter(
                                        (data) => data.id !== item.id
                                      );
                                    dispatch(setBookCategory(updatedData));
                                  }}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* No Results State */}
                  {searchTerm && filteredCategories.length === 0 && (
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
                  {filteredCategories.length > 0 && (
                    <div
                      className={`p-4 border-t ${
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

export default AddBookCategoryPage;
