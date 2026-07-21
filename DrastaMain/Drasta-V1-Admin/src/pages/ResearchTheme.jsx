import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Table from "../components/ResearchTheme/Table";
import FormModal from "../components/ResearchTheme/FormModal";
import axios from "axios";
import { getResearchTheme } from "../config/config";

const API_URL = `${getResearchTheme.researchThemeUrl}`;

function Researchtheme() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchThemes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setThemes(res.data.themes || []);
    } catch (err) {
      toast.error("Failed to fetch research themes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
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
      toast.success("Theme deleted successfully.");
      fetchThemes();
    } catch (err) {
      toast.error("Failed to delete theme.");
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await axios.put(`${API_URL}/${editData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Theme updated successfully.");
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Theme added successfully.");
      }
      setModalOpen(false);
      fetchThemes();
    } catch (err) {
      toast.error("Failed to save theme.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Research Themes</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Add Research Theme
        </button>
      </div>
      <Table
        data={themes}
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
}

export default Researchtheme;