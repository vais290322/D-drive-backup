// const url = `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUD_NAME_CLOUDINARY}/image/upload`

// const url =`https://cors-anywhere.herokuapp.com/https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME_CLOUDINARY}/image/upload`

const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME_CLOUDINARY}/image/upload`;

const uploadImage  = async(image) => {
    const formData = new FormData()
    formData.append("file",image)
    formData.append("upload_preset","MERN-Ecommerce")
    

    const dataResponse = await fetch(url,{
        method : "post",
        body : formData,
        withcredentials : "false"
    })

    return dataResponse.json()

}

export default uploadImage 