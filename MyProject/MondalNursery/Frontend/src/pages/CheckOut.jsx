import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common/index';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const CheckOut = () => {
  const [data, setData] = useState({
    fullName: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: ""
  });
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const loadingCart = new Array(4).fill(null);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');
  const [payButtonText, setPayButtonText] = useState('Place Order');

  const cartFetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: 'include',
      headers: {
        "content-type": 'application/json'
      },
    });

    const responseData = await response.json();
    if (responseData.success) {
      setCartData(responseData.data);
    }
    if (responseData.data.length === 0) {
      navigate('/my-orders');
    }
  }

  const handleLoading = async () => {
    await cartFetchData();
  }

  useEffect(() => {
    setLoading(true);
    handleLoading();
    setLoading(false);
  }, []);

  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: 'include',
      headers: {
        "content-type": 'application/json'
      },
      body: JSON.stringify({
        _id: id,
      })
    });

    const responseData = await response.json();
    if (responseData.success) {
      cartFetchData();
      context.fetchUserAddToCart();
    }
  }

  const totalQty = cartData.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
  const totalPrice = cartData.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setPayButtonText(e.target.value === 'Razorpay' ? 'Pay' : 'Place Order');
  };

  const areAllFieldsEmpty = (data) => {
    return Object.values(data).every(value => value === "");
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption) {
      toast.error('Please select a payment option');
      return;
    }

    if (areAllFieldsEmpty(data)) {
      toast.error('Please fill the shipping address');
      return;
    }

    if (data.fullName === "" || data.email === "" || data.streetAddress === "" ||
      data.state === "" || data.city === "" || data.zipCode === "" || data.phoneNumber === "") {
      toast.error('Please fill all the required fields');
      return;
    }

    if (selectedOption === "Razorpay") {
      // Create Razorpay order
      const razorpayOrderResponse = await fetch(SummaryApi.createRazorpayOrder.url, {
        method: SummaryApi.createRazorpayOrder.method,
        credentials: 'include',
        headers: {
          "content-type": 'application/json'
        },
        body: JSON.stringify({ amount: totalPrice + 40 })
      });

      const razorpayOrderResponseData = await razorpayOrderResponse.json();
      console.log("razorpayOrderResponsedata", razorpayOrderResponseData)

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrderResponseData.data.amount,
        currency: razorpayOrderResponseData.data.currency,
        name: "dk-Ecommerce",
        description: "Cart Transaction",
        order_id: razorpayOrderResponseData.data.id,
        handler: async (response) => {
          console.log(response)
          const verifyResponse = await fetch(SummaryApi.verifyRazorpayPayment.url, {
            method: SummaryApi.verifyRazorpayPayment.method,
            credentials: 'include',
            headers: {
              "content-type": 'application/json'
            },
            body: JSON.stringify({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyResponseData = await verifyResponse.json();
          console.log("verifyResponseData", verifyResponseData)
          if (verifyResponseData.message === "payment verified successfully") {
            // Create order after successful payment
            const orderData = {
              orderItems: cartData.map(product => ({
                productId: product.productId._id,
                quantity: product.quantity,
              })),
              shippingAddress: data,
              paymentMethod: selectedOption,
              itemsPrice: totalPrice,
              shippingPrice: 40, // Example shipping cost
              totalPrice: totalPrice + 40,
              isPaid:true,
              paidAt: Date.now(),
              razorpay:{
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              }
            };
            console.log("orderData", orderData);

            // Send order data to server

            const orderResponse = await fetch(SummaryApi.createOrder.url, {
              method: SummaryApi.createOrder.method,
              credentials: 'include',
              headers: {
                "content-type": 'application/json'
              },
              body: JSON.stringify(orderData)
            });

            const orderResponseData = await orderResponse.json();
            if (orderResponseData.data && orderResponseData.data._id) {
              // Clear cart and redirect
              for (const product of cartData) {
                await deleteCartProduct(product._id);
              }
              navigate("/my-orders");
              toast.success(`Order placed successfully with Payment Option: ${selectedOption}`);
            } else {
              toast.error('Failed to place order. Please try again.');
            }
          } else {
            toast.error('Payment verification failed in frontend');
          }
        },
        prefill: {
          name: data.fullName,
          email: data.email,
          contact: data.phoneNumber
        },
        notes: {
          address: data.streetAddress
        },
        theme: {
          color: "#e83323"
        },
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
          paylater: true,
          emi: true
        },
        modal: {
          ondismiss: function () {
            toast.info('Payment process was cancelled.');
          }
        }
      };

      const paymentObject = new Razorpay(options);
      paymentObject.open();
    } else {
      // Handle COD
      const orderData = {
        orderItems: cartData.map(product => ({
          productId: product.productId._id,
          quantity: product.quantity,
        })),
        shippingAddress: data,
        paymentMethod: selectedOption,
        itemsPrice: totalPrice,
        shippingPrice: 40, // Example shipping cost
        totalPrice: totalPrice + 40,
      };

      const response = await fetch(SummaryApi.createOrder.url, {
        method: SummaryApi.createOrder.method,
        credentials: 'include',
        headers: {
          "content-type": 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const orderResponseData = await response.json();
      if (orderResponseData.data && orderResponseData.data._id) {
        // Clear cart and redirect
        for (const product of cartData) {
          await deleteCartProduct(product._id);
        }
        toast.success(`Order placed successfully with Payment Option: ${selectedOption}`);
        navigate("/my-orders");
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApi.saveAddress.url, {
      method: SummaryApi.saveAddress.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    console.log("address", data)
    const responseData = await response.json();
    if (responseData.success) {
      toast.success(responseData?.message);
      
    } else {
      toast.error(responseData?.message);
    }
};

  return (
    <div className='p-4 flex flex-col lg:flex-row w-full gap-4'>
      {/* Shipping Address */}
      <div className='p-4 rounded w-full lg:max-w-xl h-full lg:max-h-[80%] overflow-y-scroll bg-white'>
        <form className='grid grid-cols-1 gap-3' onSubmit={handleSubmit}>
          <h2 className='tex-md text-red-400'>Shipping Address</h2>
          <input
            type='text'
            id='fullName'
            placeholder='Enter full name'
            name='fullName'
            value={data.fullName}
            onChange={handleOnChange}
            className='p-1 bg-slate-100 border rounded'
            required
          />
          <input
            type='email'
            id='email'
            placeholder='Enter email address'
            value={data.email}
            name='email'
            onChange={handleOnChange}
            className='p-1 bg-slate-100 border rounded'
            required
          />
          <input
            type='text'
            id='state'
            placeholder='Enter state'
            value={data.state}
            name='state'
            onChange={handleOnChange}
            className='p-1 bg-slate-100 border rounded'
            required
          />
          <input
            type='text'
            id='city'
            placeholder='Enter city'
            value={data.city}
            name='city'
            onChange={handleOnChange}
            className='p-1 bg-slate-100 border rounded'
            required
          />
          <input
            type='text'
            id='streetAddress'
            placeholder='Enter street address'
            value={data.streetAddress}
            name='streetAddress'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />
          <input
            type='number'
            id='zipCode'
            placeholder='Enter ZIP/Postal code'
            value={data.zipCode}
            name='zipCode'
            onChange={handleOnChange}
            className='p-1 bg-slate-100 border rounded'
            required
          />
          <input
            type='tel'
            id='phoneNumber'
            placeholder='Enter phone number'
            value={data.phoneNumber}
            name='phoneNumber'
            onChange={handleOnChange}
            className='p-1 bg-slate-100 border rounded'
            required
          />
          <button className='px-3 py-2 bg-red-600 text-white hover:bg-red-700'>Save Address</button>
        </form>
      </div>

      {/* Cart Section */}
      <div className='p-4 rounded w-full lg:max-w-xl h-full lg:max-h-[80%] overflow-y-auto'>
        <h2 className='tex-md text-red-400'>Products</h2>
        <div className='w-full max-w-3xl'>
          {
            loading ? (
              loadingCart.map((el, index) => (
                <div key={el + "Add To Cart Loading" + index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'></div>
              ))
            ) : (
              cartData.map((product, index) => (
                <div key={product?._id + "Add To Cart Loading"} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                  <div className='w-32 h-32 bg-slate-200'>
                    <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                  </div>
                  <div className='w-full h-full bg-white p-2 flex flex-col'>
                    <div className='w-full flex justify-between'>
                      <p className='text-md font-medium line-clamp-1 text-ellipsis'>{product?.productId?.productName}</p>
                      {/* <button onClick={() => deleteCartProduct(product?._id)} className='text-xl text-red-400'>
                        <MdDelete />
                      </button> */}
                    </div>

                    <div className='w-full py-1 flex items-center'>
                      <p className='text-md font-medium'>Quantity : {product?.quantity}</p>
                    </div>
                    <div className='w-full flex justify-between'>
                      <span className='text-red-500 font-medium'>{displayINRCurrency(product?.productId?.sellingPrice)}</span>
                    </div>
                  </div>
                </div>
              ))
            )
          }
        </div>
      </div>

      {/* Payment Section */}
      <div className='p-4 rounded w-full lg:max-w-xl h-full lg:max-h-[80%] overflow-y-scroll'>
        <div className='w-full flex flex-col gap-2'>
          <button onClick={() => navigate("/cart")} className='text-black border rounded px-3 py-2 w-full bg-white flex items-center justify-center'>
            <FaArrowLeftLong className='inline mr-1' />Back to Shop
          </button>
          <div className='h-36 bg-white'>
                                    <h2 className='text-white bg-red-600 px-4 py-1'>Order Summary</h2>
                                    <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                        <p>Quantity</p>
                                        <p>{totalQty}</p>
                                    </div>

                                    <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                        <p>Item(s) Price</p>
                                        <p>{displayINRCurrency(totalPrice)}</p>    
                                    </div>
                                    <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                        <p>Shipping Price</p>
                                        <p>{displayINRCurrency(40)}</p>    
                                    </div>
                                    <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                        <p>Total Price</p>
                                        <p>{displayINRCurrency(totalPrice+40)}</p>    
                                    </div>


                                </div>

          <form onSubmit={handlePaymentSubmit}>
            <div className='flex flex-col gap-2'>
              <h2 className='font-bold text-lg text-red-400'>Select Payment Method</h2>
              <div>
                <input
                  type="radio"
                  id="payment1"
                  value="Razorpay"
                  checked={selectedOption === 'Razorpay'}
                  onChange={handleOptionChange}
                  className='mr-2'
                  required
                />
                <label htmlFor="payment1" className='font-medium text-md'>Razorpay(online)</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="payment2"
                  value="COD"
                  checked={selectedOption === 'COD'}
                  onChange={handleOptionChange}
                  className='mr-2'
                  required
                />
                <label htmlFor="payment2" className='font-medium text-md'>Cash on Delivery (COD)</label>
              </div>
            </div>
            <button className='px-3 py-2 bg-red-600 text-white hover:bg-red-700 w-full mt-4' type='submit'>{payButtonText}</button>
          </form>
        </div>
      </div>
    </div>

    // <div className='w-full h-full bg-white top-0 left-0 right-0 bottom-0 flex flex-col lg:flex-row items-center lg:fixed'>
    //   {/* Address Section */}
    //   <div className='p-4 rounded w-full lg:max-w-xl h-full lg:max-h-[80%] overflow-hidden'>
    //     <h2 className='font-bold text-lg text-red-400'>Upload Your Shipping Address</h2>
    //     <form className='grid gap-2 p-4 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
    //       <input
    //         type='text'
    //         id='fullName'
    //         placeholder='Enter full name'
    //         name='fullName'
    //         value={data.fullName}
    //         onChange={handleOnChange}
    //         className='p-1 bg-slate-100 border rounded'
    //         required
    //       />
    //       <input
    //         type='email'
    //         id='email'
    //         placeholder='Enter email address'
    //         value={data.email}
    //         name='email'
    //         onChange={handleOnChange}
    //         className='p-1 bg-slate-100 border rounded'
    //         required
    //       />
    //       <input
    //         type='text'
    //         id='streetAddress'
    //         placeholder='Enter your street address'
    //         value={data.streetAddress}
    //         name='streetAddress'
    //         onChange={handleOnChange}
    //         className='p-1 bg-slate-100 border rounded'
    //         required
    //       />
    //       <input
    //         type='text'
    //         id='city'
    //         placeholder='Enter your city'
    //         value={data.city}
    //         name='city'
    //         onChange={handleOnChange}
    //         className='p-1 bg-slate-100 border rounded'
    //         required
    //       />
    //       <input
    //         type='text'
    //         id='state'
    //         placeholder='Enter your state'
    //         value={data.state}
    //         name='state'
    //         onChange={handleOnChange}
    //         className='p-1 bg-slate-100 border rounded'
    //         required
    //       />
    //       <input
    //         type='number'
    //         id='zipCode'
    //         placeholder='Enter your zip code'
    //         value={data.zipCode}
    //         name='zipCode'
    //         onChange={handleOnChange}
    //         className='p-1 bg-slate-100 border rounded'
    //         required
    //       />
    //       <input
    //         type='number'
    //         id='phoneNumber'
    //         placeholder='Enter your phone number'
    //         value={data.phoneNumber}
    //         name='phoneNumber'
    //         onChange={handleOnChange}
    //         className='p-1 bg-slate-100 border rounded'
    //         required
    //       />
    //       <button
    //         type='submit'
    //         className='bg-yellow-400 text-white rounded py-1.5 hover:bg-yellow-300 transition-all duration-200 w-full'>
    //         Submit
    //       </button>
    //     </form>
    //   </div>

    //   {/* Cart Summary Section */}
    //   <div className='p-4 rounded w-full lg:max-w-xl h-full lg:max-h-[80%] overflow-hidden'>
    //     <h2 className='font-bold text-lg text-red-400 flex items-center'>
    //       <span className='mr-4 text-black' onClick={() => navigate('/')}><FaArrowLeftLong /></span> Review Your Order
    //     </h2>
    //     <div className='overflow-y-scroll max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-200'>
    //       {loading ?
    //         loadingCart.map((_, index) => (
    //           <div key={index} className='border rounded p-2 mb-2'>
    //             <div className='animate-pulse flex space-x-4'>
    //               <div className='bg-slate-200 h-20 w-20 rounded'></div>
    //               <div className='flex-1 space-y-4 py-1'>
    //                 <div className='h-4 bg-slate-200 rounded w-3/4'></div>
    //                 <div className='space-y-2'>
    //                   <div className='h-4 bg-slate-200 rounded'></div>
    //                   <div className='h-4 bg-slate-200 rounded w-5/6'></div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         )) :
    //         cartData.map(product => (
    //           <div key={product._id} className='border rounded p-2 mb-2 flex items-center'>
    //             <img
    //               src={product?.productId?.productImage[0]?.url}
    //               alt={product?.productId?.productName}
    //               className='w-20 h-20 object-cover rounded'
    //             />
    //             <div className='ml-4 flex-1'>
    //               <h3 className='font-semibold'>{product?.productId?.productName}</h3>
    //               <p className='text-sm'>Quantity: {product?.quantity}</p>
    //               <p className='text-sm text-yellow-500'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
    //             </div>
    //             <button onClick={() => deleteCartProduct(product._id)} className='text-red-400 hover:text-red-600'>
    //               <MdDelete size={20} />
    //             </button>
    //           </div>
    //         ))}
    //     </div>

    //     <div className='border-t mt-4 pt-2'>
    //       <div className='flex justify-between items-center'>
    //         <p className='font-semibold'>Total Quantity:</p>
    //         <p>{totalQty}</p>
    //       </div>
    //       <div className='flex justify-between items-center'>
    //         <p className='font-semibold'>Subtotal:</p>
    //         <p>{displayINRCurrency(totalPrice)}</p>
    //       </div>
    //       <div className='flex justify-between items-center'>
    //         <p className='font-semibold'>Shipping:</p>
    //         <p>{displayINRCurrency(40)}</p>
    //       </div>
    //       <div className='flex justify-between items-center'>
    //         <p className='font-semibold'>Total:</p>
    //         <p>{displayINRCurrency(totalPrice + 40)}</p>
    //       </div>
    //     </div>

    //     <div className='mt-4'>
    //       <h3 className='font-bold mb-2 text-red-400'>Payment Method</h3>
    //       <div className='flex items-center'>
    //         <input
    //           type='radio'
    //           id='razorpay'
    //           name='paymentMethod'
    //           value='Razorpay'
    //           checked={selectedOption === 'Razorpay'}
    //           onChange={handleOptionChange}
    //           className='mr-2'
    //         />
    //         <label htmlFor='razorpay' className='mr-4'>Razorpay</label>
    //         <input
    //           type='radio'
    //           id='cod'
    //           name='paymentMethod'
    //           value='COD'
    //           checked={selectedOption === 'COD'}
    //           onChange={handleOptionChange}
    //           className='mr-2'
    //         />
    //         <label htmlFor='cod'>Cash On Delivery (COD)</label>
    //       </div>
    //     </div>

    //     <button
    //       onClick={handlePaymentSubmit}
    //       className='bg-yellow-400 text-white rounded py-1.5 hover:bg-yellow-300 transition-all duration-200 w-full mt-4'>
    //       Place Order
    //     </button>
    //   </div>
    // </div>


  );
};

export default CheckOut;
