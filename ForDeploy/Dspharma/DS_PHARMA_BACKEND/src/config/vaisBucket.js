import axios from "axios";
import { vaisBucketApiKey, vaisBucketFolderId } from "../config/credentials.js";
import FormData from "form-data";

const url = "https://apibucket.vais.co.in/api/v1/user/files/upload";

export const uploadImage = async (file) => {
  // console.log({ file });

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("visibility", "public");
    formData.append("folderId", vaisBucketFolderId);

    const response = await axios.post(url, formData, {
      headers: {
        "X-API-Key": vaisBucketApiKey,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("upload image response", response);
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error.response.data;
  }
};

export const deleteImageFromBucket = async (fileId) => {
  try {
    const response = await fetch(`${url}/${fileId}`, {
      method: "DELETE",
      headers: {
        "X-API-Key": vaisBucketApiKey,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};
