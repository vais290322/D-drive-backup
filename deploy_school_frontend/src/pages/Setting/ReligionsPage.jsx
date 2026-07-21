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
import { setReligions } from "@/utils/settings/settingsSlice";
import settingUrlApi from "@/common/setting";

const ReligionsPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const religions = useSelector((state) => state.settings.religions);
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user);
  const [input, setInput] = useState({
    religionName: "",
  });

  const [editInput, setEditInput] = useState({
    religionName: "",
  });

  const dataLength = religions.length;

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

  // for fetch the  data
  const fetchReligionData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${settingUrlApi.getAllReligion.url}`
      );

      // console.log("response : ", response);

      if (response) {
        dispatch(setReligions(response?.data?.data));
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    }
  };

  useEffect(() => {
    fetchReligionData();
  }, []);
  // for add new  data
  const addNewReligion = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${settingUrlApi.getAllReligion.url}`,
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
        `${settingUrlApi.getAllReligion.url}/${id}`,
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

  const dialogHeader = "Religion";
  const formData = [
    {
      name: "religionName",
      label: "Religion Name",
      type: "text",
      placeholder: "type religion name",
      required: true,
    },
  ];

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = religions.slice(
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
              All Religions
            </span>
          </div>
          {["admin", "edp"].includes(role) && (
            <div className="flex items-center text-[1.25rem]">
              <AddNewComponents
                onChangeFunctin={changeEventHandler}
                onSubmitFunction={addNewReligion}
                dialogHeader={dialogHeader}
                formData={formData}
                inputValue={input}
                postApiLoading={postApiLoading}
              />
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
                  {item.religionName}
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
                      <EditDataComponent
                        formData={formData}
                        postApiLoading={postApiLoading}
                        onChangeFunctin={(e) => {
                          setEditInput({
                            ...editInput,
                            [e.target.name]: e.target.value,
                          });
                        }}
                        inputValue={editInput}
                        onSubmitFunction={(e) => {
                          updateReligionData(e, item.id);
                        }}
                        onEditClick={() => {
                          handleEditClick(item);
                        }}
                      />

                      {/* for conformation delete the data start here */}
                      <DeleteComponent
                        name={item.religionName} // Name of the class
                        deletePath={`${settingUrlApi.getAllReligion.url}/${item.id}`} // API endpoint for deletion
                        onDelete={() => {
                          const updatedData = religions.filter(
                            (data) => data.id !== item.id
                          );
                          dispatch(setReligions(updatedData)); // Update the Redux state after deletion
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

export default ReligionsPage;
