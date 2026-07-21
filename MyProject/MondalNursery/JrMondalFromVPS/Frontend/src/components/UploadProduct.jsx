import React, { useEffect, useState } from 'react'
import { CgClose } from "react-icons/cg"
import { FaCloudUploadAlt } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'

import uploadImage from '../helpers/uploadImage'
import DisplayImage from './DisplayImage'
import SummaryApi from '../common'
import { setCategory } from '../store/categorySlice'
import deleteImageFromBucket from "../helpers/deleteImageFromvaisbucket"

const UploadProduct = ({ onClose, fetchData }) => {

  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  })

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState("")

  const allcategories = useSelector(state => state?.category?.categoryNames) || []
  const dispatch = useDispatch()

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const fetchCategory = async () => {
    try {
      const response = await fetch(SummaryApi.fetchCategory.url)
      const dataResponse = await response.json()

      if (response.ok) {
        dispatch(setCategory(dataResponse.categories))
      }
    } catch (error) {
      toast.error("Failed to load categories")
    }
  }

  useEffect(() => {
    fetchCategory()
  }, [])

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const res = await uploadImage(file)

      if (!res?.data?.fileUrl || !res?.data?.fileId) {
        throw new Error("Invalid upload response")
      }

      const imageObj = {
        fileId: res.data.fileId,
        url: res.data.fileUrl,
        uploadedAt: res.data.uploadedAt
      }

      setData(prev => ({
        ...prev,
        productImage: [...prev.productImage, imageObj]
      }))

      toast.success("Image uploaded")

    } catch (error) {
      console.error(error)
      toast.error("Image upload failed")
    }
  }

  const handleDeleteProductImageOld = (index) => {
    const updatedImages = [...data.productImage]
    updatedImages.splice(index, 1)

    setData(prev => ({
      ...prev,
      productImage: updatedImages
    }))
  }

  const handleDeleteProductImage = async (index) => {
  try {
    const imageToDelete = data.productImage[index];

    if (!imageToDelete?.fileId) {
      return toast.error("Invalid image");
    }

    // Call API to delete from bucket
    const res = await deleteImageFromBucket(imageToDelete.fileId);

    if (!res?.success) {
      return toast.error(res?.message || "Failed to delete image from server");
    }

    // Remove from UI only after successful delete
    const updatedImages = [...data.productImage];
    updatedImages.splice(index, 1);

    setData(prev => ({
      ...prev,
      productImage: updatedImages
    }));

    toast.success("Image deleted successfully");

  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Image delete failed");
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!data.productImage.length) {
      return toast.error("Please upload at least one image")
    }

    // console.log("data : ",data)
    // return;

    try {
      const response = await fetch(SummaryApi.uploadProduct.url, {
        method: SummaryApi.uploadProduct.method,
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const responseData = await response.json()

      if (responseData.success) {
        toast.success(responseData.message)
        onClose()
        fetchData()
      } else {
        toast.error(responseData.message || "Upload failed")
      }

    } catch (error) {
      toast.error("Server error while uploading product")
    }
  }

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>

        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Upload Product</h2>
          <div className='text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>

          <label>Product Name :</label>
          <input
            type='text'
            name='productName'
            value={data.productName}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label className='mt-3'>Brand Name :</label>
          <input
            type='text'
            name='brandName'
            value={data.brandName}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label className='mt-3'>Category :</label>
          <select
            required
            value={data.category}
            name='category'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
          >
            <option value="">Select Category</option>
            {allcategories.map((el, index) => (
              <option value={el} key={index}>{el}</option>
            ))}
          </select>

          <label className='mt-3'>Product Image :</label>
          <label htmlFor='uploadImageInput'>
            <div className='p-2 bg-slate-100 border rounded h-32 flex justify-center items-center cursor-pointer'>
              <div className='text-slate-500 flex flex-col items-center gap-2'>
                <span className='text-4xl'><FaCloudUploadAlt /></span>
                <p className='text-sm'>Upload Product Image</p>
                <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} />
              </div>
            </div>
          </label>

          <div className='flex items-center gap-2 mt-2'>
            {data.productImage.map((el, index) => (
              <div key={index} className='relative group'>
                <img
                  src={el.url}
                  alt={el.fileId}
                  width={80}
                  height={80}
                  className='bg-slate-100 border cursor-pointer'
                  onClick={() => {
                    setOpenFullScreenImage(true)
                    setFullScreenImage(el.url)
                  }}
                />

                <div
                  className='absolute bottom-0 right-0 p-1 text-white bg-green-600 rounded-full hidden group-hover:block cursor-pointer'
                  onClick={() => handleDeleteProductImage(index)}
                >
                  <MdDelete />
                </div>
              </div>
            ))}
          </div>

          <label className='mt-3'>Price :</label>
          <input
            type='number'
            name='price'
            value={data.price}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label className='mt-3'>Selling Price :</label>
          <input
            type='number'
            name='sellingPrice'
            value={data.sellingPrice}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label className='mt-3'>Description :</label>
          <textarea
            className='h-28 bg-slate-100 border resize-none p-1'
            name='description'
            value={data.description}
            onChange={handleOnChange}
          />

          <button className='px-3 py-2 bg-green-600 text-white mb-10 hover:bg-red-700'>
            Upload Product
          </button>
        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  )
}

export default UploadProduct
