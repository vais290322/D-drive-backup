import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../common/api';
import StudentForm from '../components/Students/StudentForm';
import StudentList from '../components/Students/StudentList';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  // New state variables for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/students');
      setStudents(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle student creation
  const handleCreateStudent = async (studentData) => {
    try {
      await api.post('/api/v1/students', studentData);
      toast.success('Student created successfully');
      fetchStudents();
      setIsFormOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create student');
    }
  };

  // Handle student update
  const handleUpdateStudent = async (id, studentData) => {
    try {
      await api.put(`/api/v1/students/${id}`, studentData);
      toast.success('Student updated successfully');
      fetchStudents();
      setIsFormOpen(false);
      setEditingStudent(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update student');
    }
  };

  // Handle student deletion
  const handleDeleteStudent = async (id) => {
    try {
      await api.delete(`/api/v1/students/${id}`);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete student');
    }
  };

  // Open form for editing
  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  // Search functionality
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter data based on search term
  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm?.toLowerCase();
    return (
      student.name?.toLowerCase().includes(searchLower) ||
      student.studentId?.toLowerCase().includes(searchLower) ||
      (student.parent && student.parent?.toLowerCase().includes(searchLower)) ||
      (student.phone && student.phone.toString().includes(searchTerm)) ||
      (student.email && student.email?.toLowerCase().includes(searchLower)) ||
      (student.rfid && student.rfid.toString().includes(searchTerm))
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <button
          onClick={() => {
            setEditingStudent(null);
            setIsFormOpen(!isFormOpen);
          }}
          className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isFormOpen ? 'Cancel' : 'Add New Student'}
        </button>
      </div>

      {isFormOpen && (
        <StudentForm
          onSubmit={editingStudent ? 
            (data) => handleUpdateStudent(editingStudent._id, data) : 
            handleCreateStudent}
          initialData={editingStudent}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingStudent(null);
          }}
        />
      )}

      {/* Search Box */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by name, Roll, parent, phone, email or RFID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <StudentList
        students={currentStudents}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteStudent}
        indexOfFirstItem={indexOfFirstItem}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        handleItemsPerPageChange={handleItemsPerPageChange}
        totalItems={filteredStudents.length}
      />
    </div>
  );
};

export default StudentsPage;