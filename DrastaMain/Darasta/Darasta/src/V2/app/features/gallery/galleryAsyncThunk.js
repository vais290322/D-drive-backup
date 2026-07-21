import api from "@/V2/service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchGallery = createAsyncThunk(
  "gallery/fetchGallery",
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.append("size", "11"); // Default size
      if (params?.page && params?.page > 1) queryParams.append("page", (params.page - 1).toString());
      if (params?.category && params?.category !== "All") queryParams.append("category", params.category);
      if (params?.size && params?.size !== "All") queryParams.size = params.size.toString();

      const queryString = queryParams.toString();
      const endpoint = `/gallery${queryString ? `?${queryString}` : ""}`;

      const { data: { data } } = await api.get(endpoint);

      return data
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch gallery images";
      return rejectWithValue(msg);
    }
  }
);

export const deleteGalleryImages = createAsyncThunk(
  "gallery/deleteImages",
  async (imageIds, { rejectWithValue }) => {
    console.log(imageIds)
    try {
      await api.delete("/gallery/batch-delete", { data: imageIds });

      return imageIds;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to delete gallery images";
      return rejectWithValue(msg);
    }
  }
);

export const uploadGalleryImage = createAsyncThunk(
  "gallery/uploadImage",
  async (formData, { rejectWithValue }) => {
    try {
      const { data: { data } } = await api.post(`/gallery`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data; // return the uploaded image data
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to upload image";
      return rejectWithValue(msg);
    }
  }
);
