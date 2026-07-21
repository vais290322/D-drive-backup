const imageTobase64 = async (image) => {
    const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        
        reader.readAsDataURL(image);
    });

    return data;
}

export default imageTobase64;