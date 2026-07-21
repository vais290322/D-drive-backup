import { createBlog } from "@/V2/app/features/blogs/blogsAsyncThunk";
import { BlogForm } from "@/V2/components/blog";
import { useToast } from "@/context/ToastContext";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export function CreateBlog() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      const created = await dispatch(createBlog(data)).unwrap();
      showToast("New blog created successfully!", "success");
      navigate(`/blog/${created.id}`);
    } catch (_) {
      showToast("Failed to create blog", "error");
    }
  };

    return (
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <BlogForm onSubmit={handleCreate} submitText="Publish Blog Post" />
      </div>
    );
}
