const url = "https://apibucket.vais.co.in/api/v1/user/files/upload";

const apikey=import.meta.env.VITE_BUCKET_API_KEY;

const uploadImageForBankingCustomer = async (image:any) => {
    try {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("visibility", "public");
        formData.append("folderId", "69a294389a32c234a45cf8c5");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "X-API-Key": apikey
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

export {uploadImageForBankingCustomer};
