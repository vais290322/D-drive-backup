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
import AddNewComponents from "@/components/Addnew/AddNewComponents";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import EditDataComponent from "@/components/EditData/EditDataComponent";
import { useDispatch, useSelector } from "react-redux";
import { setGenders } from "@/utils/settings/settingsSlice";
import settingUrlApi from "@/common/setting";

const GendersPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const genders = useSelector((state) => state.settings.genders) || [];
  const role = useSelector((state) => state.auth.user);
  // console.log("role : ", role);
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

  // for fetch the  data
  const fetchGenderData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${settingUrlApi.getAllGender.url}`);

      // console.log("response : ", response);
      if (response) {
        dispatch(setGenders(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    }
  };

  useEffect(() => {
    fetchGenderData();
  }, []);
  // for add new  data
  const addNewGender = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${settingUrlApi.getAllGender.url}`,
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
          genderName: "",
        });
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
        `${settingUrlApi.getAllGender.url}/${id}`,
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

  const dialogHeader = "Gender";
  const formData = [
    {
      name: "genderName",
      label: "Gender Name",
      type: "text",
      placeholder: "type gender name",
      required: true,
    },
  ];

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
              All Genders
            </span>
          </div>

          <div className="flex items-center text-[1.25rem]">
            {["edp", "admin"].includes(role) && (
              <AddNewComponents
                onChangeFunctin={changeEventHandler}
                onSubmitFunction={addNewGender}
                dialogHeader={dialogHeader}
                formData={formData}
                inputValue={input}
                postApiLoading={postApiLoading}
              />
            )}
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
              {headers.map((n, index) => (
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
                  {item.genderName}
                </TableCell>

                {["edp", "admin","vais"].includes(role) && (
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    <div className="flex justify-end items-center gap-2 ">
                      {/* for edit data */}
                      {/* <EditDataComponent formData={formData} postApiLoading={postApiLoading} onChangeFunctin={(e)=>{
    setEditInput({
      ...editInput,
      [e.target.name]: e.target.value
    })
  }} inputValue={editInput} onSubmitFunction={(e)=>updateGenderData(e, item.id)} onEditClick={()=>handleEditClick( item)} /> */}

                      {/* for conformation delete the data start here */}
                      <DeleteComponent
                        name={item.genderName} // Name of the item
                        deletePath={`${settingUrlApi.getAllGender.url}/${item.id}`} // API endpoint for deletion
                        onDelete={() => {
                          const updatedData = genders.filter(
                            (data) => data.id !== item.id
                          );
                          dispatch(setGenders(updatedData));
                        }}
                      />
                      {/* till now delete section  */}
                    </div>
                  </TableCell>
                )}
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

export default GendersPage;
