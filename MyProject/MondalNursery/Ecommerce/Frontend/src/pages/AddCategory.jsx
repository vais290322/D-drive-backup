import React, { useState } from 'react'
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../store/categorySlice';

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const dispatch = useDispatch();
    const categoryNames = useSelector(state => state?.category?.categoryNames) 
    const allcategories = useSelector(state => state?.category?.category)
    // console.log(categoryNames);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!categoryName.trim()) {
        toast.error("Category name cannot be empty");
        return;
      }
  
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
  
        if (response.ok) {
          toast.success("Category added successfully");
          setCategories((prev) => [...prev, data.newCategory]);
          dispatch(setCategory(data?.newCategory));

          setCategoryName("");
        } else {
          toast.error(data.message || "Failed to add category");
        }
      } catch (error) {
        console.error("Error adding category:", error);
        toast.error("Something went wrong. Please try again.");
      }
    };
  
  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md mt-10">
    <h2 className="text-xl font-bold mb-4">Add Category</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="categoryName" className="block text-sm font-medium">
          Category Name
        </label>
        <input
          type="text"
          id="categoryName"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
          className="mt-1 block w-full p-2 border rounded-md shadow-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Add Category
      </button>
    </form>

    {categories.length > 0 && (
      <div className="mt-6">
        <h3 className="text-lg font-medium">Categories</h3>
        <ul className="list-disc list-inside mt-2">
          {categories?.map((category, index) => (
            <li key={index}>{category.name}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
  )
}

export default AddCategory