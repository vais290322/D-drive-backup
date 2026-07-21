const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME_CLOUDINARY}/image/upload`;

const uploadImage  = async(image) => {
    try {
        const formData = new FormData()
    formData.append("file",image)
    formData.append("upload_preset","Mondal_ecommerce")
    

    const dataResponse = await fetch(url,{
        method : "post",
        body : formData,
        
    })

    const result =  dataResponse.json()
    console.log('Upload response:', result); // Debug log
    return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default uploadImage 