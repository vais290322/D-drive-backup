import fs from "fs";
import path from "path";
import os from "os";
import Customer from "./models/Customer.js";
import { uploadToVaisBucket } from "./utils/uploadToVaisBucket.js";

async function recoverImages() {
  const customers = await Customer.find();


  for (const customer of customers) {
    // console.log(typeof customer.photo_url);
    // console.log(customer);
    // console.log(customer.photo_url);
    // return;

    // Case 1: photo_url is still Base64 string
    if (typeof customer.photo_url === "string" && customer.photo_url.startsWith("data:image")) {

      const matches = customer.photo_url.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) continue;

      const extension = matches[1];
      const base64Data = matches[2];

      const tempFilePath = path.join(os.tmpdir(), `${customer._id}.${extension}`);
      fs.writeFileSync(tempFilePath, Buffer.from(base64Data, "base64"));

      try {
        const uploadRes = await uploadToVaisBucket(tempFilePath, "69a294389a32c234a45cf8c5");

        // Convert Base64 string → array of objects
        customer.photoUrl = [
          {
            fileUrl: uploadRes.fileUrl,
            fileId: uploadRes.fileId
          }
        ];

        await customer.save();
        console.log(`✅ Migrated ${customer._id}`);
      } catch (err) {
        console.error(`❌ Failed for ${customer._id}`, err.message);
      } finally {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      }
    }

    // Case 2: already migrated (array of objects) → skip
    else if (Array.isArray(customer.photoUrl) && customer.photoUrl.length > 0 && customer.photoUrl[0].fileUrl) {
      console.log(`⏩ Already migrated: ${customer._id}`);
      continue;
    }

    // Edge case: empty array → skip
    else if (Array.isArray(customer.photoUrl) && customer.photoUrl.length === 0) {
      continue;
    }
  }

  console.log("🚀 Migration completed");
}

