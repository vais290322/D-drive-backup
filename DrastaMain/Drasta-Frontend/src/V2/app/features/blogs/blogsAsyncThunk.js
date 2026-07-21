import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/V2/service";

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async ({ page = 0, size = 6, append = false, publish = "true" } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/blogs?publish=${publish}`, { params: { page, size } });

      return {
        ...data.data,
        append,
      };
    } catch (error) {
      const msg =
        error?.response?.data?.message || error.message || "Failed to fetch blogs";
      return rejectWithValue(msg);
    }
  }
);

export const fetchPopularBlogs = createAsyncThunk(
  "blogs/fetchPopularBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/blogs/popular");
      return data.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch popular blogs";
      return rejectWithValue(msg);
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (id, { rejectWithValue }) => {
    try {
      const {
        data: { data },
      } = await api.get(`/blogs/${id}`);
      return data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch blog";
      return rejectWithValue(msg);
    }
  }
);

export const createBlog = createAsyncThunk(
  "blogs/create",
  async (blog, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/blogs/upload", blog);
      return data.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to create blog";
      return rejectWithValue(msg);
    }
  }
);

export const editBlog = createAsyncThunk(
  "blogs/edit",
  async ({ id, blogData }, { rejectWithValue }) => {
    console.log("blog data", blogData);
    try {
      const { data } = await api.put(`/blogs/${id}`, blogData);
      return data.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to Update blog";
      return rejectWithValue(msg);
    }
  }
);

export const searchSidebarBlogs = createAsyncThunk(
  "blogs/search",
  async (query, { rejectWithValue }) => {
    try {
      const { data: { data } } = await api.get(`/blogs/search`, {
        params: { title: query },
      });
      return data; // Assuming data.data is an array of blogs
    } catch (error) {
      const msg =
        error?.response?.data?.message || error.message || "Search failed";
      return rejectWithValue(msg);
    }
  }
);

export const searchBlog = createAsyncThunk();
