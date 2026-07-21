import axios from "axios";


export const deleteFromVaisBucket = async (fileId) => {
    try {
        const response = await axios.delete(`https://apibucket.vais.co.in/api/v1/user/files/${fileId}`, {
            headers: {
                "X-API-Key": process.env.VAIS_BUCKET_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting file from Vais bucket:", error);
        throw error;
    }
};
