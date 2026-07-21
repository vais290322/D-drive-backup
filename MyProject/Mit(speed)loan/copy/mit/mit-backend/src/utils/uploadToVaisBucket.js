import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export async function uploadToVaisBucket(filePath, folderId = null) {

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("visibility", "public");

  // Optional folder
  if (folderId) {
    form.append("folderId", folderId);
  }

  const res = await axios.post(
    "https://apibucket.vais.co.in/api/v1/user/files/upload",
    form,
    {
      headers: {
        ...form.getHeaders(),
        "X-API-Key": process.env.VAIS_BUCKET_API_KEY
      }
    }
  );
  console.log("res.data.data", res.data.data);

  return res.data.data;
}

// usage
// await uploadToVaisBucket("/tmp/photo.png", "695ce180d810b1e51cc9");