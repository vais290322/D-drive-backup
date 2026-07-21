// ExpertTeam.jsx (Main Page)
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ExpertTable from "../components/Expert/ExpertTable";
import ExpertFormModal from "../components/Expert/ExpertFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { getExpert } from "../config/config";

const ExpertTeam = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchExperts = async () => {
    try {
      const res = await axios.get(`${getExpert.expertUrl}`);
      setExperts(res.data.experts);
    } catch (err) {
      toast.error("Failed to fetch experts.");
      console.error("Error fetching experts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEdit = async (formData, isEdit) => {
    try {
      const url = `${getExpert.expertUrl}`;
      await axios.post(url, formData);
      toast.success(isEdit ? "Expert updated successfully!" : "Expert added successfully!");
      setShowFormModal(false);
      setEditData(null);
      fetchExperts();
    } catch (err) {
      toast.error("Failed to submit expert data.");
      console.error("Error submitting expert data", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${getExpert.expertUrl}/${deleteId}`);
      toast.success("Expert data deleted successfully!");
      setDeleteId(null);
      fetchExperts();
    } catch (err) {
      toast.error("Failed to delete expert data.");
      console.error("Error deleting expert data", err);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Expert Team</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setShowFormModal(true)}
        >
          Add Expert Team
        </button>
      </div>

      <ExpertTable
        data={experts}
        loading={loading}
        onEdit={(data) => {
          setEditData(data);
          setShowFormModal(true);
        }}
        onDelete={(id) => setDeleteId(id)}
      />

      <ExpertFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditData(null);
        }}
        onSubmit={handleAddOrEdit}
        initialData={editData}
      />

      <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ExpertTeam;
