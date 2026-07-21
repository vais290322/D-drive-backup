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
import { setSection } from "@/utils/academic/sectionSlice";
import { academicUrlApi } from "@/common";

const SectionPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const dispatch = useDispatch();
  const sectionData = useSelector((state) => state.section.section);
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const [input, setInput] = useState({
    sectionName: "",
    section_Code: "",
  });
  const [editInput, setEditInput] = useState({
    sectionName: "",
    section_Code: "",
  });
  const dataLength = sectionData?.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (item) => {
    setEditInput({
      sectionName: item.sectionName,
      section_Code: item.section_Code,
    });
    // setEditId(item.id);
  };

  // for fetch the class data
  const fetchSectionData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${academicUrlApi.getAllSection.url}/${schoolId}`
      );
      dispatch(setSection(response?.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchSectionData();
  }, [sectionData]);

  // for add new Subject data
  const addNewSection = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${academicUrlApi.getAllSection.url}/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          // withCredentials: true,
        }
      );

      if (response) {
        setInput({
          sectionName: "",
          section_Code: "",
        });
        // dispatch(setClass([...sectionData, response.data]));
        toast.success(response.data);
        fetchSectionData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "error in add ");
    } finally {
      setPostApiLoading(false);
    }
  };

  const updateSectionData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${academicUrlApi.getAllSection.url}/${id}/${schoolId}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if(response){
      toast.success("Section updated successfully!");
      const updatedData = sectionData.map((item) =>
        item.id === id ? { ...item, ...editInput } : item
      );
      setEditInput({ sectionName: "", section_Code: "" });
      dispatch(setSection(updatedData));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update section");
    } finally {
      setPostApiLoading(false);
    }
  };

  const dialogHeader = "Section";
  const formData = [
    {
      name: "sectionName",
      label: "Section Name",
      type: "text",
      placeholder: "Section Name",
      required: true,
    },
    {
      name: "section_Code",
      label: "Section Code",
      type: "text",
      placeholder: "Section Code",
      required: true,
    },
  ];

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = sectionData?.slice(
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
      } h-[100vh] font-poppins `}
    >
      <div
        className={`mt-4 border-[1px] rounded-[0.675rem] mx-0 sm:mx-14 ${
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
               Section
            </span>
          </div>

          <div className="flex items-center text-[1.25rem]">
            <AddNewComponents
              onChangeFunctin={changeEventHandler}
              onSubmitFunction={addNewSection}
              dialogHeader={dialogHeader}
              formData={formData}
              inputValue={input}
              postApiLoading={postApiLoading}
            />
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
              {["S.No", "Section Name", "Section Code", "Action"].map(
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
                  {item.sectionName}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  } `}
                >
                  {item.section_Code}
                </TableCell>
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
                      onChangeFunctin={(e) =>
                        setEditInput({
                          ...editInput,
                          [e.target.name]: e.target.value,
                        })
                      }
                      inputValue={editInput}
                      onSubmitFunction={(e) => updateSectionData(e, item.id)}
                      onEditClick={() => handleEditClick(item)}
                    />
                    {/* for conformation delete the data start here */}
                    <DeleteComponent
                      name={item.sectionName} // Name of the class
                      deletePath={`${academicUrlApi.getAllSection.url}/${item.id}/${schoolId}`} // API endpoint for deletion
                      onDelete={() => {
                        const updatedData = sectionData.filter(
                          (data) => data.id !== item.id
                        );
                        dispatch(setSection(updatedData)); // Update the Redux state after deletion
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
  );
};

export default SectionPage;
