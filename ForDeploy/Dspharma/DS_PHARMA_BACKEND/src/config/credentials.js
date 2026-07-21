import dotenv from 'dotenv';

dotenv.config({
  quiet: true,
});

export const isProduction = process.env.NODE_ENV === 'production';

export const margApiBaseUrl = process.env.VITE_MARG_API_BASE_URL;
export const companyCode = process.env.VITE_COMPANY_CODE;
export const margId = process.env.VITE_MARG_ID;
export const margDecryptionKey = process.env.VITE_DECRYPTION_KEY;
export const mongoDbUri = process.env.MONGO_URI;
export const vaisBucketApiKey = process.env.VAIS_BUCKET_API_KEY;
export const vaisBucketFolderId = process.env.VAIS_BUCKET_FOLDER_ID;
export const backendBaseUrl = process.env.VITE_BACKEND_BASE_URL;

export const emailUser = process.env.EMAIL_USER;
export const emailPassword = process.env.EMAIL_PASSWORD;

export const adminId = process.env.ADMIN_ID;
export const adminUserId = process.env.ADMIN_USER_ID;
export const adminPassword = process.env.ADMIN_PASSWORD;

export const ecomSalesManId = process.env.ECOM_SALESMAN_ID;

export const companyDetails = {
  logo: 'http://apibucket.vais.co.in/uploads/users/697b2c970829419d7080fbdc/2026/02/1772189249697-c30ad7d9-cab5-456d-98d9-1be88a953077-Logo.png',
  name: 'DS Pharma',
  // email: 'dscommunication3@gmail.com',
  email: process.env.EMAIL_USER,
  address: 'Berachapa Haroa Road North 24 Pargana, 19-West Bengal',
  gstin: '',
  dlNo: '',
};

export const phonepeDetails = {
  clientId: Number(process.env.PHONEPE_CLIENT_ID),
  clientVersion: String(process.env.PHONEPE_CLIENT_VERSION),
  clientSecret: Number(process.env.PHONEPE_CLIENT_SECRET),
  env: process.env.PHONEPE_ENV,
  redirectUrl: process.env.MERCHANT_REDIRECT_URL,
};
