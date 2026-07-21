const url = "https://apibucket.vais.co.in/api/v1/user/files";

const deleteImageFromBucket = async (fileId) => {
    try {

        const response = await fetch(`${url}/${fileId}`, {
            method: "DELETE",
            headers: {
                "X-API-Key": "fup_ea141b5c_8c11ccecd93370abde903628d4738f927aabcd933b9068f763165c61de0bab2b"
            },
        });

        const result = await response.json();
        // console.log("Upload response:", result);
        return result;
    } catch (error) {
        console.error("Delete failed:", error);
        throw error;
    }
};

export default deleteImageFromBucket;
