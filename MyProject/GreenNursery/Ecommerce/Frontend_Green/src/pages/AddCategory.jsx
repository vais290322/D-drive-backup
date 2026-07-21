import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../store/categorySlice';
import { FaLeaf, FaPlus, FaTags, FaListAlt } from 'react-icons/fa';

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
  
    // console.log(categoryNames);
    const [allcategories, setAllcategories] = useState([]);

    // console.log('allcategories',allcategories)
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!categoryName.trim()) {
        toast.error("Category name cannot be empty");
        return;
      }
  
      setIsLoading(true);
      try {
        // Simulating an API call to add a category
        const response = await fetch(`${SummaryApi.addCategory.url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: categoryName }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          toast.success("Category added successfully");
          setCategories((prev) => [...prev, data.newCategory]);
          dispatch(setCategory(data?.newCategory));
          fetchCategories(); // Refresh the categories list
          setCategoryName("");
        } else {
          toast.error(data.message || "Failed to add category");
        }
      } catch (error) {
        console.error("Error adding category:", error);
        // toast.error("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${SummaryApi.fetchCategory.url}`);
        const data = await response.json(); 
        if (response.ok) {
          setAllcategories(data.categories);
          // dispatch(setCategory(data?.categories)); 
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    useEffect(() => {
      fetchCategories();
    }, []);
  
  return (
    <div>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-2xl font-bold text-emerald-800 flex items-center'>
            <FaListAlt className="mr-2 text-emerald-600" />
            Category Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Create and manage product categories
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Category Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center">
            <FaPlus className="mr-2 text-emerald-600" size={18} />
            Add New Category
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaPlus size={14} />
                  Add Category
                </>
              )}
            </button>
          </form>
          
          {/* Recently Added Categories */}
          {categories.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <FaTags className="mr-2 text-emerald-600" size={14} />
                Recently Added
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories?.map((category, index) => (
                  <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm flex items-center">
                    <FaLeaf className="mr-1 text-emerald-600" size={10} />
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* All Categories Display */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center">
            <FaTags className="mr-2 text-emerald-600" size={18} />
            All Categories
          </h2>
          
          {allcategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2">
              {allcategories.map((category, index) => (
                <div 
                  key={category._id || index} 
                  className="bg-emerald-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-emerald-100"
                >
                  <div className="flex items-center mb-2">
                    <FaLeaf className="text-emerald-600 mr-2" size={14} />
                    <h3 className="font-medium text-emerald-800">{category.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-lg p-8 text-center border border-emerald-100">
              <div className="text-emerald-600 text-5xl mb-4 flex justify-center">
                <FaTags />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No Categories Found</h3>
              <p className="text-gray-600 mb-6">
                You haven't added any product categories yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddCategory