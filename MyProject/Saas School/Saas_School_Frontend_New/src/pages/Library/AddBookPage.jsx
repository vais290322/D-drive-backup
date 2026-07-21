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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { setAllBooks } from "@/utils/library/addBookSlice";
import libraryUrlApi from "@/common/library";
import { Book, BookOpen, Bookmark, Loader2, Search } from "lucide-react";
import TourButton from "@/components/Tour/TourButton";
import { addBookPageSteps } from "@/components/Tour/Steps/LibrarySteps/Steps";

const AddBookPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allBooks = useSelector((state) => state.allBooks.allBooks) || [];
  const allBooksCategory =
    useSelector((state) => state.bookCategory.bookCategoryNames) || [];
  const allClass = useSelector((state) => state.class.classNames) || [];
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const [input, setInput] = useState({
    bookName: "",
    author: "",
    bookNumber: "",
    bookQuantity: "",
    bookCategory: "",
    classAssigned: "",
  });

  const [editInput, setEditInput] = useState({
    bookName: "",
    author: "",
    bookNumber: "",
    bookQuantity: "",
    bookCategory: "",
    classAssigned: "",
  });

  const handleEditClick = (item) => {
    setEditInput({
      bookName: item.bookName,
      author: item.author,
      bookNumber: item.bookNumber,
      bookQuantity: item.bookQuantity,
      bookCategory: item.bookCategory,
      classAssigned: item.classAssigned,
    });
  };

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // for fetch the class data
  const fetchLibraryBookData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${libraryUrlApi.getAllBook.url}/${schoolId}`
      );
      dispatch(setAllBooks(response.data.data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryBookData();
  }, []);

  // for add new and update time data
  const addNewBook = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${libraryUrlApi.getAllBook.url}/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        setInput({
          bookName: "",
          author: "",
          bookNumber: "",
          bookQuantity: "",
          bookCategory: "",
          classAssigned: "",
        });
        toast.success(response?.data?.message);
        fetchLibraryBookData();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setPostApiLoading(false);
    }
  };

  const updateBookData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${libraryUrlApi.getAllBook.url}/${id}/${schoolId}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.success("Book details updated successfully!");
        const updatedData = allBooks.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );
        setEditInput({
          bookName: "",
          author: "",
          bookNumber: "",
          bookQuantity: "",
          bookCategory: "",
          classAssigned: "",
        });
        dispatch(setAllBooks(updatedData));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update book details"
      );
    } finally {
      setPostApiLoading(false);
    }
  };

  // Filter books based on search term
  const filteredBooks = allBooks.filter(
    (book) =>
      book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.bookNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.bookCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.classAssigned.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dataLength = filteredBooks?.length;

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = filteredBooks?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  // Get book status color
  const getStatusColor = (status) => {
    if (status === "Available") return "bg-green-100 text-green-800";
    if (status === "Issued") return "bg-blue-100 text-blue-800";
    if (status === "Reserved") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
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
            Library Management
            <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-80">
            Add, edit and manage books in your library
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
            <div className="booksAvailable mb-4 md:mb-0">
              <h2
                className={`text-xl font-bold flex items-center ${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Book Collection
              </h2>
              <p
                className={`mt-1 text-sm ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {allBooks.length} books in your library
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
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Add New Book Button */}

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="addClass bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg">
                    <FaPlus className="mr-2" />
                    Add New Book
                  </Button>
                </DialogTrigger>

                <DialogContent
                  className={`max-w-10 sm:max-w-[36%] ${
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
                      <Book
                        className={`mr-2 h-5 w-5 ${
                          theme === "light"
                            ? "text-purple-400"
                            : "text-purple-600"
                        }`}
                      />
                      Add New Book
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={addNewBook}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                      {/* for book name */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="bookName"
                          className={
                            theme === "light"
                              ? "text-gray-200"
                              : "text-gray-700"
                          }
                        >
                          Book's Name <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.bookName}
                          id="bookName"
                          name="bookName"
                          placeholder="Enter book name"
                          onChange={changeEventHandler}
                          className={`${
                            theme === "light"
                              ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                              : "bg-white border-gray-300 text-gray-900 focus-visible:ring-purple-500"
                          }`}
                        />
                      </div>

                      {/* for auther name */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="author"
                          className={
                            theme === "light"
                              ? "text-gray-200"
                              : "text-gray-700"
                          }
                        >
                          Author's Name
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.author}
                          id="author"
                          name="author"
                          placeholder="Enter author name"
                          onChange={changeEventHandler}
                          className={`${
                            theme === "light"
                              ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                              : "bg-white border-gray-300 text-gray-900 focus-visible:ring-purple-500"
                          }`}
                        />
                      </div>
                      {/* for book number */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="bookNumber"
                          className={
                            theme === "light"
                              ? "text-gray-200"
                              : "text-gray-700"
                          }
                        >
                          Book's Number
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.bookNumber}
                          id="bookNumber"
                          name="bookNumber"
                          placeholder="Enter book number"
                          onChange={changeEventHandler}
                          className={`${
                            theme === "light"
                              ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                              : "bg-white border-gray-300 text-gray-900 focus-visible:ring-purple-500"
                          }`}
                        />
                      </div>
                      {/* for book's quantity */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="bookQuantity"
                          className={
                            theme === "light"
                              ? "text-gray-200"
                              : "text-gray-700"
                          }
                        >
                          Book's Quantity
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.bookQuantity}
                          id="bookQuantity"
                          name="bookQuantity"
                          placeholder="Enter quantity"
                          onChange={changeEventHandler}
                          className={`${
                            theme === "light"
                              ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                              : "bg-white border-gray-300 text-gray-900 focus-visible:ring-purple-500"
                          }`}
                        />
                      </div>

                      {/* for book's category */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="className"
                          className={
                            theme === "light"
                              ? "text-gray-200"
                              : "text-gray-700"
                          }
                        >
                          Select a book category
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Select
                          onValueChange={(e) =>
                            setInput({ ...input, bookCategory: e })
                          }
                          required
                        >
                          <SelectTrigger
                            className={`w-full ${
                              theme === "light"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                          >
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent
                            className={
                              theme === "light"
                                ? "bg-gray-800 border-gray-700 text-white"
                                : ""
                            }
                          >
                            <SelectGroup>
                              <SelectLabel
                                className={
                                  theme === "light" ? "text-gray-400" : ""
                                }
                              >
                                Category
                              </SelectLabel>
                              {allBooksCategory.map((category, index) => (
                                <SelectItem
                                  key={index}
                                  value={category}
                                  className={
                                    theme === "light"
                                      ? "text-white hover:bg-gray-700"
                                      : ""
                                  }
                                >
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* for class */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="className"
                          className={
                            theme === "light"
                              ? "text-gray-200"
                              : "text-gray-700"
                          }
                        >
                          Select a class
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Select
                          onValueChange={(e) =>
                            setInput({ ...input, classAssigned: e })
                          }
                          required
                        >
                          <SelectTrigger
                            className={`w-full ${
                              theme === "light"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                          >
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                          <SelectContent
                            className={
                              theme === "light"
                                ? "bg-gray-800 border-gray-700 text-white"
                                : ""
                            }
                          >
                            <SelectGroup>
                              <SelectLabel
                                className={
                                  theme === "light" ? "text-gray-400" : ""
                                }
                              >
                                Class
                              </SelectLabel>
                              {allClass.map((classItem, index) => (
                                <SelectItem
                                  key={index}
                                  value={classItem}
                                  className={
                                    theme === "light"
                                      ? "text-white hover:bg-gray-700"
                                      : ""
                                  }
                                >
                                  {classItem}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter
                      className={`${
                        theme === "light"
                          ? "border-t border-gray-700 pt-4"
                          : "border-t border-gray-200 pt-4"
                      }`}
                    >
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
                steps={addBookPageSteps}
                tourName={"addBooksPage-tour"}
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
                  Loading books...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {allBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <BookOpen
                    className={`w-16 h-16 mb-4 ${
                      theme === "light" ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-lg font-medium ${
                      theme === "light" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    No books in your library
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Add your first book by clicking the "Add New Book" button
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
                            "Book Name",
                            "Author Name",
                            "Category",
                            "Book No.",
                            "Class",
                            "Status",
                            "Quantity",
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
                                {item.bookName}
                              </div>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              {item.author}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {item.bookCategory}
                              </span>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.bookNumber}
                              </span>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              {item.classAssigned}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  item.status
                                )}`}
                              >
                                {item.status || "Available"}
                              </span>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              {item.bookQuantity}
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
                                  <DialogContent className="sm:max-w-[30%]">
                                    <DialogHeader>
                                      <DialogTitle className="text-xl flex items-center">
                                        <Book className="mr-2 h-5 w-5" />
                                        Edit Book Details
                                      </DialogTitle>
                                    </DialogHeader>

                                    <form
                                      onSubmit={(e) => {
                                        updateBookData(e, item.id);
                                      }}
                                    >
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                                        {/* for book name */}
                                        <div className="flex flex-col gap-2">
                                          <Label htmlFor="bookName">
                                            Book's Name{" "}
                                            <sup className="text-red-600">
                                              *
                                            </sup>
                                          </Label>
                                          <Input
                                            required
                                            type="text"
                                            value={editInput.bookName}
                                            id="bookName"
                                            name="bookName"
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

                                        {/* for auther name */}
                                        <div className="flex flex-col gap-2">
                                          <Label htmlFor="author">
                                            Author's Name
                                            <sup className="text-red-600">
                                              *
                                            </sup>
                                          </Label>
                                          <Input
                                            required
                                            type="text"
                                            value={editInput.author}
                                            id="author"
                                            name="author"
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
                                        {/* for book number */}
                                        <div className="flex flex-col gap-2">
                                          <Label htmlFor="bookNumber">
                                            Book's Number
                                            <sup className="text-red-600">
                                              *
                                            </sup>
                                          </Label>
                                          <Input
                                            required
                                            type="text"
                                            value={editInput.bookNumber}
                                            id="bookNumber"
                                            name="bookNumber"
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
                                        {/* for book's quantity */}
                                        <div className="flex flex-col gap-2">
                                          <Label htmlFor="bookQuantity">
                                            Book's Quantity
                                            <sup className="text-red-600">
                                              *
                                            </sup>
                                          </Label>
                                          <Input
                                            required
                                            type="text"
                                            value={editInput.bookQuantity}
                                            id="bookQuantity"
                                            name="bookQuantity"
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

                                        {/* for book's category */}
                                        <div className="flex flex-col gap-2">
                                          <Label htmlFor="className">
                                            Select a book category
                                            <sup className="text-red-600">
                                              *
                                            </sup>
                                          </Label>
                                          <Select
                                            onValueChange={(e) =>
                                              setEditInput({
                                                ...editInput,
                                                bookCategory: e,
                                              })
                                            }
                                            defaultValue={
                                              editInput.bookCategory
                                            }
                                            required
                                          >
                                            <SelectTrigger
                                              className={`w-full ${
                                                theme === "light"
                                                  ? "bg-gray-700 border-gray-600 text-white"
                                                  : ""
                                              }`}
                                            >
                                              <SelectValue
                                                placeholder={
                                                  editInput.bookCategory
                                                }
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                <SelectLabel>
                                                  Category
                                                </SelectLabel>
                                                {allBooksCategory.map(
                                                  (item, index) => {
                                                    return (
                                                      <SelectItem
                                                        key={index}
                                                        value={item}
                                                      >
                                                        {item}
                                                      </SelectItem>
                                                    );
                                                  }
                                                )}
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        {/* for class */}
                                        <div className="flex flex-col gap-2">
                                          <Label htmlFor="className">
                                            Select a class
                                            <sup className="text-red-600">
                                              *
                                            </sup>
                                          </Label>
                                          <Select
                                            onValueChange={(e) =>
                                              setEditInput({
                                                ...editInput,
                                                classAssigned: e,
                                              })
                                            }
                                            required
                                            defaultValue={
                                              editInput.classAssigned
                                            }
                                          >
                                            <SelectTrigger
                                              className={`w-full ${
                                                theme === "light"
                                                  ? "bg-gray-700 border-gray-600 text-white"
                                                  : ""
                                              }`}
                                            >
                                              <SelectValue
                                                placeholder={
                                                  editInput.classAssigned
                                                }
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                <SelectLabel>Class</SelectLabel>
                                                {allClass.map((item, index) => {
                                                  return (
                                                    <SelectItem
                                                      key={index}
                                                      value={item}
                                                    >
                                                      {item}
                                                    </SelectItem>
                                                  );
                                                })}
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
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
                                  name={item.bookName}
                                  deletePath={`${libraryUrlApi.getAllBook.url}/${item.id}/${schoolId}`}
                                  onDelete={() => {
                                    const updatedData = allBooks?.filter(
                                      (data) => data.id !== item.id
                                    );
                                    dispatch(setAllBooks(updatedData));
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
                  {searchTerm && filteredBooks.length === 0 && (
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
                        Try adjusting your search term or filters
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {filteredBooks.length > 0 && (
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

export default AddBookPage;
