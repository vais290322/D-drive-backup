import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import Table from "../../componants/components/SuperAdvisor/Table";
import FormModal from "../../componants/components/SuperAdvisor/FormModal";
import axios from "axios";
import { getSuperAdvisor } from "../../config/config";

const API_URL = `${getSuperAdvisor.superAdvisorUrl}`;

const AdvisorTeam = () => {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchAdvisors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setAdvisors(res.data.superAdvisors || []);
    } catch (err) {
      // toast.error("Failed to fetch advisors.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisors();
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
      // toast.success("Advisor deleted successfully.");
      fetchAdvisors();
    } catch (err) {
      // toast.error("Failed to delete advisor.");
      console.error(err);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editData) {
        await axios.put(`${API_URL}/${editData._id}`, data);
        // toast.success("Advisor updated successfully.");
      } else {
        await axios.post(API_URL, data);
        // toast.success("Advisor added successfully.");
      }
      setModalOpen(false);
      fetchAdvisors();
    } catch (err) {
      // toast.error("Failed to save advisor.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl mb-5 font-bold">Advisor Team</h2>
   

        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Add Advisor
        </button>
        
      </div>
      <Table
        data={advisors}
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

export default AdvisorTeam;
