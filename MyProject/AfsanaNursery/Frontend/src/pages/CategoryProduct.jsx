import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common/index';
import { useSelector } from 'react-redux';
import { setCategory } from '../store/categorySlice';
import { FaFilter, FaTimes, FaLeaf } from 'react-icons/fa';

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");
  const subcategory = urlSearch.get("subcategory");
  
  const [productCategory, setProductCategory] = useState([]);

  const urlCategoryListObject = {};
  urlCategoryListinArray.forEach(el => {
    urlCategoryListObject[el] = true;
  });

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.filterProduct.url, {
      method: SummaryApi.filterProduct.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        category: filterCategoryList
      })
    });

    const dataResponse = await response.json();
    const responseData = dataResponse?.data || [];
    setData(responseData);
    
    // Apply subcategory filtering if needed - client-side filtering
    if (subcategory && urlCategoryListinArray.includes("Mango Veriety")) {
      let filtered = responseData.filter(product => product.category === "Mango Veriety");
      
      if (subcategory === "thai") {
        filtered = filtered.filter(product => 
          product.productName.toLowerCase().includes('thai')
        );
      } else if (subcategory === "indian") {
        filtered = filtered.filter(product => 
          !product.productName.toLowerCase().includes('thai')
        );
      }
      setFilteredData(filtered || []);
    } else {
      setFilteredData(responseData);
    }
    
    setLoading(false);
  };

  const handleSelectCategory = (e) => {
    const { name, value, checked } = e.target;

    setSelectCategory((prev) => {
      return {
        ...prev,
        [value]: checked
      };
    });
  };

  const fetchCategory = async()=>{
    const response = await fetch(SummaryApi.fetchCategory.url)
    const dataResponse = await response.json()
    
    if(response){
      setProductCategory(dataResponse.categories)
    }
  }

  useEffect(() => {
    fetchData();
  }, [filterCategoryList, subcategory]);

  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName => {
      if (selectCategory[categoryKeyName]) {
        return categoryKeyName;
      }
      return null;
    }).filter(el => el);

    setFilterCategoryList(arrayOfCategory);

    // Format for URL change when checkbox changes
    const urlFormat = arrayOfCategory.map((el, index) => {
      if ((arrayOfCategory.length - 1) === index) {
        return `category=${el}`;
      }
      return `category=${el}&&`;
    });

    // Preserve subcategory parameter if it exists and Mango Variety is selected
    let url = "/product-category?" + urlFormat.join("");
    if (subcategory && arrayOfCategory.includes("Mango Veriety")) {
      url += `&subcategory=${subcategory}`;
    }

    navigate(url, { replace: true });
  }, [selectCategory]);

  useEffect(() => {
    fetchCategory();
  }, [])

  const toggleFilters = () => {
    setShowFilters(prevState => !prevState);
  };

  return (
    <div className='bg-gradient-to-b from-green-50 to-white min-h-screen'>
      <div className='container mx-auto p-4 my-8'>
        <div className="flex items-center mb-6">
          <FaLeaf className="text-green-600 mr-3 text-2xl" />
          <h1 className='text-3xl font-bold text-green-800 border-b-2 border-yellow-500 pb-2 inline-block'>
            Product Categories
          </h1>
        </div>
        
        {/* Desktop version */}
        <div className='hidden lg:grid grid-cols-[250px,1fr] gap-6'>
          {/* Left side - Filters */}
          <div className='bg-white p-6 rounded-lg shadow-md h-fit sticky top-24 border border-green-100'>
            <h3 className='text-lg font-semibold text-green-700 border-b-2 border-green-100 pb-2 mb-4'>Categories</h3>
            <form className='text-sm flex flex-col gap-3 py-2'>
              {productCategory.map((categoryName, index) => (
                <div key={index} className='flex items-center gap-3 hover:bg-gradient-to-br hover:from-green-50 hover:to-yellow-50 p-2 rounded-md transition-colors'>
                  <input 
                    type='checkbox' 
                    name={"category"} 
                    checked={selectCategory[categoryName?.name]} 
                    value={categoryName?.name} 
                    id={categoryName?.name} 
                    onChange={handleSelectCategory}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor={categoryName?.name} className="text-gray-700 cursor-pointer w-full">{categoryName?.name}</label>
                </div>
              ))}
            </form>
            
            {filterCategoryList.length > 0 && (
              <div className="mt-4 pt-4 border-t border-green-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  <button 
                    onClick={() => setSelectCategory({})} 
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {filterCategoryList.map((cat, index) => (
                    <span key={index} className="bg-gradient-to-br from-green-100 to-yellow-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      {cat}
                      <button 
                        onClick={() => setSelectCategory(prev => ({...prev, [cat]: false}))}
                        className="ml-1 text-green-700 hover:text-green-900"
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right side - Products */}
          <div className=''>
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-green-100">
              {/* Add subcategory title if applicable */}
              {subcategory && urlCategoryListinArray.includes("Mango Veriety") ? (
                <div className="flex flex-col">
                  <p className='font-medium text-gray-700'>
                    <span className="text-green-700 font-bold">{filteredData.length}</span> products found in 
                    <span className="font-semibold"> {subcategory === "thai" ? "Thai" : "Indian"} Mango Veriety</span>
                  </p>
                </div>
              ) : (
                <p className='font-medium text-gray-700'>
                  <span className="text-green-700 font-bold">{filteredData.length}</span> products found
                  {filterCategoryList.length > 0 && ` in ${filterCategoryList.length} ${filterCategoryList.length === 1 ? 'category' : 'categories'}`}
                </p>
              )}
            </div>
            
            <div className='min-h-[calc(100vh-250px)]'>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
              ) : filteredData.length !== 0 ? (
                <VerticalCard data={filteredData} loading={false} />
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-green-100">
                  <div className="text-green-600 text-5xl mb-4 flex justify-center">
                    <FaLeaf />
                  </div>
                  <p className="text-gray-700 text-lg mb-2 font-medium">No products found</p>
                  <p className="text-gray-500">Try selecting different categories</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile version */}
        <div className='lg:hidden'>
          <button 
            onClick={toggleFilters} 
            className='w-full bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white p-3 mb-4 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors'
          >
            {showFilters ? <FaTimes /> : <FaFilter />}
            {showFilters ? 'Close Filters' : 'Show Filters'}
          </button>
          
          {showFilters && (
            <div className='bg-white p-4 rounded-lg shadow-md mb-4 border border-green-100'>
              <h3 className='text-lg font-semibold text-green-700 border-b-2 border-green-100 pb-2 mb-4'>Categories</h3>
              <form className='text-sm flex flex-col gap-3 py-2'>
                {productCategory.map((categoryName, index) => (
                  <div key={index} className='flex items-center gap-3 hover:bg-gradient-to-br hover:from-green-50 hover:to-yellow-50 p-2 rounded-md transition-colors'>
                    <input 
                      type='checkbox' 
                      name={"category"} 
                      checked={selectCategory[categoryName?.name]} 
                      value={categoryName?.name} 
                      id={`mobile-${categoryName?.name}`} 
                      onChange={handleSelectCategory}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor={`mobile-${categoryName?.name}`} className="text-gray-700 cursor-pointer w-full">{categoryName?.name}</label>
                  </div>
                ))}
              </form>
              
              {filterCategoryList.length > 0 && (
                <div className="mt-4 pt-4 border-t border-green-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Active filters:</span>
                    <button 
                      onClick={() => setSelectCategory({})} 
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filterCategoryList.map((cat, index) => (
                      <span key={index} className="bg-gradient-to-br from-green-100 to-yellow-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                        {cat}
                        <button 
                          onClick={() => setSelectCategory(prev => ({...prev, [cat]: false}))}
                          className="ml-1 text-green-700 hover:text-green-900"
                        >
                          <FaTimes size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Products */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-green-100">
            {subcategory && urlCategoryListinArray.includes("Mango Veriety") ? (
              <p className='font-medium text-gray-700'>
                <span className="text-green-700 font-bold">{filteredData.length}</span> products found in 
                <span className="font-semibold"> {subcategory === "thai" ? "Thai" : subcategory === "japanese" ? "Japanese" : "Indian"} Mango Veriety</span>
              </p>
            ) : (
              <p className='font-medium text-gray-700'>
                <span className="text-green-700 font-bold">{filteredData.length}</span> products found
                {filterCategoryList.length > 0 && ` in ${filterCategoryList.length} ${filterCategoryList.length === 1 ? 'category' : 'categories'}`}
              </p>
            )}
          </div>
          
          <div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : filteredData.length !== 0 ? (
              <VerticalCard data={filteredData} loading={false} />
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-green-100">
                <div className="text-green-600 text-5xl mb-4 flex justify-center">
                  <FaLeaf />
                </div>
                <p className="text-gray-700 text-lg mb-2 font-medium">No products found</p>
                <p className="text-gray-500">Try selecting different categories</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
