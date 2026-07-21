import React, { useState, useEffect } from 'react';
import RfidScannerComponent from '../components/RfidScanner/RfidScannerComponent';
import api from '../common/api';
import { toast } from 'sonner';

const DashboardPage = () => {
  const [attendanceStats, setAttendanceStats] = useState({
    totalStudents: 0,
    presentCount: 0,
    absentCount: 0,
    totalTeachers: 0,
    presentTeachersCount: 0,
    absentTeachersCount: 0,
    date: new Date().toLocaleDateString()
  });
  const [loading, setLoading] = useState(true);
  const [recentAttendance, setRecentAttendance] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [allAttendanceRecords, setAllAttendanceRecords] = useState([]);

  // console.log("recentAttendance : ", recentAttendance)

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/attendance/today');
      const data = response.data.data;

      // console.log("absent teacher ", data.absentTeachersCount);

      setAttendanceStats({
        totalStudents: data.totalStudents,
        presentCount: data.presentCount,
        absentCount: data.absentCount,
        totalTeachers: data.totalTeachers,
        presentTeachersCount: data.presentTeachersCount,
        absentTeachersCount: data.absentTeachersCount,
        date: new Date(data.date).toLocaleDateString()
      });

      // Store all attendance records
      setAllAttendanceRecords(data.margedRecords);
      // Get the paginated records
      setRecentAttendance(data.margedRecords);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = recentAttendance.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(recentAttendance.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // console.log("absent teacher ", attendanceStats.absentTeachersCount);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - RFID Scanner */}
        <div>
          <RfidScannerComponent onScanComplete={fetchTodayAttendance} />
        </div>

        {/* Right column - Statistics */}
        <div className="space-y-6">
          {/* Attendance Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Attendance</h2>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-gray-500 mb-4">{attendanceStats.date}</div>

                <div className="grid grid-cols-3 gap-4 mb-6">

                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    {/* Header */}
                    <h1 className="text-lg font-semibold text-blue-600 mb-3">Total</h1>

                    {/* Content */}
                    <div className="flex items-center justify-center gap-2">
                      {/* Students */}
                      <div>
                        <div className="text-3xl font-bold text-blue-600">
                          {attendanceStats.totalStudents}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Students</div>
                      </div>

                      {/* Vertical Divider */}
                      <div className="w-[2px] h-12 bg-blue-300"></div>

                      {/* Teachers */}
                      <div>
                        <div className="text-3xl font-bold text-blue-600">
                          {attendanceStats.totalTeachers }
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Teachers</div>
                      </div>

                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    {/* Header */}
                    <h1 className="text-lg font-semibold text-green-600 mb-3">Present</h1>

                    {/* Content */}
                    <div className="flex items-center justify-center gap-2">

                      {/* Student Present */}
                      <div>
                        <div className="text-3xl font-bold text-green-600">
                          {attendanceStats.presentCount}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Students</div>
                      </div>

                      {/* Vertical Divider */}
                      <div className="w-[2px] h-12 bg-green-300"></div>

                      {/* Teacher Present Static */}
                      <div>
                        <div className="text-3xl font-bold text-green-600">
                          {attendanceStats.presentTeachersCount}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Teachers</div>
                      </div>

                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    {/* Header */}
                    <h1 className="text-lg font-semibold text-red-600 mb-3">Absent</h1>

                    {/* Content */}
                    <div className="flex items-center justify-center gap-2">

                      {/* Student Absent */}
                      <div>
                        <div className="text-3xl font-bold text-red-600">
                          {attendanceStats.absentCount}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Students</div>
                      </div>

                      {/* Vertical Divider */}
                      <div className="w-[2px] h-12 bg-red-300"></div>

                      {/* Teacher Absent Static */}
                      <div>
                        <div className="text-3xl font-bold text-red-600">
                          {attendanceStats.absentTeachersCount}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Teachers</div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Attendance Rate */}
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-sky-600">Student's Attendance Rate</span>
                  <span className="text-sm font-medium">
                    {attendanceStats.totalStudents > 0
                      ? Math.round((attendanceStats.presentCount / attendanceStats.totalStudents) * 100)
                      : 0}%
                  </span>
                </div>

                {/* Attendance Rate Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${attendanceStats.totalStudents > 0
                        ? Math.round((attendanceStats.presentCount / attendanceStats.totalStudents) * 100)
                        : 0}%`
                    }}
                  ></div>
                </div>


                {/* Teacher Attendance Rate */}
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-lime-600 ">Teacher's Attendance Rate</span>
                  <span className="text-sm font-medium">
                    {attendanceStats.totalTeachers > 0
                      ? Math.round((attendanceStats.presentTeachersCount / attendanceStats.totalTeachers) * 100)
                      : 0}%
                  </span>
                </div>

                {/* Attendance Rate Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: `${attendanceStats.totalTeachers > 0
                        ? Math.round((attendanceStats.presentTeachersCount / attendanceStats.totalTeachers) * 100)
                        : 0}%`
                    }}
                  ></div>
                </div>

              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : recentAttendance.length > 0 ? (
              <>
                {/* Items per page selector */}
                <div className="flex justify-between items-center mb-4 text-sm">
                  <div>
                    <label htmlFor="itemsPerPage" className="mr-2">Show</label>
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border rounded px-2 py-1"
                    >
                      {/* <option value="1">1</option> */}
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                    </select>
                    <span className="ml-2">entries</span>
                  </div>
                  <div>
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, recentAttendance.length)} of {recentAttendance.length} entries
                  </div>
                </div>

                <div className="space-y-3">
                  {currentItems.map((record, index) => (
                    <div key={record._id} className="flex items-center p-3 border-b border-gray-100 last:border-0">
                      <div className="w-8 text-center text-gray-500 font-medium">
                        {indexOfFirstItem + index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium flex gap-10"> <p> {record.student?.name || record?.teacher?.name || record?.name}</p> <p className={` ${record?.student ? "text-sky-600" : "text-lime-600"} `}>{record?.student ? "Student" : "Teacher"} </p> </div>
                        <div className="text-sm text-gray-500">
                          {record.checkIn ? `Check-in: ${new Date(record.checkIn).toLocaleTimeString()}` : 'Not checked in'}
                          {record.checkOut ? ` | Check-out: ${new Date(record.checkOut).toLocaleTimeString()}` : ''}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${record.status === 'present' ? 'bg-green-100 text-green-800' : record.status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <nav className="flex items-center space-x-1">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 cursor-pointer rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                      >
                        Previous
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        // Show limited page numbers with ellipsis
                        const pageNum = index + 1;
                        const showPageNumbers = pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                        if (showPageNumbers) {
                          return (
                            <button
                              key={index}
                              onClick={() => paginate(pageNum)}
                              className={`px-3 py-1 cursor-pointer rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                          return <span key={index} className="px-1">...</span>;
                        }
                        return null;
                      })}

                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 cursor-pointer rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No attendance records for today
              </div>
            )}

            <div className="mt-4 text-center">
              <a href="/reports" className="text-blue-600 hover:underline text-sm font-medium">
                View Full Report →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;