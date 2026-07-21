import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import Table from "../../componants/components/Trustee/Table";
import FormModal from "../../componants/components/Trustee/FormModal";
import axios from "axios";
import { getTrustee } from "../../config/config";

const API_URL = `${getTrustee.trusteeUrl}`;

const TrusteeTeam = () => {
  const [trustees, setTrustees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchTrustees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTrustees(res.data.data || []);
    } catch (err) {
      // toast.error("Failed to fetch trustees.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrustees();
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
      // toast.success("Trustee deleted successfully.");
      fetchTrustees();
    } catch (err) {
      // toast.error("Failed to delete trustee.");
      console.error(err);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editData) {
        await axios.put(`${API_URL}/${editData._id}`, data);
        // toast.success("Trustee updated successfully.");
      } else {
        await axios.post(API_URL, data);
        // toast.success("Trustee added successfully.");
      }
      setModalOpen(false);
      fetchTrustees();
    } catch (err) {
      // toast.error("Failed to save trustee.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Trustee Team</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Add Trustee
        </button>
      </div>
      <Table
        data={trustees}
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

export default TrusteeTeam;
