const url = "https://apibucket.vais.co.in/api/v1/user/files";

const apikey=import.meta.env.VITE_BUCKET_API_KEY;

const deleteImageFromBucket = async (fileId:string) => {
    try {

        const response = await fetch(`${url}/${fileId}`, {
            method: "DELETE",
            headers: {
                "X-API-Key": apikey
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

export {deleteImageFromBucket};
