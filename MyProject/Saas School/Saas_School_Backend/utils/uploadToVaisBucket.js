import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

export async function uploadToVaisBucket(file, folderId = null) {
  try {
    // console.log("🚀 upload started");

    const form = new FormData();

    form.append("file", fs.createReadStream(file.path), {
      filename: file.originalname,
      contentType: file.mimetype
    });

    form.append("visibility", "public");

    if (folderId) {
      form.append("folderId", folderId);
    }

    // console.log("📡 Sending request...");

    const res = await axios.post(
      "https://apibucket.vais.co.in/api/v1/user/files/upload",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "X-API-Key": process.env.VAIS_BUCKET_API_KEY
        },
        timeout: 10000
      }
    );

    // console.log("✅ Response received:", res.data);

    return res.data.data;

  } catch (error) {
    // console.error("❌ Upload error:");
    // console.error("Message:", error.message);
    // console.error("Response:", error.response?.data);
    throw error;
  }
}