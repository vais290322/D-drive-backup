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

const AddBookPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allBooks = useSelector((state) => state.allBooks.allBooks) || [];
  const allBooksCategory =
    useSelector((state) => state.bookCategory.bookCategoryNames) || [];
  const allClass = useSelector((state) => state.class.classNames) || [];
  const dispatch = useDispatch();
  // console.log("allBooks : ", allBooks);

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
  const dataLength = allBooks.length;

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
        `${libraryUrlApi.getAllBook.url}`
      );

      // console.log("response : ", response);
      // setData(response.data.data);
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
        `${libraryUrlApi.getAllBook.url}`,
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
          bookName: "",
          author: "",
          bookNumber: "",
          bookQuantity: "",
          bookCategory: "",
          classAssigned: "",
        });
        toast.success(response.data.message);
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
          `${libraryUrlApi.getAllBook.url}/${id}`,
          editInput,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log("editinput : ", editInput);
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

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = allBooks.slice(
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
      } font-poppins h-[100vh] `}
    >
      <div className={` ${theme === "light" ? "bg-[#212121]" : ""} `}>
        {/* for table and add new class rooms */}
        <div
          className={`mt-4 border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${
            theme === "light"
              ? "border-[rgba(193,193,193,0.3)]"
              : "border-slate-200 bg-white"
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
              <span className="text-[1rem] sm:text-[1.5rem] font-bold">
                All Books
              </span>
            </div>
            {/* add button section */}
            <div className="flex items-center text-[1.25rem]">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#452B90] hover:bg-[#c29732] text-white hidden sm:flex ">
                    <span>
                      <FaPlus />
                    </span>
                    <span>Add New Book</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-10 sm:max-w-[36%]">
                  <DialogHeader>
                    <DialogTitle>Write New Book's Details </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={addNewBook}>
                    <div className="grid grid-cols-2 gap-6 py-4">
                      {/* for book name */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="bookName">
                          Book's Name <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.bookName}
                          id="bookName"
                          name="bookName"
                          onChange={changeEventHandler}
                        />
                      </div>

                      {/* for auther name */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="author">
                          Auther's Name
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.author}
                          id="author"
                          name="author"
                          onChange={changeEventHandler}
                        />
                      </div>
                      {/* for book number */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="bookNumber">
                          Book's Number
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.bookNumber}
                          id="bookNumber"
                          name="bookNumber"
                          onChange={changeEventHandler}
                        />
                      </div>
                      {/* for book's quantity */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="bookQuantity">
                          Book's Quantity
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="text"
                          value={input.bookQuantity}
                          id="bookQuantity"
                          name="bookQuantity"
                          onChange={changeEventHandler}
                        />
                      </div>

                      {/* for book's category */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="className">
                          Select a book category
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Select
                          onValueChange={(e) =>
                            setInput({ ...input, bookCategory: e })
                          }
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Category</SelectLabel>
                              {allBooksCategory.map((category, index) => (
                                <SelectItem
                                  key={index}
                                  value={category}
                                  
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
                        <Label htmlFor="className">
                          Select a class
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Select
                          onValueChange={(e) =>
                            setInput({ ...input, classAssigned: e })
                          }
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Class</SelectLabel>
                              {allClass.map((classItem, index) => (
                                <SelectItem key={index} value={classItem}>
                                  {classItem}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="submit"
                        className=" bg-[#452B90] hover:bg-[#c29732] "
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Table */}
          <Table className="table-auto w-full border-collapse border border-slate-200">
            <TableHeader
              className={`bg-gray-100 text-left ${
                theme === "light" ? "bg-[#212121]" : "light"
              }`}
            >
              <TableRow>
                {[
                  "S.No",
                  "Book Name",
                  "Author Name",
                  "Category",
                  "Book No.",
                  "class",
                  "Status",
                  "Quantity",
                  "Action",
                ].map((header, index) => (
                  <TableHead
                    key={index}
                    className={`px-4 py-2 border ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)] text-white "
                        : "border-slate-200 text-black"
                    } font-semibold  ${
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
                    {item.bookName}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.author}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.bookCategory}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.bookNumber}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.classAssigned}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.status}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.bookQuantity}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    <div className="flex justify-end items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <FaEdit className="sm:w-8 sm:h-8 w-6 h-6 bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer rounded-sm" onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(item);
                          }} />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[30%]">
                          <DialogHeader>
                            <DialogTitle>Edit This Data</DialogTitle>
                          </DialogHeader>

                          <form onSubmit={(e)=>{
                            updateBookData(e, item.id)
                          }}>
                            <div className="grid grid-cols-2 gap-6 py-4">
                              {/* for book name */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="bookName">
                                  Book's Name{" "}
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={editInput.bookName}
                                  id="bookName"
                                  name="bookName"
                                  onChange={(e)=>{
                                    setEditInput({...editInput, [e.target.name]: e.target.value})
                                  }}
                                />
                              </div>

                              {/* for auther name */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="author">
                                  Auther's Name
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={editInput.author}
                                  id="author"
                                  name="author"
                                  onChange={(e)=>{
                                    setEditInput({...editInput, [e.target.name]: e.target.value})
                                  }}
                                />
                              </div>
                              {/* for book number */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="bookNumber">
                                  Book's Number
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={editInput.bookNumber}
                                  id="bookNumber"
                                  name="bookNumber"
                                  onChange={(e)=>{
                                    setEditInput({...editInput, [e.target.name]: e.target.value})
                                  }}
                                />
                              </div>
                              {/* for book's quantity */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="bookQuantity">
                                  Book's Quantity
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={editInput.bookQuantity}
                                  id="bookQuantity"
                                  name="bookQuantity"
                                  onChange={(e)=>{
                                    setEditInput({...editInput, [e.target.name]: e.target.value})
                                  }}
                                />
                              </div>

                              {/* for book's category */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="className">
                                  Select a book category
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Select
                                  onValueChange={(e) =>
                                    setEditInput({ ...editInput, bookCategory: e })
                                  }
                                  defaultValue={editInput.bookCategory}
                                  required
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={editInput.bookCategory} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Category</SelectLabel>
                                      {
                                        allBooksCategory.map((item, index) => {
                                          return (
                                            <SelectItem
                                              key={index}
                                              value={item}
                                            >
                                              {item}
                                            </SelectItem>
                                          );
                                        })
                                      }
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                              {/* for class */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="className">
                                  Select a class
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Select
                                  onValueChange={(e) =>
                                    setEditInput({ ...editInput, classAssigned: e })
                                  }
                                  required
                                  defaultValue={editInput.classAssigned}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={editInput.classAssigned} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Class</SelectLabel>
                                      {
                                        allClass.map((item, index) => {
                                          return (
                                            <SelectItem
                                              key={index}
                                              value={item}
                                            >
                                              {item}
                                            </SelectItem>
                                          );
                                        })
                                      }
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <DialogFooter>
                              <Button
                                type="submit"
                                className=" bg-[#452B90] hover:bg-[#c29732] "
                              >
                                Save changes
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <DeleteComponent
                        name={item.bookName} // Name of the class
                        deletePath={`${libraryUrlApi.getAllBook.url}/${item.id}`} // API endpoint for deletion
                        onDelete={() => {
                          const updatedData = allBooks.filter(
                            (data) => data.id !== item.id
                          );
                          dispatch(setAllBooks(updatedData)); // Update the Redux state after deletion
                        }}
                      />
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
    </div>
  );
};

export default AddBookPage;
