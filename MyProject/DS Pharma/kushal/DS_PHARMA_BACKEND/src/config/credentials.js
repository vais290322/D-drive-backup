import dotenv from "dotenv";

dotenv.config();

export const margApiBaseUrl = process.env.VITE_MARG_API_BASE_URL;
export const companyCode = process.env.VITE_COMPANY_CODE;
export const margId = process.env.VITE_MARG_ID;
export const margDecryptionKey = process.env.VITE_DECRYPTION_KEY;
export const mongoDbUri = process.env.MONGO_URI;
export const vaisBucketApiKey = process.env.VAIS_BUCKET_API_KEY;
export const vaisBucketFolderId = process.env.VAIS_BUCKET_FOLDER_ID;
export const backendBaseUrl = process.env.VITE_BACKEND_BASE_URL;


