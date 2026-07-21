import React, { useEffect, useState } from "react";
// import { Toast } from "@/components";
import Table from "../../../V1/componants/components/News/Table";
import FormModal from "../../../V1/componants/components/News/FormModal";
import axios from "axios";
import { getNews } from "@/V1/config/config";

const API_URL = `${getNews.newsUrl}`;

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setNews(res.data.news || []);
    } catch (err) {
      // Toast.error("Failed to fetch news.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
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
      // toast.success("News deleted successfully.");
      fetchNews();
    } catch (err) {
      // toast.error("Failed to delete news.");
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await axios.put(`${API_URL}/${editData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // Toast.success("News updated successfully.");
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // Toast.success("News added successfully.");
      }
      setModalOpen(false);
      fetchNews();
    } catch (err) {
      // Toast.error("Failed to save news.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">News</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Add News
        </button>
      </div>
      <Table
        data={news}
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

export default News;