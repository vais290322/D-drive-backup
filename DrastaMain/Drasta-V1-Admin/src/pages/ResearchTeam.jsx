import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Table from "../components/Researcher/Table";
import FormModal from "../components/Researcher/FormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { getAdvisor } from "../config/config";

const API = `${getAdvisor.advisorUrl}`;

const ResearchTeam = () => {
  const [advisors, setAdvisors] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchAdvisors = async () => {
    try {
      const res = await axios.get(API);
      setAdvisors(res.data.advisors);
    } catch (err) {
      toast.error("Failed to fetch advisors");
    }
  };

  const handleAdd = () => {
    setSelectedAdvisor(null);
    setShowForm(true);
  };

  const handleEdit = (advisor) => {
    setSelectedAdvisor(advisor);
    setShowForm(true);
  };

  const handleDelete = (advisor) => {
    setSelectedAdvisor(advisor);
    setShowDeleteConfirm(true);
  };

  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      if (selectedAdvisor?._id) {
        await axios.patch(`${API}/${selectedAdvisor._id}`, formData);
        toast.success("Expert updated successfully!");
      } else {
        await axios.post(API, formData);
        toast.success("Expert added successfully!");
      }

      fetchAdvisors();
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to submit form.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API}/${selectedAdvisor._id}`);
      toast.success("Expert deleted successfully!");
      fetchAdvisors();
    } catch (error) {
      toast.error("Failed to delete expert.");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    fetchAdvisors();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">Research Team</h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Research Team
        </button>
      </div>

      <Table
        advisors={advisors}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedAdvisor}
      />

      <ConfirmDeleteModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ResearchTeam;
