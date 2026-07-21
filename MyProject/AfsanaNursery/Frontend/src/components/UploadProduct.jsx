import React, { useEffect, useState } from 'react'
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt, FaLeaf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import SummaryApi from '../common/index';
import {toast} from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../store/categorySlice';

const UploadProduct = ({
    onClose,
    fetchData
}) => {
  const [data,setData] = useState({
    productName : "",
    brandName : "",
    category : "",
    productImage : [],
    description : "",
    // price : "",
    // sellingPrice : ""
  })
  const [openFullScreenImage,setOpenFullScreenImage] = useState(false)
  const [fullScreenImage,setFullScreenImage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const allcategories = useSelector(state => state?.category?.categoryNames) ||[];
  const dispatch = useDispatch();

  const handleOnChange = (e)=>{
      const { name, value} = e.target

      setData((preve)=>{
        return{
          ...preve,
          [name]  : value
        }
      })
  }

  const fetchCategory = async()=>{
    const response = await fetch(SummaryApi.fetchCategory.url)
    const dataResponse = await response.json()
    
    if(response){
      dispatch(setCategory(dataResponse.categories))
    }
  }

  useEffect(()=>{
    fetchCategory();
  },[]);

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const uploadImageCloudinary = await uploadImage(file);
      if (!uploadImageCloudinary?.url) {
        throw new Error("Image upload failed");
      }
      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, uploadImageCloudinary.url],
      }));
    } catch (error) {
      console.error("Error uploading product image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteProductImage = async(index)=>{
    const newProductImage = [...data.productImage]
    newProductImage.splice(index,1)

    setData((preve)=>{
      return{
        ...preve,
        productImage : [...newProductImage]
      }
    })
  }

  {/**upload product */}
  const handleSubmit = async(e) =>{
    e.preventDefault()
    
    const response = await fetch(SummaryApi.uploadProduct.url,{
      method : SummaryApi.uploadProduct.method,
      credentials : 'include',
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify(data)
    })

    const responseData = await response.json()

    if(responseData.success){
        toast.success(responseData?.message)
        onClose()
        fetchData()
    }

    if(responseData.error){
      toast.error(responseData?.message)
    }
  }

  return (
    <div className='fixed w-full h-full bg-black bg-opacity-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50'>
       <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
          {/* Header with pattern overlay */}
          <div className="bg-gradient-to-r from-green-800 via-yellow-700 to-green-800 text-white p-4 relative">
            <div className="absolute inset-0 opacity-10" 
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '20px'
                }}>
            </div>
            <div className='flex justify-between items-center relative z-10'>
                <div className="flex items-center">
                  <FaLeaf className="text-yellow-300 mr-2" />
                  <h2 className='font-bold text-xl'>Add New Product</h2>
                </div>
                <button 
                  className='text-white hover:text-yellow-200 transition-colors p-1 rounded-full hover:bg-green-700' 
                  onClick={onClose}
                >
                  <CgClose className="text-2xl" />
                </button>
            </div>
          </div>

          <form className='p-6 overflow-y-auto h-[calc(100%-64px)]' onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor='productName' className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type='text' 
                  id='productName' 
                  placeholder='Enter product name' 
                  name='productName'
                  value={data.productName} 
                  onChange={handleOnChange}
                  className='w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors'
                  required
                />
              </div>

              <div>
                <label htmlFor='brandName' className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                <input 
                  type='text' 
                  id='brandName' 
                  placeholder='Enter brand name' 
                  value={data.brandName} 
                  name='brandName'
                  onChange={handleOnChange}
                  className='w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors'
                  required
                />
              </div>

              <div>
                <label htmlFor='category' className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  required 
                  value={data.category} 
                  name='category' 
                  onChange={handleOnChange} 
                  className='w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors'
                >
                  <option value={""}>Select Category</option>
                  {
                    allcategories.map((el,index)=><option value={el} key={index}>{el}</option>)
                  }
                </select>
              </div>

              <div>
                <label htmlFor='productImage' className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                <label htmlFor='uploadImageInput'>
                  <div className='border-2 border-dashed border-green-300 rounded-lg h-36 w-full flex justify-center items-center cursor-pointer hover:border-yellow-500 transition-colors'>
                    <div className='text-green-600 flex justify-center items-center flex-col gap-2'>
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                      ) : (
                        <>
                          <span className='text-4xl'><FaCloudUploadAlt/></span>
                          <p className='text-sm font-medium'>Click to upload product image</p>
                          <p className='text-xs text-gray-500'>PNG, JPG or JPEG (max 5MB)</p>
                        </>
                      )}
                      <input 
                        type='file' 
                        id='uploadImageInput' 
                        className='hidden' 
                        onChange={handleUploadProduct}
                        accept="image/png, image/jpeg, image/jpg"
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                </label>
              </div>
              
              <div>
                {data?.productImage.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</p>
                    <div className='flex flex-wrap items-center gap-3'>
                      {data.productImage.map((el, index) => (
                        <div key={index} className='relative group rounded-lg overflow-hidden shadow-sm border border-gray-200'>
                          <img 
                            src={el} 
                            alt={`Product image ${index + 1}`} 
                            width={80} 
                            height={80}  
                            className='object-cover w-20 h-20 cursor-pointer'  
                            onClick={() => {
                              setOpenFullScreenImage(true)
                              setFullScreenImage(el)
                            }}
                          />
                          <div 
                            className='absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'
                          >
                            <button 
                              type="button"
                              className='p-1.5 text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors'
                              onClick={() => handleDeleteProductImage(index)}
                            >
                              <MdDelete size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {data.productImage.length === 0 && (
                  <p className='text-red-600 text-xs mt-1'>*Please upload at least one product image</p>
                )}
              </div>

              <div>
                <label htmlFor='description' className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className='w-full p-3 bg-gray-50 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors' 
                  placeholder='Enter product description' 
                  rows={4} 
                  onChange={handleOnChange} 
                  name='description'
                  value={data.description}
                  required
                >
                </textarea>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className='w-full py-3 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2'
                  disabled={data.productImage.length === 0 || isUploading}
                >
                  <FaLeaf size={16} />
                  Add Product
                </button>
              </div>
            </div>
          </form>
       </div>

       {/* Display image full screen */}
       {openFullScreenImage && (
         <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage}/>
       )}
    </div>
  )
}

export default UploadProduct