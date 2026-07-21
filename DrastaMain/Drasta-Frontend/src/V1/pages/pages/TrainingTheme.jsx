import React, { useEffect, useState } from "react";
// import { Toast } from "@/components";
import Table from "../../../V1/componants/components/TrainingTheme/Table";
import FormModal from "../../componants/components/News/FormModal";
import axios from "axios";

const API_URL =import.meta.env.VITE_REACT_BASE_URL 


const TrainingTheme = () => {

  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchThemes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/traning-theme`);
      console.log("Fetched themes:", res.data);
      
      setThemes(res.data.themes || []);
    } catch (err) {
      // Toast.error("Failed to fetch training themes.");
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
      await axios.delete(`${API_URL}/traning-theme/${id}`);
      // Toast.success("Theme deleted successfully.");
      fetchThemes();
    } catch (err) {
      // Toast.error("Failed to delete theme.");
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await axios.put(`${API_URL}/traning-theme/${editData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // Toast.success("Theme updated successfully.");
      } else {
        await axios.post(`${API_URL}/traning-theme`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // Toast.success("Theme added successfully.");
      }
      setModalOpen(false);
      fetchThemes();
    } catch (err) {
      // Toast.error("Failed to save theme.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Training Themes</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Add Training Theme
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
};

export default TrainingTheme;