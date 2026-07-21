import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Table from "../components/Intern/Table";
import FormModal from "../components/Intern/FormModal";
import axios from "axios";
import { getIntern } from "../config/config";

const API_URL = `${getIntern.internUrl}`;

const InternTeam = () => {
  const [interns, setInterns] = useState([]);
  console.log("Interns:", interns);
  
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchInterns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      console.log("Fetched interns:", res.data.data.years);
      
      const allInterns = (res.data.data.years || []).flatMap(y =>
        y.interns.map(i => ({ ...i, year: y.year }))
      );
      console.log("All interns:", allInterns);
      
      setInterns(allInterns);
    } catch (err) {
      toast.error("Failed to fetch interns.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setModalOpen(true);
  };

  const handleDelete = async (id, year) => {
    try {
await axios.delete(`${API_URL}/${year}/${id}`);
      toast.success("Intern deleted successfully.");
      fetchInterns();
    } catch (err) {
      toast.error("Failed to delete intern.");
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await axios.put(
          `${API_URL}/${editData.year}/${editData._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Intern updated successfully.");
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Intern added successfully.");
      }
      setModalOpen(false);
      fetchInterns();
    } catch (err) {
      toast.error("Failed to save intern.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Intern Team</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Add Intern
        </button>
      </div>
      <Table
        data={interns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={(id, year) => handleDelete(id, year)}
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

export default InternTeam;