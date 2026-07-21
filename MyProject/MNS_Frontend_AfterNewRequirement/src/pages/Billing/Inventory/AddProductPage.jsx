
import AddInventoryItem from "../../../component/InventoryManagement/AddInventoryItem"
import InventoryList from "../../../component/InventoryManagement/InventoryList"




const AddProductPage = () => {


  return (
    <>
   
  <AddInventoryItem/>
  <div className="mt-4">
 <InventoryList/>
 </div>
  </>

  )
}

export default AddProductPage







// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { v4 as uuidv4 } from "uuid";
// import PaginatedTable from "../../../component/Table/ProductTable";
// const addProductURL = import.meta.env.VITE_ADD_PRODUCT

// const ProductForm = () => {
//   const [product, setProduct] = useState({ id: uuidv4(), itemName: "", description: "" });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     let formErrors = {};
//     if (!product.itemName.trim()) {
//       formErrors.itemName = "Item Name is required";
//     }
//     if (!product.description.trim()) {
//       formErrors.description = "Description is required";
//     }
//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   const sendProductData = async (productData) => {
//     try {
//       setLoading(true);
//       const response = await fetch(addProductURL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           item_name: productData.itemName,
//           item_id: productData.id,
//           item_description: productData.description,
//         }),
//       });
//       const res = await response.json();
//       setLoading(false);
      
//       if (!res.success) {
//         toast.error(res.message);
//         return;
//       }
      
//       toast.success(res.message);
//     } catch (error) {
//       setLoading(false);
//       toast.error("Product data Server error");
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (validateForm()) {
//       await sendProductData(product);
//       setProduct({ id: uuidv4(), itemName: "", description: "" }); // Reset form after submit
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow-md rounded-lg w-full max-w-lg mx-auto">
//     {/* Item Name Field */}
//     <div>
//       <label className="block text-sm font-semibold text-gray-700">Item Name</label>
//       <input
//         type="text"
//         name="itemName"
//         value={product.itemName}
//         onChange={handleInputChange}
//         className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//         placeholder="Enter item name"
//       />
//       {errors.itemName && <p className="text-red-500 text-xs mt-1">{errors.itemName}</p>}
//     </div>
  
// //     {/* Description Field */}
//     <div>
//       <label className="block text-sm font-semibold text-gray-700">Description</label>
//       <textarea
//         name="description"
//         value={product.description}
//         onChange={handleInputChange}
//         className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//         placeholder="Enter description"
//         rows="4"
//       ></textarea>
//       {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
//     </div>
  
// //     {/* Submit Button */}
//     <div className="flex justify-center">
//       <button
//         type="submit"
//         className="flex items-center justify-center px-6 py-2 text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
//         disabled={loading}
//       >
//         {loading ? (
//           <>
//             <svg
//               className="animate-spin h-5 w-5 mr-2 text-white"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8z"></path>
//             </svg>
//             Submitting...
//           </>
//         ) : (
//           "Submit"
//         )}
//       </button>
//     </div>
//   </form>
//   );
// };


// const getAllProductsURL = import.meta.env.VITE_GET_ALL_PRODUCTS
// const updateProductsURL = import.meta.env.VITE_UPDATE_PRODUCT
// const deleteProductsURL = import.meta.env.VITE_DELETE_PRODUCT

// const AddProductPage = () => {
//   const [items, setItems] = useState([]);
//   const getAllProducts = async() => {
//     try {
//       const allProducts = await fetch(getAllProductsURL,{
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//       const res = await allProducts.json();
//       setItems(res?.data.reverse() || []);
//     } catch (error) {
//       toast.error("Server not connected");
//       console.log(error);
      
//     }
//   }

//   const deleteItem = async (id) => {
//     try {
//       const deleteProduct = await fetch(`${deleteProductsURL}/${id}`,{
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//       const res = await deleteProduct.json();
//       return res
//     } catch (error) {
//       toast.error("Server not connected");
//       console.log(error);
      
//     }
//   }

//   // Handle Delete
//   const handleDelete = async(id) => {
//     const deleted = await deleteItem(id);
//     console.log(deleted);
    
//     if (!deleted.success) {
//       toast.error(res?.message);
//       return;
//     }
//     setItems(items.filter((item) => item.item_id !== id));
//     toast.success(deleted?.message);
//   };

//   // Handle Update
//   const handleUpdate = (item) => {
//     alert(`Updating item: ${item.item_name}`);
//     // Logic for updating (open modal, update state, etc.)
//   };
//   useEffect(() => {
//     getAllProducts();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto mb-12">
//         <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-4">
//           <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
//             Product Management
//           </span>
//         </h1>
//         <p className="text-center text-gray-600 text-lg">
//           Add and manage products in your inventory
//         </p>
//       </div>
  
//       <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
//         <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Product</h2>
//         <ProductForm />
//       </div>
  
//       <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-gray-800">Product Inventory</h2>
//           <span className="text-sm text-gray-500">
//             {items.length} products in total
//           </span>
//         </div>
//         <div className="border-t border-gray-200 pt-6 ">
//           <PaginatedTable 
//             data={items} 
//             onUpdate={handleUpdate} 
//             onDelete={handleDelete}  
//             className="overflow-x-auto rounded-lg w-full"
//           />
//         </div>
//       </div>
//     </div>
//   </div>
//   )
// }

// export default AddProductPage