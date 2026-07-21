import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common/index";
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import { FaLeaf, FaShippingFast, FaWhatsapp } from "react-icons/fa";
import displayINRCurrency from "../helpers/displayCurrency";
import VerticalCardProduct from "../components/VerticalCardProduct";
import CategroyWiseProductDisplay from "../components/CategoryWiseProductDisplay";

import Context from "../context";

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
  });
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");
  const PhoneNumber = import.meta.env.VITE_PHONE_NUMBER;

  const [allCategories, setAllcategories] = useState([]);

  // Initialize randomCategory as an object with a name property
  const [randomCategory, setRandomCategory] = useState({ name: "" });

  // console.log("all categories", randomCategory.name);

  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [zoomImage, setZoomImage] = useState(false);

  const fetchCategories = async () => {
    const response = await fetch(SummaryApi.fetchCategory.url, {
      method: SummaryApi.fetchCategory.method,
      headers: {
        "content-type": "application/json",
      },
    });
    const dataResponse = await response.json();

    if (dataResponse) {
      setAllcategories(dataResponse?.categories);

      if (dataResponse?.categories && dataResponse.categories.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * dataResponse.categories.length
        );
        setRandomCategory(dataResponse.categories[randomIndex]);
      }
    }
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: params?.id,
      }),
    });
    setLoading(false);
    const dataReponse = await response.json();

    setData(dataReponse?.data);
    setActiveImage(dataReponse?.data?.productImage[0]);
  };

  useEffect(() => {
    fetchProductDetails();
    fetchCategories();
    // Scroll to top when product changes
    window.scrollTo(0, 0);
  }, [params]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  const handleZoomImage = useCallback(
    (e) => {
      setZoomImage(true);
      const { left, top, width, height } = e.target.getBoundingClientRect();

      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      setZoomImageCoordinate({
        x,
        y,
      });
    },
    [zoomImageCoordinate]
  );

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleEnquireNow = (product) => {
    const phoneNumber = PhoneNumber;
    const message = `Hello, I'm interested in the product: ${product.productName}. Can you provide more details?`;
    const encodedMessage = encodeURIComponent(message);

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="container mx-auto p-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex text-sm">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a
                  href="/"
                  className="inline-flex items-center text-gray-600 hover:text-green-600"
                >
                  Home
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <a
                    href="/product-category"
                    className="text-gray-600 hover:text-green-600"
                  >
                    Products
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-500">
                    {loading
                      ? "Loading..."
                      : data?.productName?.substring(0, 30) +
                        (data?.productName?.length > 30 ? "..." : "")}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-8 mb-8 border border-green-100">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Image */}
            <div className="flex flex-col lg:flex-row-reverse gap-4 lg:w-1/2">
              <div className="h-[300px] w-full lg:h-[400px] lg:w-[400px] bg-gradient-to-br from-green-50 to-yellow-50 relative p-4 rounded-lg border border-green-100 mx-auto">
                {loading ? (
                  <div className="h-full w-full bg-slate-200 animate-pulse rounded-lg"></div>
                ) : (
                  <>
                    <img
                      src={activeImage}
                      className="h-full w-full object-contain mix-blend-multiply transition-all duration-300 hover:scale-105"
                      onMouseMove={handleZoomImage}
                      onMouseLeave={handleLeaveImageZoom}
                      alt={data?.productName}
                    />
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Hover to zoom
                    </div>
                  </>
                )}

                {/* Product zoom */}
                {zoomImage && (
                  <div className="hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-gradient-to-br from-green-50 to-yellow-50 p-1 -right-[510px] top-0 rounded-lg shadow-lg border border-green-100 z-10">
                    <div
                      className="w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150"
                      style={{
                        background: `url(${activeImage})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: `${zoomImageCoordinate.x * 100}% ${
                          zoomImageCoordinate.y * 100
                        }% `,
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="h-full">
                {loading ? (
                  <div className="flex gap-2 lg:flex-col overflow-auto scrollbar-none h-full">
                    {productImageListLoading.map((el, index) => (
                      <div
                        className="h-20 w-20 bg-slate-200 rounded-lg animate-pulse"
                        key={"loadingImage" + index}
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-2 lg:flex-col overflow-auto scrollbar-none h-full">
                    {data?.productImage?.map((imgURL) => (
                      <div
                        className={`h-20 w-20 bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg p-1 border-2 transition-all duration-200 cursor-pointer ${
                          activeImage === imgURL
                            ? "border-green-500"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                        key={imgURL}
                      >
                        <img
                          src={imgURL}
                          className="w-full h-full object-contain mix-blend-multiply"
                          onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                          onClick={() => handleMouseEnterProduct(imgURL)}
                          alt={data?.productName}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product details */}
            <div className="lg:w-1/2">
              {loading ? (
                <div className="grid gap-3 w-full">
                  <p className="bg-slate-200 animate-pulse h-6 lg:h-8 w-1/4 rounded-full"></p>
                  <h2 className="bg-slate-200 animate-pulse h-10 lg:h-12 w-full rounded-md"></h2>
                  <p className="bg-slate-200 animate-pulse h-6 lg:h-8 w-1/3 rounded-md"></p>
                  <div className="bg-slate-200 animate-pulse h-6 lg:h-8 w-1/4 rounded-md"></div>
                  <div className="flex items-center gap-3 my-4">
                    <button className="h-12 bg-slate-200 rounded-lg animate-pulse w-full"></button>
                  </div>
                  <p className="bg-slate-200 animate-pulse h-6 lg:h-8 w-1/4 rounded-md"></p>
                  <p className="bg-slate-200 animate-pulse h-32 w-full rounded-md"></p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className="bg-gradient-to-r from-green-100 to-yellow-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <FaLeaf className="text-green-600" size={14} />
                      {data?.brandName || "Afsana Nursery"}
                    </span>
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm capitalize">
                      {data?.category}
                    </span>
                  </div>

                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                    {data?.productName}
                  </h1>

                  <div className="flex items-center gap-1 text-yellow-500 mb-2">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalf />
                    <span className="text-gray-500 text-sm ml-2">
                      Top rated product
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 my-4 md:my-6">
                    <button
                      onClick={() => handleEnquireNow(data)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white px-6 py-3 rounded-lg font-medium text-lg shadow-sm hover:shadow transition-all duration-300"
                    >
                      <FaWhatsapp size={20} />
                      Enquire Now on WhatsApp
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-4 rounded-lg mb-4 border border-green-100">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <FaShippingFast size={18} />
                      <span className="font-medium">Delivery Information</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Contact us for delivery options and shipping details. We
                      ensure safe packaging for all our plants.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-gray-800 font-semibold text-lg mb-2 flex items-center">
                      <FaLeaf className="mr-2 text-green-600" size={14} />
                      Description
                    </h3>
                    <div className="text-gray-600 bg-gradient-to-br from-green-50 to-yellow-50 p-4 rounded-lg border border-green-100">
                      {data?.description ||
                        "No description available for this product."}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {data.category && (
          <div className="mt-8">
            <CategroyWiseProductDisplay
              category={data?.category}
              heading={"Recommended Products"}
            />
          </div>
        )}

        {/* Category-wise Products */}
        {/* <div>
          <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
            <FaLeaf className="mr-2 text-green-600" />
            You May Also Like
          </h2>
          {randomCategory.name ? (
            <VerticalCardProduct
              category={randomCategory.name}
              heading="Explore More Products"
            />
          ) : (
            <div className="flex justify-center items-center py-8">
              <div className="animate-pulse bg-gradient-to-r from-green-100 to-yellow-100 h-64 w-full rounded-lg"></div>
            </div>
          )}
        </div>
         */}
      </div>
    </div>
  );
};

export default ProductDetails;
