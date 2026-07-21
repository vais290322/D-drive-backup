import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../common/api';
import TeacherForm from '../components/Teachers/TeacherForm';
import TeacherList from '../components/Teachers/TeacherList';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/teachers');
      setTeachers(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreateTeacher = async (data) => {
    try {
      setLoading(true);
      await api.post('/api/v1/teachers', data);
      toast.success('Teacher created successfully'); 
      fetchTeachers();
      setIsFormOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeacher = async (id, data) => {
    try {
      setLoading(true);
      await api.put(`/api/v1/teachers/${id}`, data);
      toast.success('Teacher updated successfully');
      fetchTeachers();
      setIsFormOpen(false);
      setEditingTeacher(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/api/v1/teachers/${id}`);
      toast.success('Teacher deleted successfully');
      fetchTeachers();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete teacher');
    }
    finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setIsFormOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTeachers = teachers.filter((t) => {
    const s = searchTerm.toLowerCase();
    return (
      (t.name || '').toLowerCase().includes(s) ||
      (t.employeeId || '').toLowerCase().includes(s) ||
      (t.email || '').toLowerCase().includes(s) ||
      (t.phone && t.phone.toString().includes(searchTerm)) ||
      (t.rfid && t.rfid.toString().includes(searchTerm)) ||
      (t.subjects || '').toLowerCase().includes(s)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const paginate = (page) => setCurrentPage(page);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teacher Management</h1>
        <button
          onClick={() => {
            setEditingTeacher(null);
            setIsFormOpen(!isFormOpen);
          }}
          className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isFormOpen ? 'Cancel' : 'Add New Teacher'}
        </button>
      </div>

      {isFormOpen && (
        <TeacherForm
          onSubmit={editingTeacher ? (data) => handleUpdateTeacher(editingTeacher._id, data) : handleCreateTeacher}
          initialData={editingTeacher}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingTeacher(null);
          }}
          loading={loading}
        />
      )}

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by name, employee ID, email, phone, subjects or RFID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <TeacherList
        teachers={currentTeachers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteTeacher}
        indexOfFirstItem={indexOfFirstItem}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        handleItemsPerPageChange={handleItemsPerPageChange}
        totalItems={filteredTeachers.length}
       
      />
    </div>
  );
};

export default TeachersPage;