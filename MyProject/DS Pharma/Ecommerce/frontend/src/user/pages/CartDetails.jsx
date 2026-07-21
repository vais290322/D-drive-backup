import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartItem } from "@/user/components/cart";
import { OrderSummary } from "@/user/components/order";
import SuggestedItemsSection from "@/user/components/sections/SuggestedItemsSection";
import useDataStore from "@/store/useDataStore";
import { useCartStore } from "@/store/useCartStore";
import { useProducts } from "@/shared/hooks/queries/useProducts";
import {
  cartUrl,
  userAddressUrl,
  paymentUrl,
  userProfileUrl,
} from "@/config/userApi";
import {
  X,
  MapPin,
  Home,
  Briefcase,
  ShoppingCart,
  Package,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import BackButton from "@/shared/components/BackButton";
import toastUtil from "@/shared/utils/toast";

const CartDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useDataStore((state) => state.currentUser);
  const setCartItems = useCartStore((state) => state.setItems);

  // State for placing order
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { data: suggestionsData } = useProducts({ limit: 5 });
  const suggestedItems = suggestionsData?.data || [];

  // State for cart items fetched from API
  const [cartItems, setLocalCartItems] = useState([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  // State for addresses fetched from API
  const [userAddresses, setUserAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [deliveryAddress, setDeliveryAddress] = useState(null);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch cart items from API using cartUrl.getCart with bearer token
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoadingCart(true);
        const response = await axios.get(cartUrl.getCart, {
          // headers: getAuthHeaders()
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        console.log("[CartDetails] getCart response:", response.data);

        const rawItems =
          response.data?.data || response.data?.items || response.data || [];

        if (!Array.isArray(rawItems)) {
          console.warn(
            "[CartDetails] Unexpected cart response structure:",
            response.data,
          );
          setLocalCartItems([]);
          return;
        }

        // Normalize items to ensure flat structure for store
        const normalizedItems = rawItems.map((item) => {
          const product = item.product || item.productId || {};
          const isPopulated = !!(item.product || item.productId);
          const baseDetails = isPopulated ? product : item;

          // Extract first image URL from images array
          let imageUrl = "";
          if (
            baseDetails.images &&
            Array.isArray(baseDetails.images) &&
            baseDetails.images.length > 0
          ) {
            imageUrl = baseDetails.images[0].url || baseDetails.images[0];
          } else {
            imageUrl =
              baseDetails.image ||
              baseDetails.imageUrl ||
              item.image ||
              item.imageUrl ||
              "";
          }

          return {
            _id: item._id,
            id: baseDetails.id || baseDetails._id,
            productCode: baseDetails.code || baseDetails.productCode || "",
            rid: baseDetails.rid || baseDetails.RID || item.rid,
            name: baseDetails.name || item.name || "Unknown Product",
            image: imageUrl,
            images: baseDetails.images || [],
            price:
              Number(baseDetails.price) ||
              Number(baseDetails.PRate) ||
              Number(baseDetails.Rate) ||
              Number(item.price) ||
              0,
            originalPrice:
              Number(baseDetails.originalPrice) ||
              Number(baseDetails.mrp) ||
              Number(baseDetails.MRP) ||
              undefined,
            quantity: Number(item.quantity) || 1,
            stock:
              baseDetails.stock !== undefined
                ? Number(baseDetails.stock)
                : undefined,
            unit: baseDetails.unit || baseDetails.pack || item.unit || "piece",
            discount: baseDetails.discount || item.discount || 0,
            free: Number(baseDetails.Free) || 0,
          };
        });

        setLocalCartItems(normalizedItems);
        if (setCartItems) {
          setCartItems(normalizedItems);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toastUtil.error("Failed to load cart items. Please refresh the page.");
        setLocalCartItems([]);
      } finally {
        setIsLoadingCart(false);
      }
    };

    fetchCartItems();
  }, [setCartItems]);

  // Fetch addresses from API using userAddressUrl.getAllAddresses with bearer token
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const response = await axios.get(userAddressUrl.getAllAddresses, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        console.log("[CartDetails] getAllAddresses response:", response.data);
        setUserAddresses(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setUserAddresses([]);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  // Initialize delivery address from saved addresses or user profile
  useEffect(() => {
    // Only auto-select if no address is currently selected and addresses are loaded
    if (!deliveryAddress && !isLoadingAddresses) {
      if (userAddresses.length > 0) {
        // Default to first address or default one
        const defaultAddr =
          userAddresses.find((a) => a.isDefault) || userAddresses[0];
        setDeliveryAddress(defaultAddr);
      } else if (currentUser) {
        setDeliveryAddress({
          id: "temp-1",
          name: currentUser.name || "",
          phone: currentUser.phone || "",
          address: currentUser.address
            ? `${currentUser.address.street}, ${currentUser.address.city}, ${currentUser.address.state} - ${currentUser.address.pincode}`
            : "",
          type: "Home",
        });
      }
    }
  }, [currentUser, deliveryAddress, userAddresses, isLoadingAddresses]);

  // Cart validation and initialization
  useEffect(() => {
    if (isLoadingCart) return;

    // Check for invalid cart items
    const invalidItems = cartItems.filter(
      (item) => !item.id && !item.rid && !item._id,
    );

    if (invalidItems.length > 0) {
      toastUtil.error(
        "Some items in your cart have invalid data. Please refresh the page.",
      );
    }

    // Check for out of stock items
    const outOfStockItems = cartItems.filter((item) => item.stock === 0);

    if (outOfStockItems.length > 0) {
      toastUtil.warning(
        `${outOfStockItems.length} item(s) in your cart are out of stock`,
      );
    }
  }, [cartItems, isLoadingCart]);

  // Update cart item quantity using cartUrl.updateCart/:id
  const updateQuantity = async (id, newQuantity) => {
    const quantity = Math.max(1, newQuantity);
    try {
      const response = await axios.put(
        `${cartUrl.updateCart}/${id}`,
        { quantity },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      console.log("[CartDetails] updateCart response:", response.data);
      // Update local state
      setLocalCartItems((prev) =>
        prev.map((item) =>
          item._id === id || item.id === id ? { ...item, quantity } : item,
        ),
      );
      toastSuccess("Cart updated");
    } catch (error) {
      console.error("Error updating cart item:", error);
      toastError("Failed to update cart item");
    }
  };

  // Remove cart item using cartUrl.removeFromCart/:id
  const removeItem = async (id) => {
    try {
      const response = await axios.delete(`${cartUrl.removeFromCart}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("[CartDetails] removeFromCart response:", response.data);
      // Update local state
      setLocalCartItems((prev) =>
        prev.filter((item) => item._id !== id && item.id !== id),
      );
      toastSuccess("Item removed from cart");
    } catch (error) {
      console.error("Error removing cart item:", error);
      toastError("Failed to remove item from cart");
    }
  };

  // Reactive Coupon Reset - Clear discount if input is emptied
  React.useEffect(() => {
    if (!couponCode && appliedCoupon) {
      setAppliedCoupon(null);
    }
  }, [couponCode, appliedCoupon]);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toastError("Please enter a coupon code");
      setAppliedCoupon(null);
      return;
    }

    const code = couponCode.trim().toUpperCase();
    const cartValue = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (code === "SAVE10") {
      if (cartValue < 500) {
        toastError("Min order value for SAVE10 is ₹500");
        setAppliedCoupon(null);
        return;
      }
      setAppliedCoupon({ code, type: "10% Off" });
    } else if (code === "FLAT50") {
      if (cartValue < 300) {
        toastError("Min order value for FLAT50 is ₹300");
        setAppliedCoupon(null);
        return;
      }
      setAppliedCoupon({ code, type: "Flat ₹50 Off" });
    } else if (code === "FREESHIP") {
      setAppliedCoupon({ code, type: "Free Shipping" });
    } else {
      toastError("Invalid coupon code");
      setAppliedCoupon(null);
      return;
    }
    toastSuccess(`Coupon ${code} applied!`);
  };

  // Re-validate coupon when cart changes
  React.useEffect(() => {
    if (appliedCoupon) {
      // 1. Silent reset if cart is cleared
      if (cartItems.length === 0) {
        setAppliedCoupon(null);
        return;
      }

      const cartValue = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // 2. Threshold checks with professional feedback
      if (appliedCoupon.code === "SAVE10" && cartValue < 500) {
        setAppliedCoupon(null);
        toastError("Coupon SAVE10 removed (min order value ₹500 not met)");
      } else if (appliedCoupon.code === "FLAT50" && cartValue < 300) {
        setAppliedCoupon(null);
        toastError("Coupon FLAT50 removed (min order value ₹300 not met)");
      }
    }
  }, [cartItems, appliedCoupon, toastError]);

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const totals = useMemo(() => {
    const totalCartValue = Math.round(
      cartItems.reduce((sum, item) => {
        const price = Number(item.price || item.unitPrice || item.Rate || 0);
        return sum + price * item.quantity;
      }, 0),
    );

    const productDiscount = cartItems.reduce((sum, item) => {
      const price = Number(item.price || item.unitPrice || item.Rate || 0);
      const originalPrice = Number(
        item.originalPrice || item.mrp || item.MRP || price * 1.2,
      );
      return sum + (originalPrice - price) * item.quantity;
    }, 0);

    const gst = Math.round(totalCartValue * 0.18);

    // Delivery Charge Logic
    // 1. Empty Cart -> 0
    // 2. Cart Value >= 500 -> 0 (Free Shipping starts at 500)
    // 3. Else -> 40 (Standard Fee)
    let deliveryCharges = cartItems.length > 0 && totalCartValue < 500 ? 40 : 0;
    let couponDiscount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.code === "FREESHIP") {
        deliveryCharges = 0;
      } else if (appliedCoupon.code === "SAVE10") {
        couponDiscount = Math.round(totalCartValue * 0.1);
      } else if (appliedCoupon.code === "FLAT50") {
        couponDiscount = 50;
      }
    }

    const totalWithoutCoupon = totalCartValue + gst + deliveryCharges;
    const finalCouponDiscount = Math.min(couponDiscount, totalWithoutCoupon);
    const total = totalWithoutCoupon - finalCouponDiscount;

    return {
      totalCartValue,
      discount: Math.round(productDiscount),
      coupon: finalCouponDiscount,
      gst,
      deliveryCharges,
      total: Math.max(0, Math.round(total)),
    };
  }, [cartItems, appliedCoupon]);

  const handlePlaceOrder = async (paymentMethod) => {
    console.log("[CartDetails] handlePlaceOrder called with:", paymentMethod);
    // Clear previous validation errors
    setValidationError(null);
    console.log(currentUser);
    // 1. Validate user authentication
    let effectiveUser = currentUser;
    if (!effectiveUser) {
      console.log("[CartDetails] No current user in state, checking token...");
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          setIsPlacingOrder(true); // Show loading state while fetching
          const userRes = await axios.get(userProfileUrl.getUserProfile, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.data && (userRes.data.data || userRes.data.user)) {
            effectiveUser = userRes.data.data || userRes.data.user;
            console.log(
              "[CartDetails] User fetched on-the-fly:",
              effectiveUser,
            );
          } else {
            throw new Error("Invalid user profile response");
          }
          setIsPlacingOrder(false);
        } catch (err) {
          console.error("[CartDetails] Failed to fetch user profile:", err);
          setIsPlacingOrder(false);
          toastError("Session expired. Please login again.");
          return;
        }
      } else {
        console.log("[CartDetails] No token found");
        toastError("Please login to place your order");
        return;
      }
    }

    // Update currentUser reference for subsequent logic
    const userId = effectiveUser._id || effectiveUser.id;
    const userName = effectiveUser.name || "Guest User";
    const userEmail = effectiveUser.email || "user@example.com";
    const userPhone = effectiveUser.phone || "";

    if (!userId) {
      console.error("User ID missing from effectiveUser", effectiveUser);
      toastError("User data incomplete. Please login again.");
      return;
    }

    // 2. Validate cart is not empty
    if (cartItems.length === 0) {
      console.log("[CartDetails] Cart empty");
      setValidationError("Your cart is empty. Add items to continue shopping.");
      return;
    }

    // 3. Validate delivery address is selected
    if (!deliveryAddress) {
      console.log("[CartDetails] No delivery address");
      setValidationError("Please select a delivery address to continue.");
      setShowAddressModal(true);
      return;
    }

    // 4. Validate address completeness
    if (
      !deliveryAddress.name ||
      !deliveryAddress.phone ||
      !deliveryAddress.address
    ) {
      console.log("[CartDetails] Incomplete address:", deliveryAddress);
      setValidationError(
        "Selected address is incomplete. Please choose or add a complete address.",
      );
      setShowAddressModal(true);
      return;
    }

    // 5. Validate cart items data integrity
    const invalidItems = cartItems.filter(
      (item) => !item._id || !item.price || !item.name,
    );
    if (invalidItems.length > 0) {
      console.log("[CartDetails] Invalid items:", invalidItems);
      setValidationError(
        "Some items in your cart have invalid data. Please refresh the page and try again.",
      );
      return;
    }

    // 6. Validate totals
    if (!totals || totals.total < 0) {
      console.log("[CartDetails] Invalid totals:", totals);
      setValidationError(
        "Order total calculation failed. Please refresh and try again.",
      );
      return;
    }

    // All validations passed - prepare and place order with checkout API
    const orderPayload = {
      user: userId,
      orderItems: cartItems.map((item) => {
        // Get first image URL
        let imageUrl = "";
        if (
          item.images &&
          Array.isArray(item.images) &&
          item.images.length > 0
        ) {
          imageUrl = item.images[0].url || item.images[0];
        } else {
          imageUrl = item.image || "";
        }

        return {
          name: item.name || "",
          productCode: item.productCode || item.rid || "",
          Quantity: item.quantity,
          Free: item.free || 0,
          price: item.price,
          image: imageUrl,
        };
      }),
      paymentMethod: paymentMethod === "cod" ? "COD" : "PREPAID",
      orderStatus: "Processing",
      shippingPrice: totals.deliveryCharges,
      discount: totals.discount + totals.coupon,
      totalPrice: totals.total,
      paidAt: paymentMethod === "cod" ? null : new Date().toISOString(),
      address: deliveryAddress.address || "",
      street: deliveryAddress.street || "",
      city: deliveryAddress.city || "",
      state: deliveryAddress.state || "",
      postalCode: deliveryAddress.postalCode || deliveryAddress.pincode || "",
      district: deliveryAddress.district || "",
      landmark: deliveryAddress.landmark || "",
    };

    console.log("[CartDetails] Checkout payload:", orderPayload);

    // If COD, proceed directly
    if (paymentMethod === "cod") {
      setIsPlacingOrder(true);
      try {
        const response = await axios.post(cartUrl.checkout, orderPayload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        console.log("[CartDetails] Checkout response:", response.data);
        toastSuccess("Order placed successfully!");
        setLocalCartItems([]);
        if (setCartItems) {
          setCartItems([]);
        }
        navigate("/orders");
      } catch (error) {
        console.error("Error placing order:", error);
        toastError(
          error.response?.data?.message ||
            "Failed to place order. Please try again.",
        );
      } finally {
        setIsPlacingOrder(false);
      }
    } else if (paymentMethod === "online") {
      // Razorpay Flow
      if (!window.Razorpay) {
        toastError("Razorpay SDK not loaded. Please refresh.");
        return;
      }

      setIsPlacingOrder(true);
      try {
        const token = localStorage.getItem("authToken");
        const amountToCharge = totals.total;

        const paymentRes = await axios.post(
          paymentUrl.createPayment,
          { amount: amountToCharge },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const order = paymentRes.data?.data;
        if (!order?.id) {
          console.error("Values returned from createPayment:", paymentRes.data);
          throw new Error("Invalid payment order received");
        }

        // Sanitize key just in case
        let razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (
          razorpayKey &&
          (razorpayKey.startsWith('"') || razorpayKey.startsWith("'"))
        ) {
          razorpayKey = razorpayKey.slice(1, -1);
        }

        console.log(
          "[CartDetails] Initializing Razorpay with key length:",
          razorpayKey?.length,
        );

        const options = {
          key: razorpayKey,
          amount: order.amount,
          currency: order.currency,
          name: "E-Commerce Store",
          description: "Complete your purchase",
          order_id: order.id,
          prefill: {
            name: userName,
            email: userEmail,
            contact: userPhone,
          },
          theme: { color: "#0B5345" },
          modal: {
            ondismiss: function () {
              console.log("[CartDetails] Payment modal dismissed");
              setIsPlacingOrder(false);
              toastError("Payment cancelled");
            },
          },
          handler: async function (response) {
            console.log("[CartDetails] Payment success, verifying...");
            try {
              const verifyPayload = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };

              const verifyRes = await axios.post(
                paymentUrl.verifyPayment,
                verifyPayload,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );

              if (
                verifyRes.data?.success ||
                verifyRes.data?.message?.toLowerCase().includes("verified")
              ) {
                toastSuccess("Payment Successful!");

                try {
                  const finalOrderPayload = {
                    ...orderPayload,
                    paymentMethod: "PREPAID",
                    paidAmount: amountToCharge,
                    dueAmount: 0,
                    paidAt: new Date().toISOString(),
                  };

                  const createOrderRes = await axios.post(
                    cartUrl.checkout,
                    finalOrderPayload,
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );

                  console.log(
                    "[CartDetails] Order created:",
                    createOrderRes.data,
                  );
                  toastSuccess("Order created successfully!");
                  setLocalCartItems([]);
                  if (setCartItems) setCartItems([]);
                  navigate("/orders");
                } catch (orderErr) {
                  console.error("Order creation failed:", orderErr);
                  toastError(
                    "Payment successful but order creation failed. Contact support.",
                  );
                }
              } else {
                console.warn("Payment verification failed:", verifyRes.data);
                toastError("Payment verification failed.");
              }
            } catch (verifyErr) {
              console.error("Verification error:", verifyErr);
              toastError("Error verifying payment.");
            }
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        razorpay.on("payment.failed", function (response) {
          console.error("Payment failed event:", response.error);
          toastError(response.error.description || "Payment failed");
          setIsPlacingOrder(false);
        });
      } catch (error) {
        console.error("Error initializing payment:", error);
        toastError(
          error.response?.data?.message || "Failed to initiate payment",
        );
        setIsPlacingOrder(false);
      }
    }
  };

  return (
    <div style={{ paddingTop: "2rem" }}>
      <style>{` 
         @media (min-width: 768px) { .orders-container { padding-top: 80px !important; } }
         @media (max-width: 639px) { .cart-details-container { padding-left: 5px !important; padding-right: 5px !important; } }
       `}</style>

      {/* Address Management Modal */}
      {showAddressModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          style={{ padding: "5px" }}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            style={{ padding: "10px" }}
          >
            <div
              className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50"
              style={{ paddingBottom: "10px" }}
            >
              <h3 className="text-xl font-bold text-gray-900">
                Delivery Address
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div
              className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar"
              style={{ padding: "10px" }}
            >
              {isLoadingAddresses ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                </div>
              ) : userAddresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userAddresses.map((addr) => (
                    <div
                      key={addr._id || addr.id}
                      onClick={() => {
                        setDeliveryAddress(addr);
                        setShowAddressModal(false);
                      }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${
                        addr.isDefault
                          ? "border-emerald-500 bg-emerald-50/50"
                          : (deliveryAddress?._id || deliveryAddress?.id) ===
                              (addr._id || addr.id)
                            ? "border-blue-500 bg-blue-50/30"
                            : "border-gray-100 bg-white hover:border-emerald-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg ${
                              addr.type === "Work"
                                ? "bg-purple-100 text-purple-600"
                                : addr.type === "Home"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-orange-100 text-orange-600"
                            }`}
                          >
                            {addr.type === "Work" ? (
                              <Briefcase size={14} />
                            ) : addr.type === "Home" ? (
                              <Home size={14} />
                            ) : (
                              <MapPin size={14} />
                            )}
                          </div>
                          <span className="font-bold text-gray-900">
                            {addr.type}
                          </span>
                        </div>
                        {addr.isDefault && (
                          <div
                            className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full"
                            style={{ padding: "2px 8px" }}
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span style={{ marginTop: "2px" }}>
                              Order will be delivered here
                            </span>
                          </div>
                        )}
                        {!addr.isDefault &&
                          (deliveryAddress?._id || deliveryAddress?.id) ===
                            (addr._id || addr.id) && (
                            <span
                              className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold"
                              style={{ padding: "2px 6px" }}
                            >
                              Selected
                            </span>
                          )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-800">
                          {addr.name}
                        </p>
                        <p className="text-xs text-gray-600 tabular-nums">
                          {addr.phone}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {addr.address}
                          {addr.street && `, ${addr.street}`}
                          {addr.landmark && ` (${addr.landmark})`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {addr.city}, {addr.district && `${addr.district}, `}
                          {addr.state} - {addr.postalCode || addr.pincode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <MapPin size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm">
                    No saved addresses found
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Please add an address from your profile.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="orders-container w-full pt-4 pb-16 lg:pt-32 lg:pb-16">
        <div
          className="cart-details-container w-full"
          style={{ maxWidth: "1280px", margin: "10px auto" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div style={{ paddingBottom: "1.25rem" }}>
                <BackButton
                  on
                  fallbackRoute="/"
                  label="Back to Shopping"
                  className="mb-4"
                />
              </div>
              <div className="mb-5">
                <h1
                  style={{
                    fontFamily: "Gyrotrope",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#000000",
                    marginBottom: "0",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Cart Items ({cartItems.length})
                </h1>
              </div>

              {/* Validation Error Display */}
              {validationError && (
                <div
                  className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{ margin: "10px 0px" }}
                >
                  <div className="flex items-center flex-row justify-between">
                    <p
                      className="text-red-800 text-sm font-medium"
                      style={{ fontFamily: "Gyrotrope", marginTop: "5px" }}
                    >
                      {validationError}
                    </p>
                    <svg
                      className="w-5 h-5 text-red-500 mr-2 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ margin: "0px 10px" }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <div
                className="space-y-3"
                style={{
                  maxHeight: "750px",
                  overflowY: "auto",
                  paddingRight: "5px",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <style>{`.space-y-3::-webkit-scrollbar { display: none; }`}</style>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <CartItem
                      key={item._id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center bg-white rounded-lg shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                    <div className="mb-4">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto" />
                    </div>
                    <h3
                      className="text-xl font-bold text-gray-700 mb-2"
                      style={{ fontFamily: "Gyrotrope" }}
                    >
                      Your cart is empty
                    </h3>
                    <p
                      className="text-gray-500 mb-6"
                      style={{ fontFamily: "Gyrotrope" }}
                    >
                      Looks like you haven't added any items to your cart yet
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2"
                      style={{ fontFamily: "Gyrotrope" }}
                    >
                      <Package size={18} />
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                deliveryAddress={deliveryAddress}
                couponCode={couponCode}
                onCouponChange={(e) => setCouponCode(e.target.value)}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={removeCoupon}
                appliedCoupon={appliedCoupon}
                totals={totals}
                onOrderNow={handlePlaceOrder}
                onChangeAddress={() => setShowAddressModal(true)}
                isPlacingOrder={isPlacingOrder}
                cartItems={cartItems}
                isLoadingCart={isLoadingCart}
              />
            </div>
          </div>

          {/* <SuggestedItemsSection title="Suggested Items" items={suggestedItems} className="w-full" 
            titleStyle={{ fontSize: '22px', marginBottom: '1rem', textDecorationThickness: '2px', textDecorationColor: '#111827', lineHeight: '1.2' }}
            containerStyle={{ paddingTop: '1rem' }}
        /> */}
        </div>
      </div>
    </div>
  );
};

export default CartDetails;