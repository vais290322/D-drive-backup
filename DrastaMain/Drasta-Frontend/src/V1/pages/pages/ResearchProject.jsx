import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import Table from "../../../V1/componants/components/ResearchProject/Table";
import FormModal from "../../componants/components/ResearchProject/FormModal";
import axios from "axios";
import { getResearchProject } from "../../config/config";

const API_URL = `${getResearchProject.researchProjectUrl}`;
 
const ResearchProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setProjects(res.data.projects || []);
    } catch (err) {
      // toast.error("Failed to fetch projects.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
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
      // toast.success("Project deleted successfully.");
      fetchProjects();
    } catch (err) {
      // toast.error("Failed to delete project.");
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await axios.put(`${API_URL}/${editData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // toast.success("Project updated successfully.");
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // toast.success("Project added successfully.");
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      // toast.error("Failed to save project.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Research Projects</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Add Project
        </button>
      </div>
      <Table
        data={projects}
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

export default ResearchProject;