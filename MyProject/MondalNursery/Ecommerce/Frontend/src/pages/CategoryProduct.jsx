import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import productCategory from '../helpers/productCategory';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common/index';
import { useSelector } from 'react-redux';
import { setCategory } from '../store/categorySlice';

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");
  
  const [productCategory, setProductCategory] = useState([]);
  // console.log("productCategory", productCategory);


  const urlCategoryListObject = {};
  urlCategoryListinArray.forEach(el => {
    urlCategoryListObject[el] = true;
  });

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  // console.log("selectCategory", selectCategory);
  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false); // State to manage filter visibility

  const fetchData = async () => {
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
    setData(dataResponse?.data || []);
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
    // console.log("categorys", dataResponse);
    
    if(response){
      // dispatch(setCategory(dataResponse.categories))
      setProductCategory(dataResponse.categories)
    }
    
  }

  useEffect(() => {
    fetchData();
  }, [filterCategoryList]);

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

    // if (arrayOfCategory.length === 1) {
    //   // Replace history if no category is selected
    //   navigate("/product-category", { replace: true });
    // } else {
    //   // Add new entry for each selection change
    //   navigate("/product-category?" + urlFormat.join(""), { replace: false });
    // }

    navigate("/product-category?" + urlFormat.join(""), { replace: true });
  }, [selectCategory]);

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;

    setSortBy(value);

    if (value === 'asc') {
      setData(prev => prev.sort((a, b) => a.sellingPrice - b.sellingPrice));
    }

    if (value === 'dsc') {
      setData(prev => prev.sort((a, b) => b.sellingPrice - a.sellingPrice));
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [])

  const toggleFilters = () => {
    setShowFilters(prevState => !prevState);
  };

  return (
    <div className='container mx-auto p-4 '>
      {/***desktop version */}
      <div className='hidden lg:grid grid-cols-[200px,1fr]'>
        {/***left side */}
        <div className='bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll'>
          {/**sort by */}
          <div>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>
            <form className='text-sm flex flex-col gap-2 py-2'>
              <div className='flex items-center gap-3'>
                <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value={"asc"} />
                <label>Price - Low to High</label>
              </div>
              <div className='flex items-center gap-3'>
                <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value={"dsc"} />
                <label>Price - High to Low</label>
              </div>
            </form>
          </div>

          {/**filter by */}
          <div>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>
            <form className='text-sm flex flex-col gap-2 py-2'>
              {productCategory.map((categoryName, index) => (
                <div key={index} className='flex items-center gap-3'>
                  <input type='checkbox' name={"category"} checked={selectCategory[categoryName?.name]} value={categoryName?.name} id={categoryName?.name} onChange={handleSelectCategory} />
                  <label htmlFor={categoryName?.name}>{categoryName?.name}</label>
                </div>
              ))}
            </form>
          </div>
        </div>

        {/***right side (product) */}
        <div className='px-4'>
          <p className='font-medium text-slate-800 text-lg my-2'>Search Results: {data.length}</p>
          <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
            {data.length !== 0 && !loading && (
              <VerticalCard data={data} loading={loading} />
            )}
          </div>
        </div>
      </div>

      {/***mobile version */}
      <div className='lg:hidden'>
        <button onClick={toggleFilters} className='w-full bg-blue-500 text-white p-2 mb-2'>
          {showFilters ? 'Close Filters' : 'Show Filters'}
        </button>
        {showFilters && (
          <div className='bg-white p-2'>
            {/**sort by */}
            <div>
              <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>
              <form className='text-sm flex flex-col gap-2 py-2'>
                <div className='flex items-center gap-3'>
                  <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value={"asc"} />
                  <label>Price - Low to High</label>
                </div>
                <div className='flex items-center gap-3'>
                  <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value={"dsc"} />
                  <label>Price - High to Low</label>
                </div>
              </form>
            </div>

            {/**filter by */}
            <div>
              <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>
              <form className='text-sm flex flex-col gap-2 py-2'>
                {productCategory.map((categoryName, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <input type='checkbox' name={"category"} checked={selectCategory[categoryName?.name]} value={categoryName?.name} id={categoryName?.name} onChange={handleSelectCategory} />
                    <label htmlFor={categoryName?.name}>{categoryName?.name}</label>
                  </div>
                ))}
              </form>
            </div>
          </div>
        )}

        {/**products */}
        <div className='px-4'>
          <p className='font-medium text-slate-800 text-lg my-2'>Search Results: {data.length}</p>
          <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
            {data.length !== 0 && !loading && (
              <VerticalCard data={data} loading={loading} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
