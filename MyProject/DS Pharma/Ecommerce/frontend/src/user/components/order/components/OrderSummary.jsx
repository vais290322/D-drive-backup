import React, { useState } from "react";
import {
  ChevronDown,
  Check,
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({
  deliveryAddress,
  couponCode,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon,
  totals,
  onOrderNow,
  onAddNewAddress,
  onChangeAddress,
  isPlacingOrder = false,
  cartItems = [],
}) => {
  const [paymentMethod, setPaymentMethod] = useState("online");

  const navigate = useNavigate()

  return (
    <div className="sticky top-32 space-y-3">
      {/* Delivery Address Summary */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
          border: "1px solid #64E5B8",
          marginBottom: "5px",
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <h3
            style={{
              fontFamily: "Gyrotrope",
              fontSize: "16px",
              fontWeight: 600,
              color: "#34B485",
              letterSpacing: "-0.01em",
              marginBottom: "8px",
            }}
          >
            Delivery Address
          </h3>
          {deliveryAddress?.type && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
              {deliveryAddress.type}
            </span>
          )}
        </div>

        <div
          style={{
            fontFamily: "Gyrotrope",
            fontSize: "12px",
            fontWeight: 400,
            color: "#374151",
            lineHeight: "1.5",
            marginBottom: "12px",
          }}
        >
          {deliveryAddress ? (
            <>
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: "2px",
                  color: "#000000",
                }}
              >
                {deliveryAddress.name} - {deliveryAddress.phone}
              </div>
              <div className="line-clamp-2">
                {deliveryAddress.address}, {deliveryAddress.city}
              </div>
            </>
          ) : (
            <div className="text-gray-400 italic">No address selected</div>
          )}
        </div>

        <div className="flex gap-2">
          {/* <button
            onClick={onAddNewAddress}
            className="flex-1 text-[12px] sm:text-xs transition-colors cursor-pointer hover:opacity-90"
            style={{
              fontFamily: "Gyrotrope",
              fontWeight: 600,
              backgroundColor: "#A5E8DC",
              color: "#000000",
              border: "none",
              borderRadius: "8px",
              padding: "6px 10px",
              height: "30px",
            }}
          >
            + Add New Address
          </button> */}

          <button
            onClick={onChangeAddress}
            className="flex-1 transition-colors text-[12px] sm:text-xs cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-1"
            style={{
              fontFamily: "Gyrotrope",
              fontWeight: 600,
              color: "#000000",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              padding: "6px 10px",
              height: "30px",
              backgroundColor: "transparent",
            }}
          >
            Change Address
          </button>
          <button
            onClick={()=>{navigate("/profile")}}
            className="flex-1 transition-colors text-[12px] sm:text-xs cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-1"
            style={{
              fontFamily: "Gyrotrope",
              fontWeight: 600,
              color: "#000000",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              padding: "6px 10px",
              height: "30px",
              backgroundColor: "transparent",
            }}
          >
            Add Address
          </button>
        </div>
      </div>
      {/* Apply Coupon */}
      <div
        className="bg-orange-100"
        style={{
          borderRadius: "12px",
          padding: "10px 10px 20px 10px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
          border: "1px solid #F97316",
          marginBottom: "5px",
        }}
      >
        <h3
          style={{
            fontFamily: "Gyrotrope",
            fontSize: "16px",
            fontWeight: 600,
            color: "#F97316",
            padding: "0px 5px",
            marginBottom: "6px",
            letterSpacing: "-0.01em",
          }}
        >
          Apply Coupon
        </h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={couponCode}
              onChange={onCouponChange}
              placeholder="Enter coupon code"
              disabled={!!appliedCoupon}
              className={`w-full focus:outline-none focus:ring-2 focus:ring-orange-400 ${appliedCoupon ? "bg-orange-50 border-orange-300" : "bg-white border-orange-400"}`}
              style={{
                fontFamily: "Gyrotrope",
                fontSize: "11px",
                padding: "6px 10px",
                border: "1px solid #F97316",
                borderRadius: "8px",
                height: "30px",
              }}
            />
            {appliedCoupon && (
              <div
                className="absolute left-0 -bottom-5.5 flex items-center gap-1"
                style={{ padding: "5px 0px" }}
              >
                <Check className="w-4 h-3 font-bold text-green-800" />
                <span className="text-[9px] font-bold text-green-700 capitalize">
                  {appliedCoupon.code}: {appliedCoupon.type}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={appliedCoupon ? onRemoveCoupon : onApplyCoupon}
            className={`transition-colors cursor-pointer hover:opacity-90 px-3 ${appliedCoupon ? "bg-orange-500 text-white border-none" : "bg-white text-black border border-orange-500"}`}
            style={{
              fontFamily: "Gyrotrope",
              fontSize: "11px",
              fontWeight: 600,
              borderRadius: "8px",
              height: "30px",
              padding: "0px 5px",
            }}
          >
            {appliedCoupon ? "Remove" : "Apply"}
          </button>
        </div>
      </div>
      {/* Payment Breakdown */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
          border: "1px solid #64E5B8",
        }}
      >
        <h3
          style={{
            fontFamily: "Gyrotrope",
            fontSize: "16px",
            fontWeight: 600,
            color: "#34B485",
            marginBottom: "12px",
            letterSpacing: "-0.01em",
          }}
        >
          Payment Breakdown
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div className="flex justify-between">
            <span
              style={{
                fontFamily: "Gyrotrope",
                fontSize: "11px",
                fontWeight: 400,
                color: "#6B7280",
              }}
            >
              Total Cart Value
            </span>
            <span
              style={{
                fontFamily: "Gyrotrope",
                fontSize: "11px",
                fontWeight: 600,
                color: "#000000",
              }}
            >
              ₹{totals.totalCartValue}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              style={{
                fontFamily: "Gyrotrope",
                fontSize: "11px",
                fontWeight: 400,
                color: "#6B7280",
              }}
            >
              Discount
            </span>
            <span
              style={{
                fontFamily: "Gyrotrope",
                fontSize: "11px",
                fontWeight: 600,
                color: "#10B981",
              }}
            >
              -₹{totals.discount}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              style={{
                fontFamily: "Gyrotrope",
                fontSize: "11px",
                fontWeight: 400,
                color: "#6B7280",
              }}
            >
              Coupon
            </span>
            <span
              style={{
                fontFamily: "Gyrotrope",
                fontSize: "11px",
                fontWeight: 600,
                color: "#10B981",
              }}
            >
              -₹{totals.coupon}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              style={{
                fontFamily: "Gyrotrope",
                fontSize: "11px",
                fontWeight: 400,
                color: "#6B7280",
              }}
            >
              GST
            </span>
            <span
              style={{
                fontFamily: "Gyrotrope",
                fontSize: "11px",
                fontWeight: 600,
                color: "#000000",
              }}
            >
              +₹{totals.gst}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              style={{
                fontFamily: "Gyrotrope",
                fontSize: "11px",
                fontWeight: 400,
                color: "#6B7280",
              }}
            >
              Delivery Charges
            </span>
            <span
              style={{
                fontFamily: "Gyrotrope",
                fontSize: "11px",
                fontWeight: 600,
                color: "#000000",
              }}
            >
              +₹{totals.deliveryCharges}
            </span>
          </div>
          <div
            style={{
              borderTop: "1px solid #E5E7EB",
              paddingTop: "10px",
              marginTop: "10px",
            }}
          >
            <div className="flex justify-between">
              <span
                style={{
                  fontFamily: "Gyrotrope",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#000000",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "Gyrotrope",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#000000",
                }}
              >
                ₹{totals.total}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Payment Method Selection */}
      <div
        style={{
          marginTop: "10px",
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            padding: "5px 10px 10px 10px",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
            border: "1px solid #64E5B8",
          }}
        >
          <h4
            style={{
              fontFamily: "Gyrotrope",
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "10px",
              letterSpacing: "-0.01em",
            }}
          >
            Payment Method
          </h4>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("online")}
              className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all duration-200 cursor-pointer text-left ${
                paymentMethod === "online"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-white hover:border-emerald-300"
              }`}
              style={{
                fontFamily: "Gyrotrope",
                padding: "2px 5px",
                marginBottom: "5px",
              }}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  paymentMethod === "online"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Smartphone size={18} />
              </div>
              <div className="flex-1">
                <span
                  className={`font-semibold text-sm ${
                    paymentMethod === "online"
                      ? "text-emerald-700"
                      : "text-gray-900"
                  }`}
                >
                  Online Payment
                </span>
                <p className="text-[8px] sm:text-xs text-gray-500">
                  UPI, Wallets, Netbanking
                </p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "online"
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "online" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </button>
            {/* Card Payment
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all duration-200 cursor-pointer text-left ${
                paymentMethod === "card"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-white hover:border-emerald-300"
              }`}
              style={{
                fontFamily: "Gyrotrope",
                padding: "2px 5px",
                marginBottom: "5px",
              }}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  paymentMethod === "card"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <CreditCard size={18} />
              </div>
              <div className="flex-1">
                <span
                  className={`font-semibold text-sm ${
                    paymentMethod === "card"
                      ? "text-emerald-700"
                      : "text-gray-900"
                  }`}
                >
                  Debit / Credit Card
                </span>
                <p className="text-[8px] sm:text-xs text-gray-500">
                  Visa, Mastercard, RuPay
                </p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "card"
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "card" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </button> */}
            <button
              type="button"
              onClick={() => setPaymentMethod("cod")}
              className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all duration-200 cursor-pointer text-left ${
                paymentMethod === "cod"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-white hover:border-emerald-300"
              }`}
              style={{ fontFamily: "Gyrotrope", padding: "2px 5px" }}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  paymentMethod === "cod"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Banknote size={18} />
              </div>
              <div className="flex-1">
                <span
                  className={`font-semibold text-sm ${
                    paymentMethod === "cod"
                      ? "text-emerald-700"
                      : "text-gray-900"
                  }`}
                >
                  Cash on Delivery
                </span>
                <p className="text-[8px] sm:text-xs text-gray-500">
                  Pay when you receive
                </p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "cod"
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "cod" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </button>
          </div>
        </div>

        <button
          onClick={() => onOrderNow(paymentMethod)}
          disabled={isPlacingOrder || cartItems.length === 0}
          className="w-full transition-all duration-200 hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            fontFamily: "Gyrotrope",
            fontSize: "14px",
            fontWeight: 600,
            backgroundColor: "#10B981",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "10px",
            padding: "12px",
            marginTop: "16px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
          }}
        >
          {isPlacingOrder
            ? "Placing Order..."
            : `Proceed to Pay ₹${totals.total}`}
        </button>
      </div>
 
    </div>
  );
};

export default OrderSummary;