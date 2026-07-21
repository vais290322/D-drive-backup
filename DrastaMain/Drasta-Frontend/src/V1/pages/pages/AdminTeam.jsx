import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import Table from "../../componants/components/AdminTeam/Table";
import FormModal from "../../componants/components/AdminTeam/FormModal";
import axios from "axios";
import { getAdmin } from "../../config/config";

const API_URL = `${getAdmin.adminUrl}`;

const AdminTeam = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setAdmins(res.data.admins || []);
    } catch (err) {
      // toast.error("Failed to fetch admins.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      // toast.success("Admin deleted successfully.");
      fetchAdmins();
    } catch (err) {
      // toast.error("Failed to delete admin.");
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await axios.put(`${API_URL}/${editData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // toast.success("Admin updated successfully.");
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // toast.success("Admin added successfully.");
      }
      setModalOpen(false);
      fetchAdmins();
    } catch (err) {
      toast.error("Failed to save admin.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Team</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Add Admin
        </button>
      </div>
      <Table
        data={admins}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
      />
    </div>
  );
};

export default AdminTeam;