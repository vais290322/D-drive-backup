import React, { useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from 'axios';
import { toast } from 'sonner';
import PaginationComponent from '@/components/pagination/PaginationComponent';
import AddNewComponents from '@/components/Addnew/AddNewComponents';
import DeleteComponent from '@/components/DeleteData/DeleteComponent';
import EditDataComponent from '@/components/EditData/EditDataComponent';
import { useDispatch, useSelector } from 'react-redux';
import { setBookCategory } from '@/utils/library/bookCategorySlice';
import libraryUrlApi from '@/common/library';

const AddBookCategoryPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const bookCategoryData = useSelector((state) => state.bookCategory.bookCategory) || [];
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const dispatch = useDispatch();
  const [input, setInput] = useState(
    {
      bookCategory: "",
      bookCategoryCode: "",
    }
  );
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

          if(response){
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

  const dataLength = bookCategoryData?.length;

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
      const response = await axios.get(`${libraryUrlApi.addBookCategory.url}/${schoolId}`);
      // console.log("response : ", response);
      if(response){
        dispatch(setBookCategory(response.data.data));
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLibraryCategoryData();
  }, []);

  // for add new Subject data 
  const addNewBookCategory = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(`${libraryUrlApi.addBookCategory.url}/${schoolId}`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true,
      });
      if (response) {
        setInput({
          bookCategory: "",
          bookCategoryCode: "",
        })
        toast.success(response.data.message);
        fetchLibraryCategoryData();
      }
    } catch (error) {
      toast.error(error.response.data.message);

    }
    finally {
      setPostApiLoading(false)
    }
  }

  const dialogHeader = "Book Category";
  const formData = [
    { name: "bookCategory", label: "Book Category Name", type: "text", placeholder: "Enter book category", required: true },
    { name: "bookCategoryCode", label: "Book Category Code", type: "text", placeholder: "Enter book category's code", required: true },
  ]

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = bookCategoryData?.slice(
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
    <div className={` ${theme === "light" ? 'dark' : 'light'} h-[100vh]`}>
      <div
        className={`mt-4 font-poppins border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${theme === "light" ? 'border-[rgba(193,193,193,0.3)]' : ' border-slate-200 bg-white'
          }`}
      >
        {/* Page Header Section */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-between items-center p-3 sm:p-4 border-b-[1px] ${theme === "light" ? 'border-[rgba(193,193,193,0.3)]' : 'border-slate-200'
            }`}>
          <div>
            <span className="text-[1rem] sm:text-[1.5rem] font-bold font-poppins">
              Book's Category
            </span>
          </div>

          <div className="flex items-center text-[1.25rem]">
            <AddNewComponents onChangeFunctin={changeEventHandler} onSubmitFunction={addNewBookCategory} dialogHeader={dialogHeader} formData={formData} inputValue={input} postApiLoading={postApiLoading} />
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
                "Book Category Name",
                "Book Category Code",
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
                  } ${header === "S.No" ? "hidden sm:table-cell" : ""} `}
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
                  } hidden sm:table-cell `}
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
                  {item.bookCategory}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.bookCategoryCode}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  <div className="flex justify-end items-center gap-2">
                    {/* for edit data */}
                    <EditDataComponent formData={formData} postApiLoading={postApiLoading} onChangeFunctin={(e) =>
                        setEditInput({
                          ...editInput,
                          [e.target.name]: e.target.value,
                        })
                      }
                      inputValue={editInput} onSubmitFunction={(e) => updateBookCategoryData(e, item.id)}
                      onEditClick={() => handleEditClick(item)}
                      />
                    {/* for conformation delete the data start here */}
                    <DeleteComponent
                      name={item.bookCategory} // Name of the class
                      deletePath={`${libraryUrlApi.addBookCategory.url}/${item.id}/${schoolId}`} // API endpoint for deletion
                      onDelete={() => {
                        const updatedData = bookCategoryData?.filter(
                          (data) => data.id !== item.id
                        );
                        dispatch(setBookCategory(updatedData)); // Update the Redux state after deletion
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
        <PaginationComponent currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          onRowsPerPageChange={handleRowsPerPageChange}
          onPageChange={setCurrentPage} />

      </div>
    </div>
  )
} 

export default AddBookCategoryPage