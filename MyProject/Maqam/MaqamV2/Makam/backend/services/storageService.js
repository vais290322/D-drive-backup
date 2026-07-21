import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const API_KEY = process.env.VAIS_BUCKET_API_KEY;
const API_URL = process.env.VAIS_BUCKET_URL || 'https://apibucket.vais.co.in/api/v1/user';

if (!API_KEY) {
    console.warn('⚠️ VAIS_BUCKET_API_KEY is not set in .env');
}

/**
 * Upload file to VaisBucket
 */
export const uploadFile = async (filePath, visibility = 'public', folderId = null) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        form.append('visibility', visibility);

        if (folderId) {
            form.append('folderId', folderId);
        }

        const response = await axios.post(`${API_URL}/files/upload`, form, {
            headers: {
                ...form.getHeaders(),
                'X-API-Key': API_KEY,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        return response.data;
    } catch (error) {
        console.error('VaisBucket Upload Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
};

/**
 * Delete file from VaisBucket
 */
export const deleteFile = async (fileId) => {
    try {
        const response = await axios.delete(`${API_URL}/files/${fileId}`, {
            headers: {
                'X-API-Key': API_KEY,
            },
        });

        return response.data;
    } catch (error) {
        console.error('VaisBucket Delete Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete file');
    }
};
