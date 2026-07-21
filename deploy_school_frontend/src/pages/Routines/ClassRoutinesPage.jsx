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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddNewClassRoutines from "@/components/ForRoutines/AddNewClassRoutines";
import { useDispatch, useSelector } from "react-redux";
import { setClassRoutine } from "@/utils/routines/classRoutineSlice";
import { Download } from "lucide-react";
import UpdateClassRoutineComponent from "@/components/ForRoutines/UpdateClassRoutineComponent";
import routineUrlApi from "@/common/routines";

const ClassRoutinesPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const dispatch = useDispatch();
  const classTime = useSelector((state) => state.classTime.classTime);
  const classRoutineTime =
    useSelector((state) => state.classRoutine.classRoutine) || [];
  const allClass = useSelector((state) => state.class.classNames);
  const allSection = useSelector((state) => state.section.sectionNames);
 

  const [searchData, setSearchData] = useState({
    className: "",
    section: "",
  });
  const [searchRoutineData, setSearchRoutineData] = useState([]);

  const dataLength = searchRoutineData.length;

  // for fetch the class data
  const fetchClassRoutine = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${routineUrlApi.getRoutine.url}`
      );

      // console.log("response : ", response);
      dispatch(setClassRoutine(response.data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    fetchClassRoutine();
  }, []);
  // for add new Subject data
  const editStudent = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post("url", {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true,
      });

      // console.log("response : ", response);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setPostApiLoading(false);
    }
  };

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = searchRoutineData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const searchClass = async (e) => {
    e.preventDefault();
    try {
      // console.log("searchData : ", searchData);
      const response = await axios.get(
        `${routineUrlApi.getRoutine.url}/search?className=${searchData.className}&section=${searchData.section}`
      );
      if (response) {
        setSearchRoutineData(response.data.data);
        // setShowSearchData(true);
        // console.log("search response : ", response);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
    }
  };

  const sortedClassTime = [...classTime].sort((a, b) => {
    const periodOrder = (period) => {
      if (period.toLowerCase().includes("break")) return 4.5; // Place "break period" after 4th period
      const match = period.match(/\d+/); // Extract the number (e.g., 1, 2, 3)
      return match ? parseInt(match[0], 10) : Infinity; // Non-numbered periods go to the end
    };

    return periodOrder(a.periods) - periodOrder(b.periods);
  });

  const downloadRoutine = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${routineUrlApi.getRoutine.url}/search/download?className=${searchData.className}&section=${searchData.section}`,
        {
          responseType: "blob",
        }
      );

      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        // Set the filename for the download
        link.setAttribute(
          "download",
          `routine_${searchData.className}_${searchData.section}.pdf`
        );

        // Append the link to the document and trigger a click to download
        document.body.appendChild(link);
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);

        // console.log("PDF downloaded successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Search before downloading");
    }
  };

  return (
    <div
      className={` ${
        theme === "light" ? "dark" : "light"
      } font-poppins h-[100vh] `}
    >
      <div className={` ${theme === "light" ? "" : ""} `}>
        {/* for search function  */}
        <div
          className={`mt-4  flex items-center justify-start mx-4 sm:mx-14 gap-4 h-20 ${
            theme === "light" ? "bg-[#212121] text-white" : "bg-white"
          } `}
        >
          <p className="text-2xl font-semibold hidden sm:block mx-4">
            Search Class Routines{" "}
          </p>
          <form onSubmit={searchClass} className="flex gap-4">
            <Select
              className="border-red-600 border "
              onValueChange={(value) =>
                setSearchData({ ...searchData, className: value })
              }
            >
              <SelectTrigger className="w-[180px] ">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>class</SelectLabel>
                  {allClass.map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {capitalizeFirstLetter(item)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              className="border-red-600 border "
              onValueChange={(value) =>
                setSearchData({ ...searchData, section: value })
              }
            >
              <SelectTrigger className="w-[180px] ">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>sections</SelectLabel>
                  {allSection.map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {capitalizeFirstLetter(item)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button type="submit" className="bg-[#452B90] hover:bg-[#c29732]">
              Search
            </Button>
          </form>
        </div>

        {/* for table and add new class rooms */}
        <div
          className={`mt-4 border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${
            theme === "light"
              ? "border-[rgba(193,193,193,0.3)] bg-[#212121] text-white"
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
                All Class Routines
              </span>
            </div>

            <div>
              <Button
                className="bg-[#452B90] hover:bg-[#c29732] flex items-center gap-2"
                onClick={downloadRoutine}
              >
                {" "}
                <span className="w-4 h-4">
                  <Download />
                </span>{" "}
                Download
              </Button>
            </div>

            <div>
              <AddNewClassRoutines />
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
                <TableHead
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)] text-white "
                      : "border-slate-200 text-black"
                  } font-semibold`}
                >
                  S.No
                </TableHead>
                <TableHead
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)] text-white "
                      : "border-slate-200 text-black"
                  } font-semibold`}
                >
                  Day
                </TableHead>

                {/* Dynamic Period Headers */}
                {sortedClassTime.map((period) => (
                  <TableHead
                    key={period.id}
                    className={`px-4 py-2 border ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)] text-white "
                        : "border-slate-200 text-black"
                    } font-semibold`}
                  >
                    {`${period.periods} (${period.startTime} - ${period.endTime})`}
                  </TableHead>
                ))}

                {/* Action Header */}
                <TableHead
                  className={`px-4 py-2 border text-right ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)] text-white "
                      : "border-slate-200 text-black"
                  } font-semibold`}
                >
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {searchRoutineData.length > 0 ? (
                paginatedData.map((item, index) => {
                  // Calculate remaining periods for each row
                  const remainingPeriods = Array(9 - item.periods.length).fill(
                    "No class"
                  );

                  return (
                    <TableRow
                      key={item.id}
                      className={`hover:bg-gray-50 border ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)]"
                          : "border-slate-200"
                      }`}
                    >
                      {/* S.No */}
                      <TableCell
                        className={`px-4 py-2 border text-left ${
                          theme === "light"
                            ? "border-[rgba(193,193,193,0.3)]"
                            : "border-slate-200"
                        }`}
                      >
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>

                      {/* Day */}
                      <TableCell
                        className={`px-4 py-2 border text-left ${
                          theme === "light"
                            ? "border-[rgba(193,193,193,0.3)]"
                            : "border-slate-200"
                        }`}
                      >
                        {item.day}
                      </TableCell>

                      {/* Periods */}
                      {item.periods.map((period, idx) => (
                        <TableCell
                          key={idx}
                          className={`px-4 py-2 border text-left ${
                            theme === "light"
                              ? "border-[rgba(193,193,193,0.3)]"
                              : "border-slate-200"
                          }`}
                        >
                          {period.subjectName}
                          <br />
                          {period.teacherName}
                        </TableCell>
                      ))}

                      {/* Fill empty cells for remaining periods */}
                      {remainingPeriods.map((_, idx) => (
                        <TableCell
                          key={`remaining-${idx}`}
                          className={`px-4 py-2 border text-left ${
                            theme === "light"
                              ? "border-[rgba(193,193,193,0.3)]"
                              : "border-slate-200"
                          }`}
                        >
                          No class
                        </TableCell>
                      ))}

                      {/* Actions */}
                      <TableCell
                        className={`px-4 py-2 border text-left ${
                          theme === "light"
                            ? "border-[rgba(193,193,193,0.3)]"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="flex justify-end items-center gap-2">
                          {/* <UpdateClassRoutineComponent /> */}
                          <DeleteComponent
                            name={item.day} // Name of the class
                            deletePath={`${routineUrlApi.getRoutine.url}/${item.id}`} // API endpoint for deletion
                            onDelete={() => {
                              const updatedData = classRoutineTime.filter(
                                (data) => data.id !== item.id
                              );
                              dispatch(setClassRoutine(updatedData)); // Update the Redux state after deletion
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="100%"
                    className="text-center text-xl text-red-400"
                  >
                    please select a class and section to see the routine
                  </TableCell>
                </TableRow>
              )}
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

export default ClassRoutinesPage;
