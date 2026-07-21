const url = "https://apibucket.vais.co.in/api/v1/user/files/upload";

const uploadImage = async (image) => {
    try {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("visibility", "public");
        formData.append("folderId", "69719d10a0c97161d4583d6f");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "X-API-Key": "fup_ea141b5c_8c11ccecd93370abde903628d4738f927aabcd933b9068f763165c61de0bab2b"
            },
            body: formData,
        });

        const result = await response.json();
        // console.log("Upload response:", result);
        return result;
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
};

export default uploadImage;
