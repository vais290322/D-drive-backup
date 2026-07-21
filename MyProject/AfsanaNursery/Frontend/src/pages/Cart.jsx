

// 3rd update

import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common/index";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [unavailableProducts, setUnavailableProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const loadingCart = new Array(4).fill(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    const responseData = await response.json();

    if (responseData.success) {
      // Separate available and unavailable products
      const validProducts = responseData.data.filter((item) => item?.productId);
      const invalidProducts = responseData.data.filter(
        (item) => !item?.productId
      );

      setAvailableProducts(validProducts);
      setUnavailableProducts(invalidProducts);
    }
  };

  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
      context.fetchUserAddToCart();
    }
  };

  const increaseQty = async (id, qty) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
        quantity: qty + 1,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
    }
  };

  const decraseQty = async (id, qty) => {
    if (qty >= 2) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          quantity: qty - 1,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        fetchData();
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  const totalQty = availableProducts.reduce(
    (previousValue, currentValue) => previousValue + currentValue?.quantity,
    0
  );
  const totalPrice = availableProducts.reduce(
    (prev, curr) => prev + (curr.quantity * curr?.productId?.sellingPrice || 0),
    0
  );

  return (
    <div className="container mx-auto">
      <div className="text-center text-lg my-3">
        {availableProducts.length === 0 &&
          unavailableProducts.length === 0 &&
          !loading && <p className="bg-white py-5">No Data</p>}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4">
        {/* Available products */}
        <div className="w-full max-w-3xl">
          <h2 className="text-xl font-bold mb-4">Available Products</h2>
          {loading
            ? loadingCart.map((_, index) => (
                <div
                  key={index}
                  className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
                ></div>
              ))
            : availableProducts.map((product) => (
                <div
                  key={product._id}
                  className="w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]"
                >
                  <div className="w-32 h-32 bg-slate-200">
                    <img
                      src={product.productId.productImage[0]}
                      className="w-full h-full object-scale-down mix-blend-multiply"
                      alt="Product"
                    />
                  </div>
                  <div className="px-4 py-2 relative">
                    {/* Delete product */}
                    <div
                      className="absolute right-0 text-green-600 rounded-full p-2 hover:bg-green-600 hover:text-white cursor-pointer"
                      onClick={() => deleteCartProduct(product._id)}
                    >
                      <MdDelete />
                    </div>
                    <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
                      {product.productId.productName}
                    </h2>
                    <p className="capitalize text-slate-500">
                      {product.productId.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-green-600 font-medium text-lg">
                        {displayINRCurrency(product.productId.sellingPrice)}
                      </p>
                      <p className="text-slate-600 font-semibold text-lg">
                        {displayINRCurrency(
                          product.productId.sellingPrice * product.quantity
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                        onClick={() =>
                          decraseQty(product?._id, product?.quantity)
                        }
                      >
                        -
                      </button>
                      <span>{product?.quantity}</span>
                      <button
                        className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                        onClick={() =>
                          increaseQty(product?._id, product?.quantity)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Unavailable products */}
        {unavailableProducts.length > 0 && (
          <div className="w-full max-w-3xl">
            <h2 className="text-xl font-bold mb-4">Unavailable Products</h2>
            {unavailableProducts.map((product) => (
              <div
                key={product._id}
                className="w-full bg-white h-16 my-2 border border-red-300 rounded flex justify-between items-center px-4"
              >
                <p className="text-red-600">Product not available</p>
                <button
                  className="text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer"
                  onClick={() => deleteCartProduct(product._id)}
                >
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="mt-5 lg:mt-0 w-full max-w-sm">
          {loading ? (
            <div className="h-36 bg-slate-200 border border-slate-300 animate-pulse"></div>
          ) : (
            <div className="h-36 bg-white">
              <h2 className="text-white bg-green-600 px-4 py-1">Summary</h2>
              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Quantity</p>
                <p>{totalQty}</p>
              </div>
              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Total Price</p>
                <p>{displayINRCurrency(totalPrice)}</p>
              </div>
              {availableProducts.length > 0 && (
                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-green-600 p-2 text-white w-full mt-2"
                >
                  Buy Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <button
          className="bg-green-600 p-2 mb-2 rounded-full text-white hover:bg-blue-950"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Cart;
